import { Timestamp } from "firebase/firestore";

export type TaskStatus = "not-started" | "in-progress" | "paused" | "completed";
export type TaskPriority = "low" | "medium" | "high";

export interface ISession {
  start: Timestamp;
  end?: Timestamp;
}

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deadline?: Timestamp;
  timeStart?: Timestamp;
  timeEnd?: Timestamp;
  sessions?: ISession[];
  duration?: number;
};

export type LoadingState = {
  starting: boolean;
  pausing: boolean;
};
