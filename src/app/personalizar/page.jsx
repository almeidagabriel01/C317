"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import EventCustomizationPage from "@/components/customization/EventCustomizationPage";

export default function PersonalizarPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  // Renderiza um estado de carregamento ou a página se estiver autenticado
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#101820]">
        <div className="text-[#E0CEAA] text-lg">Carregando...</div>
      </div>
    );
  }

  return isAuthenticated ? <EventCustomizationPage /> : null;
}