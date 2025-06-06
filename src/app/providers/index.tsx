import { useEffect, type ReactNode } from "react";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { auth } from "@/shared/lib/firebase";
import { useAuthStore } from "@/shared/store/auth";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const setUser = useAuthStore((s) => s.setUser);
  const setIsLoading = useAuthStore((s) => s.setIsLoading);

  useEffect(() => {
    setIsLoading(true);

    const unsubscribe = onAuthStateChanged(
      auth,
      (user: FirebaseUser | null) => {
        if (user?.emailVerified) {
          setUser({ uid: user.uid, email: user.email ?? "" });
        } else {
          setUser(null);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("Помилка автентифікації Firebase:", error);
        setUser(null);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [setUser, setIsLoading]);

  return <>{children}</>;
};
