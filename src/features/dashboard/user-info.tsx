import { useState, useEffect } from "react";
import { User, Mail, Flame, CheckCircle, Edit3, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { AnimatePresence, motion } from "framer-motion";
import { UserEdit } from "./user-edit";
import { auth } from "@/shared/lib/firebase";
import { useAuthStore } from "@/shared/store/auth";
import { useToastStore } from "@/shared/store/toast";
import type { IUser } from "@/entities/user/types";

interface IProps {
  user: IUser | null;
  isLoading: boolean;
}

export const UserInfo: React.FC<IProps> = ({ user: userProp, isLoading }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<IUser | null>(userProp);
  const { showToast } = useToastStore();

  useEffect(() => {
    setUser(userProp);
  }, [userProp]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      useAuthStore.getState().logout();
      showToast({ type: "success", message: "Ви вийшли з облікового запису" });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="flex sm:flex-row items-center gap-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="flex-1 w-full space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
          </div>
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <section className="space-y-4">
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <UserEdit
              userId={user.uid}
              user={{ email: user.email, fullName: user.fullName }}
              onSuccess={(updates) => {
                setUser((prev) => (prev ? { ...prev, ...updates } : prev));
                setIsEditing(false);
              }}
              onCancel={() => setIsEditing(false)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-6 bg-gradient-to-r from-blue-50
            to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-100
              dark:border-blue-800"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div
                  className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-500
                to-purple-600 rounded-full shadow-lg flex-shrink-0"
                >
                  <User className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                    {user.fullName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="group relative inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800
                  text-gray-700 dark:text-gray-200 text-sm font-semibold rounded-xl border border-gray-200
                    dark:border-gray-700 shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700
                    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      dark:focus:ring-offset-gray-800 active:scale-95"
                >
                  <Edit3 className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
                  <span>Редагувати</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="group relative inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500
                  to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-sm font-semibold rounded-xl
                    shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500
                    focus:ring-offset-2 dark:focus:ring-offset-gray-800 active:scale-95 overflow-hidden"
                >
                  <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
                  <span>Вийти</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-100 dark:border-orange-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex-shrink-0">
              <Flame className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                Стрік
              </p>
              <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                {user.streak ?? 0}
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                Виконано
              </p>
              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                {user.completedTasksCount ?? 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
