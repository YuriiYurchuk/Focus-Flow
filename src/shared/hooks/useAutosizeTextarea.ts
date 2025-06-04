import { useEffect, useRef } from "react";

export function useAutoResizeTextarea(value: string, as: "input" | "textarea") {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (as === "textarea" && textareaRef.current) {
      const el = textareaRef.current;

      el.style.height = "auto";
      const newHeight = el.scrollHeight;

      if (newHeight > el.clientHeight) {
        el.style.height = `${newHeight}px`;
      }
    }
  }, [value, as]);

  return textareaRef;
}
