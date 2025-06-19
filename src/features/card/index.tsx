import { useState, useEffect } from "react";
import {
  Play,
  Pause,
  Clock,
  Calendar,
  Flag,
  CheckCircle2,
  Circle,
  MoreVertical,
} from "lucide-react";
// import { useTaskTimer } from "@/shared/hooks/useTaskTimer";
import { useTaskTimer } from "@/shared/hooks/timer/useTaskTimer";
import { useToastStore } from "@/shared/store/toast";
import type { ITask } from "@/entities/task/types";

interface TaskCardProps {
  task: ITask;
  onStatusChange?: (taskId: string, status: ITask["status"]) => void;
  onDelete?: (taskId: string) => void;
}

export const Card: React.FC<TaskCardProps> = ({
  task,
  onStatusChange,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = useState(false);
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

  const getPriorityConfig = (priority: ITask["priority"]) => {
    switch (priority) {
      case "high":
        return {
          color: "from-red-500 to-red-600",
          bgColor: "bg-red-50 dark:bg-red-900/20",
          textColor: "text-red-700 dark:text-red-300",
          label: "Високий",
        };
      case "medium":
        return {
          color: "from-orange-500 to-orange-600",
          bgColor: "bg-orange-50 dark:bg-orange-900/20",
          textColor: "text-orange-700 dark:text-orange-300",
          label: "Середній",
        };
      case "low":
        return {
          color: "from-green-500 to-green-600",
          bgColor: "bg-green-50 dark:bg-green-900/20",
          textColor: "text-green-700 dark:text-green-300",
          label: "Низький",
        };
    }
  };

  const getStatusConfig = (status: ITask["status"]) => {
    switch (status) {
      case "completed":
        return {
          icon: CheckCircle2,
          color: "text-green-600 dark:text-green-400",
          label: "Завершено",
        };
      case "in-progress":
        return {
          icon: Play,
          color: "text-blue-600 dark:text-blue-400",
          label: "В роботі",
        };
      case "paused":
        return {
          icon: Pause,
          color: "text-yellow-600 dark:text-yellow-400",
          label: "Призупинено",
        };
      default:
        return {
          icon: Circle,
          color: "text-gray-600 dark:text-gray-400",
          label: "Не розпочато",
        };
    }
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDeadline = (deadline: any) => {
    if (!deadline) return null;
    const date = deadline.toDate ? deadline.toDate() : new Date(deadline);
    return date.toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

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

  const handleToggleComplete = () => {
    if (task.status === "completed") {
      onStatusChange?.(task.id, "not-started");
    } else {
      handleCompleteTask();
    }
  };

  useEffect(() => {
    if (error) {
      showToast({ message: error, type: "error" });
      clearError();
    }
  }, [error]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] group">
      <div className={`h-1 bg-gradient-to-r ${priorityConfig.color}`} />
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <button
              onClick={handleToggleComplete}
              className={`mt-1 transition-all duration-200 hover:scale-110 ${statusConfig.color}`}
            >
              <StatusIcon size={20} />
            </button>
            <div className="flex-1 min-w-0">
              <h3
                className={`font-semibold text-lg leading-tight transition-all duration-200 ${
                  task.status === "completed"
                    ? "line-through text-gray-500 dark:text-gray-500"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                {task.title}
              </h3>
              {task.description && (
                <p
                  className={`text-sm mt-1 transition-all duration-200 ${
                    task.status === "completed"
                      ? "line-through text-gray-400 dark:text-gray-600"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {task.description}
                </p>
              )}
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreVertical
                size={16}
                className="text-gray-600 dark:text-gray-400"
              />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-8 bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 py-2 min-w-[120px] z-10">
                <button
                  onClick={() => {
                    onDelete?.(task.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-600 text-red-600 dark:text-red-400"
                >
                  Видалити
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${priorityConfig.bgColor}`}
          >
            <Flag size={12} className={priorityConfig.textColor} />
            <span className={priorityConfig.textColor}>
              {priorityConfig.label}
            </span>
          </div>
          {task.deadline && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <Calendar
                size={12}
                className="text-blue-700 dark:text-blue-300"
              />
              <span className="text-blue-700 dark:text-blue-300">
                {formatDeadline(task.deadline)}
              </span>
            </div>
          )}
          {(task.duration || elapsed > 0) && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <Clock
                size={12}
                className="text-purple-700 dark:text-purple-300"
              />
              <span className="text-purple-700 dark:text-purple-300">
                {formatTime(elapsed)}
              </span>
            </div>
          )}
        </div>
        {task.status !== "completed" && (
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleTimerAction}
              disabled={isLoading || (!canStart && !canPause)}
              className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                isActive
                  ? "bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
              }`}
            >
              {isStarting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Запуск...
                </>
              ) : isPausing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Пауза...
                </>
              ) : isActive ? (
                <>
                  <Pause size={16} />
                  Призупинити
                </>
              ) : (
                <>
                  <Play size={16} />
                  {task.status === "not-started" ? "Почати" : "Продовжити"}
                </>
              )}
            </button>
            {(task.status === "in-progress" || task.status === "paused") && (
              <button
                onClick={handleCompleteTask}
                disabled={isLoading}
                className="px-4 py-2.5 rounded-xl font-medium bg-green-500 hover:bg-green-600 text-white transition-all duration-200 hover:scale-[1.02] shadow-lg inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <CheckCircle2 size={16} />
                Завершити
              </button>
            )}
          </div>
        )}
      </div>
      {showMenu && (
        <div className="fixed inset-0 z-0" onClick={() => setShowMenu(false)} />
      )}
    </div>
  );
};
