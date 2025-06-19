import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { calculateCurrentElapsed } from "@/shared/lib/utils/taskTimerUtils";
import { TIMER_CONSTANTS } from "@/shared/model/timer";
import type { ILoadingState } from "@/entities/task/types";

export const useTimerState = (
  isActive: boolean,
  completedDurationRef: React.MutableRefObject<number>,
  currentSessionStartRef: React.MutableRefObject<number | null>,
  initialDuration?: number
) => {
  const [elapsed, setElapsed] = useState(0);
  const [loading, setLoading] = useState<ILoadingState>({
    starting: false,
    pausing: false,
  });
  const [error, setError] = useState<string | null>(null);

  const intervalRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const calculateElapsed = useCallback(() => {
    return calculateCurrentElapsed(
      completedDurationRef.current,
      currentSessionStartRef.current
    );
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const setLoadingState = useCallback(
    (type: keyof ILoadingState, value: boolean) => {
      setLoading((prev) => ({ ...prev, [type]: value }));
    },
    []
  );

  const resetElapsed = useCallback(() => {
    setElapsed(0);
  }, []);

  useEffect(() => {
    if (isActive && currentSessionStartRef.current) {
      setElapsed(calculateElapsed());
    } else if (initialDuration !== undefined && !isActive) {
      setElapsed(initialDuration);
    } else {
      setElapsed(completedDurationRef.current);
    }
  }, [isActive, initialDuration]);

  useEffect(() => {
    if (!isActive || !currentSessionStartRef.current) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    setElapsed(calculateElapsed());

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      if (now - lastUpdateRef.current < TIMER_CONSTANTS.MIN_UPDATE_INTERVAL) {
        return;
      }

      lastUpdateRef.current = now;
      setElapsed(calculateElapsed());
    }, TIMER_CONSTANTS.TIMER_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, calculateElapsed]);

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(
        () => setError(null),
        TIMER_CONSTANTS.ERROR_TIMEOUT
      );
      return () => clearTimeout(timeout);
    }
  }, [error]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const computedValues = useMemo(() => {
    return {
      isLoading: loading.starting || loading.pausing,
    };
  }, [loading.starting, loading.pausing]);

  return {
    elapsed,
    error,
    loading,
    isLoading: computedValues.isLoading,
    setError,
    clearError,
    setLoadingState,
    resetElapsed,
  };
};
