import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { getWishlist, removeFromWishlist, type Product } from "@/lib/api";
import ProductCard from "@/components/products/ProductCard";
import { toast } from "sonner";

export default function WishlistPage() {
  const { wishlist } = useStore();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }
    const loadWishlist = async () => {
      try {
        const data = await getWishlist();
        console.log("Wishlist products from API:", data);
        setWishlistProducts(data || []);
      } catch (error) {
        console.error("Failed to load wishlist", error);
      } finally {
        setLoading(false);
      }
    };
    loadWishlist();
  }, [isAuthenticated, navigate]);

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      const data = await removeFromWishlist(productId);
      console.log("Remove response:", data);
      // Ensure data is an array
      const products = Array.isArray(data) ? data : [];
      setWishlistProducts(products);
      toast.success("Removed from wishlist");
    } catch (error) {
      console.error("Failed to remove from wishlist", error);
      toast.error("Failed to remove item");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] dark:bg-[#1C1A17] flex items-center justify-center pt-16">
        <div className="text-center">
          <p className="font-display text-4xl font-light text-[#1C1A17] dark:text-[#F5F0E8] mb-4">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F0E8] dark:bg-[#1C1A17] min-h-screen pt-16">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-16">
        <div className="flex items-center gap-2 mb-4 font-accent text-xs text-[#1C1A17]/50 dark:text-[#F5F0E8]/50">
          <Link to="/" className="hover:text-[#C8A97E] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#1C1A17] dark:text-[#F5F0E8]">Wishlist</span>
        </div>

        <div className="flex items-end justify-between mb-12 border-b border-[#C8A97E]/20 pb-8">
          <div>
            <p className="font-accent text-xs tracking-[0.25em] uppercase text-[#C8A97E] mb-3">
              Saved Pieces
            </p>
            <h1 className="font-display text-6xl font-light text-[#1C1A17] dark:text-[#F5F0E8]">
              Wishlist
            </h1>
          </div>
          <p className="font-accent text-sm text-[#1C1A17]/50 dark:text-[#F5F0E8]/50">
            {wishlistProducts.length} {wishlistProducts.length === 1 ? "item" : "items"}
          </p>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="py-24 text-center">
            <Heart size={48} className="text-[#C8A97E]/30 mx-auto mb-6" />
            <p className="font-display text-3xl font-light text-[#1C1A17] dark:text-[#F5F0E8] mb-3">
              Your wishlist is empty
            </p>
            <p className="font-body text-sm text-[#1C1A17]/50 dark:text-[#F5F0E8]/50 mb-8">
              Save pieces you love to revisit later.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-10 py-4 bg-[#1C1A17] dark:bg-[#F5F0E8] text-[#F5F0E8] dark:text-[#1C1A17] font-body font-600 text-sm tracking-wider uppercase hover:bg-[#C8A97E] hover:text-[#1C1A17] transition-colors"
            >
              Explore Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {wishlistProducts.map((product) => (
              <div key={product.id} className="relative group">
                <ProductCard product={product} />
                <button
                  onClick={() => handleRemoveFromWishlist(product.id.toString())}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 z-10"
                  title="Remove from wishlist"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
