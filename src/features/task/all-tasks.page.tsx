import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, Plus, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/shared/store/auth";
import { useTaskPagination } from "@/shared/hooks/task/useTaskPagination";
import { useTaskActions } from "@/shared/hooks/task/useTaskActions";
import { StatusFilter } from "@/features/task/status-filter";
import { LoadMoreButton } from "@/features/task/load-more-button";
import { getSkeletonCount } from "@/shared/lib/utils/skeleton";
import { Card } from "@/features/card";
import { TaskCardSkeleton } from "@/features/card/skeleton";
import { useTaskFilterStore } from "@/shared/store/filter";

const AllTaskPage = () => {
  const { filterStatus, setFilterStatus } = useTaskFilterStore();
  const [skeletonCount, setSkeletonCount] = useState(getSkeletonCount());

  const uid = useAuthStore((state) => state.user?.uid);

  const {
    tasks,
    setTasks,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    totalCount,
  } = useTaskPagination(uid, filterStatus);

  const { handleCompleteTask, handleDeleteTask } = useTaskActions(
    uid,
    tasks,
    setTasks
  );

  const handleResize = useCallback(() => {
    setSkeletonCount(getSkeletonCount());
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Мої завдання
          </h1>
          <div className="flex items-center gap-2">
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                {totalCount}
              </span>
            </div>
          </div>
        </div>
      </div>
      <StatusFilter
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
      />
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 auto-rows-min">
        {loading ? (
          Array.from({ length: skeletonCount }).map((_, i) => (
            <div key={`loading-skeleton-${i}`}>
              <TaskCardSkeleton />
            </div>
          ))
        ) : error ? (
          <div className="col-span-full">
            <div className="flex flex-col items-center justify-center rounded-xl py-12 px-6">
              <AlertCircle className="w-8 h-8 text-red-400 mb-3" />
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-center">
                Сталася помилка при завантаженні завдань
              </p>
              <button
                onClick={() => window.location.reload()}
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors"
              >
                Спробувати знову
              </button>
            </div>
          </div>
        ) : tasks.length > 0 ? (
          <>
            <AnimatePresence mode="sync">
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card
                    task={task}
                    onStatusChange={handleCompleteTask}
                    onDelete={handleDeleteTask}
                  />
                </motion.div>
              ))}
              {loadingMore &&
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={`loading-more-${i}`}>
                    <TaskCardSkeleton />
                  </div>
                ))}
            </AnimatePresence>
            <LoadMoreButton
              hasMore={hasMore}
              loadingMore={loadingMore}
              onLoadMore={loadMore}
            />
          </>
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center shadow-sm">
                <ClipboardList className="w-10 h-10 text-gray-400 dark:text-gray-500" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <Plus className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Тут поки порожньо
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-base max-w-md leading-relaxed">
                Можеш спробувати інші налаштування або додати нове завдання
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export const Component = AllTaskPage;
