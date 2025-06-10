import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

export const useActiveNav = <T extends { to: string }>(
  navItems: readonly T[]
) => {
  const location = useLocation();
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const currentIndex = navItems.findIndex(
      (item) => item.to === location.pathname
    );
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
    }
  }, [location.pathname, navItems]);

  useEffect(() => {
    const activeEl = navRefs.current[activeIndex];
    if (!activeEl) return;

    requestAnimationFrame(() => {
      const { offsetLeft, offsetWidth } = activeEl;
      setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
    });
  }, [activeIndex]);

  return { navRefs, activeIndex, indicatorStyle };
};
