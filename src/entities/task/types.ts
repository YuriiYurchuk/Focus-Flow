import { Timestamp } from "firebase/firestore";

export type ITaskStatus =
  | "not-started"
  | "in-progress"
  | "paused"
  | "completed";
export type ITaskPriority = "low" | "medium" | "high";

export type ITask = {
  id: string;
  title: string;
  description?: string;
  status: ITaskStatus;
  priority: ITaskPriority;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deadline?: Timestamp;
  timeStart?: Timestamp;
  timeEnd?: Timestamp;
  sessions?: { start: Timestamp; end?: Timestamp }[];
  duration?: number;
};
