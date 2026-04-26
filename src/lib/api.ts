import axios, { AxiosError, type AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
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

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await api.post("/auth/refresh", {}, { withCredentials: true });
        return api(originalRequest);
      } catch (refreshError) {
        logout();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
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
  name: string;
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
  const { data } = await api.get<User>("/auth/me");
  return data;
}

export function logout(): void {
  localStorage.removeItem("auth_user");
  api.post("/auth/logout").catch(() => {});
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