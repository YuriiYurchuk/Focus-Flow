import { collection, getDocs } from "firebase/firestore";
import { db } from "@/shared/lib/firebase";
import type { IAchievement } from "@/entities/achievement/types";

const CACHE_DURATION = 30 * 60 * 1000;

let cache: {
  data: IAchievement[] | null;
  timestamp: number;
} = {
  data: null,
  timestamp: 0,
};

export const getCachedAchievements = async (): Promise<IAchievement[]> => {
  const now = Date.now();

  if (cache.data && now - cache.timestamp < CACHE_DURATION) return cache.data;

  const snapshot = await getDocs(collection(db, "achievements"));
  const achievements = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as IAchievement[];

  cache.data = achievements;
  cache.timestamp = now;

  return achievements;
};
