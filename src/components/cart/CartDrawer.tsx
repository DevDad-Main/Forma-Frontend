import { useEffect } from "react";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, cartTotal, updateQuantity, removeFromCart } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (cartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [cartOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-[80] bg-[#1C1A17]/40 backdrop-blur-[2px] transition-opacity duration-300",
          cartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed right-0 top-0 bottom-0 z-[90] w-full sm:w-[420px] bg-[#F5F0E8] dark:bg-[#1C1A17] flex flex-col",
          "transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          cartOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-[#C8A97E]/20">
          <div className="flex items-center gap-3">
            <ShoppingBag size={18} className="text-[#1C1A17] dark:text-[#F5F0E8]" />
            <span className="font-body font-500 text-[#1C1A17] dark:text-[#F5F0E8]">
              Your Cart {cart.length > 0 && <span className="text-[#C8A97E]">({cart.reduce((s, i) => s + i.quantity, 0)})</span>}
            </span>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="text-[#1C1A17]/60 dark:text-[#F5F0E8]/60 hover:text-[#1C1A17] dark:hover:text-[#F5F0E8] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-8 py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag size={40} className="text-[#C8A97E]/40" />
              <p className="font-display text-xl font-light text-[#1C1A17] dark:text-[#F5F0E8]">Your cart is empty</p>
              <p className="font-body text-sm text-[#1C1A17]/50 dark:text-[#F5F0E8]/50">Add pieces you love to get started.</p>
              <button
                onClick={() => { setCartOpen(false); navigate("/shop"); }}
                className="mt-2 font-body text-sm font-500 text-[#C8A97E] underline underline-offset-4 hover:text-[#1C1A17] dark:hover:text-[#F5F0E8] transition-colors"
              >
                Explore the shop
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              {cart.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.variant}`}
                  className={cn(
                    "flex gap-4 py-5",
                    idx < cart.length - 1 && "border-b border-[#C8A97E]/15"
                  )}
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <p className="font-body font-500 text-sm text-[#1C1A17] dark:text-[#F5F0E8] leading-tight">{item.product.name}</p>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-[#1C1A17]/30 dark:text-[#F5F0E8]/30 hover:text-[#1C1A17] dark:hover:text-[#F5F0E8] transition-colors flex-shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    {item.variant && (
                      <p className="font-accent text-xs text-[#1C1A17]/50 dark:text-[#F5F0E8]/50 mt-0.5">{item.variant}</p>
                    )}
                    <p className="font-accent text-xs text-[#1C1A17]/50 dark:text-[#F5F0E8]/50 mt-0.5">{item.product.material}</p>
                    <div className="flex items-center justify-between mt-3">
                      {/* Qty stepper */}
                      <div className="flex items-center border border-[#C8A97E]/30 rounded">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#1C1A17] dark:text-[#F5F0E8] hover:bg-[#EDE8DF] dark:hover:bg-[#2a2520] transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-7 text-center font-accent text-xs text-[#1C1A17] dark:text-[#F5F0E8]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#1C1A17] dark:text-[#F5F0E8] hover:bg-[#EDE8DF] dark:hover:bg-[#2a2520] transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <p className="font-accent text-sm font-500 text-[#1C1A17] dark:text-[#F5F0E8]">
                        ${(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer summary */}
        {cart.length > 0 && (
          <div className="px-8 py-6 border-t border-[#C8A97E]/20 space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-body text-sm text-[#1C1A17]/60 dark:text-[#F5F0E8]/60">Subtotal</span>
              <span className="font-accent font-500 text-[#1C1A17] dark:text-[#F5F0E8]">${cartTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-body text-sm text-[#1C1A17]/60 dark:text-[#F5F0E8]/60">Shipping</span>
              <span className="font-accent text-sm text-[#1C1A17]/60 dark:text-[#F5F0E8]/60">Calculated at checkout</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-[#C8A97E]/15">
              <span className="font-body font-600 text-[#1C1A17] dark:text-[#F5F0E8]">Total</span>
              <span className="font-accent font-600 text-lg text-[#1C1A17] dark:text-[#F5F0E8]">${cartTotal.toLocaleString()}</span>
            </div>
            <button
              onClick={() => { setCartOpen(false); navigate("/checkout"); }}
              className="w-full py-4 bg-[#1C1A17] dark:bg-[#F5F0E8] text-[#F5F0E8] dark:text-[#1C1A17] font-body font-600 text-sm tracking-wider uppercase hover:bg-[#2e2b27] dark:hover:bg-[#e8e3d8] transition-colors mt-2"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={() => setCartOpen(false)}
              className="w-full text-center font-body text-sm text-[#1C1A17]/50 dark:text-[#F5F0E8]/50 hover:text-[#1C1A17] dark:hover:text-[#F5F0E8] transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
