import { useState } from "react";
import { Plus, FileText, Flag, Calendar } from "lucide-react";
import {
  doc,
  collection,
  setDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/shared/lib/firebase";
import { taskSchema } from "@/shared/schema/taskSchema";
import { handleValidationErrors } from "@/shared/lib/helpers/validationHelpers";
import { Input } from "@/features/ui/input";
import { Button } from "@/features/ui/button";
import { Select } from "@/features/ui/select";
import { useToastStore } from "@/shared/store/toast";
import { useAuthStore } from "@/shared/store/auth";
import { uidToUserActivity } from "@/shared/lib/helpers/userActivity";
import type { ITask, ITaskPriority } from "@/entities/task/types";

export const FormTask: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<ITaskPriority>("medium");
  const [deadline, setDeadline] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToastStore();
  const user = useAuthStore((state) => state.user);
  const uid = user?.uid;

  const handleTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setIsSubmitting(true);

    const validation = taskSchema.safeParse({
      title,
      description,
      priority,
      deadline: deadline ? new Date(deadline) : undefined,
    });

    const hasErrors = handleValidationErrors(
      validation,
      setFieldErrors,
      setIsSubmitting
    );

    if (hasErrors) return;

    try {
      const taskRef = doc(collection(db, `users/${uid}/tasks`));
      const newTask: ITask = {
        id: taskRef.id,
        title,
        status: "not-started",
        priority,
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp,
        sessions: [],
        ...(description ? { description } : {}),
        ...(deadline
          ? { deadline: Timestamp.fromDate(new Date(deadline)) }
          : {}),
      };

      await setDoc(taskRef, newTask);
      if (uid) {
        await uidToUserActivity(uid);
      }
      showToast({ message: "Завдання успішно додано!", type: "success" });
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDeadline("");
    } catch (error: unknown) {
      if (error instanceof Error) {
        const firebaseError = error as { code?: string; message: string };
        if (firebaseError.code === "permission-denied") {
          showToast({ message: "Доступ заборонено", type: "error" });
        } else if (firebaseError.code === "unavailable") {
          showToast({
            message: "Сервіс тимчасово недоступний. Спробуйте пізніше",
            type: "error",
          });
        } else {
          console.error("Помилка при додаванні завдання:", error);
          showToast({
            message: "Сталася помилка. Спробуйте ще раз",
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

  const priorityOptions = [
    { value: "low", label: "Низький" },
    { value: "medium", label: "Середній" },
    { value: "high", label: "Високий" },
  ];

  return (
    <form onSubmit={handleTask} className="space-y-6" noValidate>
      <Input
        placeholder="Назва завдання"
        value={title}
        icon={<FileText size={16} />}
        name="title"
        label="Назва завдання"
        onChange={(e) => setTitle(e.target.value)}
        error={fieldErrors.title}
        type="text"
      />
      <Select
        name="priority"
        label="Пріоритет"
        value={priority}
        options={priorityOptions}
        onChange={(val) => {
          setPriority(val as ITaskPriority);
          setFieldErrors((prev) => ({ ...prev, priority: "" }));
        }}
        onBlur={() => {
          if (!priority) {
            setFieldErrors((prev) => ({
              ...prev,
              priority: "Оберіть пріоритет",
            }));
          }
        }}
        error={fieldErrors.priority}
        placeholder="Оберіть пріоритет..."
        color="orange"
        icon={<Flag size={16} />}
      />
      <Input
        placeholder="Оберіть дедлайн"
        value={deadline}
        icon={<Calendar size={16} />}
        name="deadline"
        label="Дедлайн (необов'язково)"
        onChange={(e) => setDeadline(e.target.value)}
        error={fieldErrors.deadline}
        color="yellow"
        type="date"
      />
      <Input
        as="textarea"
        placeholder="Опис завдання (необов'язково)"
        value={description}
        icon={<FileText size={16} />}
        name="description"
        label="Опис завдання"
        onChange={(e) => setDescription(e.target.value)}
        error={fieldErrors.description}
        color="purple"
      />
      <Button type="submit" isLoading={isSubmitting} icon={Plus}>
        Додати завдання
      </Button>
    </form>
  );
};

const AddTaskPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500
      to-purple-600 rounded-2xl mb-4 shadow-lg transform transition-all duration-500 hover:scale-110 
      hover:rotate-3 animate-pulse"
          >
            <Plus className="w-8 h-8 text-white transition-transform duration-300" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Створити нове завдання
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Додайте завдання та налаштуйте час роботи
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-8 space-y-6">
            <FormTask />
          </div>
        </div>
      </div>
    </div>
  );
};

export const Component = AddTaskPage;
