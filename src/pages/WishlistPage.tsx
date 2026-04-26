import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { products } from "@/data/products";
import ProductCard from "@/components/products/ProductCard";

export default function WishlistPage() {
  const { wishlist } = useStore();
  const wishlisted = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="bg-[#F5F0E8] dark:bg-[#1C1A17] min-h-screen pt-16">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-16">
        <div className="flex items-center gap-2 mb-4 font-accent text-xs text-[#1C1A17]/50 dark:text-[#F5F0E8]/50">
          <Link to="/" className="hover:text-[#C8A97E] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#1C1A17] dark:text-[#F5F0E8]">Wishlist</span>
        </div>

        <div className="flex items-end justify-between mb-12 border-b border-[#C8A97E]/20 pb-8">
          <div>
            <p className="font-accent text-xs tracking-[0.25em] uppercase text-[#C8A97E] mb-3">Saved Pieces</p>
            <h1 className="font-display text-6xl font-light text-[#1C1A17] dark:text-[#F5F0E8]">Wishlist</h1>
          </div>
          <p className="font-accent text-sm text-[#1C1A17]/50 dark:text-[#F5F0E8]/50">
            {wishlisted.length} {wishlisted.length === 1 ? "item" : "items"}
          </p>
        </div>

        {wishlisted.length === 0 ? (
          <div className="text-center py-24">
            <Heart size={48} className="text-[#C8A97E]/30 mx-auto mb-6" />
            <p className="font-display text-3xl font-light text-[#1C1A17] dark:text-[#F5F0E8] mb-3">Your wishlist is empty</p>
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
            {wishlisted.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
