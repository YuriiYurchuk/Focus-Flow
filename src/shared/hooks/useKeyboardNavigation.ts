import { useEffect } from "react";

export const useKeyboardNavigation = (
  isActive: boolean,
  onEscape?: () => void,
  onEnter?: () => void
) => {
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Escape":
          event.preventDefault();
          onEscape?.();
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          onEnter?.();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isActive, onEscape, onEnter]);
};
