import { Outlet, useLocation } from "react-router-dom";
import { Header } from "@/features/header";
import { Navbar } from "@/features/navbar";
import { Suspense } from "react";
import { Toaster } from "@/features/toaster";
import { Loader } from "@/features/loader";
import { ROUTES } from "@/shared/model/routes";

export const AppLayout: React.FC = () => {
  const location = useLocation();

  const hideNavbarRoutes: string[] = [ROUTES.AUTH.LOGIN, ROUTES.AUTH.REGISTER];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div>
      <Header />
      {!shouldHideNavbar && <Navbar />}
      <main className="flex-1 container mx-auto py-6 pb-20 relative">
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </main>
      <Toaster />
    </div>
  );
};
