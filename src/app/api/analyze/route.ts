import { getOptionalUser } from "@/server/auth";
import { checkRateLimit } from "@/server/rate-limit";
import { analyzeSurplusWithGemini, type ImageInputPayload } from "@/server/gemini";
import { analyzeRequestSchema } from "@/features/ai-analysis/schemas";
import { clientEnv } from "@/lib/env.client";
import { logger } from "@/server/logger";

export async function POST(request: Request): Promise<Response> {
  // 1. Authenticate user
  const user = await getOptionalUser();
  if (!user) {
    return Response.json(
      { ok: false, error: "Must be signed in to analyze photos" },
      { status: 401 }
    );
  }

  // 2. Per-user rate limit: 10 calls per hour (3600 seconds)
  const isAllowed = await checkRateLimit(`analyze:${user.id}`, 10, 3600);
  if (!isAllowed) {
    return Response.json(
      {
        ok: false,
        error: "Rate limit reached (10 estimates/hr). Please confirm material details manually.",
      },
      { status: 429 }
    );
  }

  // 3. Parse and validate JSON payload
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { ok: false, error: "Invalid JSON body in request" },
      { status: 400 }
    );
  }

  const parsedInput = analyzeRequestSchema.safeParse(body);
  if (!parsedInput.success) {
    return Response.json(
      {
        ok: false,
        error: "Invalid request payload",
        details: parsedInput.error.issues,
      },
      { status: 400 }
    );
  }

  const { photoUrls, photoBase64 } = parsedInput.data;
  const imagePayloads: ImageInputPayload[] = [];

  // 4. Handle base64 input
  if (photoBase64) {
    const cleanBase64 = photoBase64.replace(/^data:image\/[a-z]+;base64,/, "");
    imagePayloads.push({
      base64: cleanBase64,
      mimeType: "image/jpeg",
    });
  }

  // 5. Handle and validate photoUrls (SSRF + User Path Isolation)
  if (photoUrls && photoUrls.length > 0) {
    const supabaseUrl = new URL(clientEnv.NEXT_PUBLIC_SUPABASE_URL);
    const expectedHost = supabaseUrl.hostname;

    for (const rawUrl of photoUrls) {
      let parsedUrl: URL;
      try {
        parsedUrl = new URL(rawUrl);
      } catch {
        return Response.json(
          { ok: false, error: "Malformed photo URL provided" },
          { status: 400 }
        );
      }

      const isAllowedHost =
        parsedUrl.hostname === expectedHost ||
        parsedUrl.hostname.endsWith(".supabase.co") ||
        parsedUrl.hostname === "127.0.0.1" ||
        parsedUrl.hostname === "localhost";

      if (!isAllowedHost) {
        return Response.json(
          { ok: false, error: "Image URLs must point to project storage host" },
          { status: 400 }
        );
      }

      // Enforce path isolation: must be within listing-photos/<userId>/
      const expectedPathPrefix = `/storage/v1/object/public/listing-photos/${user.id}/`;
      if (!parsedUrl.pathname.includes(expectedPathPrefix)) {
        return Response.json(
          {
            ok: false,
            error: "Image URL must belong to your authenticated folder in listing-photos",
          },
          { status: 403 }
        );
      }

      try {
        const response = await fetch(parsedUrl.toString(), {
          signal: AbortSignal.timeout(6000),
        });

        if (!response.ok) {
          logger.warn({
            event: "photo_fetch_failed",
            userId: user.id,
            error: `HTTP ${response.status}`,
          });
          continue;
        }

        const arrayBuffer = await response.arrayBuffer();
        if (arrayBuffer.byteLength > 5 * 1024 * 1024) {
          return Response.json(
            { ok: false, error: "Photo exceeds 5 MB ceiling" },
            { status: 400 }
          );
        }

        const mimeType = response.headers.get("content-type") || "image/jpeg";
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        imagePayloads.push({ base64, mimeType });
      } catch (err) {
        logger.warn({
          event: "photo_download_exception",
          userId: user.id,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }
  }

  if (imagePayloads.length === 0) {
    return Response.json(
      { fallback: true, reason: "no_valid_photos_to_analyze" },
      { status: 200 }
    );
  }

  // 6. Invoke Gemini surplus analysis
  const result = await analyzeSurplusWithGemini(imagePayloads);

  return Response.json(result, { status: 200 });
}
