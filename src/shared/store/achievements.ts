import { create } from "zustand";
import type { IGrantedAchievement } from "@/entities/achievement/types";

interface AchievementsStore {
  userAchievements: IGrantedAchievement[];
  setUserAchievements: (achievements: IGrantedAchievement[]) => void;
  addUserAchievement: (achievement: IGrantedAchievement) => void;
  hasAchievement: (id: string) => boolean;
  reset: () => void;
}

export const useAchievementsStore = create<AchievementsStore>((set, get) => ({
  userAchievements: [],

  setUserAchievements: (achievements) => {
    set({ userAchievements: achievements });
  },

  addUserAchievement: (achievement) => {
    const current = get().userAchievements;
    const exists = current.some((a) => a.id === achievement.id);
    if (!exists) {
      set({ userAchievements: [...current, achievement] });
    }
  },

  hasAchievement: (id) => {
    return get().userAchievements.some((a) => a.id === id);
  },

  reset: () => {
    set({ userAchievements: [] });
  },
}));
