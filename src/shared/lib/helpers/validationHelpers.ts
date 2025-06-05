import { loginSchema } from "@/shared/schema/loginSchema";

type FieldErrors = Record<string, string>;

interface IValidationError {
  path: (string | number)[];
  message: string;
}

interface IValidationResult {
  success: boolean;
  error?: {
    errors: IValidationError[];
  };
}

export function handleValidationErrors(
  validation: IValidationResult,
  setFieldErrors: (errors: FieldErrors) => void,
  setIsSubmitting: (value: boolean) => void
): boolean {
  if (!validation.success) {
    const errors: FieldErrors = {};
    validation.error?.errors.forEach((err) => {
      if (err.path[0]) {
        errors[err.path[0] as string] = err.message;
      }
    });
    setFieldErrors(errors);
    setIsSubmitting(false);
    return true;
  }
  return false;
}

export function validateField(
  field: "email" | "password",
  values: { email: string; password: string }
) {
  const validation = loginSchema.safeParse(values);
  if (!validation.success) {
    const error = validation.error.errors.find((err) => err.path[0] === field);
    return error ? error.message : "";
  }
  return "";
}
