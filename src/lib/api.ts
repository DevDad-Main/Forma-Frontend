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

// Initialize from localStorage (survives page reload)
if (typeof window !== "undefined") {
  const loggedOut = localStorage.getItem("auth_logging_out");
  if (loggedOut === "true") {
    isLoggingOut = true;
  }
}

export function resetLoggingOut() {
  isLoggingOut = false;
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_logging_out");
  }
}

export function setLoggingOut() {
  isLoggingOut = true;
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_logging_out", "true");
  }
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
    const isProductsEndpoint = url.includes("/products") || url.includes("/shop");
    
    if (
      error.response?.status === 401 &&
      !isLoggingOut &&
      !config?._skipAuthCheck &&
      !isWishlistEndpoint &&
      !isProductsEndpoint // Don't redirect on public product endpoints
    ) {
      isLoggingOut = true;
      localStorage.removeItem("auth_user");
      // Clear any running intervals by reloading to clean state
      // Only redirect if we're not already on the home page
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
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
  // Since JWT is HttpOnly, we cannot check it via JavaScript
  // Check localStorage as fallback, or let checkAuth handle the 401
  return !!getUser();
}

export interface Wishlist {
  id?: string;
  userId?: string;
  products: string[];
}

export interface CreatePaymentIntentRequest {
  amount: number;
  currency?: string; // Will be "pln" for Polish Złoty
  products?: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  shippingCost?: number;
  discount?: number;
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
}

export async function createPaymentIntent(
  request: CreatePaymentIntentRequest,
): Promise<CreatePaymentIntentResponse> {
  const { data } = await api.post<CreatePaymentIntentResponse>(
    "/payments/create-payment-intent",
    request,
  );
  return data;
}

export interface CreateCheckoutSessionRequest {
  products: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  shippingCost: number;
  discount: number;
}

export interface CreateCheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export async function createCheckoutSession(
  request: CreateCheckoutSessionRequest,
): Promise<CreateCheckoutSessionResponse> {
  const { data } = await api.post<CreateCheckoutSessionResponse>(
    "/payments/create-checkout-session",
    request,
  );
  return data;
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

export async function removeFromWishlist(
  productId: string,
): Promise<Product[]> {
  const { data } = await api.delete<Product[]>(`/wishlist/remove/${productId}`);
  return data;
}

export interface Order {
  id: string;
  orderNumber?: string;
  date: string;
  status: string;
  total: number;
  subtotal?: number;
  shippingCost?: number;
  discount?: number;
  items: number;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export async function getOrders(): Promise<Order[]> {
  try {
    const response = await api.get("/orders");

    console.log(response);

    // Handle if backend returns string instead of parsed JSON
    let orders = response.data;
    if (typeof orders === "string") {
      try {
        orders = JSON.parse(orders);
      } catch (e) {
        console.error("Failed to parse orders JSON:", e);
        return [];
      }
    }

    if (!Array.isArray(orders)) {
      console.error("Orders is not an array:", orders);
      return [];
    }

    const transformed = orders.map((order: any) => ({
      id: String(order.id || "N/A"),
      orderNumber: order.orderNumber || order.order_number || `FMA-${order.id}`,
      date: order.createdAt
        ? new Date(order.createdAt).toLocaleDateString()
        : new Date().toLocaleDateString(),
      status: order.status || "Processing",
      total: Math.round((order.amount || 0) / 100),
      subtotal: Math.round((order.subtotal || order.amount || 0) / 100),
      shippingCost: Math.round((order.shipingCost || order.shippingCost || 0) / 100),
      discount: Math.round((order.discount || 0) / 100),
      items: Array.isArray(order.items) ? order.items.length : 0,
      shippingAddress: order.shippingAddress ? {
        street: order.shippingAddress.street || "",
        city: order.shippingAddress.city || "",
        state: order.shippingAddress.state || "",
        zipCode: order.shippingAddress.zipCode || "",
        country: order.shippingAddress.country || "",
      } : undefined,
    }));

    return transformed;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }
}

export { api };
