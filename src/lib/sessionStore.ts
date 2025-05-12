// stores/sessionStore.ts
import { UserType } from "@/schemas";
import { create } from "zustand";

const TOKEN_KEY = "jwtToken";
const EXPIRY_KEY = "jwtTokenExpiry";
const USER_KEY = "jwtUser";
const EXPIRY_DURATION = 24 * 60 * 60 * 1000;

export type SessionType = {
  token: string;
  expiry: number;
  user: UserType;
} | null;

interface SessionStore {
  session: SessionType;
  setSession: (token: string, user: UserType) => void;
  clearSession: () => void;
  initializeSession: () => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  session: null,

  setSession: (token, user) => {
    const expiry = Date.now() + EXPIRY_DURATION;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(EXPIRY_KEY, expiry.toString());
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    set({
      session: { token, expiry, user },
    });
  },

  clearSession: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRY_KEY);
    localStorage.removeItem(USER_KEY);

    set({ session: null });
  },

  initializeSession: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const expiry = localStorage.getItem(EXPIRY_KEY);
    const user = localStorage.getItem(USER_KEY);

    if (token && expiry && user && Date.now() < Number(expiry)) {
      set({
        session: {
          token,
          expiry: Number(expiry),
          user: JSON.parse(user),
        },
      });
    } else {
      set({ session: null });
    }
  },
}));
