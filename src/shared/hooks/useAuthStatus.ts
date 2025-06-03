import { useAuthStore } from "@/shared/store/auth";

export const useAuthStatus = () => {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  return { user, isLoading };
};
