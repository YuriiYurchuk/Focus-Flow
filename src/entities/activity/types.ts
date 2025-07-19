import type { Timestamp } from "firebase/firestore";

export type ActivityType =
  | "achievement_granted"
  | "task_created"
  | "task_completed"
  | "task_deleted"
  | "profile_updated";

export interface IActivityMetadata {
  achievementId?: string;
  taskId?: string;
  changedFields?: string[];
}

export interface IActivityLog {
  id: string;
  type: ActivityType;
  message: string;
  metadata?: IActivityMetadata;
  timestamp: Timestamp;
}
