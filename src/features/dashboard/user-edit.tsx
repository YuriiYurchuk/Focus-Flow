import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { Save, X, Mail, User, Lock } from "lucide-react";
import {
  verifyBeforeUpdateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { Input } from "../ui/input";
import { db, auth } from "@/shared/lib/firebase";
import { editSchema } from "@/shared/schema/editSchema";
import { handleValidationErrors } from "@/shared/lib/helpers/validationHelpers";
import { useToastStore } from "@/shared/store/toast";
import type { IUser } from "@/entities/user/types";
import { processUserAchievements } from "@/shared/lib/helpers/processUserAchievements";

interface IProps {
  user: {
    email: string;
    fullName: string;
  };
  userId: string;
  onSuccess: (updatedUser: Partial<IUser>) => void;
  onCancel: () => void;
}

export const UserEdit: React.FC<IProps> = ({
  user,
  userId,
  onSuccess,
  onCancel,
}) => {
  const [email, setEmail] = useState(user.email);
  const [fullName, setFullName] = useState(user.fullName);
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToastStore();

  const isEmailChanged = email !== user.email;
  const isChanged = isEmailChanged || fullName !== user.fullName;

  const handleSave = async () => {
    setFieldErrors({});
    setIsSubmitting(true);

    const schema = editSchema(user.email);
    const validation = schema.safeParse({ email, fullName, password });
    const hasErrors = handleValidationErrors(
      validation,
      setFieldErrors,
      setIsSubmitting
    );
    if (hasErrors) return;

    try {
      const authUser = auth.currentUser;
      if (!authUser) throw new Error("Користувач не авторизований");

      const updates: Partial<IUser> = {};
      let emailUpdated = false;

      if (isEmailChanged) {
        const credential = EmailAuthProvider.credential(
          authUser.email!,
          password
        );
        await reauthenticateWithCredential(authUser, credential);

        await verifyBeforeUpdateEmail(authUser, email);
        emailUpdated = true;

        showToast({
          message:
            "На нову адресу надіслано лист підтвердження. Email буде змінено після підтвердження.",
          type: "success",
        });
      }

      if (fullName !== user.fullName) {
        updates.fullName = fullName;
      }

      if (Object.keys(updates).length > 0) {
        await updateDoc(doc(db, "users", userId), updates);
        showToast({ message: "Ім’я оновлено!", type: "success" });
        onSuccess(updates);
        await processUserAchievements(userId, { editedProfile: true });
      } else if (!emailUpdated) {
        onCancel();
      }
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        if (error.code === "auth/email-already-in-use") {
          showToast({ message: "Email вже використовується", type: "error" });
        } else if (error.code === "auth/requires-recent-login") {
          showToast({
            message:
              "Потрібно повторно увійти. Введіть пароль і спробуйте ще раз.",
            type: "error",
          });
        } else if (
          error.code === "auth/wrong-password" ||
          error.code === "auth/invalid-credential"
        ) {
          showToast({ message: "Неправильний пароль.", type: "error" });
        } else {
          showToast({ message: `Помилка: ${error.message}`, type: "error" });
          console.error("Firebase error:", error.message);
        }
      } else {
        showToast({ message: "Помилка під час оновлення.", type: "error" });
      }
    } finally {
      setIsSubmitting(false);
      setPassword("");
    }
  };

  return (
    <>
      <div className="space-y-2">
        <Input
          type="text"
          name="fullName"
          label="Повне ім'я"
          icon={<User size={16} />}
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            setFieldErrors((prev) => ({ ...prev, fullName: "" }));
          }}
          placeholder="Нове повне ім'я"
          error={fieldErrors.fullName}
          color="blue"
        />
        <Input
          label="Email"
          name="email"
          icon={<Mail size={16} />}
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setFieldErrors((prev) => ({ ...prev, email: "" }));
          }}
          placeholder="Email"
          error={fieldErrors.email}
          color="purple"
        />
        {isEmailChanged && (
          <Input
            label="Поточний пароль"
            name="password"
            icon={<Lock size={16} />}
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFieldErrors((prev) => ({ ...prev, password: "" }));
            }}
            placeholder="Введіть ваш пароль"
            error={fieldErrors.password}
            color="yellow"
          />
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={!isChanged || isSubmitting}
          className={`
            w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium transition-all duration-300 
            inline-flex items-center justify-center gap-2 shadow-sm text-sm
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-300 min-w-[120px]
            ${
              !isChanged || isSubmitting
                ? "bg-gray-400 cursor-not-allowed opacity-60"
                : `bg-green-500 hover:bg-green-600 text-white cursor-pointer
                  hover:brightness-110 active:scale-[0.99]`
            }
          `}
        >
          <Save className="w-4 h-4" />
          <span className="whitespace-nowrap">
            {isSubmitting ? "Збереження..." : "Зберегти"}
          </span>
        </button>
        <button
          onClick={onCancel}
          disabled={isSubmitting}
          className={`
            w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium transition-all duration-300 
            inline-flex items-center justify-center gap-2 shadow-sm text-sm min-w-[120px]
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300
            ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed opacity-60"
                : `bg-gray-500 hover:bg-gray-600 text-white cursor-pointer
                  hover:brightness-110 active:scale-[0.99]`
            }
          `}
        >
          <X className="w-4 h-4" />
          <span className="whitespace-nowrap">Скасувати</span>
        </button>
      </div>
    </>
  );
};
