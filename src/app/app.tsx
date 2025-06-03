import { Outlet } from "react-router-dom";
import { Header } from "@/features/header";
import { Suspense } from "react";
import { Loader } from "@/features/loader";

export const AppLayout: React.FC = () => {
  return (
    <div>
      <Header />
      <main>
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
};
