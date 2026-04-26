import { Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { StoreProvider } from "@/context/StoreContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import HomePage from "@/pages/HomePage";
import ShopPage from "@/pages/ShopPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CheckoutPage from "@/pages/CheckoutPage";
import WishlistPage from "@/pages/WishlistPage";

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isCheckout = location.pathname === "/checkout";

  return (
    <>
      {!isCheckout && <Navbar />}
      <CartDrawer />
      <main>{children}</main>
      {!isCheckout && <Footer />}
    </>
  );
}

function App() {
  return (
    <StoreProvider>
      <Suspense fallback={
        <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
          <p className="font-display text-2xl font-light text-[#1C1A17]/40">Forma</p>
        </div>
      }>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
          </Routes>
        </Layout>
      </Suspense>
    </StoreProvider>
  );
}

export default App;
