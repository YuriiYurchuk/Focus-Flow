import { Outlet } from "react-router-dom";
import { Header } from "@/features/header";
import { Suspense } from "react";
import { Toaster } from "@/features/toaster";
import { Loader } from "@/features/loader";

export const AppLayout: React.FC = () => {
  return (
    <div>
      <Header />
      <main className="flex-1 container mx-auto py-6 pb-20 relative">
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </main>
      <Toaster />
    </div>
  );
};
