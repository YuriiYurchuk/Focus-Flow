import {
  doc,
  updateDoc,
  increment,
  getDoc,
  type FieldValue,
} from "firebase/firestore";
import { getHours, isAfter } from "date-fns";
import { db } from "@/shared/lib/firebase";
import { processUserAchievements } from "@/shared/lib/helpers/processUserAchievements";
import type { Task } from "@/entities/task/types";
import type { IUserAchievementStats } from "@/entities/achievement/types";

type UserIncrementableFields = Extract<
  {
    [K in keyof IUserAchievementStats]: IUserAchievementStats[K] extends number
      ? K
      : never;
  }[keyof IUserAchievementStats],
  string
>;

type UserUpdateData = Partial<Record<UserIncrementableFields, FieldValue>>;

export const userCompletedTask = async (uid: string, task: Task) => {
  if (!uid || !task) return;

  try {
    const userRef = doc(db, `users/${uid}`);
    const now = new Date();
    const hour = getHours(now);

    const updateData: UserUpdateData = {
      completedTasksCount: increment(1),
    };

    if (hour < 8) {
      updateData.earlyTasksCount = increment(1);
    } else if (hour >= 23) {
      updateData.lateTasksCount = increment(1);
    }

    const deadline = task.deadline?.toDate?.() ?? null;
    const completedAt = now;

    if (deadline && isAfter(completedAt, deadline)) {
      updateData.missedDeadlinesCount = increment(1);
    }

    await updateDoc(userRef, updateData);

    await new Promise((resolve) => setTimeout(resolve, 100));

    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return;

    const userData = userSnap.data() as IUserAchievementStats;

    await processUserAchievements(uid, {
      completedTasksCount: userData.completedTasksCount,
      earlyTasksCount: userData.earlyTasksCount,
      lateTasksCount: userData.lateTasksCount,
      missedDeadlinesCount: userData.missedDeadlinesCount,
    });
  } catch (error) {
    console.error("Помилка при оновленні статистики користувача:", error);
  }
};
