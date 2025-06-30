import { Navigate, Outlet } from "react-router-dom";
import { useAuthStatus } from "@/shared/hooks/useAuthStatus";
import { ROUTES } from "@/shared/model/routes";

export const ProtectedRoute = () => {
  const { user, isLoading } = useAuthStatus();

  if (isLoading) return null;

  if (!user) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  return <Outlet />;
};

export const GuestOnlyRoute = () => {
  const { user, isLoading } = useAuthStatus();

  if (isLoading) return null;

  if (user) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
};
