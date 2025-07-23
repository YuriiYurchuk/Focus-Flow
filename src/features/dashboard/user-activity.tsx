import { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { uk } from "date-fns/locale";
import {
  Trophy,
  Plus,
  CheckCircle,
  Trash2,
  User,
  Clock,
  Activity as ActivityIcon,
} from "lucide-react";
import { db } from "@/shared/lib/firebase";
import type { IActivityLog, ActivityType } from "@/entities/activity/types";

interface IProps {
  uid: string;
}

const getActivityConfig = (type: ActivityType) => {
  const configs = {
    achievement_granted: {
      icon: Trophy,
      color: "text-yellow-600 dark:text-yellow-400",
      iconBg: "bg-yellow-100 dark:bg-yellow-900/40",
    },
    task_created: {
      icon: Plus,
      color: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-100 dark:bg-blue-900/40",
    },
    task_completed: {
      icon: CheckCircle,
      color: "text-green-600 dark:text-green-400",
      iconBg: "bg-green-100 dark:bg-green-900/40",
    },
    task_deleted: {
      icon: Trash2,
      color: "text-red-600 dark:text-red-400",
      iconBg: "bg-red-100 dark:bg-red-900/40",
    },
    profile_updated: {
      icon: User,
      color: "text-purple-600 dark:text-purple-400",
      iconBg: "bg-purple-100 dark:bg-purple-900/40",
    },
  };

  return configs[type] || configs.task_created;
};

export const UserActivity: React.FC<IProps> = ({ uid }) => {
  const [activeUsers, setActiveUsers] = useState<IActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchActiveUsers = async () => {
      setIsLoading(true);
      try {
        const usersRef = collection(db, "users", uid, "activityLogs");
        const snapshot = await getDocs(usersRef);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as IActivityLog[];
        data.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());
        setActiveUsers(data);
      } catch (error) {
        console.error("Error fetching active users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (uid) fetchActiveUsers();
  }, [uid]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-500/30 border-t-blue-500"></div>
      </div>
    );
  }

  if (activeUsers.length === 0) {
    return (
      <section className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <ActivityIcon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Поки що активності немає
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
          Тут з'являтимуться записи про ваші досягнення, завдання та інші дії
        </p>
      </section>
    );
  }

  return (
    <section
      className="space-y-4 lg:space-y-6"
      aria-labelledby="activity-title"
    >
      <div className="space-y-3 lg:space-y-4">
        {activeUsers.map((log) => {
          const config = getActivityConfig(log.type);
          const Icon = config.icon;

          return (
            <ul
              key={log.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 lg:p-5 shadow-sm"
            >
              <li className="flex items-start space-x-4">
                <div
                  className={`
                  flex-shrink-0 w-11 h-11 lg:w-12 lg:h-12 rounded-full 
                  flex items-center justify-center ${config.iconBg} shadow-sm
                `}
                >
                  <Icon
                    className={`w-5 h-5 lg:w-6 lg:h-6 ${config.color}`}
                    aria-hidden="true"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm lg:text-base font-medium text-gray-900 dark:text-white mb-3 leading-relaxed">
                    {log.message}
                  </p>
                  <div className="flex items-center justify-end">
                    <div className="flex items-center space-x-1.5 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      <time
                        className="font-medium"
                        dateTime={log.timestamp.toDate().toISOString()}
                      >
                        {formatDistanceToNow(log.timestamp.toDate(), {
                          addSuffix: true,
                          locale: uk,
                        })}
                      </time>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          );
        })}
      </div>
    </section>
  );
};
