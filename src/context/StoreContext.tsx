import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  type Wishlist,
} from "@/lib/api";

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
  isNew?: boolean;
  isBestSeller?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  variant?: string;
}

interface StoreContextType {
  cart: CartItem[];
  wishlist: string[];
  cartOpen: boolean;
  darkMode: boolean;
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product, quantity?: number, variant?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleWishlist: (productId: string) => void;
  setCartOpen: (open: boolean) => void;
  toggleDarkMode: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Load wishlist from backend on mount
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const data = await getWishlist();
        // Backend returns Product[], extract IDs
        const productIds = data.map((p: any) => p.id.toString());
        setWishlist(productIds);
      } catch (error) {
        console.error("Failed to load wishlist", error);
      }
    };
    loadWishlist();
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const addToCart = useCallback(
    (product: Product, quantity = 1, variant?: string) => {
      setCart((prev) => {
        const existing = prev.find(
          (item) => item.product.id === product.id && item.variant === variant,
        );
        if (existing) {
          return prev.map((item) =>
            item.product.id === product.id && item.variant === variant
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
        }
        return [...prev, { product, quantity, variant }];
      });
      setCartOpen(true);
    },
    [],
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }
      setCart((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item,
        ),
      );
    },
    [removeFromCart],
  );

  const toggleWishlist = useCallback(
    async (productId: string) => {
      try {
        if (wishlist.includes(productId)) {
          const data = await removeFromWishlist(productId);
          // Backend returns Product[], extract IDs
          const productIds = data.map((p: any) => p.id.toString());
          setWishlist(productIds);
        } else {
          const data = await addToWishlist(productId);
          // Backend returns Product[], extract IDs
          const productIds = data.map((p: any) => p.id.toString());
          setWishlist(productIds);
        }
      } catch (error) {
        console.error("Failed to update wishlist", error);
      }
    },
    [wishlist],
  );

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      document.documentElement.classList.add("theme-transition");
      if (next) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      setTimeout(() => {
        document.documentElement.classList.remove("theme-transition");
      }, 420);
      return next;
    });
  }, []);

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        cartOpen,
        darkMode,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleWishlist,
        setCartOpen,
        toggleDarkMode,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
