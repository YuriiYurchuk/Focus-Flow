import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, Plus, List, Clock } from "lucide-react";
import { ROUTES } from "@/shared/model/routes";

export const Navbar = () => {
  const [showTimerPanel, setShowTimerPanel] = useState(false);

  const toggleTimerPanel = () => setShowTimerPanel((prev) => !prev);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 
    border-t border-gray-200/50 dark:border-gray-700/50 shadow-2xl shadow-gray-900/5"
    >
      <div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 
      to-transparent"
      ></div>
      <div className="max-w-md mx-auto px-4 py-3">
        <ul className="flex justify-around items-center space-x-1">
          <li className="flex-1">
            <NavLink
              to={ROUTES.DASHBOARD}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center py-3 px-4 rounded-2xl transition-all duration-300 
                group overflow-hidden ${
                  isActive
                    ? "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/40 text-blue-600 dark:text-blue-400 scale-105 shadow-lg shadow-blue-500/20"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-800/50 dark:hover:to-gray-700/50 hover:scale-102"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500/5 to-indigo-500/5"
                        : "bg-gradient-to-r from-gray-500/5 to-gray-600/5"
                    }`}
                  />
                  <div
                    className={`relative p-1.5 rounded-xl mb-1 transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-800/40 dark:to-indigo-700/40 scale-110 rotate-3"
                        : "group-hover:bg-gradient-to-br group-hover:from-gray-100 group-hover:to-gray-200 dark:group-hover:from-gray-700/50 dark:group-hover:to-gray-600/50 group-hover:scale-105"
                    }`}
                  >
                    <Home
                      size={20}
                      className={`transition-all duration-300 ${
                        isActive ? "scale-110" : "group-hover:scale-105"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-xs font-medium transition-all duration-300 ${
                      isActive ? "font-semibold" : ""
                    }`}
                  >
                    Дашборд
                  </span>
                </>
              )}
            </NavLink>
          </li>
          <li className="flex-1">
            <NavLink
              to={ROUTES.TASK.ADD}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center py-3 px-4 rounded-2xl transition-all duration-300 group overflow-hidden ${
                  isActive
                    ? "bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/40 text-green-600 dark:text-green-400 scale-105 shadow-lg shadow-green-500/20"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-800/50 dark:hover:to-gray-700/50 hover:scale-102"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-green-500/5 to-emerald-500/5"
                        : "bg-gradient-to-r from-gray-500/5 to-gray-600/5"
                    }`}
                  />
                  <div
                    className={`relative p-1.5 rounded-xl mb-1 transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-800/40 dark:to-emerald-700/40 scale-110 rotate-90"
                        : "group-hover:bg-gradient-to-br group-hover:from-gray-100 group-hover:to-gray-200 dark:group-hover:from-gray-700/50 dark:group-hover:to-gray-600/50 group-hover:scale-105 group-hover:rotate-12"
                    }`}
                  >
                    <Plus
                      size={20}
                      className={`transition-all duration-300 ${
                        isActive
                          ? "scale-110 rotate-90"
                          : "group-hover:scale-105"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-xs font-medium transition-all duration-300 ${
                      isActive ? "font-semibold" : ""
                    }`}
                  >
                    Додати
                  </span>
                </>
              )}
            </NavLink>
          </li>
          <li className="flex-1">
            <NavLink
              to={ROUTES.TASK.ALL}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center py-3 px-4 rounded-2xl transition-all duration-300 group overflow-hidden ${
                  isActive
                    ? "bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/40 text-purple-600 dark:text-purple-400 scale-105 shadow-lg shadow-purple-500/20"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-800/50 dark:hover:to-gray-700/50 hover:scale-102"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-purple-500/5 to-violet-500/5"
                        : "bg-gradient-to-r from-gray-500/5 to-gray-600/5"
                    }`}
                  />
                  <div
                    className={`relative p-1.5 rounded-xl mb-1 transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-br from-purple-100 to-violet-200 dark:from-purple-800/40 dark:to-violet-700/40 scale-110 -rotate-3"
                        : "group-hover:bg-gradient-to-br group-hover:from-gray-100 group-hover:to-gray-200 dark:group-hover:from-gray-700/50 dark:group-hover:to-gray-600/50 group-hover:scale-105"
                    }`}
                  >
                    <List
                      size={20}
                      className={`transition-all duration-300 ${
                        isActive ? "scale-110" : "group-hover:scale-105"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-xs font-medium transition-all duration-300 ${
                      isActive ? "font-semibold" : ""
                    }`}
                  >
                    Завдання
                  </span>
                </>
              )}
            </NavLink>
          </li>
          <li className="flex-1 relative">
            <button
              onClick={toggleTimerPanel}
              className="relative flex flex-col items-center justify-center py-3 px-4 rounded-2xl transition-all duration-300 group overflow-hidden text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-800/50 dark:hover:to-gray-700/50 hover:scale-102 w-full"
            >
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-orange-500/5 to-red-500/5" />
              <div className="relative p-1.5 rounded-xl mb-1 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-orange-100 group-hover:to-red-200 dark:group-hover:from-orange-700/50 dark:group-hover:to-red-600/50 group-hover:scale-105">
                <Clock
                  size={20}
                  className="transition-all duration-300 group-hover:scale-105"
                />
              </div>
              <span className="text-xs font-medium transition-all duration-300">
                Таймер
              </span>
              <div className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
            </button>
            {showTimerPanel && (
              <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2 w-64 p-4 rounded-xl shadow-lg bg-white dark:bg-gray-800 border dark:border-gray-700 z-50">
                <div className="text-center">
                  <p className="text-sm text-gray-700 dark:text-gray-200">
                    Залишилось:{""}
                    <span className="font-semibold">12 хв 30 сек</span>
                  </p>
                  <div className="mt-3">
                    <button className="px-3 py-1 text-sm font-medium rounded-md bg-orange-500 text-white hover:bg-orange-600">
                      Пауза
                    </button>
                  </div>
                </div>
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};
