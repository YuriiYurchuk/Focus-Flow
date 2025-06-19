import { useEffect, useRef, useState } from "react";
import { onSnapshot, DocumentReference } from "firebase/firestore";
import type { ITask } from "@/entities/task/types";
import {
  calculateDurationMs,
  isSessionActive,
} from "@/shared/lib/utils/taskTimerUtils";

export const useTaskSync = (
  taskRef: DocumentReference | null,
  initialTask: ITask | null
) => {
  const [currentTask, setCurrentTask] = useState<ITask | null>(initialTask);
  const [isActive, setIsActive] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const completedDurationRef = useRef<number>(0);
  const currentSessionStartRef = useRef<number | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const prevTaskIdRef = useRef<string | undefined>(initialTask?.id);

  const resetRefs = () => {
    completedDurationRef.current = 0;
    currentSessionStartRef.current = null;
  };

  useEffect(() => {
    const currentTaskId = initialTask?.id;
    const prevTaskId = prevTaskIdRef.current;

    if (currentTaskId !== prevTaskId) {
      setCurrentTask(initialTask);
      setSyncError(null);
      resetRefs();
      prevTaskIdRef.current = currentTaskId;
    }
  }, [initialTask?.id]);

  useEffect(() => {
    if (!taskRef) {
      unsubscribeRef.current?.();
      unsubscribeRef.current = null;
      resetRefs();
      setCurrentTask(null);
      return;
    }

    const unsubscribe = onSnapshot(
      taskRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setSyncError("Задачу не знайдено");
          setCurrentTask(null);
          resetRefs();
          return;
        }

        const data = snapshot.data() as ITask;
        setCurrentTask(data);

        const sessions = data.sessions ?? [];
        const lastSession = sessions.at(-1);
        const sessionActive = isSessionActive(data.status, sessions);

        setIsActive(sessionActive);

        const completed = sessionActive ? sessions.slice(0, -1) : sessions;
        completedDurationRef.current = calculateDurationMs(completed);

        if (sessionActive && lastSession?.start) {
          currentSessionStartRef.current = lastSession.start.toMillis();
        } else {
          currentSessionStartRef.current = null;
        }

        setSyncError(null);
      },
      (error) => {
        console.error("Firestore sync error:", error);
        setSyncError("Помилка синхронізації");
      }
    );

    unsubscribeRef.current = unsubscribe;

    return () => {
      unsubscribe();
      unsubscribeRef.current = null;
      resetRefs();
    };
  }, [taskRef]);

  return {
    currentTask,
    isActive,
    syncError,
    completedDurationRef,
    currentSessionStartRef,
    resetRefs,
  };
};
