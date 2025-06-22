import { CirclePlay, CirclePause, CheckCircle2, Circle } from "lucide-react";
import type { Task } from "@/entities/task/types";
import type { IPriorityConfig, IStatusConfig } from "@/entities/card/types";

export const getPriorityConfig = (
  priority: Task["priority"]
): IPriorityConfig => {
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

export const getStatusConfig = (status: Task["status"]): IStatusConfig => {
  switch (status) {
    case "completed":
      return {
        icon: CheckCircle2,
        color: "text-green-600 dark:text-green-400",
        label: "Завершено",
      };
    case "in-progress":
      return {
        icon: CirclePlay,
        color: "text-blue-600 dark:text-blue-400",
        label: "В роботі",
      };
    case "paused":
      return {
        icon: CirclePause,
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
