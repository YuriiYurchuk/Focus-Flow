import { useAchievementsStore } from "@/shared/store/achievements";

export const UserAchievement: React.FC = () => {
  const achievements = useAchievementsStore((state) => state.userAchievements);

  if (achievements.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-6">
        У вас поки немає досягнень.
      </p>
    );
  }

  return (
    <ul className="max-w-md mx-auto mt-6 space-y-4">
      {achievements.map((ach) => {
        const grantedDate = ach.grantedAt?.toDate
          ? ach.grantedAt.toDate().toLocaleString()
          : "Дата не вказана";

        return (
          <li
            key={ach.id}
            className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-lg shadow p-4"
          >
            <span className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
              {ach.id.replace(/_/g, " ")}
            </span>
            <time
              dateTime={ach.grantedAt?.toDate?.().toISOString()}
              className="text-sm text-gray-500 dark:text-gray-400"
              title={grantedDate}
            >
              {grantedDate}
            </time>
          </li>
        );
      })}
    </ul>
  );
};
