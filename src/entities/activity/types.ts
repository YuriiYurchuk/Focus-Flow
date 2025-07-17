import type { Timestamp } from "firebase/firestore";

export type ActivityType =
  | "achievement_granted"
  | "task_created"
  | "task_completed"
  | "task_deleted"
  | "profile_updated";

export interface ActivityMetadata {
  achievementId?: string;
  taskId?: string;
  changedFields?: string[];
}

export interface ActivityLog {
  id: string;
  type: ActivityType;
  message: string;
  metadata?: ActivityMetadata;
  timestamp: Timestamp;
}
