import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email є обов'язковим" })
    .email("Невірний формат email")
    .max(100, "Email повинен містити не більше 100 символів"),

  password: z
    .string({ required_error: "Пароль є обов'язковим" })
    .min(6, "Пароль повинен містити мінімум 6 символів")
    .max(50, "Пароль повинен містити не більше 50 символів"),
});
