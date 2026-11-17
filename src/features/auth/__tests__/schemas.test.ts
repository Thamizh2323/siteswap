import { describe, it, expect } from "vitest";
import { signInSchema, signUpSchema } from "../schemas";

describe("Auth Validation Schemas", () => {
  it("validates correct sign-in inputs", () => {
    const valid = signInSchema.safeParse({
      email: "user@example.com",
      password: "securepassword",
    });
    expect(valid.success).toBe(true);
  });

  it("rejects invalid emails and short passwords", () => {
    const invalidEmail = signInSchema.safeParse({
      email: "not-an-email",
      password: "pass",
    });
    expect(invalidEmail.success).toBe(false);
  });

  it("validates correct sign-up inputs", () => {
    const valid = signUpSchema.safeParse({
      email: "contractor@salem.in",
      password: "strongpassword123",
      name: "Murugan Builders",
      phone: "+91 98765 43210",
      role: "seller",
      lang: "ta",
    });
    expect(valid.success).toBe(true);
  });

  it("rejects short names", () => {
    const invalid = signUpSchema.safeParse({
      email: "valid@email.com",
      password: "password123",
      name: "A",
    });
    expect(invalid.success).toBe(false);
  });
});
