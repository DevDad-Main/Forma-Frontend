import { useState, useMemo, useEffect } from "react";
import { ChevronDown, ChevronUp, X, SlidersHorizontal, Filter } from "lucide-react";
import { Link } from "react-router-dom";
// import { products } from "@/data/products";
import { getProducts, type Product } from "@/lib/api";
import ProductCard from "@/components/products/ProductCard";
import { cn } from "@/lib/utils";

type SortOption = "newest" | "price-low" | "price-high" | "popular";

const categories = ["All", "Seating", "Tables", "Lighting", "Storage", "Textiles"];
const materials = ["Walnut", "Oak", "Marble", "Brass", "Linen", "Velvet", "Steel", "Wool"];
const colors = [
  { name: "Oat", hex: "#E8DFD0" },
  { name: "Cognac", hex: "#9B6942" },
  { name: "Stone", hex: "#D4CCBC" },
  { name: "Sage", hex: "#8FA68B" },
  { name: "Smoke", hex: "#6B6B6B" },
  { name: "Ivory", hex: "#F5F0E8" },
];

function SkeletonCard() {
  return (
    <div className="space-y-3">
      <div className="skeleton-shimmer aspect-[4/5] rounded" />
      <div className="skeleton-shimmer h-4 w-3/4 rounded" />
      <div className="skeleton-shimmer h-3 w-1/2 rounded" />
    </div>
  );
}

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 7000]);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filterOpen, setFilterOpen] = useState(false); // mobile
  const [sidebarSections, setSidebarSections] = useState({
    category: true, price: true, material: true, color: true
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data || []);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const toggleSection = (key: keyof typeof sidebarSections) => {
    setSidebarSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleMaterial = (m: string) =>
    setSelectedMaterials(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);

  const toggleColor = (c: string) =>
    setSelectedColors(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const activeFilters = [
    ...(selectedCategory !== "All" ? [{ label: selectedCategory, clear: () => setSelectedCategory("All") }] : []),
    ...selectedMaterials.map(m => ({ label: m, clear: () => toggleMaterial(m) })),
    ...selectedColors.map(c => ({ label: c, clear: () => toggleColor(c) })),
  ];

  const filtered = useMemo(() => {
    let list = [...products];
    if (selectedCategory !== "All") list = list.filter(p => p.category === selectedCategory);
    if (selectedMaterials.length) list = list.filter(p => selectedMaterials.some(m => p.material.toLowerCase().includes(m.toLowerCase())));
    if (selectedColors.length) list = list.filter(p => selectedColors.some(c => p.color.toLowerCase().includes(c.toLowerCase())));
    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    switch (sortBy) {
      case "price-low": return list.sort((a, b) => a.price - b.price);
      case "price-high": return list.sort((a, b) => b.price - a.price);
      case "popular": return list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
      default: return list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }
  }, [products, selectedCategory, selectedMaterials, selectedColors, priceRange, sortBy]);

  const FilterContent = () => (
    <div className="space-y-0">
      {/* Category */}
      <div className="border-b border-[#C8A97E]/20 py-5">
        <button
          onClick={() => toggleSection("category")}
          className="w-full flex items-center justify-between font-body text-sm font-500 text-[#1C1A17] dark:text-[#F5F0E8]"
        >
          Category {sidebarSections.category ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
        {sidebarSections.category && (
          <div className="mt-4 space-y-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "block font-body text-sm transition-colors",
                  selectedCategory === cat
                    ? "text-[#C8A97E] font-500"
                    : "text-[#1C1A17]/60 dark:text-[#F5F0E8]/60 hover:text-[#1C1A17] dark:hover:text-[#F5F0E8]"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price */}
      <div className="border-b border-[#C8A97E]/20 py-5">
        <button
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between font-body text-sm font-500 text-[#1C1A17] dark:text-[#F5F0E8]"
        >
          Price Range {sidebarSections.price ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
        {sidebarSections.price && (
          <div className="mt-4 space-y-3">
            <div className="flex justify-between font-accent text-xs text-[#1C1A17]/60 dark:text-[#F5F0E8]/60">
              <span>${priceRange[0].toLocaleString()}</span>
              <span>${priceRange[1].toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={0} max={7000} step={100}
              value={priceRange[1]}
              onChange={e => setPriceRange([priceRange[0], +e.target.value])}
              className="w-full accent-[#C8A97E]"
            />
          </div>
        )}
      </div>

      {/* Material */}
      <div className="border-b border-[#C8A97E]/20 py-5">
        <button
          onClick={() => toggleSection("material")}
          className="w-full flex items-center justify-between font-body text-sm font-500 text-[#1C1A17] dark:text-[#F5F0E8]"
        >
          Material {sidebarSections.material ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
        {sidebarSections.material && (
          <div className="mt-4 space-y-2">
            {materials.map(m => (
              <label key={m} className="flex items-center gap-2.5 cursor-pointer group">
                <div
                  onClick={() => toggleMaterial(m)}
                  className={cn(
                    "w-4 h-4 border rounded-sm flex items-center justify-center cursor-pointer transition-colors",
                    selectedMaterials.includes(m)
                      ? "bg-[#C8A97E] border-[#C8A97E]"
                      : "border-[#C8A97E]/40 group-hover:border-[#C8A97E]"
                  )}
                >
                  {selectedMaterials.includes(m) && <span className="text-[#1C1A17] text-[10px]">✓</span>}
                </div>
                <span className="font-body text-sm text-[#1C1A17]/70 dark:text-[#F5F0E8]/70 group-hover:text-[#1C1A17] dark:group-hover:text-[#F5F0E8] transition-colors">
                  {m}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Color */}
      <div className="py-5">
        <button
          onClick={() => toggleSection("color")}
          className="w-full flex items-center justify-between font-body text-sm font-500 text-[#1C1A17] dark:text-[#F5F0E8]"
        >
          Color {sidebarSections.color ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
        {sidebarSections.color && (
          <div className="mt-4 flex flex-wrap gap-3">
            {colors.map(c => (
              <button
                key={c.name}
                title={c.name}
                onClick={() => toggleColor(c.name)}
                className={cn(
                  "w-8 h-8 rounded-full border-2 transition-all duration-200",
                  selectedColors.includes(c.name)
                    ? "border-[#C8A97E] scale-110"
                    : "border-transparent hover:border-[#C8A97E]/50"
                )}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-[#F5F0E8] dark:bg-[#1C1A17] min-h-screen pt-16">
      {/* Page header */}
      <div className="px-6 md:px-16 py-14 max-w-[1440px] mx-auto border-b border-[#C8A97E]/20">
        <div className="flex items-center gap-2 mb-4 font-accent text-xs text-[#1C1A17]/50 dark:text-[#F5F0E8]/50">
          <Link to="/" className="hover:text-[#C8A97E] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#1C1A17] dark:text-[#F5F0E8]">Shop</span>
        </div>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-6xl md:text-7xl font-light text-[#1C1A17] dark:text-[#F5F0E8]">
              {selectedCategory === "All" ? "All Pieces" : selectedCategory}
            </h1>
            <p className="font-accent text-sm text-[#1C1A17]/50 dark:text-[#F5F0E8]/50 mt-2">
              {filtered.length} {filtered.length === 1 ? "item" : "items"}
            </p>
          </div>
          {/* Desktop sort */}
          <div className="hidden md:flex items-center gap-3">
            <span className="font-accent text-xs text-[#1C1A17]/50 dark:text-[#F5F0E8]/50">Sort by</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortOption)}
              className="font-accent text-sm bg-transparent border border-[#C8A97E]/30 px-3 py-2 text-[#1C1A17] dark:text-[#F5F0E8] outline-none hover:border-[#C8A97E] transition-colors cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {activeFilters.map((f, i) => (
              <span
                key={i}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1C1A17] dark:bg-[#F5F0E8] text-[#F5F0E8] dark:text-[#1C1A17] font-accent text-xs rounded-full"
              >
                {f.label}
                <button onClick={f.clear}><X size={12} /></button>
              </span>
            ))}
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedMaterials([]);
                setSelectedColors([]);
                setPriceRange([0, 7000]);
              }}
              className="font-accent text-xs text-[#1C1A17]/50 dark:text-[#F5F0E8]/50 hover:text-[#C8A97E] transition-colors underline underline-offset-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      <div className="max-w-[1440px] mx-auto flex">
        {/* Sidebar - desktop */}
        <aside className="hidden md:block w-[240px] flex-shrink-0 px-8 pt-8 border-r border-[#C8A97E]/20 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
          <p className="font-accent text-xs tracking-[0.2em] uppercase text-[#C8A97E] mb-6">Filters</p>
          <FilterContent />
        </aside>

        {/* Product grid */}
        <main className="flex-1 px-6 md:px-10 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{ animationDelay: `${i * 50}ms` }} className="fade-in-up">
                  <SkeletonCard />
                </div>
              ))
            ) : (
              filtered.map((product, i) => (
                <div
                  key={product.id}
                  style={{ animationDelay: `${i * 50}ms` }}
                  className="fade-in-up"
                >
                  <ProductCard product={product} />
                </div>
              ))
            )}
          </div>

          {!loading && filtered.length === 0 && (
            <div className="py-24 text-center">
              <p className="font-display text-3xl font-light text-[#1C1A17] dark:text-[#F5F0E8] mb-3">No pieces found</p>
              <p className="font-body text-sm text-[#1C1A17]/50 dark:text-[#F5F0E8]/50">Try adjusting your filters.</p>
            </div>
          )}
        </main>
      </div>

      {/* Mobile filter bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F5F0E8] dark:bg-[#1C1A17] border-t border-[#C8A97E]/20 px-6 py-3 flex gap-3">
        <button
          onClick={() => setFilterOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 py-3 border border-[#1C1A17] dark:border-[#F5F0E8] font-body text-sm font-500 text-[#1C1A17] dark:text-[#F5F0E8]"
        >
          <Filter size={15} /> Filter & Sort
        </button>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as SortOption)}
          className="flex-1 font-accent text-sm bg-[#1C1A17] dark:bg-[#F5F0E8] text-[#F5F0E8] dark:text-[#1C1A17] border-none px-3 outline-none"
        >
          <option value="newest">Newest</option>
          <option value="popular">Popular</option>
          <option value="price-low">Price ↑</option>
          <option value="price-high">Price ↓</option>
        </select>
      </div>

      {/* Mobile filter drawer */}
      {filterOpen && (
        <div className="md:hidden fixed inset-0 z-[80]">
          <div className="absolute inset-0 bg-[#1C1A17]/30" onClick={() => setFilterOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-[#F5F0E8] dark:bg-[#1C1A17] rounded-t-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#C8A97E]/20">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-[#C8A97E]" />
                <span className="font-body font-500 text-[#1C1A17] dark:text-[#F5F0E8]">Filters</span>
              </div>
              <button onClick={() => setFilterOpen(false)}>
                <X size={20} className="text-[#1C1A17] dark:text-[#F5F0E8]" />
              </button>
            </div>
            <div className="px-6 pb-24">
              <FilterContent />
            </div>
            <div className="fixed bottom-0 left-0 right-0 px-6 py-4 bg-[#F5F0E8] dark:bg-[#1C1A17] border-t border-[#C8A97E]/20">
              <button
                onClick={() => setFilterOpen(false)}
                className="w-full py-4 bg-[#1C1A17] dark:bg-[#F5F0E8] text-[#F5F0E8] dark:text-[#1C1A17] font-body font-600 text-sm tracking-wider uppercase"
              >
                View {filtered.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
