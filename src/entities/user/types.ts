import { Timestamp } from "firebase/firestore";
import type { IGrantedAchievement } from "@/entities/achievement/types";

export interface IUser {
  uid: string;
  fullName: string;
  email: string;
  createdAt: Timestamp;
  streak: number;
  lastActiveAt: Timestamp;
  completedTasksCount: number;
  achievements: IGrantedAchievement[];
}
