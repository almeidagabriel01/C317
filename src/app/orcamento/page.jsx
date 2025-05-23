"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import { useAuth } from "@/context/AuthContext";

export default function Orcamento() {
  const [orcamento, setOrcamento] = useState(null);

  const { user, isAuthenticated, logout, loading } = useAuth();

  useEffect(() => {
    // Simulação de fetch de dados do backend
    const fetchData = async () => {
      const data = {
        nome: "João da Silva",
        data: "21/06/2025",
        numConvidados: 80,
        cargaHoraria: "6h",
        drinks: ["cosmopolitan", "mojito", "moscow mule"],
        softDrinks: ["refrigerante", "suco"],
        bebidasAdicionais: ["whisky", "gin"],
        shots: ["tequila", "fireball"],
        bartender: "Sim",
        itensAdicionais: ["copos personalizados", "decoração temática"],
        balcao: "Iluminado",
        valorTotal: 22500,
      };

      setOrcamento(data);
    };

    fetchData();
  }, []);

  if (!orcamento) {
    return <div className="text-white p-8">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-[#101820] text-[#f6e6cb]">
      {/* Navbar */}
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={logout} />

      <div className="px-6 py-8 lg:px-12 lg:py-6 max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-croissant mb-6 lg:mb-8 text-[#E0CEAA]">
          Dados do orçamento
        </h1>
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg lg:p-12 md:p-10 p-4">
          <div className="space-y-2 text-space-y-3 md:space-y-4 text-base md:text-lg">
            {/* Nome e Carga Horária */}
            <div className="flex flex-col md:flex-row md:justify-between gap-2 md:gap-4">
              <div className="flex-1">
                <strong className="text-[#d5841b] font-serif mr-2">
                  Nome:
                </strong>
                <span className="break-words">{orcamento.nome}</span>
              </div>
              <div className="flex-1 md:text-right  lg:pr-100">
                <strong className="text-[#d5841b] font-serif mr-2 ">
                  Carga horária:
                </strong>
                {orcamento.cargaHoraria}
              </div>
            </div>

            {/* Data */}
            <div>
              <strong className="text-[#d5841b] font-serif mr-2">Data:</strong>
              {orcamento.data}
            </div>

            {/* Número de Convidados */}
            <div className="mb-4 md:mb-6">
              <strong className="text-[#d5841b] font-serif mr-2">
                Num. convidados:
              </strong>
              {orcamento.numConvidados}
            </div>

            {/* Drinks */}
            <div>
              <strong className="text-[#d5841b] font-serif mr-2">
                Drinks:
              </strong>
              <span className="break-words">{orcamento.drinks.join("; ")}</span>
            </div>

            {/* Soft Drinks */}
            <div>
              <strong className="text-[#d5841b] font-serif mr-2">
                Soft Drinks:
              </strong>
              <span className="break-words">
                {orcamento.softDrinks.join("; ")}
              </span>
            </div>

            {/* Bebidas Adicionais */}
            <div>
              <strong className="text-[#d5841b] font-serif mr-2">
                Bebidas adicionais:
              </strong>
              <span className="break-words">
                {orcamento.bebidasAdicionais.join("; ")}
              </span>
            </div>

            {/* Shots */}
            <div>
              <strong className="text-[#d5841b] font-serif mr-2">Shots:</strong>
              <span className="break-words">{orcamento.shots.join("; ")}</span>
            </div>

            {/* Bartender */}
            <div>
              <strong className="text-[#d5841b] font-serif mr-2">
                Bartender:
              </strong>
              {orcamento.bartender}
            </div>

            {/* Itens Adicionais */}
            <div>
              <strong className="text-[#d5841b] font-serif mr-2">
                Itens adicionais:
              </strong>
              <span className="break-words">
                {orcamento.itensAdicionais.join("; ")}
              </span>
            </div>

            {/* Balcão */}
            <div>
              <strong className="text-[#d5841b] font-serif mr-2">
                Balcão:
              </strong>
              {orcamento.balcao}
            </div>
          </div>

          {/* Valor Total */}
          <div className="mt-6 md:mt-8 text-xl md:text-2xl font-bold font-serif text-[#d5841b]">
            Valor Total:{" "}
            <span className="text-yellow-100">
              R$ {orcamento.valorTotal.toLocaleString("pt-BR")},00
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-10 mt-6 md:mt-8 justify-center items-center">
            <button className="bg-[#d5bfa4] text-black px-4 py-2 rounded-full text-base md:text-lg font-medium hover:bg-[#9D4815] hover:text-white transition-colors">
              Salvar
            </button>
            <button className="bg-[#d5bfa4] text-black px-4 py-2 rounded-full text-base md:text-lg font-medium hover:bg-[#9D4815] hover:text-white transition-colors">
              Contratar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
