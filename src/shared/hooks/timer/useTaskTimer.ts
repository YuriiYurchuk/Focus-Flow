import { useCallback, useMemo, useRef } from "react";
import type { Task } from "@/entities/task/types";
import { useAuthStore } from "@/shared/store/auth";
import { useTaskFirebaseOperations } from "./useTaskFirebaseOperations";
import { useTaskSync } from "./useTaskSync";
import { useTimerState } from "./useTimerState";

export const useTaskTimer = (task: Task | null) => {
  const uid = useAuthStore((s) => s.user?.uid);

  const internalLockRef = useRef(false);

  const { taskRef, startTaskSession, pauseTaskSession } =
    useTaskFirebaseOperations(uid, task);

  const {
    currentTask,
    isActive,
    syncError,
    completedDurationRef,
    currentSessionStartRef,
    resetRefs,
  } = useTaskSync(taskRef, task);

  const {
    elapsed,
    error: timerError,
    loading,
    isLoading,
    setError,
    clearError,
    setLoadingState,
    resetElapsed,
  } = useTimerState(
    isActive,
    completedDurationRef,
    currentSessionStartRef,
    currentTask?.duration
  );

  const error = syncError ?? timerError;

  const startTimer = useCallback(async () => {
    if (internalLockRef.current) return;
    internalLockRef.current = true;

    if (!currentTask || isActive) {
      setError("Завдання вже активне або не готове");
      internalLockRef.current = false;
      return;
    }

    setLoadingState("starting", true);
    clearError();

    try {
      await startTaskSession();
    } catch (err) {
      console.error("Start timer error:", err);
      setError(
        err instanceof Error ? err.message : "Помилка при запуску таймера"
      );
    } finally {
      setLoadingState("starting", false);
      internalLockRef.current = false;
    }
  }, [
    currentTask,
    isActive,
    startTaskSession,
    setError,
    clearError,
    setLoadingState,
  ]);

  const pauseTimer = useCallback(async () => {
    if (internalLockRef.current) return;
    internalLockRef.current = true;

    if (!currentTask || !isActive) {
      setError("Немає активної задачі для паузи");
      internalLockRef.current = false;
      return;
    }

    setLoadingState("pausing", true);
    clearError();

    try {
      await pauseTaskSession();
    } catch (err) {
      console.error("Pause timer error:", err);
      setError(
        err instanceof Error ? err.message : "Помилка при зупиненні таймера"
      );
    } finally {
      setLoadingState("pausing", false);
      internalLockRef.current = false;
    }
  }, [
    currentTask,
    isActive,
    pauseTaskSession,
    setError,
    clearError,
    setLoadingState,
  ]);

  const computedValues = useMemo(() => {
    return {
      canStart: !isLoading && !isActive && !!taskRef && !!currentTask,
      canPause: !isLoading && isActive && !!taskRef && !!currentTask,
    };
  }, [isLoading, isActive, taskRef, currentTask]);

  return {
    isActive,
    elapsed,
    currentTask,
    error,
    isLoading,
    isStarting: loading.starting,
    isPausing: loading.pausing,
    startTimer,
    pauseTimer,
    clearError,
    canStart: computedValues.canStart,
    canPause: computedValues.canPause,
    resetTimerState: () => {
      resetRefs();
      resetElapsed();
      clearError();
    },
  };
};
