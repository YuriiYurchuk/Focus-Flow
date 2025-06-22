import type { Task } from "@/entities/task/types";

export interface ITaskCardProps {
  task: Task;
  onStatusChange?: (taskId: string, status: Task["status"]) => void;
  onDelete?: (taskId: string) => void;
}

export interface IPriorityConfig {
  color: string;
  bgColor: string;
  textColor: string;
  label: string;
}

export interface IStatusConfig {
  icon: React.ComponentType<{ size: number }>;
  color: string;
  label: string;
}
