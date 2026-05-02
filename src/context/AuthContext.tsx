import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
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
  resetLoggingOut,
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
  const checkIntervalRef = useRef<number | null>(null);
  const lastAuthCheckRef = useRef<number>(0);
  const failedAuthAttempts = useRef<number>(0);

  const checkAuth = useCallback(async () => {
    const now = Date.now();
    // Prevent rapid successive calls (minimum 5 seconds between calls)
    if (now - lastAuthCheckRef.current < 5000) {
      console.log("Auth check throttled, skipping...");
      return;
    }
    lastAuthCheckRef.current = now;

    try {
      console.log("Checking auth with backend...");
      const currentUser = await getCurrentUser();
      console.log("Got user:", currentUser);
      setUser(currentUser);
      setIsAuthenticated(true);
      setIsLoading(false);
      failedAuthAttempts.current = 0;
      resetLoggingOut(); // Reset the logging out flag
      
      // Only set up interval after successful authentication
      if (!checkIntervalRef.current) {
        checkIntervalRef.current = window.setInterval(() => {
          checkAuth();
        }, 30000);
      }
    } catch (error: any) {
      console.error("Auth check failed:", error);
      if (error?.response?.status === 401) {
        console.log("User not logged in (401) - this is expected");
        setUser(null);
        setIsAuthenticated(false);
        failedAuthAttempts.current += 1;
        
        // Stop checking auth when not authenticated
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
          checkIntervalRef.current = null;
        }
        
        // If too many failed attempts, stop trying for a while
        if (failedAuthAttempts.current >= 3) {
          console.log("Too many failed auth attempts, backing off...");
          setTimeout(() => {
            failedAuthAttempts.current = 0;
          }, 60000); // Reset after 1 minute
        }
      } else {
        console.log("Other error, keeping current auth state");
      }
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Always attempt auth check on mount
    // HttpOnly cookies cannot be checked via JavaScript, so we must always try
    // The backend /auth/me will return 401 if not authenticated
    if (failedAuthAttempts.current < 3) {
      checkAuth();
    } else {
      console.log("Skipping auth check - too many failed attempts");
      setIsLoading(false);
    }
    
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, []);

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