import { useEffect, useRef, useCallback } from "react";

export const useClickOutside = (
  callback: () => void,
  isActive: boolean = true
) => {
  const refs = useRef<(HTMLElement | null)[]>([]);

  const addRef = useCallback((element: HTMLElement | null) => {
    if (element && !refs.current.includes(element)) {
      refs.current.push(element);
    }
  }, []);

  const removeRef = useCallback((element: HTMLElement | null) => {
    refs.current = refs.current.filter((ref) => ref !== element);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      const isOutside = refs.current.every(
        (ref) => ref && !ref.contains(target)
      );

      if (isOutside) {
        callback();
      }
    };

    const events = ["mousedown", "touchstart"] as const;
    events.forEach((event) => {
      document.addEventListener(event, handleClickOutside, { passive: true });
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleClickOutside);
      });
    };
  }, [callback, isActive]);

  return { addRef, removeRef };
};
