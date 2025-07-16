import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/shared/lib/firebase";
import { UserInfo } from "./user-info";
import { UserAchievement } from "./user-achievement";
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

  return (
    <>
      <UserInfo key={uid} user={user} isLoading={isLoading} />
      <div className="flex border-b mb-4">
        <button
          onClick={() => setActiveTab("achievements")}
          className={`px-4 py-2 font-medium ${
            activeTab === "achievements"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
        >
          Досягнення
        </button>
        <button
          onClick={() => setActiveTab("activity")}
          className={`px-4 py-2 font-medium ${
            activeTab === "activity"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
        >
          Остання активність
        </button>
      </div>
      <div>
        {activeTab === "achievements" && (
          <UserAchievement
            userAchievements={user.achievements || []}
            userStats={{
              completedTasksCount: user.completedTasksCount ?? 0,
              streak: user.streak ?? 0,
            }}
          />
        )}

        {/* {activeTab === "activity" && <UserActivity userId={user.uid} />} */}
      </div>
    </>
  );
};

export const Component = Dashboard;
