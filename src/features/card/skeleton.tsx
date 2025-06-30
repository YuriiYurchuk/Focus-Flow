export const TaskCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xs border border-gray-100 dark:border-gray-700 overflow-hidden animate-pulse">
      <div className="h-1 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500" />
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full mt-1" />
            <div className="flex-1">
              <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-4/5 mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            </div>
          </div>
          <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded" />
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-12" />
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded" />
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 h-10 bg-gray-300 dark:bg-gray-600 rounded-lg" />
          <div className="flex-1 h-10 bg-gray-300 dark:bg-gray-600 rounded-lg" />
        </div>
      </div>
    </div>
  );
};
