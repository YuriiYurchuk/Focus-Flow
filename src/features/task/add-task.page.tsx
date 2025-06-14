import { useState } from "react";
import { Plus, FileText } from "lucide-react";
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
import { useToastStore } from "@/shared/store/toast";
import { useAuthStore } from "@/shared/store/auth";
import type { ITask, ITaskPriority } from "@/entities/task/types";

export const addTaskPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<ITaskPriority>("medium");
  const [deadline, setDeadline] = useState<string>("");
  const [duration, setDuration] = useState<number | "">("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToastStore();
  const uid = useAuthStore((state) => state.user?.uid);

  const handleTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setIsSubmitting(true);

    const validation = taskSchema.safeParse({
      title,
      description,
      priority,
      deadline: deadline ? new Date(deadline) : undefined,
      duration: duration ? Number(duration) : undefined,
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
        description: description || undefined,
        status: "not-started",
        priority,
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp,
        deadline: deadline ? Timestamp.fromDate(new Date(deadline)) : undefined,
        duration: duration ? Number(duration) : undefined,
        sessions: [],
      };

      await setDoc(taskRef, newTask);
      showToast({ message: "Завдання успішно додано!", type: "success" });
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDeadline("");
      setDuration("");
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

export const Component = addTaskPage;
