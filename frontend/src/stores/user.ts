import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserInfo {
  username?: string;
  email?: string;
  is_teacher?: boolean;
  is_student?: boolean;
  entry_period?: string;
}

interface UserStore extends UserInfo {
  accessToken?: string | null;
  refreshToken?: string | null;
  setUserInfo: (data: UserInfo) => void;
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  clearTokens: () => void;
}

export const useUserStore = create(
  persist<UserStore>(
    (set) => ({
      setUserInfo: (data) => set({ ...data }),
      setAccessToken: (token) => set({ accessToken: token }),
      setRefreshToken: (token) => set({ refreshToken: token }),
      clearTokens: () => set({ accessToken: null, refreshToken: null }),
    }),
    {
      name: "user-store",
    }
  )
);

export const getUserStore = useUserStore.getState;
