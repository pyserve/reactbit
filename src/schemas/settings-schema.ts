import * as z from "zod";

export const AccountSchema = z.object({
  first_name: z
    .string()
    .min(2, "First name must be at least 2 character long."),
  last_name: z.string().optional().nullable(),
  email: z
    .string()
    .nullable()
    .optional()
    .transform((v) => (v === "" ? null : v))
    .refine((v: any) => v === null || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
      message: "Invalid email",
    }),
  username: z.string().min(3, "Username must be at least 3 character long."),
  bio: z.string().optional(),
});
export type AccountSchemaType = z.infer<typeof AccountSchema>;

export const SecuritySchema = z
  .object({
    current_password: z.string().min(1, "Current password is required."),
    new_password: z
      .string()
      .min(5, "New password must be at least 5 characters."),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match.",
  });

export type SecuritySchemaType = z.infer<typeof SecuritySchema>;

export const NotificationSettingsSchema = z.object({
  emailAll: z.boolean(),
  emailNewMessages: z.boolean(),
  pushAll: z.boolean(),
  pushNewMessages: z.boolean(),
  pushNewFollowers: z.boolean(),
  pushCommentsLikes: z.boolean(),
});

export type NotificationSettingsForm = z.infer<
  typeof NotificationSettingsSchema
>;
