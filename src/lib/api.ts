import axios, { AxiosError, type AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
    _skipAuthCheck?: boolean;
  }
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export let isLoggingOut = false;

export function resetLoggingOut() {
  isLoggingOut = false;
}

export function setLoggingOut() {
  isLoggingOut = true;
}

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig & { _skipAuthCheck?: boolean };
    if (error.response?.status === 401 && !isLoggingOut && !config?._skipAuthCheck) {
      isLoggingOut = true;
      localStorage.removeItem("auth_user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

const getStoredUser = (): User | null => {
  const user = localStorage.getItem("auth_user");
  return user ? JSON.parse(user) : null;
};

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface GoogleAuthRequest {
  credential: string;
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  picture?: string;
}

export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login", credentials);
  localStorage.setItem("auth_user", JSON.stringify(data.user));
  return data;
}

export async function register(req: RegisterRequest): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/register", req);
  localStorage.setItem("auth_user", JSON.stringify(data.user));
  return data;
}

export async function googleAuth(credential: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/google", { credential });
  localStorage.setItem("auth_user", JSON.stringify(data.user));
  return data;
}

export async function getCurrentUser(): Promise<User> {
  const { data } = await api.get<User>("/auth/me", { _skipAuthCheck: true } as any);
  return data;
}

export async function logout(): Promise<void> {
  localStorage.removeItem("auth_user");
  isLoggingOut = true;
  try {
    await api.post("/auth/logout", {}, { _skipAuthCheck: true } as any);
  } catch {
    // Ignore - we're logging out anyway
  }
}

export function getUser(): User | null {
  return getStoredUser();
}

export function isAuthenticated(): boolean {
  // Just check if we have a JWT cookie - the backend will verify on requests
  // We don't store user in localStorage for security
  return true;
}

export { api };