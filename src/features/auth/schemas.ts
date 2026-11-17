import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SignInInput = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(50),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+-\s()]{7,20}$/, "Invalid phone format")
    .optional()
    .or(z.literal("")),
  role: z.enum(["seller", "buyer", "both"]).default("both"),
  lang: z.enum(["en", "ta"]).default("en"),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
