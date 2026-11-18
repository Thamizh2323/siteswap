import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { ok, fail, type Result } from "@/lib/result";
import { compressImageClient, formatListingPhotoPath } from "@/lib/image";

export const LISTING_PHOTOS_BUCKET = "listing-photos";

export interface UploadListingPhotoResult {
  path: string;
  publicUrl: string;
}

/**
 * Compresses an image on the client and uploads it to the Supabase Storage listing-photos bucket.
 * Enforces authenticated user folder path matching RLS check.
 */
export async function uploadListingPhoto(
  file: File,
  userId: string
): Promise<Result<UploadListingPhotoResult>> {
  if (!userId) {
    return fail("UNAUTHENTICATED", "Must be logged in to upload photos");
  }

  // 1. Compress image to < 300 KB and strip EXIF
  const compressResult = await compressImageClient(file);
  if (!compressResult.ok) {
    return compressResult;
  }

  const compressedBlob = compressResult.data;
  const filePath = formatListingPhotoPath(userId);
  const supabase = createBrowserSupabaseClient();

  try {
    const { error: uploadError } = await supabase.storage
      .from(LISTING_PHOTOS_BUCKET)
      .upload(filePath, compressedBlob, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      return fail("UPSTREAM", `Storage upload failed: ${uploadError.message}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(LISTING_PHOTOS_BUCKET).getPublicUrl(filePath);

    return ok({
      path: filePath,
      publicUrl,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown upload error";
    return fail("INTERNAL", `Upload unexpected error: ${message}`);
  }
}

/**
 * Deletes a listing photo from Supabase Storage by its stored path.
 */
export async function deleteListingPhoto(path: string): Promise<Result<true>> {
  if (!path) {
    return fail("VALIDATION", "No photo path provided");
  }

  const supabase = createBrowserSupabaseClient();
  try {
    const { error } = await supabase.storage.from(LISTING_PHOTOS_BUCKET).remove([path]);
    if (error) {
      return fail("UPSTREAM", `Failed to delete photo: ${error.message}`);
    }
    return ok(true);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return fail("INTERNAL", `Delete photo error: ${message}`);
  }
}
