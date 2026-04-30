import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface StripePaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export default function StripePaymentForm({
  amount,
  onSuccess,
  onError,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      onError(error.message || "Payment failed");
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess();
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-2 text-[#1C1A17]/50 dark:text-[#F5F0E8]/50 text-xs font-accent mb-4">
        <Lock size={12} className="text-[#C8A97E]" />
        Your payment information is encrypted and secure.
      </div>

      <div className="bg-[#F5F0E8] dark:bg-[#1C1A17] p-4 border border-[#C8A97E]/20">
        <PaymentElement
          options={{
            layout: "tabs",
            defaultValues: {
              billingDetails: {
                address: {
                  country: "US",
                },
              },
            },
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className={cn(
          "w-full py-4 bg-[#1C1A17] dark:bg-[#F5F0E8] text-[#F5F0E8] dark:text-[#1C1A17] font-body font-600 text-sm tracking-wider uppercase hover:bg-[#C8A97E] hover:text-[#1C1A17] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        {isProcessing ? "Processing..." : `Pay $${amount.toLocaleString()}`}
      </button>
    </form>
  );
}
