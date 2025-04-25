"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import FloatingLabelInput from "@/components/Input/Input";
import { registerUser } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from 'react-toastify';

export default function Register() {
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    email: "",
    celular: "",
    senha: "",
  });
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, authLoading, router]);

  // Função de mascaramento
  const maskPhone = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length === 0) return "";
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10)
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // se for o campo 'celular', aplica a máscara
    if (name === "celular") {
      newValue = maskPhone(value);
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loadingSubmit) return;

    setLoadingSubmit(true);
    const toastId = toast.loading("Realizando cadastro...");

    try {
      const apiData = {
        userName: formData.nomeCompleto,
        Email: formData.email,
        password: formData.senha,
        role: "Comprador",
        NumCel: formData.celular,
      };

      await registerUser(apiData);

      toast.update(toastId, {
        render: "Cadastro realizado com sucesso! Redirecionando...",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      setTimeout(() => router.push("/login"), 3000);
    } catch (err) {
      console.error("Erro no cadastro:", err);
      toast.update(toastId, {
        render: `Erro no cadastro: ${err.message}`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      setLoadingSubmit(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white text-xl">Carregando...</p>
      </div>
    );
  }
  if (isAuthenticated) return null;

  return (
    <AuthLayout type="register">
      <form onSubmit={handleSubmit} className="h-full flex flex-col">
        <div className="flex-1 flex flex-col justify-center space-y-6">
          <FloatingLabelInput
            id="nomeCompleto"
            label="Nome completo"
            value={formData.nomeCompleto}
            onChange={handleChange}
            required
            disabled={loadingSubmit}
          />
          <FloatingLabelInput
            id="email"
            type="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loadingSubmit}
          />
          <FloatingLabelInput
            id="celular"
            type="tel"
            label="Celular (Ex: (11) 98765-4321)"
            value={formData.celular}
            onChange={handleChange}
            required
            disabled={loadingSubmit}
          />
          <FloatingLabelInput
            id="senha"
            type="password"
            label="Senha"
            value={formData.senha}
            onChange={handleChange}
            required
            disabled={loadingSubmit}
          />
        </div>

        <div className="pt-5">
          <button
            type="submit"
            disabled={loadingSubmit}
            className={`w-full bg-amber-700 hover:bg-amber-600 text-white py-4 rounded-full transition-colors text-lg ${loadingSubmit ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {loadingSubmit ? "Cadastrando..." : "Cadastre-se"}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}