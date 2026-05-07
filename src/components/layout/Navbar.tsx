import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Heart,
  ShoppingBag,
  X,
  Menu,
  User,
  LogOut,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
// import { products } from "@/data/products";
import { getProducts, type Product } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { cartCount, wishlist, setCartOpen } = useStore();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartBounce, setCartBounce] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const prevCartCount = useRef(cartCount);
  const navigate = useNavigate();

  useEffect(() => {
    // Only load products for search if authenticated
    if (!isAuthenticated) return;

    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data || []);
      } catch (error: any) {
        // Only log if not a 401 error
        if (error?.response?.status !== 401) {
          console.error("Failed to load products for search", error);
        }
      }
    };
    loadProducts();
  }, [isAuthenticated]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (cartCount > prevCartCount.current) {
      setCartBounce(true);
      setTimeout(() => setCartBounce(false), 500);
    }
    prevCartCount.current = cartCount;
  }, [cartCount]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (userMenuOpen && !target.closest(".user-menu")) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [userMenuOpen]);

  const searchResults =
    searchQuery.trim().length > 1
      ? products
          .filter(
            (p) =>
              p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.category.toLowerCase().includes(searchQuery.toLowerCase()),
          )
          .slice(0, 4)
      : [];

  const navLinks = [
    { label: "Shop", href: "/shop" },
    { label: "Collections", href: "/shop" },
    { label: "About", href: "/" },
  ];

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-[#F5F0E8] dark:bg-[#1C1A17] shadow-[0_2px_20px_rgba(28,26,23,0.06)]"
            : "bg-transparent",
        )}
      >
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16 h-16 flex items-center justify-between">
          {/* Left nav */}
          <div className="items-center hidden md:flex gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="font-body text-sm font-400 tracking-wide text-[#1C1A17] dark:text-[#F5F0E8] hover:text-[#C8A97E] dark:hover:text-[#C8A97E] transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-[#1C1A17] dark:text-[#F5F0E8]"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={22} />
          </button>

          {/* Logo - centered on desktop, left-aligned on mobile */}
          <Link
            to="/"
            className="md:absolute md:left-1/2 md:-translate-x-1/2 font-display text-2xl font-light tracking-[0.12em] text-[#1C1A17] dark:text-[#F5F0E8] uppercase"
          >
            Forma
          </Link>

          {/* Right icons */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-[#1C1A17] dark:text-[#F5F0E8] hover:text-[#C8A97E] dark:hover:text-[#C8A97E] transition-colors"
            >
              <Search size={19} />
            </button>
            {isAuthenticated && (
              <>
                <button
                  onClick={() => navigate("/wishlist")}
                  className="relative text-[#1C1A17] dark:text-[#F5F0E8] hover:text-[#C8A97E] dark:hover:text-[#C8A97E] transition-colors"
                >
                  <Heart size={19} />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#C8A97E] text-[#1C1A17] text-[9px] font-accent font-600 rounded-full flex items-center justify-center badge-pop">
                      {wishlist.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setCartOpen(true)}
                  className={cn(
                    "relative text-[#1C1A17] dark:text-[#F5F0E8] hover:text-[#C8A97E] dark:hover:text-[#C8A97E] transition-colors",
                    cartBounce && "cart-bounce",
                  )}
                >
                  <ShoppingBag size={19} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#1C1A17] dark:bg-[#F5F0E8] text-[#F5F0E8] dark:text-[#1C1A17] text-[9px] font-accent font-600 rounded-full flex items-center justify-center badge-pop">
                      {cartCount}
                    </span>
                  )}
                </button>
              </>
            )}
            {isAuthenticated ? (
              <div className="relative flex items-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserMenuOpen(!userMenuOpen);
                  }}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-[#C8A97E] text-[#1C1A17] hover:bg-[#1C1A17] hover:text-[#F5F0E8] transition-colors cursor-pointer z-50 overflow-hidden"
                >
                  {user?.picture ? (
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <User size={16} />
                  )}
                </button>
                {userMenuOpen && (
                  <div className="user-menu absolute right-0 top-full mt-2 w-48 bg-[#F5F0E8] dark:bg-[#1C1A17] border border-[#C8A97E] rounded shadow-lg py-2 fade-in z-[60]">
                    <div className="px-4 py-2 border-b border-[#C8A97E]/20 flex items-center gap-3">
                      {user?.picture ? (
                        <img
                          src={user.picture}
                          alt="Profile"
                          className="object-cover w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#C8A97E] flex items-center justify-center">
                          <User size={20} className="text-[#1C1A17]" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-[#1C1A17] dark:text-[#F5F0E8] truncate">
                          {user?.firstName
                            ? `${user.firstName} ${user.lastName || ""}`
                            : user?.email}
                        </p>
                        <p className="text-xs text-[#1C1A17]/60 truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-[#1C1A17] dark:text-[#F5F0E8] hover:bg-[#EDE8DF] dark:hover:bg-[#2a2520]"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-[#1C1A17] dark:text-[#F5F0E8] hover:bg-[#EDE8DF] dark:hover:bg-[#2a2520] flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="text-[#1C1A17] dark:text-[#F5F0E8] hover:text-[#C8A97E] dark:hover:text-[#C8A97E] transition-colors"
              >
                <User size={19} />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] bg-[#F5F0E8]/95 dark:bg-[#1C1A17]/95 backdrop-blur-sm flex flex-col items-center pt-24 fade-in">
          <button
            onClick={() => {
              setSearchOpen(false);
              setSearchQuery("");
            }}
            className="absolute top-6 right-8 text-[#1C1A17] dark:text-[#F5F0E8] hover:text-[#C8A97E] transition-colors"
          >
            <X size={24} />
          </button>
          <div className="w-full max-w-xl px-6">
            <div className="border-b-2 border-[#1C1A17] dark:border-[#F5F0E8] flex items-center gap-4 pb-3">
              <Search size={20} className="text-[#C8A97E]" />
              <input
                autoFocus
                type="text"
                placeholder="Search pieces, collections…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent font-body text-xl text-[#1C1A17] dark:text-[#F5F0E8] placeholder-[#1C1A17]/40 dark:placeholder-[#F5F0E8]/40 outline-none"
              />
            </div>
            {searchResults.length > 0 && (
              <div className="mt-6 space-y-4">
                {searchResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      navigate(`/product/${product.id}`);
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="w-full flex items-center gap-4 p-3 rounded hover:bg-[#EDE8DF] dark:hover:bg-[#2a2520] transition-colors"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-cover rounded w-14 h-14"
                    />
                    <div className="text-left">
                      <p className="font-body font-500 text-[#1C1A17] dark:text-[#F5F0E8]">
                        {product.name}
                      </p>
                      <p className="font-accent text-sm text-[#C8A97E]">
                        {product.price.toLocaleString()} zł
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-[#F5F0E8] dark:bg-[#1C1A17] flex flex-col fade-in">
          <div className="flex items-center justify-between px-6 h-16 border-b border-[#C8A97E]/20">
            <span className="font-display text-2xl font-light tracking-[0.12em] text-[#1C1A17] dark:text-[#F5F0E8]">
              Forma
            </span>
            <button onClick={() => setMobileMenuOpen(false)}>
              <X size={24} className="text-[#1C1A17] dark:text-[#F5F0E8]" />
            </button>
          </div>
          <div className="flex flex-col justify-center flex-1 px-8 gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-display text-4xl font-light text-[#1C1A17] dark:text-[#F5F0E8] hover:text-[#C8A97E] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
