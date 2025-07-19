import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/shared/lib/firebase";
import { UserInfo } from "./user-info";
import { UserAchievement } from "./user-achievement";
import { UserActivity } from "./user-activity";
import { useAuthStore } from "@/shared/store/auth";
import { useToastStore } from "@/shared/store/toast";
import type { IUser } from "@/entities/user/types";

const Dashboard: React.FC = () => {
  const uid = useAuthStore((state) => state.user?.uid);
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"achievements" | "activity">(
    "achievements"
  );
  const { showToast } = useToastStore();

  useEffect(() => {
    if (!uid) return;

    let cancelled = false;

    const fetchUser = async () => {
      try {
        const snap = await getDoc(doc(db, "users", uid));
        if (!cancelled && snap.exists()) {
          const userData = snap.data() as IUser;
          setUser(userData);
        } else if (!cancelled) {
          showToast({ message: "Користувача не знайдено", type: "error" });
        }
      } catch (err) {
        if (!cancelled) {
          showToast({
            message: "Не вдалося завантажити користувача",
            type: "error",
          });
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchUser();

    return () => {
      cancelled = true;
    };
  }, [uid]);

  if (!user) return null;

  const tabVariants = {
    hidden: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        delay: 0.1,
      },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  return (
    <>
      <UserInfo key={uid} user={user} isLoading={isLoading} />
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab("achievements")}
          className={`relative px-6 py-3 font-medium text-sm transition-all duration-200 ${
            activeTab === "achievements"
              ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          Досягнення
        </button>
        <button
          onClick={() => setActiveTab("activity")}
          className={`relative px-6 py-3 font-medium text-sm transition-all duration-200 ${
            activeTab === "activity"
              ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          Остання активність
        </button>
      </div>
      <div>
        <AnimatePresence mode="wait">
          {activeTab === "achievements" && (
            <motion.div
              key="achievements"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <UserAchievement
                userAchievements={user.achievements || []}
                userStats={{
                  completedTasksCount: user.completedTasksCount ?? 0,
                  streak: user.streak ?? 0,
                }}
              />
            </motion.div>
          )}
          {activeTab === "activity" && (
            <motion.div
              key="activity"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <UserActivity uid={user.uid} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const Component = Dashboard;
