import { useState, useEffect } from "react";
import { MoreVertical, Trash2 } from "lucide-react";
import { useClickOutside } from "@/shared/hooks/useClickOutside";
import { useKeyboardNavigation } from "@/shared/hooks/useKeyboardNavigation";
import { useAccessibleFocus } from "@/shared/hooks/useAccessibleFocus";

interface ITaskMenuProps {
  onDelete: () => void;
}

export const TaskMenu: React.FC<ITaskMenuProps> = ({ onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const { setFocusRef, setFocus } = useAccessibleFocus();

  const handleCloseMenu = () => {
    setShowMenu(false);
  };

  const handleToggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  const { addRef } = useClickOutside(handleCloseMenu, showMenu);
  useKeyboardNavigation(showMenu, handleCloseMenu);

  useEffect(() => {
    if (showMenu) setFocus();
  }, [showMenu, setFocus]);

  const handleDelete = () => {
    onDelete();
    setShowMenu(false);
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={handleToggleMenu}
          className={`p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
            showMenu ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <MoreVertical
            size={16}
            className="text-gray-600 dark:text-gray-400"
          />
        </button>
        <div
          className={`absolute right-0 top-8 bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 py-2 min-w-[120px] z-10
            transform transition-all duration-200 ease-out origin-top-right
            ${
              showMenu
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-95 pointer-events-none"
            }
          `}
        >
          <button
            ref={(el) => {
              setFocusRef(el);
              addRef(el);
            }}
            onClick={handleDelete}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-600 text-red-600 dark:text-red-400 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Видалити
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={handleCloseMenu}
        className={`fixed inset-0 z-0 ${showMenu ? "block" : "hidden"}`}
        aria-label="Закрити меню"
      />
    </>
  );
};
