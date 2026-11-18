import { describe, it, expect } from "vitest";
import {
  validateImageFile,
  calculateFitDimensions,
  formatListingPhotoPath,
  MAX_IMAGE_DIMENSION,
  MAX_RAW_IMAGE_SIZE_BYTES,
} from "../image";

describe("Image validation (validateImageFile)", () => {
  it("allows valid image formats within size limit", () => {
    expect(validateImageFile({ size: 1024 * 500, type: "image/jpeg" })).toEqual({
      ok: true,
      data: true,
    });
    expect(validateImageFile({ size: 1024 * 500, type: "image/png" })).toEqual({
      ok: true,
      data: true,
    });
    expect(validateImageFile({ size: 1024 * 500, type: "image/webp" })).toEqual({
      ok: true,
      data: true,
    });
  });

  it("rejects unsupported MIME types", () => {
    const res = validateImageFile({ size: 5000, type: "application/pdf" });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.error.code).toBe("VALIDATION");
      expect(res.error.message).toContain("Unsupported image format");
    }
  });

  it("rejects empty files with 0 bytes", () => {
    const res = validateImageFile({ size: 0, type: "image/jpeg" });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.error.code).toBe("VALIDATION");
      expect(res.error.message).toBe("File is empty");
    }
  });

  it("rejects files exceeding 10 MB raw limit", () => {
    const res = validateImageFile({
      size: MAX_RAW_IMAGE_SIZE_BYTES + 1,
      type: "image/jpeg",
    });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.error.code).toBe("VALIDATION");
      expect(res.error.message).toBe("Image must be under 10 MB");
    }
  });
});

describe("Dimension scaling (calculateFitDimensions)", () => {
  it("keeps dimensions untouched if already within maximum", () => {
    const result = calculateFitDimensions(800, 600, MAX_IMAGE_DIMENSION);
    expect(result).toEqual({ width: 800, height: 600 });
  });

  it("scales down landscape dimensions preserving aspect ratio", () => {
    const result = calculateFitDimensions(2560, 1440, 1280);
    expect(result).toEqual({ width: 1280, height: 720 });
  });

  it("scales down portrait dimensions preserving aspect ratio", () => {
    const result = calculateFitDimensions(1000, 2000, 1280);
    expect(result).toEqual({ width: 640, height: 1280 });
  });

  it("scales down square images to equal maximum sides", () => {
    const result = calculateFitDimensions(3000, 3000, 1280);
    expect(result).toEqual({ width: 1280, height: 1280 });
  });

  it("handles zero or negative dimensions safely", () => {
    expect(calculateFitDimensions(0, 0)).toEqual({ width: 0, height: 0 });
    expect(calculateFitDimensions(-10, 50)).toEqual({ width: 0, height: 0 });
  });
});

describe("Storage path generation (formatListingPhotoPath)", () => {
  it("formats path with user id and photo id", () => {
    const path = formatListingPhotoPath("user-123", "photo-abc");
    expect(path).toBe("user-123/photo-abc.jpg");
  });

  it("strips path traversal sequences from user and photo identifiers", () => {
    const path = formatListingPhotoPath("../../evil-user", "../malicious");
    expect(path).toBe("evil-user/malicious.jpg");
    expect(path.includes("..")).toBe(false);
  });
});
