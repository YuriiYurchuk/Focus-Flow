import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth, db } from "@/shared/lib/firebase";
import { doc, setDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { UserPlus, Mail, Lock, User } from "lucide-react";
import { LinkText, AuthHeader } from "@/features/auth";
import { useToastStore } from "@/shared/store/toast";
import { Button } from "@/features/ui/button";
import { Input } from "@/features/ui/input";
import { registerSchema } from "@/shared/schema/registerSchema";
import {
  handleValidationErrors,
  validateField,
} from "@/shared/lib/helpers/validationHelpers";
import type { IUser } from "@/entities/user/types";
import { ROUTES } from "@/shared/model/routes";
import type { IGrantedAchievement } from "@/entities/achievement/types";

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { showToast } = useToastStore();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setIsSubmitting(true);

    const validation = registerSchema.safeParse({
      email,
      fullName,
      password,
      confirmPassword,
    });

    const hasErrors = handleValidationErrors(
      validation,
      setFieldErrors,
      setIsSubmitting
    );

    if (hasErrors) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await sendEmailVerification(userCredential.user);
      const uid = userCredential.user.uid;
      const user: IUser & { achievements?: IGrantedAchievement[] } = {
        uid,
        fullName,
        email,
        createdAt: serverTimestamp() as Timestamp,
        streak: 1,
        lastActiveAt: Timestamp.fromDate(new Date()),
        completedTasksCount: 0,
        achievements: [
          {
            id: "first_login",
            grantedAt: Timestamp.fromDate(new Date()),
          },
        ],
      };
      await setDoc(doc(db, "users", uid), user);
      showToast({ message: "Реєстрація успішна!", type: "success" });
      navigate(ROUTES.AUTH.LOGIN);
    } catch (error: unknown) {
      if (error instanceof Error) {
        const firebaseError = error as { code?: string; message: string };
        if (firebaseError.code === "auth/email-already-in-use") {
          showToast({
            message: "Користувач з такою поштою вже існує",
            type: "error",
          });
        } else {
          showToast({
            message: "Щось пішло не так. Спробуйте ще раз",
            type: "error",
          });
        }
      } else {
        showToast({ message: "Невідома помилка", type: "error" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-6" noValidate>
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
        type="text"
        placeholder="Введіть повне ім'я"
        value={fullName}
        icon={<User size={16} />}
        name="fullName"
        label="Повне ім'я"
        onChange={(e) => {
          setFullName(e.target.value);
          setFieldErrors((prev) => ({ ...prev, fullName: "" }));
        }}
        error={fieldErrors.fullName}
        color="purple"
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
        color="green"
        showToggle
      />
      <Input
        type="password"
        placeholder="Підтвердьте пароль"
        value={confirmPassword}
        icon={<Lock size={16} />}
        name="confirmPassword"
        label="Підтвердження паролю"
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          setFieldErrors((prev) => ({ ...prev, confirmPassword: "" }));
        }}
        error={fieldErrors.confirmPassword}
        color="yellow"
        showToggle
      />
      <Button type="submit" isLoading={isSubmitting} icon={UserPlus}>
        Зареєструватися
      </Button>
    </form>
  );
};

const RegisterPage = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-lg">
        <AuthHeader
          title="Реєстрація"
          description="Створіть акаунт, щоб розпочати використання застосунку"
          icon="register"
        />
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 sm:p-8 space-y-6">
            <RegisterForm />
            <LinkText
              spanText="Вже маєте акаунт?"
              to={ROUTES.AUTH.LOGIN}
              linkText="Увійти"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const Component = RegisterPage;
