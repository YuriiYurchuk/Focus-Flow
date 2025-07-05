import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/shared/lib/firebase";
import type { IUser } from "@/entities/user/types";
import { useToastStore } from "@/shared/store/toast";
import { User, Mail, Flame, CheckCircle } from "lucide-react";

interface IProps {
  userId?: string;
}

export const UserInfo: React.FC<IProps> = ({ userId }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToastStore();

  useEffect(() => {
    let cancelled = false;

    async function fetchUser() {
      if (!userId?.trim()) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const userDoc = await getDoc(doc(db, "users", userId));

        if (cancelled) return;

        if (userDoc.exists()) {
          const userData = userDoc.data() as IUser;
          setUser(userData);
        } else {
          setUser(null);
          showToast({ message: "Користувача не знайдено", type: "error" });
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Помилка завантаження користувача:", error);
          setUser(null);
          showToast({ message: "Помилка завантаження даних", type: "error" });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchUser();

    return () => {
      cancelled = true;
    };
  }, [userId, showToast]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="flex items-center gap-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
          </div>
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
        <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg">
          <User className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
            {user.fullName}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {user.email}
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-100 dark:border-orange-800 hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Flame className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                Стрік
              </p>
              <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                {user.streak ?? 0}
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800 hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                Виконано
              </p>
              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                {user.completedTasksCount ?? 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
