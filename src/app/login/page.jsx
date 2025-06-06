"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import FloatingLabelInput from "@/components/input/Input";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, role, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redireciona imediatamente se já estiver autenticado
  useEffect(() => {
    if (!authLoading && isAuthenticated && role) {
      const targetRoute = role === 'Administrador' ? '/dashboard' : '/';
      router.replace(targetRoute);
    }
  }, [isAuthenticated, role, authLoading, router]);

  // Mostra loading enquanto verifica autenticação ou se já está autenticado
  if (authLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400 mx-auto mb-2"></div>
          <p className="text-white text-xl">
            {authLoading ? "Verificando autenticação..." : "Redirecionando..."}
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    await login(email, senha);
    setIsSubmitting(false);
  };

  return (
    <AuthLayout type="login">
      <form onSubmit={handleSubmit} className="h-full flex flex-col">
        <div className="flex-1 flex flex-col justify-center space-y-8">
          <FloatingLabelInput
            id="email" type="email" label="Email"
            value={email} onChange={e => setEmail(e.target.value)}
            required disabled={isSubmitting}
          />
          <FloatingLabelInput
            id="senha" type="password" label="Senha"
            value={senha} onChange={e => setSenha(e.target.value)}
            required disabled={isSubmitting}
          />
        </div>
        <div className="pt-5">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-amber-700 hover:bg-amber-600 text-white py-4 rounded-full transition-colors text-lg ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}