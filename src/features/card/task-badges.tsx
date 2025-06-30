import {
  Clock,
  Calendar,
  Flag,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import type { Task } from "@/entities/task/types";
import type { IPriorityConfig } from "@/entities/card/types";
import { formatTime, formatDeadline } from "@/shared/lib/utils/card";

interface ITaskBadgesProps {
  task: Task;
  priorityConfig: IPriorityConfig;
  elapsed: number;
}

const BadgeWrapper: React.FC<{
  className: string;
  children: React.ReactNode;
}> = ({ className, children }) => (
  <div
    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${className}`}
  >
    {children}
  </div>
);

const isCompletedOnTime = (task: Task): boolean => {
  if (task.status !== "completed" || !task.deadline || !task.timeEnd) {
    return false;
  }

  const deadline = task.deadline.toDate();
  const completedAt = task.timeEnd.toDate();

  return completedAt <= deadline;
};

export const TaskBadges: React.FC<ITaskBadgesProps> = ({
  task,
  priorityConfig,
  elapsed,
}) => {
  const hasTimeTracking = task.duration ?? elapsed > 0;
  const completedOnTime = isCompletedOnTime(task);
  const completedLate =
    task.status === "completed" && task.deadline && !completedOnTime;

  return (
    <section
      aria-label="Інформація про завдання"
      className="flex flex-wrap gap-3 text-sm"
    >
      <BadgeWrapper
        className={priorityConfig.bgColor}
        data-testid="priority-badge"
      >
        <Flag
          size={12}
          className={priorityConfig.textColor}
          aria-hidden="true"
        />
        <span className={priorityConfig.textColor}>{priorityConfig.label}</span>
      </BadgeWrapper>
      {task.deadline && (
        <>
          {completedOnTime && (
            <BadgeWrapper className="bg-green-50 dark:bg-green-900/20">
              <CheckCircle
                size={12}
                className="text-green-700 dark:text-green-300"
                aria-hidden="true"
              />
              <span className="text-green-700 dark:text-green-300">
                Виконано вчасно
              </span>
            </BadgeWrapper>
          )}
          {completedLate && (
            <BadgeWrapper className="bg-red-50 dark:bg-red-900/20">
              <AlertTriangle
                size={12}
                className="text-red-700 dark:text-red-300"
                aria-hidden="true"
              />
              <span className="text-red-700 dark:text-red-300">
                Виконано із запізненням
              </span>
            </BadgeWrapper>
          )}
          {task.status !== "completed" && (
            <BadgeWrapper className="bg-blue-50 dark:bg-blue-900/20">
              <Calendar
                size={12}
                className="text-blue-700 dark:text-blue-300"
                aria-hidden="true"
              />
              <span className="text-blue-700 dark:text-blue-300">
                {formatDeadline(task.deadline)}
              </span>
            </BadgeWrapper>
          )}
        </>
      )}
      {hasTimeTracking && (
        <BadgeWrapper className="bg-purple-50 dark:bg-purple-900/20">
          <Clock
            size={12}
            className="text-purple-700 dark:text-purple-300"
            aria-hidden="true"
          />
          <span className="text-purple-700 dark:text-purple-300">
            {formatTime(elapsed)}
          </span>
        </BadgeWrapper>
      )}
    </section>
  );
};
