import { Timestamp } from "firebase/firestore";
import type { ISession } from "@/entities/task/types";

export const calculateDurationMs = (sessions: ISession[]): number => {
  return sessions.reduce((acc, session) => {
    if (session.start && session.end) {
      return acc + (session.end.toMillis() - session.start.toMillis());
    }
    return acc;
  }, 0);
};

export const calculateCurrentElapsed = (
  completedDuration: number,
  currentSessionStart: number | null
): number => {
  if (!currentSessionStart) return completedDuration;
  return completedDuration + Math.max(0, Date.now() - currentSessionStart);
};

export const validateSession = (sessions: ISession[]) => {
  const lastSession = sessions.at(-1);
  return {
    hasActiveSession: !!lastSession?.start && !lastSession?.end,
    lastSession,
  };
};

export const createNewSession = (): { start: Timestamp } => {
  return {
    start: Timestamp.now(),
  };
};

export const closeSession = (session: ISession): ISession => {
  return {
    start: session.start,
    end: Timestamp.now(),
  };
};

export const isSessionActive = (
  status: string,
  sessions: ISession[]
): boolean => {
  if (status !== "in-progress") return false;
  const last = sessions.at(-1);
  return !!last?.start && !last?.end;
};
