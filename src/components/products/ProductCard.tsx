import { useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { Product } from "@/context/StoreContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  size?: "default" | "small";
}

export default function ProductCard({ product, size = "default" }: ProductCardProps) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [heartAnim, setHeartAnim] = useState(false);
  const isWishlisted = wishlist.includes(product.id.toString());

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please sign in to save favorites");
      return;
    }
    toggleWishlist(product.id);
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 400);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please sign in to add to cart");
      return;
    }
    if (product.inStock) addToCart(product);
  };

  return (
    <div
      className="group cursor-pointer"
      onClick={() => navigate(`/product/${product.id}`)}
    >
       {/* Image */}
      <div className="relative overflow-hidden bg-[#EDE8DF] dark:bg-[#252220] aspect-[4/5]">
        {/* Primary image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        {/* Hover image - COMMENTED OUT: Requires additional product images
        {product.hoverImage && (
          <img
            src={product.hoverImage}
            alt={`${product.name} alternate`}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-all duration-500",
              hovered ? "opacity-100 scale-[1.01]" : "opacity-0 scale-100"
            )}
          />
        )} */}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="font-accent text-[10px] font-500 tracking-[0.1em] uppercase bg-[#1C1A17] dark:bg-[#F5F0E8] text-[#F5F0E8] dark:text-[#1C1A17] px-2 py-0.5">
              New
            </span>
          )}
          {product.isBestSeller && (
            <span className="font-accent text-[10px] font-500 tracking-[0.1em] uppercase bg-[#C8A97E] text-[#1C1A17] px-2 py-0.5">
              Best Seller
            </span>
          )}
          {!product.inStock && (
            <span className="font-accent text-[10px] font-500 tracking-[0.1em] uppercase bg-[#1C1A17]/50 text-[#F5F0E8] px-2 py-0.5">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className={cn(
            "absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200",
            "bg-[#F5F0E8]/80 dark:bg-[#1C1A17]/80 backdrop-blur-sm",
            "opacity-0 group-hover:opacity-100",
            heartAnim && "heart-burst"
          )}
        >
          <Heart
            size={14}
            className={cn(
              "transition-colors duration-200",
              isWishlisted ? "fill-[#C8A97E] text-[#C8A97E]" : "text-[#1C1A17] dark:text-[#F5F0E8]"
            )}
          />
        </button>

        {/* Quick Add */}
        {product.inStock && (
          <div
            className="absolute bottom-0 left-0 right-0 transition-all duration-300 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
          >
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#1C1A17] dark:bg-[#F5F0E8] text-[#F5F0E8] dark:text-[#1C1A17] font-body text-xs font-600 tracking-wider uppercase hover:bg-[#C8A97E] hover:text-[#1C1A17] transition-colors duration-200"
            >
              <ShoppingBag size={13} />
              Quick Add
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="pt-4 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p className={cn(
            "font-body font-500 text-[#1C1A17] dark:text-[#F5F0E8] leading-tight group-hover:text-[#C8A97E] transition-colors duration-200",
            size === "small" ? "text-sm" : "text-base"
          )}>
            {product.name}
          </p>
          <div className="text-right flex-shrink-0">
            <p className="font-accent font-500 text-[#1C1A17] dark:text-[#F5F0E8]">
              {product.price.toLocaleString()} zł
            </p>
            {product.originalPrice && (
              <p className="font-accent text-xs text-[#1C1A17]/40 dark:text-[#F5F0E8]/40 line-through">
                {product.originalPrice.toLocaleString()} zł
              </p>
            )}
          </div>
        </div>
        <p className="font-accent text-xs text-[#1C1A17]/50 dark:text-[#F5F0E8]/50 tracking-wide">
          {product.material}
        </p>
      </div>
    </div>
  );
}
