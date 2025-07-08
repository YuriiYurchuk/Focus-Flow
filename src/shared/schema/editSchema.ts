import { z } from "zod";

export const editSchema = (originalEmail: string) =>
  z
    .object({
      email: z
        .string()
        .email("Невірний формат email")
        .max(100, "Email повинен містити не більше 100 символів"),
      fullName: z
        .string()
        .min(2, "Ім’я повинне містити щонайменше 2 символи")
        .max(100, "Ім’я не повинне перевищувати 100 символів")
        .regex(
          /^[a-zA-Zа-яА-ЯіїєІЇЄ'’ -]+$/,
          "Ім’я містить недопустимі символи"
        ),
      password: z.string().optional(),
    })
    .superRefine(({ email, password }, ctx) => {
      if (email !== originalEmail) {
        if (!password) {
          ctx.addIssue({
            code: "custom",
            path: ["password"],
            message: "Пароль є обов'язковим для зміни email",
          });
        } else if (password.length < 6) {
          ctx.addIssue({
            code: "custom",
            path: ["password"],
            message: "Пароль повинен містити мінімум 6 символів",
          });
        } else if (password.length > 50) {
          ctx.addIssue({
            code: "custom",
            path: ["password"],
            message: "Пароль повинен містити не більше 50 символів",
          });
        }
      }
    });
