import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, ChevronRight, Lock } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { cn } from "@/lib/utils";
import StripeProviderWrapper from "@/components/payment/StripeProvider";
import StripePaymentForm from "@/components/payment/StripePaymentForm";
import { useAuth } from "@/context/AuthContext";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}

function InputField({ label, value, onChange, type = "text", placeholder = "", disabled = false }: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-accent text-xs font-500 tracking-wide text-[#1C1A17]/60 dark:text-[#F5F0E8]/60">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "h-12 px-4 bg-[#EDE8DF] dark:bg-[#252220] border border-[#C8A97E]/20 focus:border-[#C8A97E] outline-none font-body text-sm text-[#1C1A17] dark:text-[#F5F0E8] placeholder-[#1C1A17]/30 dark:placeholder-[#F5F0E8]/30 transition-colors",
          disabled && "opacity-50 cursor-not-allowed bg-[#EDE8DF]/50 dark:bg-[#252220]/50"
        )}
      />
    </div>
  );
}

type Step = "info" | "shipping" | "payment";

export default function CheckoutPage() {
  const { cart, cartTotal, removeFromCart, setCart } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("info");
  const [completed, setCompleted] = useState(false);
  const [promoOpen, setPromoOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState(false);

  const steps: { id: Step; label: string }[] = [
    { id: "info", label: "Information" },
    { id: "shipping", label: "Shipping" },
    { id: "payment", label: "Payment" },
  ];
  const stepIndex = steps.findIndex(s => s.id === step);

  const { user } = useAuth();
  const [useDefaultAddress, setUseDefaultAddress] = useState(true);
  const [useUserInfo, setUseUserInfo] = useState(true);

  const [form, setForm] = useState({
    email: useUserInfo ? (user?.email || "") : "",
    firstName: useUserInfo ? (user?.firstName || "") : "",
    lastName: useUserInfo ? (user?.lastName || "") : "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
    shipping: "standard",
  });

  useEffect(() => {
    if (user && useDefaultAddress && user.address) {
      setForm(prev => ({
        ...prev,
        address: user.address.street || "",
        city: user.address.city || "",
        state: user.address.state || "",
        zip: user.address.zipCode || "",
        country: user.address.country || "United States",
      }));
    }
  }, [user, useDefaultAddress]);

  useEffect(() => {
    if (user && useUserInfo) {
      setForm(prev => ({
        ...prev,
        email: user.email || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      }));
    }
  }, [user, useUserInfo]);

  const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const shippingOptions = [
    { id: "standard", label: "Standard (4–6 weeks)", price: 0, note: "Free on orders over 2,000 zł" },
    { id: "express", label: "Express (2–3 weeks)", price: 180 },
    { id: "white-glove", label: "White Glove Delivery", price: 350, note: "Includes assembly" },
  ];

  const shippingCost = cartTotal >= 2000
    ? 0
    : (shippingOptions.find(s => s.id === form.shipping)?.price || 0);

  const discount = promoApplied ? cartTotal * 0.1 : 0;
  const total = cartTotal + shippingCost - discount;

  const shippingAddress = useMemo(() => ({
    street: form.address,
    city: form.city,
    state: form.state,
    zipCode: form.zip,
    country: form.country,
  }), [form.address, form.city, form.state, form.zip, form.country]);

  const handlePromo = () => {
    if (promoCode.toLowerCase() === "forma10") {
      setPromoApplied(true);
      setPromoError(false);
    } else {
      setPromoError(true);
      setPromoApplied(false);
    }
  };

  const handleNext = () => {
    if (step === "info") setStep("shipping");
    else if (step === "shipping") setStep("payment");
  };

  const handlePaymentSuccess = () => {
    setCompleted(true);
  };

  const handlePaymentError = (message: string) => {
    console.error("Payment error:", message);
  };

  if (cart.length === 0 && !completed && step !== "payment") {
    navigate("/shop");
    return null;
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] dark:bg-[#1C1A17] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[#C8A97E]/20 flex items-center justify-center mb-8">
          <Check size={28} className="text-[#C8A97E]" />
        </div>
        <h1 className="font-display text-5xl font-light text-[#1C1A17] dark:text-[#F5F0E8] mb-4">
          Thank you
        </h1>
        <p className="font-body text-base text-[#1C1A17]/60 dark:text-[#F5F0E8]/60 max-w-sm mb-10 leading-relaxed">
          Your order has been confirmed. We'll be in touch with delivery updates.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-10 py-4 bg-[#1C1A17] dark:bg-[#F5F0E8] text-[#F5F0E8] dark:text-[#1C1A17] font-body font-600 text-sm tracking-wider uppercase hover:bg-[#C8A97E] hover:text-[#1C1A17] transition-colors"
        >
          Continue Exploring
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] dark:bg-[#1C1A17]">
      {/* Minimal header */}
      <header className="border-b border-[#C8A97E]/20 px-6 md:px-16 h-16 flex items-center justify-between max-w-[1440px] mx-auto">
        <Link to="/" className="font-display text-2xl font-light tracking-[0.12em] text-[#1C1A17] dark:text-[#F5F0E8]">
          Forma
        </Link>
        <div className="flex items-center gap-1 font-accent text-xs text-[#1C1A17]/50 dark:text-[#F5F0E8]/50">
          <Lock size={12} className="text-[#C8A97E]" />
          Secure Checkout
        </div>
      </header>

      {/* Progress */}
      <div className="border-b border-[#C8A97E]/20 px-6 py-5">
        <div className="max-w-[700px] mx-auto flex items-center justify-center gap-2">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={cn(
                "flex items-center gap-2 font-accent text-xs tracking-wide",
                i <= stepIndex ? "text-[#1C1A17] dark:text-[#F5F0E8]" : "text-[#1C1A17]/40 dark:text-[#F5F0E8]/40"
              )}>
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-600",
                  i < stepIndex ? "bg-[#C8A97E] text-[#1C1A17]" :
                  i === stepIndex ? "bg-[#1C1A17] dark:bg-[#F5F0E8] text-[#F5F0E8] dark:text-[#1C1A17]" :
                  "bg-[#1C1A17]/10 dark:bg-[#F5F0E8]/10 text-[#1C1A17]/50 dark:text-[#F5F0E8]/50"
                )}>
                  {i < stepIndex ? <Check size={10} /> : i + 1}
                </div>
                {s.label}
              </div>
              {i < steps.length - 1 && (
                <ChevronRight size={12} className="text-[#1C1A17]/30 dark:text-[#F5F0E8]/30" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-10 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">

         {/* Left: Form */}
        <div>
          <div className="bg-[#EDE8DF]/40 dark:bg-[#252220]/40 border border-[#C8A97E]/15 p-8 space-y-6">

            {step === "info" && (
              <>
                <h2 className="font-display text-3xl font-light text-[#1C1A17] dark:text-[#F5F0E8]">Contact Information</h2>

                {user && (
                  <div className="mb-6 p-4 bg-[#C8A97E]/10 border border-[#C8A97E]/20">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useUserInfo}
                        onChange={e => setUseUserInfo(e.target.checked)}
                        className="mt-1 w-4 h-4 accent-[#C8A97E]"
                      />
                      <div>
                        <p className="font-body text-sm font-500 text-[#1C1A17] dark:text-[#F5F0E8]">Use default profile information</p>
                        <p className="font-accent text-xs text-[#1C1A17]/60 dark:text-[#F5F0E8]/60 mt-1">
                          {user.email} • {user.firstName} {user.lastName}
                        </p>
                      </div>
                    </label>
                  </div>
                )}

                {!useUserInfo && (
                  <div className="mb-4 p-3 bg-[#1C1A17]/5 dark:bg-[#F5F0E8]/5 border border-[#C8A97E]/20">
                    <p className="font-accent text-xs text-[#1C1A17]/60 dark:text-[#F5F0E8]/60">
                      Enter different contact information for this order
                    </p>
                  </div>
                )}

                <InputField label="Email Address" value={form.email} onChange={v => update("email", v)} type="email" placeholder="hello@example.com" disabled={useUserInfo && !!user?.email} />
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="First Name" value={form.firstName} onChange={v => update("firstName", v)} disabled={useUserInfo && !!user?.firstName} />
                  <InputField label="Last Name" value={form.lastName} onChange={v => update("lastName", v)} disabled={useUserInfo && !!user?.lastName} />
                </div>
                <button
                  onClick={handleNext}
                  className="w-full py-4 mt-4 bg-[#1C1A17] dark:bg-[#F5F0E8] text-[#F5F0E8] dark:text-[#1C1A17] font-body font-600 text-sm tracking-wider uppercase hover:bg-[#C8A97E] hover:text-[#1C1A17] transition-colors"
                >
                  Continue
                </button>
              </>
            )}

            {step === "shipping" && (
              <>
                <h2 className="font-display text-3xl font-light text-[#1C1A17] dark:text-[#F5F0E8]">Shipping Address</h2>

                {user?.address && (
                  <div className="mb-6 p-4 bg-[#C8A97E]/10 border border-[#C8A97E]/20">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useDefaultAddress}
                        onChange={e => setUseDefaultAddress(e.target.checked)}
                        className="mt-1 w-4 h-4 accent-[#C8A97E]"
                      />
                      <div>
                        <p className="font-body text-sm font-500 text-[#1C1A17] dark:text-[#F5F0E8]">Use default shipping address</p>
                        <p className="font-accent text-xs text-[#1C1A17]/60 dark:text-[#F5F0E8]/60 mt-1">
                          {user.address.street}, {user.address.city}, {user.address.state} {user.address.zipCode}
                        </p>
                      </div>
                    </label>
                  </div>
                )}

                {!useDefaultAddress && (
                  <div className="mb-4 p-3 bg-[#1C1A17]/5 dark:bg-[#F5F0E8]/5 border border-[#C8A97E]/20">
                    <p className="font-accent text-xs text-[#1C1A17]/60 dark:text-[#F5F0E8]/60">
                      Enter a different shipping address for this order
                    </p>
                  </div>
                )}

                <InputField label="Street Address" value={form.address} onChange={v => update("address", v)} placeholder="123 Main Street" disabled={useDefaultAddress && !!user?.address?.street} />
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="City" value={form.city} onChange={v => update("city", v)} disabled={useDefaultAddress && !!user?.address?.city} />
                  <InputField label="State / Province" value={form.state} onChange={v => update("state", v)} disabled={useDefaultAddress && !!user?.address?.state} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="ZIP / Postal Code" value={form.zip} onChange={v => update("zip", v)} disabled={useDefaultAddress && !!user?.address?.zipCode} />
                  <InputField label="Country" value={form.country} onChange={v => update("country", v)} disabled={useDefaultAddress && !!user?.address?.country} />
                </div>

                {/* Shipping method */}
                <div className="mt-8">
                  <h3 className="font-body text-sm font-500 text-[#1C1A17] dark:text-[#F5F0E8] mb-4">Shipping Method</h3>
                  <div className="space-y-3">
                    {shippingOptions.map(opt => (
                      <label key={opt.id} className="flex items-start gap-3 p-4 border border-[#C8A97E]/20 cursor-pointer hover:border-[#C8A97E]/40 transition-colors">
                        <div className={cn(
                          "w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 transition-all",
                          form.shipping === opt.id
                            ? "border-[#C8A97E] bg-[#C8A97E]"
                            : "border-[#C8A97E]/40"
                        )}>
                          <input
                            type="radio"
                            value={opt.id}
                            checked={form.shipping === opt.id}
                            onChange={() => update("shipping", opt.id)}
                            className="sr-only"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="font-body text-sm font-500 text-[#1C1A17] dark:text-[#F5F0E8]">{opt.label}</span>
                            <span className="font-accent text-sm text-[#C8A97E]">
                              {opt.price === 0 ? "Free" : `${opt.price} zł`}
                            </span>
                          </div>
                          {opt.note && <p className="font-body text-xs text-[#1C1A17]/50 dark:text-[#F5F0E8]/50 mt-0.5">{opt.note}</p>}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleNext}
                  className="w-full py-4 mt-4 bg-[#1C1A17] dark:bg-[#F5F0E8] text-[#F5F0E8] dark:text-[#1C1A17] font-body font-600 text-sm tracking-wider uppercase hover:bg-[#C8A97E] hover:text-[#1C1A17] transition-colors"
                >
                  Continue
                </button>
              </>
            )}

            {step === "payment" && (
              <StripeProviderWrapper 
                amount={total}
                shippingAddress={shippingAddress}
              >
                {({ clientSecret }) => (
                  <>
                    <h2 className="font-display text-3xl font-light text-[#1C1A17] dark:text-[#F5F0E8]">Payment</h2>
                    {clientSecret && (
                      <StripePaymentForm
                        amount={total}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                      />
                    )}
                  </>
                )}
              </StripeProviderWrapper>
            )}
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:sticky lg:top-8 self-start">
          <div className="bg-[#EDE8DF]/40 dark:bg-[#252220]/40 border border-[#C8A97E]/15 p-6">
            <h3 className="font-body font-500 text-[#1C1A17] dark:text-[#F5F0E8] mb-6">Order Summary</h3>

            <div className="space-y-4 mb-6">
              {cart.map(item => (
                <div key={item.product.id} className="flex gap-3">
                  <div className="relative">
                    <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover" />
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#1C1A17] dark:bg-[#F5F0E8] text-[#F5F0E8] dark:text-[#1C1A17] text-[10px] rounded-full flex items-center justify-center font-accent">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-body text-sm font-500 text-[#1C1A17] dark:text-[#F5F0E8] leading-tight">{item.product.name}</p>
                    <p className="font-accent text-xs text-[#1C1A17]/50 dark:text-[#F5F0E8]/50">{item.product.material}</p>
                  </div>
                  <p className="font-accent text-sm text-[#1C1A17] dark:text-[#F5F0E8]">
                    {(item.product.price * item.quantity).toLocaleString()} zł
                  </p>
                </div>
              ))}
            </div>

            <hr className="divider-gold border-t mb-4" />

            {/* Promo */}
            <div className="mb-4">
              <button
                onClick={() => setPromoOpen(!promoOpen)}
                className="font-body text-xs text-[#C8A97E] underline underline-offset-2 hover:text-[#1C1A17] dark:hover:text-[#F5F0E8] transition-colors"
              >
                {promoOpen ? "Hide promo code" : "Have a promo code?"}
              </button>
              {promoOpen && (
                <div className="flex gap-2 mt-3">
                  <input
                    value={promoCode}
                    onChange={e => { setPromoCode(e.target.value); setPromoError(false); }}
                    placeholder="Enter code"
                    className="flex-1 h-9 px-3 bg-[#F5F0E8] dark:bg-[#1C1A17] border border-[#C8A97E]/30 font-accent text-xs text-[#1C1A17] dark:text-[#F5F0E8] placeholder-[#1C1A17]/30 dark:placeholder-[#F5F0E8]/30 outline-none"
                  />
                  <button
                    onClick={handlePromo}
                    className="px-4 h-9 bg-[#1C1A17] dark:bg-[#F5F0E8] text-[#F5F0E8] dark:text-[#1C1A17] font-accent text-xs hover:bg-[#C8A97E] hover:text-[#1C1A17] transition-colors"
                  >
                    Apply
                  </button>
                </div>
              )}
              {promoApplied && (
                <p className="font-accent text-xs text-green-600 mt-1 flex items-center gap-1">
                  <Check size={11} /> Code applied — 10% off
                </p>
              )}
              {promoError && (
                <p className="font-accent text-xs text-red-500 mt-1">Invalid code. Try "FORMA10"</p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between font-accent text-sm text-[#1C1A17]/60 dark:text-[#F5F0E8]/60">
                <span>Subtotal</span>
                <span>{cartTotal.toLocaleString()} zł</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between font-accent text-sm text-green-600">
                  <span>Discount (10%)</span>
                  <span>–{discount.toFixed(0)} zł</span>
                </div>
              )}
              <div className="flex justify-between font-accent text-sm text-[#1C1A17]/60 dark:text-[#F5F0E8]/60">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? "Free" : `${shippingCost} zł`}</span>
              </div>
              <hr className="divider-gold border-t" />
              <div className="flex justify-between font-accent font-600 text-base text-[#1C1A17] dark:text-[#F5F0E8]">
                <span>Total</span>
                <span>{total.toLocaleString()} zł</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
