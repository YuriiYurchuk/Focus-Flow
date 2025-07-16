import { Timestamp } from "firebase/firestore";

type AchievementType = "greaterOrEqual" | "equal";

export interface IUserAchievementStats {
  completedTasksCount: number;
  streak: number;
  loginsCount: number;
  earlyTasksCount: number;
  lateTasksCount: number;
  missedDeadlinesCount: number;
  enabledDarkMode: boolean;
  editedProfile: boolean;
  streakBreaksCount: number;
}

export interface IAchievement {
  id: string;
  title: string;
  description: string;
  field: keyof IUserAchievementStats;
  goal: number | boolean;
  type: AchievementType;
  icon: string;
  hidden?: boolean;
}

export interface IGrantedAchievement {
  id: string;
  grantedAt: Timestamp;
}
