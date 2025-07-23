import { Play, Pause, Check, Loader2 } from "lucide-react";
import type { Task } from "@/entities/task/types";

interface ITaskButtonsProps {
  task: Task;
  isActive: boolean;
  isLoading: boolean;
  isStarting: boolean;
  isPausing: boolean;
  canStart: boolean;
  canPause: boolean;
  onTimerAction: () => void;
  onCompleteTask: () => void;
}

export const TaskButtons: React.FC<ITaskButtonsProps> = ({
  task,
  isActive,
  isLoading,
  isStarting,
  isPausing,
  canStart,
  canPause,
  onTimerAction,
  onCompleteTask,
}) => {
  if (task.status === "completed") {
    return null;
  }

  let timerButtonText = "";
  if (isStarting) {
    timerButtonText = "Запуск...";
  } else if (isPausing) {
    timerButtonText = "Пауза...";
  } else if (isActive) {
    timerButtonText = "Призупинити";
  } else if (task.status === "not-started") {
    timerButtonText = "Почати";
  } else {
    timerButtonText = "Продовжити";
  }

  let TimerButtonIcon;
  if (isStarting || isPausing) {
    TimerButtonIcon = <Loader2 className="w-4 h-4 animate-spin" />;
  } else if (isActive) {
    TimerButtonIcon = <Pause className="w-4 h-4" />;
  } else {
    TimerButtonIcon = <Play className="w-4 h-4" />;
  }

  const isTimerButtonDisabled = isLoading || (!canStart && !canPause);

  return (
    <div
      className="flex flex-col sm:flex-row gap-3 pt-3"
      aria-label="Дії з завданням"
    >
      <button
        onClick={onTimerAction}
        disabled={isTimerButtonDisabled}
        aria-label={
          isActive
            ? "Призупинити виконання завдання"
            : task.status === "not-started"
            ? "Почати виконання завдання"
            : "Продовжити виконання завдання"
        }
        className={`
          flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 rounded-lg 
          font-medium transition-all duration-300 text-sm sm:text-base
          focus:outline-none focus:ring-2 focus:ring-offset-2
          ${
            isTimerButtonDisabled
              ? "opacity-60 cursor-not-allowed"
              : "hover:brightness-110 active:scale-[0.99] cursor-pointer"
          }
          ${
            isActive
              ? `bg-orange-500 hover:bg-orange-600 text-white shadow-sm 
                focus:ring-orange-300`
              : `bg-blue-500 hover:bg-blue-600 text-white shadow-sm
                focus:ring-blue-300`
          }
        `}
      >
        <span className="flex items-center gap-2">
          {TimerButtonIcon}
          <span className="whitespace-nowrap">{timerButtonText}</span>
        </span>
      </button>
      {(task.status === "in-progress" || task.status === "paused") && (
        <button
          onClick={onCompleteTask}
          disabled={isLoading}
          className={`
            w-full sm:w-auto px-4 py-3 sm:py-2.5 rounded-lg font-medium transition-all duration-300 
            inline-flex items-center justify-center gap-2 shadow-sm text-sm sm:text-base
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-300
            ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed opacity-60"
                : `bg-green-500 hover:bg-green-600 text-white cursor-pointer
                  hover:brightness-110 active:scale-[0.99]`
            }
          `}
        >
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span className="whitespace-nowrap">Завершити</span>
          </span>
        </button>
      )}
    </div>
  );
};
