import { useEffect } from "react";
import { useTaskTimer } from "@/shared/hooks/timer/useTaskTimer";
import { useToastStore } from "@/shared/store/toast";
import { TaskMenu } from "./task-menu";
import { TaskBadges } from "./task-badges";
import { TaskButtons } from "./task-buttons";
import { getPriorityConfig, getStatusConfig } from "@/shared/model/card";
import { userActivity } from "@/shared/lib/helpers/userActivity";
import { userCompletedTask } from "@/shared/lib/helpers/userCompletedTask";
import { useAuthStore } from "@/shared/store/auth";
import { logUserActivity } from "@/shared/lib/helpers/logUserActivity";
import type { ITaskCardProps } from "@/entities/card/types";

export const Card: React.FC<ITaskCardProps> = ({
  task,
  onStatusChange,
  onDelete,
}) => {
  const {
    isActive,
    elapsed,
    startTimer,
    pauseTimer,
    isLoading,
    isStarting,
    isPausing,
    error,
    canStart,
    canPause,
    clearError,
  } = useTaskTimer(task);
  const { showToast } = useToastStore();
  const uid = useAuthStore((state) => state.user?.uid);

  useEffect(() => {
    if (error) {
      showToast({ message: error, type: "error" });
      clearError();
    }
  }, [error, showToast, clearError]);

  const priorityConfig = getPriorityConfig(task.priority);
  const statusConfig = getStatusConfig(task.status);
  const StatusIcon = statusConfig.icon;

  const handleTimerAction = () => {
    if (task.status === "completed") return;

    if (error) {
      clearError();
    }

    if (isActive && canPause) {
      pauseTimer();
    } else if (canStart) {
      startTimer();
    }
  };

  const handleCompleteTask = async () => {
    if (isActive) {
      await pauseTimer();
    }

    onStatusChange?.(task.id, "completed");

    if (uid) {
      try {
        await Promise.all([userActivity(uid), userCompletedTask(uid, task)]);
      } catch (error) {
        console.error("Error completing task:", error);
      }
    }
  };

  const handleDelete = async () => {
    if (!uid) return;

    try {
      await logUserActivity(
        uid,
        "task_deleted",
        `Видалено завдання: "${task.title}"`,
        {
          taskId: task.id,
        }
      );

      onDelete?.(task.id);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  return (
    <article
      className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xs border border-gray-100
        dark:border-gray-700 overflow-hidden transition-all group"
    >
      <div className={`h-1 bg-gradient-to-r ${priorityConfig.color}`} />
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div
              className={`mt-1 ${statusConfig.color}`}
              title={statusConfig.label}
              role="img"
              aria-label={`Статус завдання: ${statusConfig.label}`}
            >
              <StatusIcon size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className={`font-semibold text-lg leading-tight transition-all duration-200 
                  ${
                    task.status === "completed"
                      ? "line-through text-gray-500"
                      : "text-gray-900 dark:text-white"
                  }`}
                title={task.title}
              >
                {task.title}
              </h3>
              {task.description && (
                <p
                  className={`text-sm mt-1 transition-all duration-200
                  ${
                    task.status === "completed"
                      ? "line-through text-gray-400"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                  title={task.description}
                >
                  {task.description}
                </p>
              )}
            </div>
          </div>
          <TaskMenu onDelete={handleDelete} />
        </div>
        <TaskBadges
          task={task}
          priorityConfig={priorityConfig}
          elapsed={elapsed}
        />
        <TaskButtons
          task={task}
          isActive={isActive}
          isLoading={isLoading}
          isStarting={isStarting}
          isPausing={isPausing}
          canStart={canStart}
          canPause={canPause}
          onTimerAction={handleTimerAction}
          onCompleteTask={handleCompleteTask}
        />
      </div>
    </article>
  );
};
