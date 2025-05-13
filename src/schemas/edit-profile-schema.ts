import { z } from "zod";

export const EditProfileSchema = z.object({
  display_name: z.string().optional(),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email").optional(),
  bio: z.string().optional(),
  address: z.string().optional(),
  website: z
    .string()
    .optional()
    .refine(
      (val: any) =>
        val === "" || /^https?:\/\/[\w.-]+\.[a-z]{2,}(\/\S*)?$/i.test(val),
      {
        message: "Must be a valid URL",
      }
    ),
});

export type EditProfileFormSchemaType = z.infer<typeof EditProfileSchema>;
