import { NavLink, useLocation } from "react-router-dom";
import { ROUTES } from "@/shared/model/routes";
import { Home, List, PlusCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { forwardRef } from "react";
import { useActiveNav } from "@/shared/hooks/useActiveNav";

const NAV_ITEMS = [
  { to: ROUTES.DASHBOARD, icon: Home, label: "Головна", id: "dashboard" },
  { to: ROUTES.TASK.ALL, icon: List, label: "Завдання", id: "tasks" },
  { to: ROUTES.TASK.ADD, icon: PlusCircle, label: "Додати", id: "add" },
] as const;

interface INavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  variant: "desktop" | "mobile";
}

const useIsAuthPage = (): boolean => {
  const location = useLocation();
  const authPages = [ROUTES.AUTH.LOGIN, ROUTES.AUTH.REGISTER] as const;
  return authPages.includes(location.pathname as (typeof authPages)[number]);
};

const NavItem = forwardRef<HTMLAnchorElement, INavItemProps>(
  ({ to, icon: Icon, label, variant }, ref) => {
    return (
      <NavLink
        ref={ref}
        to={to}
        aria-label={label}
        className={({ isActive }: { isActive: boolean }) => {
          const baseClass =
            variant === "desktop"
              ? "relative flex items-center gap-2 px-4 py-2.5 rounded-2xl font-medium transition-all duration-300 ease-out group z-10"
              : "relative flex flex-col items-center justify-center px-3 py-2.5 rounded-2xl transition-all duration-300 ease-out group min-w-[70px] z-10";
          const activeClass = "text-white";
          const inactiveClassDesktop =
            "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:scale-105";
          const inactiveClassMobile =
            "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:scale-105";
          const variantInactiveClass =
            variant === "desktop" ? inactiveClassDesktop : inactiveClassMobile;

          return `${baseClass} ${
            isActive ? activeClass : variantInactiveClass
          }`;
        }}
      >
        {variant === "desktop" ? (
          <>
            <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            <span>{label}</span>
          </>
        ) : (
          <>
            <Icon className="w-6 h-6 mb-1 transition-transform duration-300 group-hover:scale-125" />
            <span className="text-[11px] font-medium">{label}</span>
          </>
        )}
      </NavLink>
    );
  }
);
export const DesktopNav: React.FC = () => {
  const isAuthPage = useIsAuthPage();
  const { navRefs, indicatorStyle } = useActiveNav(NAV_ITEMS);

  if (isAuthPage) return null;

  return (
    <nav className="hidden md:flex items-center gap-2 relative">
      <div
        className="absolute bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl shadow-blue-500/25 transition-all duration-500 ease-out z-0"
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
          height: "44px",
          transform: "scale(1.02)",
        }}
      />
      {NAV_ITEMS.map((item, index) => (
        <NavItem
          key={item.id}
          ref={(el) => {
            navRefs.current[index] = el;
          }}
          to={item.to}
          icon={item.icon}
          label={item.label}
          variant="desktop"
        />
      ))}
    </nav>
  );
};

export const MobileNav: React.FC = () => {
  const isAuthPage = useIsAuthPage();
  const { navRefs, indicatorStyle } = useActiveNav(NAV_ITEMS);

  if (isAuthPage) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:hidden z-50">
      <nav
        className="relative flex items-center justify-around px-4 py-3 gap-1
          bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl
          border border-slate-200/40 dark:border-slate-700/40
          rounded-3xl shadow-lg shadow-slate-900/10
          w-[calc(100vw-3rem)] max-w-sm mx-auto"
      >
        <div
          className="absolute bg-gradient-to-b from-blue-600 to-purple-600 rounded-2xl shadow-md shadow-blue-500/30 transition-all duration-500 ease-out z-0"
          style={{
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
            height: "68px",
            transform: "scale(1.05)",
          }}
        />
        {NAV_ITEMS.map((item, index) => (
          <NavItem
            key={item.id}
            ref={(el) => {
              navRefs.current[index] = el;
            }}
            to={item.to}
            icon={item.icon}
            label={item.label}
            variant="mobile"
          />
        ))}
      </nav>
    </div>
  );
};
