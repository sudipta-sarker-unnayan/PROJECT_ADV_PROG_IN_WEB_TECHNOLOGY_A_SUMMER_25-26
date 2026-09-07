"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { loginRequest } from "../api/auth.api";
import { AuthUser, LoginPayload } from "../types/auth.types";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Restore session from localStorage on page refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("sbms_user");
    const storedToken = localStorage.getItem("sbms_token");
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("sbms_user");
        localStorage.removeItem("sbms_token");
      }
    }
    setIsLoading(false);
  }, []);

  async function login(payload: LoginPayload) {
    const res = await loginRequest(payload);
    localStorage.setItem("sbms_token", res.accessToken);
    localStorage.setItem("sbms_user", JSON.stringify(res.user));
    setUser(res.user);
    router.push("/dashboard");
  }

  function logout() {
    localStorage.removeItem("sbms_token");
    localStorage.removeItem("sbms_user");
    setUser(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
