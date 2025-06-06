import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Mail, Lock, LogIn } from "lucide-react";
import { auth } from "@/shared/lib/firebase";
import { useAuthStore } from "@/shared/store/auth";
import { LinkText, AuthHeader } from "@/features/auth";
import { useToastStore } from "@/shared/store/toast";
import { Button } from "@/features/ui/button";
import { Input } from "@/features/ui/input";
import { loginSchema } from "@/shared/schema/loginSchema";
import {
  handleValidationErrors,
  validateField,
} from "@/shared/lib/helpers/validationHelpers";
import { ROUTES } from "@/shared/model/routes";

interface IFormProps {
  setUser: (user: { uid: string; email: string }) => void;
}

const LoginForm: React.FC<IFormProps> = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToastStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setIsSubmitting(true);

    const validation = loginSchema.safeParse({ email, password });

    const hasErrors = handleValidationErrors(
      validation,
      setFieldErrors,
      setIsSubmitting
    );

    if (hasErrors) return;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email ?? "",
      });
      showToast({ message: "Успішний вхід!", type: "success" });
      navigate(ROUTES.DASHBOARD);
    } catch (error: unknown) {
      setIsSubmitting(false);

      if (error instanceof Error) {
        const firebaseError = error as { code?: string; message: string };
        switch (firebaseError.code) {
          case "auth/wrong-password":
          case "auth/user-not-found":
          case "auth/invalid-credential":
            showToast({
              message: "Невірна електронна пошта або пароль",
              type: "error",
            });
            break;
          case "auth/too-many-requests":
            showToast({
              message: "Забагато спроб. Спробуйте пізніше",
              type: "error",
            });
            break;
          default:
            showToast({
              message: "Сталася помилка. Спробуйте ще раз",
              type: "error",
            });
            break;
        }
      } else {
        showToast({ message: "Невідома помилка", type: "error" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6" noValidate>
      <Input
        type="email"
        placeholder="Введіть електронну пошту"
        value={email}
        icon={<Mail size={16} />}
        name="email"
        label="Електронна пошта"
        onChange={(e) => {
          setEmail(e.target.value);
          setFieldErrors((prev) => ({ ...prev, email: "" }));
        }}
        onBlur={() => {
          if (email) {
            const message = validateField("email", { email, password });
            setFieldErrors((prev) => ({ ...prev, email: message }));
          }
        }}
        error={fieldErrors.email}
        color="blue"
      />
      <Input
        type="password"
        placeholder="Введіть пароль"
        value={password}
        icon={<Lock size={16} />}
        name="password"
        label="Пароль"
        onChange={(e) => {
          setPassword(e.target.value);
          setFieldErrors((prev) => ({ ...prev, password: "" }));
        }}
        onBlur={() => {
          if (password) {
            const message = validateField("password", { email, password });
            setFieldErrors((prev) => ({ ...prev, password: message }));
          }
        }}
        error={fieldErrors.password}
        color="purple"
        showToggle
      />
      <Button type="submit" isLoading={isSubmitting} icon={LogIn}>
        Увійти
      </Button>
    </form>
  );
};

const LoginPage = () => {
  const setUser = useAuthStore((state) => state.setUser);
  return (
    <div className="p-4 flex items-center justify-center">
      <div className="w-full max-w-lg">
        <AuthHeader
          title="Вхід у ваш акаунт"
          description="Будь ласка, увійдіть, щоб продовжити"
          icon="login"
        />
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-8 space-y-6">
            <LoginForm setUser={setUser} />
            <LinkText
              spanText="Немає облікового запису?"
              to={ROUTES.AUTH.REGISTER}
              linkText="Зареєструватися"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const Component = LoginPage;
