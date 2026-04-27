import { toast } from "sonner";

const goldAccent = "#C8A97E";
const darkBg = "#1C1A17";
const lightText = "#F5F0E8";

export const toastSuccess = (message: string) => {
  toast.success(message, {
    style: {
      background: darkBg,
      color: lightText,
      border: `1px solid ${goldAccent}`,
    },
    icon: "✓",
  });
};

export const toastError = (message: string) => {
  toast.error(message, {
    style: {
      background: darkBg,
      color: lightText,
      border: "1px solid #ef4444",
    },
    icon: "✕",
  });
};

export const toastInfo = (message: string) => {
  toast(message, {
    style: {
      background: darkBg,
      color: lightText,
      border: `1px solid ${goldAccent}`,
    },
  });
};

export const toastAdded = (item: string) => {
  toast.success(`Added ${item} to cart`, {
    style: {
      background: darkBg,
      color: lightText,
      border: `1px solid ${goldAccent}`,
    },
  });
};

export const toastRemoved = (item: string) => {
  toast.success(`Removed ${item}`, {
    style: {
      background: darkBg,
      color: lightText,
      border: `1px solid ${goldAccent}`,
    },
  });
};

export const toastWishlistAdded = (item: string) => {
  toast.success(`Added "${item}" to wishlist`, {
    style: {
      background: darkBg,
      color: lightText,
      border: `1px solid ${goldAccent}`,
    },
  });
};