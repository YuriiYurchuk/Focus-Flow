import { create } from "zustand";

interface IUser {
  uid: string;
  email: string;
}

interface IAuthState {
  user: IUser | null;
  isLoading: boolean;
  setUser: (user: IUser | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useAuthStore = create<IAuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
