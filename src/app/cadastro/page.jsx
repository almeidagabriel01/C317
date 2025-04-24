"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import FloatingLabelInput from "@/components/Input/Input";

export default function Register() {
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    email: "",
    celular: "",
    senha: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      router.push("/login");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout type="register">
      <form onSubmit={handleSubmit} className="h-full flex flex-col">
        {/* agora centraliza */}
        <div className="flex-1 flex flex-col justify-center space-y-6">
          <FloatingLabelInput
            id="nomeCompleto"
            label="Nome completo"
            value={formData.nomeCompleto}
            onChange={handleChange}
            required
          />
          <FloatingLabelInput
            id="email"
            type="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <FloatingLabelInput
            id="celular"
            type="tel"
            label="Celular"
            value={formData.celular}
            onChange={handleChange}
            required
          />
          <FloatingLabelInput
            id="senha"
            type="password"
            label="Senha"
            value={formData.senha}
            onChange={handleChange}
            required
          />
        </div>

        {/* botão na base, sem mt-auto */}
        <div className="pt-5">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-700 hover:bg-amber-600 text-white py-4 rounded-full transition-colors text-lg"
          >
            {loading ? "Cadastrando..." : "Cadastre-se"}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}