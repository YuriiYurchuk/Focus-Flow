import { useEffect, useRef, useState, useCallback } from "react";
import { Timestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/shared/lib/firebase";
import type { ITask } from "@/entities/task/types";
import { useAuthStore } from "@/shared/store/auth";

export const useTaskTimer = (task: ITask | null) => {
  const [isActive, setIsActive] = useState(false);
  const [hasConflict, setHasConflict] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const isUnmountedRef = useRef(false);

  const user = useAuthStore((state) => state.user);
  const userId = user?.uid;
  const localStorageKey = `active-task-session-${userId}`;

  const safeSetState = useCallback((setter: () => void) => {
    if (!isUnmountedRef.current) setter();
  }, []);

  const getTaskRef = (taskId: string) =>
    doc(db, "users", userId!, "tasks", taskId);

  const calculateDuration = useCallback(
    (sessions: { start: Timestamp; end?: Timestamp }[]) => {
      return sessions.reduce((total, session) => {
        if (session.start && session.end) {
          return (
            total + (session.end.toMillis() - session.start.toMillis()) / 1000
          );
        }
        return total;
      }, 0);
    },
    []
  );

  const getLocalStorageData = useCallback(() => {
    try {
      const data = localStorage.getItem(localStorageKey);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.warn("Failed to access or parse localStorage data:", err);
      localStorage.removeItem(localStorageKey);
      return null;
    }
  }, [localStorageKey]);

  const setLocalStorageData = useCallback(
    (data: any) => {
      try {
        localStorage.setItem(localStorageKey, JSON.stringify(data));
      } catch (err) {
        console.error("LocalStorage write failed:", err);
      }
    },
    [localStorageKey]
  );

  const updateFireStore = useCallback(
    async (taskId: string, updatedTask: Partial<ITask>) => {
      try {
        await updateDoc(getTaskRef(taskId), {
          ...updatedTask,
          updatedAt: Timestamp.now(),
        });
        safeSetState(() => setError(null));
      } catch (err) {
        console.error("Failed to update task:", err);
        safeSetState(() =>
          setError(
            "Failed to update task: " +
              (err instanceof Error ? err.message : "Unknown error")
          )
        );
        throw err;
      }
    },
    [safeSetState, userId]
  );

  const startTask = useCallback(async () => {
    if (!task?.id || !userId) return;

    try {
      const existing = getLocalStorageData();
      if (existing?.taskId && existing.taskId !== task.id) {
        safeSetState(() => setHasConflict(true));
        return;
      }

      const lastSession = task.sessions?.[task.sessions.length - 1];
      if (lastSession && !lastSession.end) {
        return;
      }

      const now = Timestamp.now();
      const newSessions = [...(task.sessions || []), { start: now }];

      setLocalStorageData({
        taskId: task.id,
        sessionStart: now.toMillis(),
      });

      await updateFireStore(task.id, {
        status: "in-progress",
        timeStart: task.timeStart ?? now,
        sessions: newSessions,
      });

      safeSetState(() => {
        setIsActive(true);
        setHasConflict(false);
      });
    } catch {
      safeSetState(() => setError("Failed to start task"));
    }
  }, [
    task,
    userId,
    getLocalStorageData,
    setLocalStorageData,
    updateFireStore,
    safeSetState,
  ]);

  const pauseTask = useCallback(async () => {
    if (!task?.id || !userId) return;

    try {
      const now = Timestamp.now();
      const updatedSessions = (task.sessions || []).map(
        (session, index, arr) => {
          if (index === arr.length - 1 && !session.end) {
            return { ...session, end: now };
          }
          return { ...session };
        }
      );

      const duration = calculateDuration(updatedSessions);
      localStorage.removeItem(localStorageKey);

      await updateFireStore(task.id, {
        status: "paused",
        timeEnd: now,
        sessions: updatedSessions,
        duration,
      });

      safeSetState(() => {
        setIsActive(false);
        setHasConflict(false);
        setElapsedTime(0);
      });
    } catch {
      safeSetState(() => setError("Failed to pause task"));
    }
  }, [
    task,
    userId,
    calculateDuration,
    updateFireStore,
    localStorageKey,
    safeSetState,
  ]);

  const restoreSession = useCallback(() => {
    if (!task?.id) return;

    const saved = getLocalStorageData();
    if (saved?.taskId === task.id) {
      safeSetState(() => {
        setIsActive(true);
        setHasConflict(false);
      });
    }
  }, [task, getLocalStorageData, safeSetState]);

  const handleBeforeUnload = useCallback(async () => {
    if (!task?.id || !userId) return;

    const saved = getLocalStorageData();
    if (!saved || saved.taskId !== task.id) return;

    try {
      const docSnap = await getDoc(getTaskRef(task.id));
      if (!docSnap.exists()) return;

      const freshTask = docSnap.data() as ITask;
      const updatedSessions = (freshTask.sessions || []).map(
        (session, index, arr) => {
          if (index === arr.length - 1 && !session.end) {
            return { ...session, end: Timestamp.now() };
          }
          return { ...session };
        }
      );

      const duration = calculateDuration(updatedSessions);

      await updateFireStore(task.id, {
        status: "paused",
        timeEnd: Timestamp.now(),
        sessions: updatedSessions,
        duration,
      });

      localStorage.removeItem(localStorageKey);
    } catch (err) {
      console.error("Before unload failed:", err);
    }
  }, [task, userId, getLocalStorageData, updateFireStore, calculateDuration]);

  useEffect(() => {
    if (!isActive || !task) return;

    const lastSession = task.sessions?.[task.sessions.length - 1];
    const sessionStart = lastSession?.start?.toMillis() ?? Date.now();

    const update = () => {
      const now = Date.now();
      setElapsedTime(Math.floor((now - sessionStart) / 1000));
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [isActive, task]);

  useEffect(() => {
    if (task?.id) restoreSession();
  }, [task?.id, restoreSession]);

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [handleBeforeUnload]);

  useEffect(() => {
    return () => {
      isUnmountedRef.current = true;
    };
  }, []);

  return {
    isActive,
    hasConflict,
    error,
    elapsedTime,
    startTask,
    pauseTask,
    clearError: () => setError(null),
  };
};
