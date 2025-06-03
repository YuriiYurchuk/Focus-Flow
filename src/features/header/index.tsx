import Logo from "@/assets/logo.svg?react";
import { Sun, Moon } from "lucide-react";
import { useDarkTheme } from "@/shared/hooks/useDarkTheme";

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useDarkTheme();
  const isDark = theme === "dark";

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
      <div className="flex justify-between items-center container mx-auto px-6 py-4">
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 group-hover:from-blue-100 group-hover:to-indigo-200 dark:group-hover:from-blue-800/30 dark:group-hover:to-indigo-800/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
            <Logo className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-600 dark:from-white dark:via-blue-300 dark:to-indigo-400 bg-clip-text text-transparent">
              Focus Flow
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
              Tasks made effortless.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            aria-label="Перемкнути тему"
            className="relative flex items-center p-1.5 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200/60 dark:border-gray-600/60 transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-purple-500/10 hover:scale-105 active:scale-95 group"
            role="switch"
            aria-checked={isDark}
            title="Перемкнути тему"
          >
            <div
              className={`absolute top-1.5 w-8 h-8 rounded-xl bg-gradient-to-r transition-all duration-500 ease-out ${
                isDark
                  ? "left-1.5 from-blue-500 via-purple-500 to-indigo-600 shadow-lg shadow-blue-500/30"
                  : "left-10 from-yellow-400 via-orange-400 to-red-500 shadow-lg shadow-orange-500/30"
              } group-hover:shadow-2xl`}
            />
            <div
              className={`relative flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-500 z-10 ${
                isDark
                  ? "text-white scale-110 rotate-0"
                  : "text-gray-400 scale-90 -rotate-45 opacity-70"
              }`}
            >
              <Moon className="w-4 h-4 transition-transform duration-500" />
            </div>
            <div
              className={`relative flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-500 z-10 ${
                !isDark
                  ? "text-white scale-110 rotate-0"
                  : "text-gray-400 scale-90 rotate-45 opacity-70"
              }`}
            >
              <Sun className="w-4 h-4 transition-transform duration-500" />
            </div>
            <div
              className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                isDark
                  ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10"
                  : "bg-gradient-to-r from-yellow-400/10 to-orange-500/10"
              }`}
            />
          </button>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
    </header>
  );
};
