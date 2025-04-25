"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import FloatingLabelInput from "@/components/Input/Input";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Removemos authError e setAuthError daqui, pois o contexto usa toasts
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redireciona se já estiver autenticado
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    await login(email, senha);
    setIsSubmitting(false); // Reseta o botão após a tentativa
  };

  // Mostra loader durante verificação inicial ou se já logado (antes do redirect)
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white text-xl">Carregando...</p>
      </div>
    );
  }
  if (isAuthenticated) {
    return null;
  }

  return (
    <AuthLayout type="login">
      <form onSubmit={handleSubmit} className="h-full flex flex-col">
        <div className="flex-1 flex flex-col justify-center space-y-8">
          <FloatingLabelInput
            id="email"
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
          />
          <FloatingLabelInput
            id="senha"
            type="password"
            label="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="pt-5">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-amber-700 hover:bg-amber-600 text-white py-4 rounded-full transition-colors text-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}