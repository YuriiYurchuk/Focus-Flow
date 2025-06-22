import { useMemo, useCallback } from "react";
import {
  doc,
  Timestamp,
  collection,
  query,
  where,
  getDocs,
  limit,
  runTransaction,
} from "firebase/firestore";
import { db } from "@/shared/lib/firebase";
import type { Task } from "@/entities/task/types";
import {
  calculateDurationMs,
  validateSession,
  createNewSession,
  closeSession,
} from "@/shared/lib/utils/taskTimer";

export const useTaskFirebaseOperations = (
  uid: string | undefined,
  task: Task | null
) => {
  const isValidTask = !!task?.id && !!uid;

  const taskRef = useMemo(() => {
    return isValidTask && task ? doc(db, "users", uid, "tasks", task.id) : null;
  }, [uid, task?.id, isValidTask]);

  const checkOtherActiveTasks = useCallback(async (): Promise<boolean> => {
    if (!uid || !task?.id) return false;
    try {
      const q = query(
        collection(db, "users", uid, "tasks"),
        where("status", "==", "in-progress"),
        limit(1)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.some((docSnap) => docSnap.id !== task.id);
    } catch (err) {
      console.error("Error checking other active tasks:", err);
      return false;
    }
  }, [uid, task?.id]);

  const startTaskSession = useCallback(async (): Promise<number> => {
    if (!taskRef || !uid || !task?.id) {
      throw new Error("Task reference not available");
    }

    return await runTransaction(db, async (transaction) => {
      const taskDoc = await transaction.get(taskRef);
      if (!taskDoc.exists()) {
        throw new Error("Задачу не знайдено");
      }

      const taskData = taskDoc.data() as Task;
      const sessions = [...(taskData.sessions ?? [])];
      const { hasActiveSession } = validateSession(sessions);

      if (hasActiveSession) {
        throw new Error("Сесія вже активна.");
      }

      const q = query(
        collection(db, "users", uid, "tasks"),
        where("status", "==", "in-progress"),
        limit(1)
      );
      const activeTasksSnapshot = await getDocs(q);
      const hasOtherActive = activeTasksSnapshot.docs.some(
        (docSnap) => docSnap.id !== task.id
      );

      if (hasOtherActive) {
        throw new Error("Інше завдання вже активне.");
      }

      const now = Timestamp.now();
      sessions.push(createNewSession());

      transaction.update(taskRef, {
        status: "in-progress",
        updatedAt: now,
        timeStart: taskData.timeStart || now,
        sessions,
      });

      return now.toMillis();
    });
  }, [taskRef, uid, task?.id]);

  const pauseTaskSession = useCallback(async (): Promise<void> => {
    if (!taskRef) throw new Error("Task reference not available");

    await runTransaction(db, async (transaction) => {
      const taskDoc = await transaction.get(taskRef);
      if (!taskDoc.exists()) {
        throw new Error("Задачу не знайдено");
      }

      const taskData = taskDoc.data() as Task;
      const sessions = [...(taskData.sessions ?? [])];
      const { hasActiveSession, lastSession } = validateSession(sessions);

      if (!hasActiveSession || !lastSession) {
        throw new Error("Немає активної сесії");
      }

      const now = Timestamp.now();
      const updatedSessions = [...sessions];
      updatedSessions[updatedSessions.length - 1] = closeSession(lastSession);
      const durationMs = calculateDurationMs(updatedSessions);

      transaction.update(taskRef, {
        status: "paused",
        updatedAt: now,
        timeEnd: now,
        duration: durationMs,
        sessions: updatedSessions,
      });
    });
  }, [taskRef]);

  return {
    taskRef,
    startTaskSession,
    pauseTaskSession,
    checkOtherActiveTasks,
  };
};
