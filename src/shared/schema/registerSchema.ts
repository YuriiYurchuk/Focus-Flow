import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.string().nonempty("Email обов’язковий").email("Некоректний email"),

    fullName: z
      .string()
      .nonempty("Ім’я обов’язкове")
      .min(2, "Ім’я повинно містити щонайменше 2 символи")
      .max(50, "Ім’я не повинно перевищувати 50 символів")
      .regex(
        /^[a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ'’\s-]+$/,
        "Ім’я містить недопустимі символи"
      ),

    password: z
      .string()
      .nonempty("Пароль обов’язковий")
      .min(6, "Пароль повинен містити щонайменше 6 символів")
      .max(100, "Пароль не повинен перевищувати 100 символів")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "Пароль має містити щонайменше одну велику, малу літеру та цифру"
      ),

    confirmPassword: z.string().nonempty("Підтвердження пароля обов’язкове"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Паролі не збігаються",
    path: ["confirmPassword"],
  });
