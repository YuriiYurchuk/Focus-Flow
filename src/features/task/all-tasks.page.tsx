import { useState, useEffect } from "react";
import { ClipboardList, Plus, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Task } from "@/entities/task/types";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { Card } from "@/features/card";
import { db } from "@/shared/lib/firebase";
import { useAuthStore } from "@/shared/store/auth";
import { useToastStore } from "@/shared/store/toast";
import { TaskCardSkeleton } from "../card/skeleton";

function getSkeletonCount() {
  const width = window.innerWidth;
  if (width < 768) return 3;
  if (width < 1024) return 4;
  if (width < 1280) return 6;
  return 8;
}

const AllTaskPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [skeletonCount, setSkeletonCount] = useState(getSkeletonCount());
  const user = useAuthStore((state) => state.user);
  const uid = user?.uid;
  const { showToast } = useToastStore();

  useEffect(() => {
    if (!uid) {
      setTasks([]);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const tasksCol = collection(db, "users", uid, "tasks");
    const unsubscribe = onSnapshot(
      tasksCol,
      (snapshot) => {
        if (!isMounted) return;
        const tasksData: Task[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Task[];
        setTasks(tasksData);
        setLoading(false);
        setError(false);
      },
      (error) => {
        console.error("Snapshot error:", error);
        if (!isMounted) return;
        setLoading(false);
        setError(true);
        showToast({
          message: "Не вдалося завантажити завдання.",
          type: "error",
        });
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [uid, showToast]);

  const handleStatusChange = async (taskId: string, status: Task["status"]) => {
    if (!uid) return;

    try {
      await updateDoc(doc(db, "users", uid, "tasks", taskId), { status });
      showToast({
        message: `Завдання завершено!`,
        type: "success",
      });
    } catch (error) {
      console.error("Error updating task status:", error);
      showToast({
        message: "Не вдалося оновити статус завдання.",
        type: "error",
      });
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!uid) return;

    const prevTasks = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    try {
      await deleteDoc(doc(db, "users", uid, "tasks", taskId));
      showToast({ message: "Завдання видалено.", type: "success" });
    } catch (error) {
      console.error("Error deleting task:", error);
      setTasks(prevTasks);
      showToast({
        message: "Не вдалося видалити завдання.",
        type: "error",
      });
    }
  };

  useEffect(() => {
    const handleResize = () => setSkeletonCount(getSkeletonCount());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 auto-rows-min">
      {loading ? (
        Array.from({ length: skeletonCount }).map((_, i) => (
          <div key={`loading-skeleton-${i}`}>
            <TaskCardSkeleton />
          </div>
        ))
      ) : error ? (
        <div className="col-span-full">
          <div className="flex flex-col items-center justify-center rounded-xl py-12 px-6">
            <AlertCircle className="w-8 h-8 text-red-400 mb-3" />
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-center">
              Сталася помилка при завантаженні завдань
            </p>
            <button
              onClick={() => window.location.reload()}
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors"
            >
              Спробувати знову
            </button>
          </div>
        </div>
      ) : tasks.length > 0 ? (
        <AnimatePresence mode="sync">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="min-h-[240px]"
            >
              <Card
                task={task}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center shadow-sm">
              <ClipboardList className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <Plus className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Почніть свій перший проект
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-base max-w-md leading-relaxed">
              Створіть завдання та почніть відстежувати свій прогрес.
              Організуйте роботу ефективно з нашим інструментом керування часом.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export const Component = AllTaskPage;
