import { useState } from "react";

const TOKEN_KEY = "jwtToken";
const EXPIRY_KEY = "jwtTokenExpiry";
const USER_KEY = "jwtUser";
const EXPIRY_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export type SessionType = {
  user?: {
    name?: string;
    email?: string;
    image?: string;
  };
  token?: string;
  expiry?: number;
} | null;

export const useSession = () => {
  const [session, setSession] = useState<SessionType>(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const expiry = localStorage.getItem(EXPIRY_KEY);
    const user = localStorage.getItem(USER_KEY);

    if (token && expiry && user && Date.now() < Number(expiry)) {
      return {
        token,
        expiry: Number(expiry),
        user: JSON.parse(user),
      };
    }
    clearStoredSession();
    return null;
  });

  const setSessionData = (data: {
    token: string;
    user: Record<string, any>;
  }) => {
    const { token, user } = data;
    const expiryTime = Date.now() + EXPIRY_DURATION;

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(EXPIRY_KEY, expiryTime.toString());
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    setSession({
      token,
      expiry: expiryTime,
      user,
    });
  };

  const clearSession = () => {
    clearStoredSession();
    setSession(null);
  };

  return {
    session,
    setSessionData,
    clearSession,
  };
};

const clearStoredSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRY_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getSession = (): SessionData => {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem(EXPIRY_KEY);
  const user = localStorage.getItem(USER_KEY);

  if (token && expiry && user && Date.now() < Number(expiry)) {
    return {
      token,
      expiry: Number(expiry),
      user: JSON.parse(user),
    };
  }

  clearStoredSession();
  return null;
};
