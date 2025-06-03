import { ROUTES } from "../shared/model/routes";
import { createBrowserRouter, redirect } from "react-router-dom";
import { AppLayout } from "./app";
import { ProtectedRoute, GuestOnlyRoute } from "@/shared/lib/router";
import { ErrorPage } from "@/features/error/error.page";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        loader: async () => {
          return redirect(ROUTES.DASHBOARD);
        },
      },
      {
        element: <GuestOnlyRoute />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: ROUTES.AUTH.LOGIN,
            lazy: () => import("@/features/auth/login.page"),
          },
          {
            path: ROUTES.AUTH.REGISTER,
            lazy: () => import("@/features/auth/register.page"),
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: ROUTES.DASHBOARD,
            lazy: () => import("@/features/dashboard/dashboard.page"),
          },
          {
            path: ROUTES.TASK.ADD,
            lazy: () => import("@/features/task/add-task.page"),
          },
          {
            path: ROUTES.TASK.ALL,
            lazy: () => import("@/features/task/all-tasks.page"),
          },
        ],
      },
    ],
  },
]);
