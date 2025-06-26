import { useState } from "react";
import { useNavigation, useLocation, useOutlet } from "react-router-dom";
import { Header } from "@/features/header";
import { MobileNav } from "@/features/nav";
import { Toaster } from "@/features/toaster";
import { Loader } from "@/features/loader";
import { AnimatePresence, motion } from "framer-motion";

const AnimatedOutlet: React.FC = () => {
  const outlet = useOutlet();
  const [frozenOutlet] = useState(outlet);
  return <>{frozenOutlet}</>;
};

export const AppLayout: React.FC = () => {
  const navigation = useNavigation();
  const location = useLocation();
  const isLoading = navigation.state === "loading";

  return (
    <div>
      <Header />
      <main className="flex-1 container mx-auto px-6 py-6 pb-28 md:pb-6 relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 z-10">
            <Loader />
          </div>
        )}

        <AnimatePresence mode="wait" initial={false}>
          {!isLoading && (
            <motion.div
              key={location.pathname}
              initial={{
                opacity: 0,
                scale: 0.95,
                filter: "blur(4px)",
              }}
              animate={{
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                scale: 1.05,
                filter: "blur(4px)",
              }}
              transition={{
                duration: 0.35,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="relative z-0"
            >
              <AnimatedOutlet />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <MobileNav />
      <Toaster />
    </div>
  );
};
