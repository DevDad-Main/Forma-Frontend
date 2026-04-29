import axios, {
  AxiosError,
  type AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
    _skipAuthCheck?: boolean;
  }
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

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
    const config = error.config as InternalAxiosRequestConfig & {
      _skipAuthCheck?: boolean;
    };
    const url = config?.url || "";
    // Don't redirect for wishlist endpoints (they may return 401 if not authenticated)
    const isWishlistEndpoint = url.includes("/wishlist");
    if (
      error.response?.status === 401 &&
      !isLoggingOut &&
      !config?._skipAuthCheck &&
      !isWishlistEndpoint
    ) {
      isLoggingOut = true;
      localStorage.removeItem("auth_user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
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
  role?: string;
  address?: Address;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  category: string;
  material: string;
  color: string;
  description: string;
  dimensions?: string;
  tags?: string[];
  inStock: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
}

export interface Address {
  id?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface UpdateAddressRequest {
  address: Address;
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
  const { data } = await api.get<User>("/auth/me", {
    _skipAuthCheck: true,
  } as any);
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

export async function updateAddress(address: Address): Promise<Address> {
  const { data } = await api.put<Address>("/auth/address", address);
  return data;
}

export async function createAddress(address: Address): Promise<Address> {
  const { data } = await api.post<Address>("/auth/address", address);
  return data;
}

export async function deleteAddress(id: string): Promise<boolean> {
  const { data } = await api.delete<boolean>(`/auth/address/${id}`);
  return data;
}

export async function getAddresses(): Promise<Address[]> {
  const { data } = await api.get<Address[]>("/auth/address");
  return data;
}

export async function createProduct(product: Product): Promise<Product> {
  const { data } = await api.post<Product>("/admin/products", product);
  return data;
}

export async function updateProduct(
  id: string,
  product: Product,
): Promise<Product> {
  const { data } = await api.put<Product>(`/admin/products/${id}`, product);
  return data;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { data } = await api.delete<boolean>(`/admin/products/${id}`);
  return data;
}

export async function getAdminProducts(): Promise<Product[]> {
  const { data } = await api.get<Product[]>("/admin/products");
  return data;
}

export async function getProducts(): Promise<Product[]> {
  const { data } = await api.get<Product[]>("/products");
  return data;
}

export async function getProduct(id: string): Promise<Product> {
  const { data } = await api.get<Product>(`/products/${id}`);
  return data;
}

export async function seedProducts(products: Product[]): Promise<Product[]> {
  const { data } = await api.post<Product[]>("/admin/products/seed", products);
  return data;
}

export function getUser(): User | null {
  return getStoredUser();
}

export function isAuthenticated(): boolean {
  // Check if we have a JWT cookie by looking for it
  const cookies = document.cookie;
  return cookies.includes("jwt=") || cookies.includes("JSESSIONID=");
}

export interface Wishlist {
  id?: string;
  userId?: string;
  products: string[];
}

// export async function getWishlist(): Promise<Wishlist> {
//   const { data } = await api.get<Wishlist>("/wishlist");
//   console.log(data);
//   return data;
// }

export async function getWishlist(): Promise<Product[]> {
  const { data } = await api.get<Product[]>("/wishlist");
  console.log(data);
  return data;
}

export async function addToWishlist(productId: string): Promise<Product[]> {
  const { data } = await api.post<Product[]>(`/wishlist/add/${productId}`);
  return data;
}

export async function removeFromWishlist(productId: string): Promise<Product[]> {
  const { data } = await api.delete<Product[]>(`/wishlist/remove/${productId}`);
  return data;
}

export { api };
