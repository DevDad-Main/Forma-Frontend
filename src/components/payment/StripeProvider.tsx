import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { createPaymentIntent, CreatePaymentIntentRequest } from "@/lib/api";
import { useStore } from "@/context/StoreContext";

interface StripeProviderProps {
  amount: number;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  children: (props: { clientSecret: string | null }) => React.ReactNode;
}

export default function StripeProviderWrapper({
  amount,
  shippingAddress,
  children,
}: StripeProviderProps) {
  const { cart } = useStore();
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (publishableKey && publishableKey !== "pk_test_your_stripe_publishable_key_here") {
      setStripePromise(loadStripe(publishableKey));
    } else {
      setError("Stripe publishable key not configured");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!stripePromise) return;

    const getClientSecret = async () => {
      try {
        setLoading(true);

        const products = cart.map(item => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        }));

        const request: CreatePaymentIntentRequest = {
          amount,
          currency: "pln",
          products,
          shippingAddress,
        };

        const response = await createPaymentIntent(request);
        setClientSecret(response.clientSecret);
      } catch (err) {
        setError("Failed to initialize payment");
      } finally {
        setLoading(false);
      }
    };

    getClientSecret();
  }, [stripePromise, amount, cart, shippingAddress]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-[#1C1A17]/60 dark:text-[#F5F0E8]/60 font-accent text-sm">
          Initializing payment...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-red-500 font-accent text-sm">{error}</div>
      </div>
    );
  }

  if (!stripePromise || !clientSecret) {
    return null;
  }

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe" as const,
      variables: {
        colorPrimary: "#C8A97E",
        colorBackground: "#F5F0E8",
        colorText: "#1C1A17",
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children({ clientSecret })}
    </Elements>
  );
}
