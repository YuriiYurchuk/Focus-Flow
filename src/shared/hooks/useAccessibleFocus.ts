import { useCallback, useRef } from "react";

export const useAccessibleFocus = () => {
  const focusRef = useRef<HTMLElement | null>(null);

  const setFocus = useCallback(() => {
    if (focusRef.current) {
      focusRef.current.focus();
    }
  }, []);

  const setFocusRef = useCallback((element: HTMLElement | null) => {
    focusRef.current = element;
  }, []);

  return { setFocus, setFocusRef };
};
