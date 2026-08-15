"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getCurrentUser, type CurrentUser } from "./authApi";

interface AuthContextValue {
  user: CurrentUser | null;
  isLoading: boolean;
  setUser: (user: CurrentUser | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .finally(() => setIsLoading(false));
  }, []);

  return <AuthContext.Provider value={{ user, isLoading, setUser }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
