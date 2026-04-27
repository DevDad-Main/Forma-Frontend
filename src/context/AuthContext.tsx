import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { googleLogout } from "@react-oauth/google";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getCurrentUser,
  getUser,
  isAuthenticated,
  api,
  isLoggingOut,
  setLoggingOut,
  type User,
  type LoginRequest,
  type RegisterRequest,
} from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = useCallback(async () => {
    try {
      console.log("Checking auth with backend...");
      const currentUser = await getCurrentUser();
      console.log("Got user:", currentUser);
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error("Auth check failed:", error);
      if (error?.response?.status === 401) {
        console.log("User not logged in (401) - this is expected");
        setUser(null);
        setIsAuthenticated(false);
      } else {
        console.log("Other error, keeping current auth state");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials: LoginRequest) => {
    const response = await apiLogin(credentials);
    setUser(response.user);
    setIsAuthenticated(true);
  };

  const register = async (data: RegisterRequest) => {
    const response = await apiRegister(data);
    setUser(response.user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    googleLogout();
    localStorage.removeItem("auth_user");
    setLoggingOut();
    try {
      api.post("/auth/logout", {}, { _skipAuthCheck: true } as any);
    } catch {
      // Ignore
    }
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};