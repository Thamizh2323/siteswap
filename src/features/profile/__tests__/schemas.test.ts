import { describe, it, expect } from "vitest";
import { updateProfileSchema } from "../schemas";

describe("Profile Validation Schemas", () => {
  it("validates valid profile updates", () => {
    const valid = updateProfileSchema.safeParse({
      name: "Thamizh Mason",
      phone: "+91 99887 76655",
      role: "both",
      area_text: "Salem & Suramangalam",
      lang: "ta",
    });
    expect(valid.success).toBe(true);
  });

  it("rejects empty name", () => {
    const invalid = updateProfileSchema.safeParse({
      name: "",
      role: "buyer",
    });
    expect(invalid.success).toBe(false);
  });
});
