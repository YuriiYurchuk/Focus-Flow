import { useEffect, useState, useRef } from "react";
import { processUserAchievements } from "@/shared/lib/helpers/processUserAchievements";
import { useAuthStore } from "@/shared/store/auth";

const DARK_COLOR = "#111827";
const LIGHT_COLOR = "#eef2ff";

export const useDarkTheme = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const uid = useAuthStore((state) => state.user?.uid);

  const achievementGranted = useRef(false);

  const updateThemeColorMeta = (color: string) => {
    const metaTag = document.querySelector('meta[name="theme-color"]');
    if (metaTag) {
      metaTag.setAttribute("content", color);
    } else {
      const newMeta = document.createElement("meta");
      newMeta.name = "theme-color";
      newMeta.content = color;
      document.head.appendChild(newMeta);
    }
  };

  const applyTheme = (theme: "light" | "dark") => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    updateThemeColorMeta(theme === "dark" ? DARK_COLOR : LIGHT_COLOR);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;

    const initialTheme =
      savedTheme ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");

    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);

    if (newTheme === "dark" && uid && !achievementGranted.current) {
      achievementGranted.current = true;
      try {
        await processUserAchievements(uid, { enabledDarkMode: true });
      } catch (error) {
        console.error("Помилка при оновленні досягнення темної теми:", error);
      }
    }
  };

  return { theme, toggleTheme };
};
