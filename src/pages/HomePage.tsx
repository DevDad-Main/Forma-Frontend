import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ChevronDown, ArrowUpRight } from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useStore } from "@/context/StoreContext";
// import { products, collections } from "@/data/products";
import { getProducts, type Product } from "@/lib/api";
import ProductCard from "@/components/products/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

// const bestSellers = products.filter(p => p.isBestSeller);
// const newArrivals = products.filter(p => p.isNew);
import { collections } from "@/data/products";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function AnimSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className || ""}`}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { addToCart } = useStore();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const autoplayPlugin = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true, stopOnMouseEnter: true })
  );
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroYRaw = useTransform(scrollYProgress, [0, 1], [0, 0.4]);
  const heroYSpring = useSpring(heroYRaw, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const heroY = useTransform(heroYSpring, (v) => `${v * 100}%`);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data || []);
      } catch (error) {
        console.error("Failed to load products", error);
      }
    };
    loadProducts();
  }, []);

  const bestSellers = products.filter(p => p.isBestSeller);
  const newArrivals = products.filter(p => p.isNew);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(""); }
  };

  return (
    <div className="bg-[#F5F0E8] dark:bg-[#1C1A17] min-h-screen">

      {/* ─── HERO ─── */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1600&q=85"
            alt="Forma — Luxury Furniture"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1C1A17]/20 via-transparent to-[#1C1A17]/50" />
        </motion.div>

        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <p className="fade-in-1 font-accent text-xs tracking-[0.3em] uppercase text-[#F5F0E8]/70 mb-6">
            New Collection 2025
          </p>
          <h1 className="fade-in-2 font-display text-[72px] sm:text-[100px] md:text-[120px] font-light leading-none tracking-tight text-[#F5F0E8] max-w-4xl">
            Live with
            <span className="italic font-light text-[#C8A97E]"> intention</span>
          </h1>
          <p className="fade-in-3 font-body text-lg sm:text-xl font-300 text-[#F5F0E8]/75 mt-6 max-w-md leading-relaxed">
            Furniture for the thoughtfully designed home.
          </p>
          <div className="fade-in-4 mt-10 flex items-center gap-6">
            <Link
              to="/shop"
              className="flex items-center gap-3 px-10 py-4 bg-[#F5F0E8] text-[#1C1A17] font-body font-600 text-sm tracking-wider uppercase hover:bg-[#C8A97E] transition-colors duration-300"
            >
              Explore Shop
              <ArrowRight size={15} />
            </Link>
            <a href="#collections" className="font-body text-sm text-[#F5F0E8]/70 hover:text-[#F5F0E8] transition-colors underline underline-offset-4">
              View Collections
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <ChevronDown size={20} className="text-[#F5F0E8]/60" />
        </div>
      </section>

      {/* ─── COLLECTIONS ─── */}
      <section id="collections" className="py-24 md:py-32 px-6 md:px-16 max-w-[1440px] mx-auto">
        <AnimSection>
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="font-accent text-xs tracking-[0.25em] uppercase text-[#C8A97E] mb-3">Collections</p>
              <h2 className="font-display text-5xl md:text-6xl font-light text-[#1C1A17] dark:text-[#F5F0E8]">
                Curated spaces
              </h2>
            </div>
            <Link
              to="/shop"
              className="hidden md:flex items-center gap-2 font-body text-sm text-[#1C1A17] dark:text-[#F5F0E8] hover:text-[#C8A97E] dark:hover:text-[#C8A97E] transition-colors underline underline-offset-4"
            >
              View all <ArrowUpRight size={14} />
            </Link>
          </div>
        </AnimSection>

        {/* Asymmetric grid */}
        <AnimSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Large left card */}
            <Link to="/shop" className="group relative overflow-hidden aspect-[4/5] md:aspect-auto md:row-span-2">
              <img
                src={collections[0].image}
                alt={collections[0].name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#1C1A17]/20 group-hover:bg-[#1C1A17]/40 transition-colors duration-300" />
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <p className="font-accent text-xs tracking-[0.25em] uppercase text-[#F5F0E8]/70 mb-2">
                  {collections[0].subtitle}
                </p>
                <h3 className="font-display text-5xl font-light text-[#F5F0E8]">{collections[0].name}</h3>
                <span className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 font-body text-sm text-[#C8A97E]">
                  Explore <ArrowRight size={14} />
                </span>
              </div>
            </Link>

            {/* Right stacked */}
            {collections.slice(1).map(col => (
              <Link key={col.id} to="/shop" className="group relative overflow-hidden aspect-[3/2]">
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[#1C1A17]/20 group-hover:bg-[#1C1A17]/40 transition-colors duration-300" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <p className="font-accent text-xs tracking-[0.25em] uppercase text-[#F5F0E8]/70 mb-1">
                    {col.subtitle}
                  </p>
                  <h3 className="font-display text-3xl font-light text-[#F5F0E8]">{col.name}</h3>
                  <span className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 font-body text-sm text-[#C8A97E]">
                    Explore <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </AnimSection>
      </section>

      {/* Divider */}
      <hr className="divider-gold border-t max-w-[1440px] mx-auto px-16" />

      {/* ─── BEST SELLERS ─── */}
      <section className="py-16 md:py-20">
        <AnimSection className="px-6 md:px-16 max-w-[1440px] mx-auto mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-accent text-[11px] tracking-[0.2em] uppercase text-[#C8A97E] mb-2">Best Sellers</p>
              <h2 className="font-display text-3xl md:text-4xl font-light text-[#1C1A17] dark:text-[#F5F0E8]">
                Most loved
              </h2>
            </div>
          </div>
        </AnimSection>

        <div className="px-6 md:px-16 max-w-[1440px] mx-auto relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[autoplayPlugin.current]}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {bestSellers.concat(products.slice(0, 4)).map((product, i) => (
                <CarouselItem key={`${product.id}-${i}`} className="pl-4 basis-[260px] md:basis-[300px]">
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:flex items-center gap-2 absolute -top-14 right-16">
              <CarouselPrevious className="relative -left-0 top-0 translate-y-0 h-9 w-9 rounded-full border-[#C8A97E]/30 hover:border-[#C8A97E] hover:bg-transparent" />
              <CarouselNext className="relative -right-0 top-0 translate-y-0 h-9 w-9 rounded-full border-[#C8A97E]/30 hover:border-[#C8A97E] hover:bg-transparent" />
            </div>
          </Carousel>
        </div>

        <div className="px-6 md:px-16 max-w-[1440px] mx-auto mt-6 md:hidden">
          <Link
            to="/shop"
            className="flex items-center gap-2 font-body text-sm text-[#1C1A17] dark:text-[#F5F0E8] hover:text-[#C8A97E] dark:hover:text-[#C8A97E] transition-colors"
          >
            Shop all <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>

      {/* Divider */}
      <hr className="divider-gold border-t max-w-[1440px] mx-auto px-16" />

      {/* ─── BRAND STORY ─── */}
      <section className="py-24 md:py-32 px-6 md:px-16 max-w-[1440px] mx-auto">
        <AnimSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <p className="font-accent text-xs tracking-[0.25em] uppercase text-[#C8A97E] mb-8">Our Philosophy</p>
              <blockquote className="font-display text-4xl md:text-5xl font-light italic text-[#1C1A17] dark:text-[#F5F0E8] leading-tight mb-8">
                "We design for the long arc of a life well lived."
              </blockquote>
              <hr className="divider-gold border-t mb-8" />
              <p className="font-body text-base font-300 text-[#1C1A17]/70 dark:text-[#F5F0E8]/70 leading-relaxed max-w-md">
                Forma was founded on a simple belief: that the objects we surround ourselves with shape how we feel, think, and connect. Every piece in our collection is chosen for its honesty of material, integrity of craft, and ability to grow more beautiful with time and use.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 mt-10 font-body text-sm font-500 text-[#1C1A17] dark:text-[#F5F0E8] hover:text-[#C8A97E] dark:hover:text-[#C8A97E] transition-colors underline underline-offset-4"
              >
                Read our story <ArrowUpRight size={14} />
              </Link>
            </div>
            <div className="order-1 md:order-2 relative">
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80"
                alt="Forma craftsmanship"
                className="w-full aspect-[4/5] object-cover"
              />
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-[#EDE8DF] dark:bg-[#252220] hidden md:block" />
            </div>
          </div>
        </AnimSection>
      </section>

      {/* Divider */}
      <hr className="divider-gold border-t max-w-[1440px] mx-auto px-16" />

      {/* ─── NEW ARRIVALS ─── */}
      <section className="py-24 md:py-32 px-6 md:px-16 max-w-[1440px] mx-auto">
        <AnimSection className="mb-12">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-accent text-xs tracking-[0.25em] uppercase text-[#C8A97E] mb-3">New Arrivals</p>
              <h2 className="font-display text-5xl md:text-6xl font-light text-[#1C1A17] dark:text-[#F5F0E8]">
                Just arrived
              </h2>
            </div>
          </div>
        </AnimSection>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {newArrivals.concat(products.slice(6, 8)).map((product, i) => (
            <AnimSection key={`${product.id}-new-${i}`}>
              <ProductCard product={product} />
            </AnimSection>
          ))}
        </div>
      </section>

      {/* ─── NEWSLETTER ─── */}
      <section className="bg-[#EDE8DF] dark:bg-[#252220] py-20 px-6">
        <AnimSection className="max-w-2xl mx-auto text-center">
          <p className="font-accent text-xs tracking-[0.3em] uppercase text-[#C8A97E] mb-4">Stay in the know</p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-[#1C1A17] dark:text-[#F5F0E8] mb-4">
            New pieces, early access
          </h2>
          <p className="font-body text-sm font-300 text-[#1C1A17]/60 dark:text-[#F5F0E8]/60 mb-10">
            Join the Forma circle for first access to new collections and design stories.
          </p>
          {subscribed ? (
            <div className="flex items-center justify-center gap-2 text-[#C8A97E] font-body">
              <span className="text-xl">✓</span>
              <span>You're in. Thank you.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex items-center gap-0 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 h-12 px-5 bg-[#F5F0E8] dark:bg-[#1C1A17] border border-[#C8A97E]/30 text-[#1C1A17] dark:text-[#F5F0E8] font-body text-sm placeholder-[#1C1A17]/40 dark:placeholder-[#F5F0E8]/40 outline-none focus:border-[#C8A97E] transition-colors"
              />
              <button
                type="submit"
                className="h-12 px-6 bg-[#1C1A17] dark:bg-[#F5F0E8] text-[#F5F0E8] dark:text-[#1C1A17] font-body text-sm font-600 hover:bg-[#C8A97E] hover:text-[#1C1A17] transition-colors flex items-center gap-2"
              >
                <ArrowRight size={16} />
              </button>
            </form>
          )}
        </AnimSection>
      </section>

    </div>
  );
}
