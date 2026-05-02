import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Heart, Minus, Plus, ChevronDown, ChevronUp, ArrowLeft,
  ZoomIn, X, ChevronLeft, ChevronRight, ShoppingBag
} from "lucide-react";
// import { products } from "@/data/products";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { getProduct, getProducts, type Product } from "@/lib/api";
import ProductCard from "@/components/products/ProductCard";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const galleryImages = (mainImage: string) => [
  mainImage,
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
  "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80",
];

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getProduct(id);
        setProduct(data);
        // Load related products
        const allProducts = await getProducts();
        const relatedProducts = allProducts
          .filter(p => p.id !== id && p.category === data?.category)
          .slice(0, 4);
        setRelated(relatedProducts);
      } catch (error) {
        console.error("Failed to load product", error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState("Natural");
  const [heartAnim, setHeartAnim] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>("details");
  const ctaRef = useRef<HTMLButtonElement>(null);
  const isWishlisted = wishlist.includes(id || "");

  useEffect(() => {
    setSelectedImage(0);
    setQuantity(1);
    setShowStickyBar(false);
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0.5 }
    );
    if (ctaRef.current) obs.observe(ctaRef.current);
    return () => obs.disconnect();
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] dark:bg-[#1C1A17] flex items-center justify-center pt-16">
        <div className="text-center">
          <p className="font-display text-4xl font-light text-[#1C1A17] dark:text-[#F5F0E8] mb-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] dark:bg-[#1C1A17] flex items-center justify-center pt-16">
        <div className="text-center">
          <p className="font-display text-4xl font-light text-[#1C1A17] dark:text-[#F5F0E8] mb-4">Product not found</p>
          <button onClick={() => navigate("/shop")} className="font-body text-sm text-[#C8A97E] underline">
            Back to shop
          </button>
        </div>
      </div>
    );
  }

  const images = galleryImages(product.image);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to add to cart");
      return;
    }
    addToCart(product, quantity, selectedVariant);
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to save favorites");
      return;
    }
    toggleWishlist(product.id);
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 400);
  };

  const variants = ["Natural", "Dark Walnut", "White Oak"];
  const accordions = [
    {
      id: "details",
      title: "Product Details",
      content: product.description + " Each piece is made to order and carefully inspected before shipping. Minor natural variations in grain and texture are characteristic of authentic solid wood furniture."
    },
    {
      id: "dimensions",
      title: "Dimensions",
      content: product.dimensions || "Please contact us for detailed dimensions."
    },
    {
      id: "care",
      title: "Care Instructions",
      content: "Dust with a soft, dry cloth. Avoid harsh chemicals or abrasive cleaners. For solid wood pieces, apply furniture wax every 6–12 months. Upholstery can be spot-cleaned with a damp cloth; avoid saturating the fabric."
    },
    {
      id: "shipping",
      title: "Shipping & Returns",
      content: "Free white-glove delivery on orders over 2,000 zł. Standard delivery 4–6 weeks. We accept returns within 14 days of delivery for items in original condition. Custom orders are non-returnable."
    },
  ];

  return (
    <div className="bg-[#F5F0E8] dark:bg-[#1C1A17] min-h-screen pt-16">
      {/* Breadcrumb */}
      <div className="px-6 md:px-16 py-5 max-w-[1440px] mx-auto flex items-center gap-2 font-accent text-xs text-[#1C1A17]/50 dark:text-[#F5F0E8]/50">
        <Link to="/" className="hover:text-[#C8A97E] transition-colors">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-[#C8A97E] transition-colors">Shop</Link>
        <span>/</span>
        <span className="text-[#1C1A17] dark:text-[#F5F0E8]">{product.name}</span>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-16 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* ─── IMAGE GALLERY ─── */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="relative group overflow-hidden bg-[#EDE8DF] dark:bg-[#252220] aspect-square">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
              {/* Zoom btn */}
              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute top-4 right-4 w-9 h-9 bg-[#F5F0E8]/80 dark:bg-[#1C1A17]/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#F5F0E8] dark:hover:bg-[#1C1A17]"
              >
                <ZoomIn size={16} className="text-[#1C1A17] dark:text-[#F5F0E8]" />
              </button>
              {/* Nav arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(prev => (prev - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#F5F0E8]/80 dark:bg-[#1C1A17]/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft size={18} className="text-[#1C1A17] dark:text-[#F5F0E8]" />
                  </button>
                  <button
                    onClick={() => setSelectedImage(prev => (prev + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#F5F0E8]/80 dark:bg-[#1C1A17]/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight size={18} className="text-[#1C1A17] dark:text-[#F5F0E8]" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "w-20 h-20 overflow-hidden flex-shrink-0 transition-all duration-200",
                    selectedImage === i
                      ? "ring-2 ring-[#C8A97E] ring-offset-2 ring-offset-[#F5F0E8] dark:ring-offset-[#1C1A17]"
                      : "opacity-60 hover:opacity-100"
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* ─── PRODUCT INFO ─── */}
          <div className="lg:sticky lg:top-24 self-start">
            {/* Back */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 font-body text-sm text-[#1C1A17]/50 dark:text-[#F5F0E8]/50 hover:text-[#C8A97E] transition-colors mb-6"
            >
              <ArrowLeft size={14} /> Back
            </button>

            {/* Category badge */}
            <p className="font-accent text-xs tracking-[0.2em] uppercase text-[#C8A97E] mb-3">{product.category}</p>

            {/* Name */}
            <h1 className="font-display text-4xl md:text-5xl font-light text-[#1C1A17] dark:text-[#F5F0E8] leading-tight mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <p className="font-accent text-2xl font-500 text-[#1C1A17] dark:text-[#F5F0E8]">
                {product.price.toLocaleString()} zł
              </p>
              {product.originalPrice && (
                <p className="font-accent text-lg text-[#1C1A17]/40 dark:text-[#F5F0E8]/40 line-through">
                  {product.originalPrice.toLocaleString()} zł
                </p>
              )}
            </div>

            <p className="font-body text-base font-300 text-[#1C1A17]/70 dark:text-[#F5F0E8]/70 leading-relaxed mb-8">
              {product.description}
            </p>

            <hr className="divider-gold border-t mb-8" />

            {/* Variant selector */}
            <div className="mb-6">
              <p className="font-body text-sm font-500 text-[#1C1A17] dark:text-[#F5F0E8] mb-3">
                Finish: <span className="font-300 text-[#1C1A17]/60 dark:text-[#F5F0E8]/60">{selectedVariant}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {variants.map(v => (
                  <button
                    key={v}
                    onClick={() => setSelectedVariant(v)}
                    className={cn(
                      "px-4 py-2 font-accent text-xs border transition-all duration-200",
                      selectedVariant === v
                        ? "bg-[#1C1A17] dark:bg-[#F5F0E8] text-[#F5F0E8] dark:text-[#1C1A17] border-[#1C1A17] dark:border-[#F5F0E8]"
                        : "bg-transparent text-[#1C1A17] dark:text-[#F5F0E8] border-[#C8A97E]/40 hover:border-[#1C1A17] dark:hover:border-[#F5F0E8]"
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Material */}
            <div className="mb-8">
              <p className="font-body text-sm font-500 text-[#1C1A17] dark:text-[#F5F0E8] mb-1">
                Material: <span className="font-300 text-[#1C1A17]/60 dark:text-[#F5F0E8]/60">{product.material}</span>
              </p>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-8">
              <p className="font-body text-sm font-500 text-[#1C1A17] dark:text-[#F5F0E8]">Quantity</p>
              <div className="flex items-center border border-[#C8A97E]/30">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-[#1C1A17] dark:text-[#F5F0E8] hover:bg-[#EDE8DF] dark:hover:bg-[#2a2520] transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center font-accent text-sm text-[#1C1A17] dark:text-[#F5F0E8]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-[#1C1A17] dark:text-[#F5F0E8] hover:bg-[#EDE8DF] dark:hover:bg-[#2a2520] transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex gap-3">
              <button
                ref={ctaRef}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={cn(
                  "flex-1 py-4 font-body font-600 text-sm tracking-wider uppercase transition-colors duration-200",
                  product.inStock
                    ? "bg-[#1C1A17] dark:bg-[#F5F0E8] text-[#F5F0E8] dark:text-[#1C1A17] hover:bg-[#C8A97E] hover:text-[#1C1A17]"
                    : "bg-[#1C1A17]/30 dark:bg-[#F5F0E8]/30 text-[#F5F0E8]/50 dark:text-[#1C1A17]/50 cursor-not-allowed"
                )}
              >
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </button>
              <button
                onClick={handleWishlist}
                className={cn(
                  "w-14 h-14 flex items-center justify-center border transition-all duration-200",
                  isWishlisted
                    ? "bg-[#C8A97E]/10 border-[#C8A97E]"
                    : "border-[#C8A97E]/30 hover:border-[#C8A97E]",
                  heartAnim && "heart-burst"
                )}
              >
                <Heart
                  size={18}
                  className={cn(
                    "transition-all duration-200",
                    isWishlisted ? "fill-[#C8A97E] text-[#C8A97E]" : "text-[#1C1A17] dark:text-[#F5F0E8]"
                  )}
                />
              </button>
            </div>

            {/* Accordion */}
            <div className="mt-10 space-y-0">
              {accordions.map(acc => (
                <div key={acc.id} className="border-t border-[#C8A97E]/20 first:border-t-0">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === acc.id ? null : acc.id)}
                    className="w-full flex items-center justify-between py-5 font-body text-sm font-500 text-[#1C1A17] dark:text-[#F5F0E8] text-left"
                  >
                    {acc.title}
                    {openAccordion === acc.id
                      ? <ChevronUp size={15} className="text-[#C8A97E] flex-shrink-0" />
                      : <ChevronDown size={15} className="text-[#C8A97E] flex-shrink-0" />
                    }
                  </button>
                  <div className={cn(
                    "overflow-hidden transition-all duration-300",
                    openAccordion === acc.id ? "max-h-48 pb-5" : "max-h-0"
                  )}>
                    <p className="font-body text-sm font-300 text-[#1C1A17]/70 dark:text-[#F5F0E8]/70 leading-relaxed">
                      {acc.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-24 pt-16 border-t border-[#C8A97E]/20">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="font-accent text-xs tracking-[0.25em] uppercase text-[#C8A97E] mb-2">You May Also Like</p>
                <h2 className="font-display text-4xl font-light text-[#1C1A17] dark:text-[#F5F0E8]">Related Pieces</h2>
              </div>
            </div>
            <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4">
              {related.map(p => (
                <div key={p.id} className="min-w-[260px] flex-shrink-0">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Add to Cart bar */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 z-40 bg-[#F5F0E8] dark:bg-[#1C1A17] border-t border-[#C8A97E]/20 px-6 py-4 flex items-center gap-4 transition-transform duration-300",
        showStickyBar ? "translate-y-0" : "translate-y-full"
      )}>
        <div className="flex-1">
          <p className="font-body font-500 text-sm text-[#1C1A17] dark:text-[#F5F0E8] truncate">{product.name}</p>
          <p className="font-accent text-sm text-[#C8A97E]">{product.price.toLocaleString()} zł</p>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="flex items-center gap-2 px-8 py-3 bg-[#1C1A17] dark:bg-[#F5F0E8] text-[#F5F0E8] dark:text-[#1C1A17] font-body font-600 text-xs tracking-wider uppercase hover:bg-[#C8A97E] hover:text-[#1C1A17] transition-colors"
        >
          <ShoppingBag size={14} />
          Add to Cart
        </button>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-[#1C1A17]/95 flex items-center justify-center">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-[#F5F0E8]/70 hover:text-[#F5F0E8] transition-colors"
          >
            <X size={28} />
          </button>
          <button
            onClick={() => setSelectedImage(prev => (prev - 1 + images.length) % images.length)}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-[#F5F0E8]/70 hover:text-[#F5F0E8] transition-colors"
          >
            <ChevronLeft size={32} />
          </button>
          <img
            src={images[selectedImage]}
            alt={product.name}
            className="max-w-[85vw] max-h-[85vh] object-contain"
          />
          <button
            onClick={() => setSelectedImage(prev => (prev + 1) % images.length)}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-[#F5F0E8]/70 hover:text-[#F5F0E8] transition-colors"
          >
            <ChevronRight size={32} />
          </button>
          <div className="absolute bottom-6 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={cn("w-2 h-2 rounded-full transition-colors", i === selectedImage ? "bg-[#C8A97E]" : "bg-[#F5F0E8]/30")}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
