import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { setStoredToken } from "@/lib/api";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const hasRun = useRef(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const token = searchParams.get("token");
    if (token) {
      setStoredToken(token);
      // Clean token from URL so it doesn't linger in the address bar
      window.history.replaceState({}, "", "/login/oauth2/code/google");
    }

    checkAuth().then((user) => {
      if (user) {
        toast.success("Welcome!");
        navigate("/profile");
      } else {
        toast.error("Sign in failed");
        navigate("/");
      }
    });
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
      <p className="font-display text-xl font-light text-[#1C1A17]">Signing you in...</p>
    </div>
  );
}