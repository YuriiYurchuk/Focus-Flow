import { Timestamp } from "firebase/firestore";

export type ITaskStatus =
  | "not-started"
  | "in-progress"
  | "paused"
  | "completed";
export type ITaskPriority = "low" | "medium" | "high";

export interface ISession {
  start: Timestamp;
  end?: Timestamp;
}

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
  sessions?: ISession[];
  duration?: number;
};

export type ILoadingState = {
  starting: boolean;
  pausing: boolean;
};
