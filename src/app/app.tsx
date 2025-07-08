import { useState } from "react";
import { useNavigation, useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "@/features/header";
import { MobileNav } from "@/features/nav";
import { Toaster } from "@/features/toaster";
import { Loader } from "@/features/loader";
import { useAuthStatus } from "@/shared/hooks/useAuthStatus";
import { useSyncEmailOnLogin } from "@/shared/hooks/useSyncEmailOnLogin";

const AnimatedOutlet: React.FC = () => {
  const outlet = useOutlet();
  const [frozenOutlet] = useState(outlet);
  return <>{frozenOutlet}</>;
};

export const AppLayout: React.FC = () => {
  const navigation = useNavigation();
  const location = useLocation();
  useSyncEmailOnLogin();
  const { isLoading: authLoading } = useAuthStatus();
  const isLoading = navigation.state === "loading" || authLoading;

  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-6 pb-28 md:pb-6 relative overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {!isLoading && (
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(4px)" }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative z-0"
            >
              <AnimatedOutlet />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <MobileNav />
      <Toaster />
      {isLoading && (
        <div>
          <Loader />
        </div>
      )}
    </div>
  );
};
