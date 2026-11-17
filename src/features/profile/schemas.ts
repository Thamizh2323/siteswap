import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+-\s()]{7,20}$/, "Invalid phone format")
    .optional()
    .or(z.literal("")),
  role: z.enum(["seller", "buyer", "both", "admin"]).default("both"),
  area_text: z.string().trim().max(100).optional().or(z.literal("")),
  lang: z.enum(["en", "ta"]).default("en"),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
