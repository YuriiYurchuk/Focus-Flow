import { useEffect, useState } from "react";
import { useTaskTimer } from "@/shared/hooks/timer/useTaskTimer";
import { useToastStore } from "@/shared/store/toast";
import { TaskMenu } from "./task-menu";
import { TaskBadges } from "./task-badges";
import { TaskButtons } from "./task-buttons";
import { getPriorityConfig, getStatusConfig } from "@/shared/model/card";
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
  const [expandedTitle, setExpandedTitle] = useState(false);
  const [expandedDescription, setExpandedDescription] = useState(false);
  const { showToast } = useToastStore();

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

  const handleCompleteTask = () => {
    if (isActive) {
      pauseTimer();
    }
    onStatusChange?.(task.id, "completed");
  };

  const handleDelete = () => {
    onDelete?.(task.id);
  };

  return (
    <div
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
            >
              <StatusIcon size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className={`font-semibold text-lg leading-tight transition-all duration-200 
                  ${expandedTitle ? "" : "line-clamp-2"} cursor-pointer
                  ${
                    task.status === "completed"
                      ? "line-through text-gray-500"
                      : "text-gray-900 dark:text-white"
                  }`}
                onClick={() => setExpandedTitle(!expandedTitle)}
                title={task.title}
              >
                {task.title}
              </h3>
              {task.description && (
                <p
                  className={`text-sm mt-1 transition-all duration-200 cursor-pointer
                  ${expandedDescription ? "" : "line-clamp-3"}
                  ${
                    task.status === "completed"
                      ? "line-through text-gray-400"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                  onClick={() => setExpandedDescription(!expandedDescription)}
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
    </div>
  );
};
