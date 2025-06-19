import { useState, useEffect } from "react";
import { Card } from "@/features/card"; // твоя картка
import type { ITask } from "@/entities/task/types";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/shared/lib/firebase";
import { useAuthStore } from "@/shared/store/auth";

const TaskListWithTimer = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const user = useAuthStore((state) => state.user);
  const uid = user?.uid;

  if (!uid) return;

  useEffect(() => {
    const tasksCol = collection(db, "users", uid, "tasks");
    const unsubscribe = onSnapshot(tasksCol, (snapshot) => {
      const tasksData: ITask[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ITask[];
      setTasks(tasksData);
    });
    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (
    taskId: string,
    status: ITask["status"]
  ) => {
    try {
      await updateDoc(doc(db, "users", uid, "tasks", taskId), { status });
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, "users", uid, "tasks", taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card
          key={task.id}
          task={task}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export const Component = TaskListWithTimer;
