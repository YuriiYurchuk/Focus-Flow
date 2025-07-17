import { useCallback } from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/shared/lib/firebase";
import { useToastStore } from "@/shared/store/toast";
import type { Task } from "@/entities/task/types";

export const useTaskActions = (
  uid: string | undefined,
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  totalCount: number | null,
  setTotalCount: React.Dispatch<React.SetStateAction<number | null>>
) => {
  const { showToast } = useToastStore();

  const handleCompleteTask = useCallback(
    async (taskId: string, status: Task["status"]) => {
      if (!uid) return;
      try {
        await updateDoc(doc(db, "users", uid, "tasks", taskId), { status });
        showToast({ message: "Завдання завершено!", type: "success" });
      } catch (error) {
        console.error("Error updating task status:", error);
        showToast({
          message: "Не вдалося оновити статус завдання.",
          type: "error",
        });
      }
    },
    [uid, showToast]
  );

  const handleDeleteTask = useCallback(
    async (taskId: string) => {
      if (!uid) return;
      const prevTasks = tasks;
      const prevTotalCount = totalCount;
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      setTotalCount((prev) => (prev !== null ? prev - 1 : prev));

      try {
        await deleteDoc(doc(db, "users", uid, "tasks", taskId));
        showToast({ message: "Завдання видалено.", type: "success" });
      } catch (error) {
        console.error("Error deleting task:", error);
        setTasks(prevTasks);
        setTotalCount(prevTotalCount);
        showToast({ message: "Не вдалося видалити завдання.", type: "error" });
      }
    },
    [uid, tasks, totalCount, setTasks, setTotalCount, showToast]
  );

  return {
    handleCompleteTask,
    handleDeleteTask,
  };
};
