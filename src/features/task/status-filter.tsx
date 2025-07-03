import type { Task } from "@/entities/task/types";

interface IStatusFilterProps {
  filterStatus: "all" | Task["status"];
  onFilterChange: (status: "all" | Task["status"]) => void;
}

const statusOptions = [
  {
    value: "all",
    label: "Усі",
    gradient: "from-indigo-500 to-blue-600",
    hoverGradient: "from-indigo-600 to-blue-700",
    shadow: "indigo-500/25",
  },
  {
    value: "not-started",
    label: "Не початі",
    gradient: "from-slate-500 to-gray-600",
    hoverGradient: "from-slate-600 to-gray-700",
    shadow: "slate-500/25",
  },
  {
    value: "in-progress",
    label: "В процесі",
    gradient: "from-amber-500 to-orange-500",
    hoverGradient: "from-amber-600 to-orange-600",
    shadow: "amber-500/25",
  },
  {
    value: "completed",
    label: "Завершені",
    gradient: "from-emerald-500 to-green-500",
    hoverGradient: "from-emerald-600 to-green-600",
    shadow: "emerald-500/25",
  },
  {
    value: "paused",
    label: "На паузі",
    gradient: "from-violet-500 to-purple-500",
    hoverGradient: "from-violet-600 to-purple-600",
    shadow: "violet-500/25",
  },
] as const;

const dotColors: Record<"all" | Task["status"], string> = {
  all: "bg-indigo-400",
  "not-started": "bg-slate-400",
  "in-progress": "bg-amber-400",
  completed: "bg-emerald-400",
  paused: "bg-violet-400",
};

export const StatusFilter = ({
  filterStatus,
  onFilterChange,
}: IStatusFilterProps) => {
  return (
    <div className="flex gap-3 mb-8 flex-wrap">
      {statusOptions.map(
        ({ value, label, gradient, hoverGradient, shadow }) => {
          const isActive = filterStatus === value;

          return (
            <button
              key={value}
              onClick={() =>
                onFilterChange(
                  value === "all" ? "all" : (value as Task["status"])
                )
              }
              className={`relative overflow-hidden px-6 py-3 rounded-xl font-medium text-sm
                transition-all duration-300 group select-none
                focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 dark:focus-visible:ring-blue-500
                ${
                  isActive
                    ? `bg-gradient-to-r ${gradient} text-white shadow-lg hover:shadow-xl hover:${shadow} 
                      hover:scale-[1.02] active:scale-[0.98] transform
                      before:absolute before:inset-0 before:bg-gradient-to-r before:${hoverGradient} 
                      before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100`
                    : `bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 
                      border border-gray-200 dark:border-gray-700 shadow-sm
                      hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transform
                      hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600
                      hover:text-gray-900 dark:hover:text-white`
                }
              `}
            >
              <span
                className={`relative z-10 flex items-center gap-2 ${
                  isActive ? "drop-shadow-sm" : ""
                }`}
              >
                <div
                  className={`
                    w-2 h-2 rounded-full transition-all duration-300
                    ${isActive ? "bg-white/90 shadow-sm" : dotColors[value]}
                    ${isActive ? "scale-110" : "group-hover:scale-110"}
                  `}
                />
                {label}
              </span>
              {isActive ? (
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
              ) : (
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl 
                            bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 
                            dark:bg-gradient-to-r dark:from-blue-500/20 dark:via-purple-500/20 dark:to-pink-500/20"
                ></div>
              )}
            </button>
          );
        }
      )}
    </div>
  );
};
