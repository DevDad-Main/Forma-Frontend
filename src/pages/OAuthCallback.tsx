import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    checkAuth().then(() => {
      toast.success("Welcome!");
      navigate("/profile");
    }).catch(() => {
      toast.error("Sign in failed");
      navigate("/");
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
      <p className="font-display text-xl font-light text-[#1C1A17]">Signing you in...</p>
    </div>
  );
}