import {
  collection,
  getDocs,
  doc,
  updateDoc,
  Timestamp,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { db } from "@/shared/lib/firebase";
import type {
  IAchievement,
  IGrantedAchievement,
  IUserAchievementStats,
} from "@/entities/achievement/types";
import { useAchievementsStore } from "@/shared/store/achievements";

interface UserData extends IUserAchievementStats {
  achievements?: IGrantedAchievement[];
}

let achievementsCache: IAchievement[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 30 * 60 * 60 * 1000;

const getCachedAchievements = async (): Promise<IAchievement[]> => {
  const now = Date.now();

  if (achievementsCache && now - cacheTimestamp < CACHE_DURATION) {
    return achievementsCache;
  }

  const snapshot = await getDocs(collection(db, "achievements"));
  achievementsCache = snapshot.docs.map((doc) => doc.data() as IAchievement);
  cacheTimestamp = now;

  return achievementsCache;
};

const checkAchievementCondition = (
  achievement: IAchievement,
  userValue: any
): boolean => {
  if (userValue === undefined || userValue === null) return false;

  switch (achievement.type) {
    case "equal":
      return userValue === achievement.goal;
    case "greaterOrEqual":
      return userValue >= achievement.goal;
    default:
      return false;
  }
};

const validateInput = (
  userId: string,
  updatedFields: Partial<UserData>
): void => {
  if (!userId?.trim()) {
    throw new Error("userId is required and cannot be empty");
  }

  if (!updatedFields || typeof updatedFields !== "object") {
    throw new Error("updatedFields must be a valid object");
  }
};

export const processUserAchievements = async (
  userId: string,
  updatedFields: Partial<UserData>
): Promise<{
  success: boolean;
  grantedCount: number;
  grantedAchievements?: string[];
  error?: string;
}> => {
  try {
    validateInput(userId, updatedFields);

    const [userSnap, allAchievements] = await Promise.all([
      getDoc(doc(db, "users", userId)),
      getCachedAchievements(),
    ]);

    if (!userSnap.exists()) {
      return {
        success: false,
        grantedCount: 0,
        error: "User not found",
      };
    }

    const userData = userSnap.data() as UserData;
    const userAchievements = userData.achievements || [];

    const grantedAchievementIds = new Set(userAchievements.map((a) => a.id));

    const now = Timestamp.now();
    const newAchievements: IGrantedAchievement[] = [];

    for (const achievement of allAchievements) {
      if (grantedAchievementIds.has(achievement.id)) continue;

      const userValue =
        updatedFields[achievement.field] ?? userData[achievement.field];

      if (checkAchievementCondition(achievement, userValue)) {
        newAchievements.push({
          id: achievement.id,
          grantedAt: now,
        });
      }
    }

    if (newAchievements.length > 0) {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        achievements: arrayUnion(...newAchievements),
      });

      const store = useAchievementsStore.getState();
      for (const achievement of newAchievements) {
        store.addUserAchievement(achievement);
      }

      console.log(
        `Додано ${newAchievements.length} нових досягнень:`,
        newAchievements.map((a) => a.id)
      );
      console.log(
        "Оновлений список досягнень у сторі:",
        store.userAchievements
      );
    }

    return {
      success: true,
      grantedCount: newAchievements.length,
      grantedAchievements: newAchievements.map((a) => a.id),
    };
  } catch (error) {
    return {
      success: false,
      grantedCount: 0,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
