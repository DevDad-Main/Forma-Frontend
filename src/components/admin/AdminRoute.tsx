import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getUser } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] dark:bg-[#1C1A17] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#C8A97E]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const currentUser = user || getUser();
  if (currentUser?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
