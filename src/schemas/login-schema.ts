import * as z from "zod";

export const LoginFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 6 characters" }),
  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters" }),
});

export type LoginFormSchemaType = z.infer<typeof LoginFormSchema>;
