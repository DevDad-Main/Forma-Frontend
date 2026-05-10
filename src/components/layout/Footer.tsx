import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export default function Footer() {
  const { darkMode, toggleDarkMode } = useStore();

  return (
    <footer className="bg-[#1C1A17] dark:bg-[#0f0e0c] text-[#F5F0E8] py-16 px-8 lg:px-16">
      <div className="max-w-[1440px] mx-auto">
        {/* Top */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-12 border-b border-[#F5F0E8]/10">
          <div className="col-span-2 md:col-span-1">
            <p className="font-display text-3xl font-light tracking-[0.12em] mb-4">Forma</p>
            <p className="font-body text-sm font-light text-[#F5F0E8]/60 leading-relaxed max-w-[220px]">
              Furniture for people who care about how they live.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="text-[#F5F0E8]/50 hover:text-[#C8A97E] transition-colors"><Instagram size={17} /></a>
              <a href="#" className="text-[#F5F0E8]/50 hover:text-[#C8A97E] transition-colors"><Twitter size={17} /></a>
              <a href="#" className="text-[#F5F0E8]/50 hover:text-[#C8A97E] transition-colors"><Facebook size={17} /></a>
            </div>
          </div>

          <div>
            <p className="font-accent text-xs font-500 tracking-[0.15em] uppercase text-[#C8A97E] mb-5">Shop</p>
            <ul className="space-y-3">
              {["Seating", "Tables", "Lighting", "Storage", "Textiles"].map(cat => (
                <li key={cat}>
                  <Link to="/shop" className="font-body text-sm text-[#F5F0E8]/60 hover:text-[#F5F0E8] transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-accent text-xs font-500 tracking-[0.15em] uppercase text-[#C8A97E] mb-5">Company</p>
            <ul className="space-y-3">
              {["About", "Sustainability", "Press", "Careers", "Contact"].map(item => (
                <li key={item}>
                  {item === "About" ? (
                    <Link to="/about" className="font-body text-sm text-[#F5F0E8]/60 hover:text-[#F5F0E8] transition-colors">
                      {item}
                    </Link>
                  ) : (
                    <a href="#" className="font-body text-sm text-[#F5F0E8]/60 hover:text-[#F5F0E8] transition-colors">
                      {item}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-accent text-xs font-500 tracking-[0.15em] uppercase text-[#C8A97E] mb-5">Support</p>
            <ul className="space-y-3">
              {["Shipping & Returns", "Care Guide", "FAQ", "Trade Program", "Showrooms"].map(item => (
                <li key={item}>
                  <a href="#" className="font-body text-sm text-[#F5F0E8]/60 hover:text-[#F5F0E8] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-accent text-xs text-[#F5F0E8]/40">
            © {new Date().getFullYear()} Forma. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="font-accent text-xs text-[#F5F0E8]/40 hover:text-[#F5F0E8]/70 transition-colors">Privacy Policy</a>
            <a href="#" className="font-accent text-xs text-[#F5F0E8]/40 hover:text-[#F5F0E8]/70 transition-colors">Terms of Service</a>
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-2 font-accent text-xs text-[#F5F0E8]/50 hover:text-[#C8A97E] transition-colors"
            >
              <span className="w-8 h-4 rounded-full border border-[#F5F0E8]/20 relative flex items-center px-0.5">
                <span className={`w-3 h-3 rounded-full transition-all duration-300 ${darkMode ? 'bg-[#C8A97E] ml-auto' : 'bg-[#F5F0E8]/50'}`} />
              </span>
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
