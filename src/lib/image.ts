import { ok, fail, type Result } from "./result";

export const MAX_RAW_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB raw upload limit
export const TARGET_MAX_IMAGE_BYTES = 300 * 1024; // 300 KB target compressed limit
export const MAX_IMAGE_DIMENSION = 1280; // 1280px max width/height

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type AllowedMimeType = (typeof ALLOWED_IMAGE_MIME_TYPES)[number];

export function generatePhotoId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Sanitizes and formats the storage path for a user's listing photo.
 * Path convention: <userId>/<randomUUID>.jpg
 */
export function formatListingPhotoPath(userId: string, photoId?: string): string {
  const cleanUserId = userId.replace(/[^a-zA-Z0-9_-]/g, "");
  const id = photoId ? photoId.replace(/[^a-zA-Z0-9_-]/g, "") : generatePhotoId();
  return `${cleanUserId}/${id}.jpg`;
}

export interface ImageFileDescriptor {
  size: number;
  type: string;
}

export interface CompressionOptions {
  maxDimension?: number;
  maxSizeBytes?: number;
  initialQuality?: number;
}

/**
 * Validates raw file type and initial size before processing.
 */
export function validateImageFile(file: ImageFileDescriptor): Result<true> {
  if (!file) {
    return fail("VALIDATION", "No file provided");
  }

  const isAllowedType = ALLOWED_IMAGE_MIME_TYPES.includes(
    file.type as AllowedMimeType
  );
  if (!isAllowedType) {
    return fail(
      "VALIDATION",
      `Unsupported image format (${file.type || "unknown"}). Allowed: JPEG, PNG, WebP`
    );
  }

  if (file.size <= 0) {
    return fail("VALIDATION", "File is empty");
  }

  if (file.size > MAX_RAW_IMAGE_SIZE_BYTES) {
    return fail("VALIDATION", "Image must be under 10 MB");
  }

  return ok(true);
}

/**
 * Calculates new aspect-ratio-preserving dimensions fitted within maxDimension.
 */
export function calculateFitDimensions(
  width: number,
  height: number,
  maxDimension = MAX_IMAGE_DIMENSION
): { width: number; height: number } {
  if (width <= 0 || height <= 0) {
    return { width: 0, height: 0 };
  }

  if (width <= maxDimension && height <= maxDimension) {
    return { width: Math.round(width), height: Math.round(height) };
  }

  const ratio = width / height;

  if (width >= height) {
    const fittedWidth = maxDimension;
    const fittedHeight = Math.round(maxDimension / ratio);
    return { width: fittedWidth, height: Math.max(1, fittedHeight) };
  } else {
    const fittedHeight = maxDimension;
    const fittedWidth = Math.round(maxDimension * ratio);
    return { width: Math.max(1, fittedWidth), height: fittedHeight };
  }
}

/**
 * Compresses an image file on the client using HTML5 Canvas.
 * Automatically strips EXIF metadata (including GPS coordinates).
 */
export async function compressImageClient(
  file: File,
  options: CompressionOptions = {}
): Promise<Result<Blob>> {
  const validation = validateImageFile(file);
  if (!validation.ok) {
    return validation;
  }

  if (typeof window === "undefined" || typeof document === "undefined") {
    return fail("INTERNAL", "Image compression can only be executed in browser context");
  }

  const maxDimension = options.maxDimension ?? MAX_IMAGE_DIMENSION;
  const maxSizeBytes = options.maxSizeBytes ?? TARGET_MAX_IMAGE_BYTES;
  const initialQuality = options.initialQuality ?? 0.82;

  try {
    const imageElement = await loadImageElement(file);
    const { width, height } = calculateFitDimensions(
      imageElement.naturalWidth || imageElement.width,
      imageElement.naturalHeight || imageElement.height,
      maxDimension
    );

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return fail("INTERNAL", "Could not initialize 2D canvas context");
    }

    ctx.drawImage(imageElement, 0, 0, width, height);

    // Progressive quality step-down to meet size threshold
    const qualities = [initialQuality, 0.7, 0.55, 0.4];
    let bestBlob: Blob | null = null;

    for (const quality of qualities) {
      const blob = await canvasToBlob(canvas, "image/jpeg", quality);
      if (!blob) continue;

      bestBlob = blob;
      if (blob.size <= maxSizeBytes) {
        break;
      }
    }

    if (!bestBlob) {
      return fail("INTERNAL", "Failed to compress image from canvas");
    }

    return ok(bestBlob);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown compression error";
    return fail("INTERNAL", `Image compression failed: ${message}`);
  }
}

function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to decode image file"));
    };
    img.src = url;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), mimeType, quality);
  });
}
