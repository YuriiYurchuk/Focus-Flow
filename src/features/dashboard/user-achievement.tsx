import { useState, useEffect } from "react";
import { Timestamp } from "firebase/firestore";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getCachedAchievements } from "@/shared/lib/helpers/achievementsCache";
import type {
  IAchievement,
  IGrantedAchievement,
  IUserAchievementStats,
} from "@/entities/achievement/types";

interface IAvailableUserStats {
  completedTasksCount: number;
  streak: number;
}

interface IUserAchievementProps {
  userAchievements: IGrantedAchievement[];
  userStats: IAvailableUserStats;
}

const formatDate = (timestamp?: Timestamp | null) =>
  timestamp ? timestamp.toDate().toLocaleDateString() : null;

const getAchievementData = (
  achievement: IAchievement,
  userAchievements: IGrantedAchievement[]
) => {
  const achievedByUser = userAchievements.find(
    (userAch) => userAch.id === achievement.id
  );
  return {
    achievedByUser,
    hasUserAchieved: !!achievedByUser,
    achievementDate: formatDate(achievedByUser?.grantedAt),
    Icon: (Icons[achievement.icon as keyof typeof Icons] ||
      Icons.Award) as LucideIcon,
  };
};

const isFieldAvailable = (
  field: keyof IUserAchievementStats
): field is keyof IAvailableUserStats => {
  return field === "completedTasksCount" || field === "streak";
};

export const UserAchievement: React.FC<IUserAchievementProps> = ({
  userAchievements,
  userStats,
}) => {
  const [allAchievements, setAllAchievements] = useState<IAchievement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      try {
        const achievements = await getCachedAchievements();
        setAllAchievements(achievements);
      } catch (error) {
        console.error("Error loading achievements:", error);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const visibleAchievements = allAchievements.filter((achievement) => {
    const achievedByUser = userAchievements.find(
      (userAch) => userAch.id === achievement.id
    );

    if (achievement.hidden && !achievedByUser) {
      return false;
    }

    return true;
  });

  const achievedCount = visibleAchievements.filter((achievement) =>
    userAchievements.some((userAch) => userAch.id === achievement.id)
  ).length;

  const totalCount = allAchievements.length;
  const progressPercentage =
    totalCount > 0 ? (achievedCount / totalCount) * 100 : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-500/30 border-t-blue-500"></div>
      </div>
    );
  }

  return (
    <section className="mx-auto mt-6" aria-labelledby="achievements-title">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-xl shadow-lg"
              aria-hidden="true"
            >
              <Icons.Trophy className="w-6 h-6 text-white" />
            </div>
            <h2
              className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white"
              id="achievements-title"
            >
              Досягнення
            </h2>
          </div>
          <div
            className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-xl"
            role="status"
            aria-label={`Виконано ${achievedCount} з ${totalCount} досягнень`}
          >
            <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {achievedCount}
            </span>
            <span className="text-gray-500 dark:text-gray-400">/</span>
            <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {totalCount}
            </span>
          </div>
        </div>
        <div
          className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-3 overflow-hidden"
          role="progressbar"
          aria-valuenow={Math.round(progressPercentage)}
          aria-label={`Загальний прогрес досягнень: ${Math.round(
            progressPercentage
          )}%`}
        >
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
          Виконано {Math.round(progressPercentage)}% досягнень
        </p>
      </div>
      <div
        className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        role="list"
        aria-label="Список досягнень"
      >
        {visibleAchievements.map((achievement) => {
          const { achievedByUser, hasUserAchieved, achievementDate, Icon } =
            getAchievementData(achievement, userAchievements);

          return (
            <div
              key={achievement.id}
              role="listitem"
              className={`relative rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                hasUserAchieved
                  ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700 shadow-green-100/50 dark:shadow-green-900/20"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-xl flex-shrink-0 transition-all duration-300 ${
                      hasUserAchieved
                        ? "bg-green-500 text-white shadow-lg shadow-green-500/25"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-semibold text-base ${
                        hasUserAchieved
                          ? "text-green-800 dark:text-green-200"
                          : "text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed line-clamp-3">
                      {achievement.description}
                    </p>
                  </div>
                </div>
                {hasUserAchieved && achievementDate && (
                  <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Icons.Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <time
                      dateTime={achievedByUser!.grantedAt
                        .toDate()
                        .toISOString()}
                      className="text-sm font-medium text-green-600 dark:text-green-400"
                    >
                      {achievementDate}
                    </time>
                  </div>
                )}
                {!hasUserAchieved &&
                  achievement.type === "greaterOrEqual" &&
                  isFieldAvailable(achievement.field) &&
                  typeof userStats[achievement.field] === "number" && (
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Прогрес
                        </span>
                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                          {userStats[achievement.field]}/{achievement.goal}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                          style={{
                            width: `${Math.min(
                              100,
                              (Number(userStats[achievement.field]) /
                                Number(achievement.goal)) *
                                100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
              </div>
              {hasUserAchieved && (
                <div className="absolute -top-2 -right-2">
                  <div className="bg-green-500 text-white rounded-full p-2 shadow-lg shadow-green-500/25">
                    <Icons.Check className="w-4 h-4" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
