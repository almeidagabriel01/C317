"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import FormStepLayout from "../stepIndicator/FormStepLayout";

export default function DrinkSelector({ items = [], selectedDrinks, toggleDrink, onNext, onBack, direction }) {
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 10,
        duration: 0.2
      }
    },
  };

  // Converter IDs para nomes para compatibilidade com o componente existente
  const handleToggleDrink = (itemId) => {
    const item = items.find(i => i.item.ID === itemId);
    if (item) {
      toggleDrink(item.item.Descricao);
    }
  };

  // Se não há itens ainda, mostrar um indicador de carregamento
  if (items.length === 0) {
    return (
      <FormStepLayout
        stepKey="step2"
        direction={direction}
        title="BEBIDAS ALCOÓLICAS"
        subtitle="SELECIONE OS DRINKS ESPECIAIS PARA O SEU EVENTO"
        onBack={onBack}
        onNext={onNext}
        isValid={true}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-[#E0CEAA] text-lg">Carregando as opções de bebidas...</div>
        </div>
      </FormStepLayout>
    );
  }

  return (
    <FormStepLayout
      stepKey="step2"
      direction={direction}
      title="BEBIDAS ALCOÓLICAS"
      subtitle="SELECIONE OS DRINKS ESPECIAIS PARA O SEU EVENTO"
      onBack={onBack}
      onNext={onNext}
      isValid={true}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 px-2 md:px-0 mt-4">
        {items.map((item) => (
          <div
            key={item.item.ID}
            className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${selectedDrinks.includes(item.item.Descricao)
              ? "border-[#9D4815] bg-[#FFF8E7]/5"
              : "border-gray-700/40 hover:border-gray-600/60"
              }`}
            onClick={() => handleToggleDrink(item.item.ID)}
          >
            <div className="min-w-[24px] pt-1">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedDrinks.includes(item.item.Descricao)
                ? "border-[#9D4815] bg-[#9D4815]"
                : "border-gray-500"
                }`}>
                {selectedDrinks.includes(item.item.Descricao) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    className="text-white text-xs"
                  >
                    ✓
                  </motion.div>
                )}
              </div>
            </div>
            <div className="relative w-16 h-16 min-w-[64px] rounded-lg overflow-hidden border-2 border-[#E0CEAA] shadow-md">
              {item.imageURL ? (
                <Image
                  src={item.imageURL}
                  alt={item.item.Descricao}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="rounded-lg"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#1C2431] text-[#E0CEAA]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex flex-col flex-1">
              <div className="font-bold text-[#E0CEAA] text-xs md:text-sm lg:text-base">{item.item.Descricao}</div>
              <div className="text-xs text-gray-300/80 md:leading-snug">
                {item.item.Preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resumo dos drinks selecionados */}
      {selectedDrinks.length > 0 && (
        <motion.div
          className="mt-8 bg-[#1A222F] p-5 rounded-lg border border-[#E0CEAA]/20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-[#E0CEAA] font-semibold mb-3">Resumo das bebidas selecionadas:</h3>
          <div className="space-y-2 mb-4">
            {items
              .filter(item => selectedDrinks.includes(item.item.Descricao))
              .map(item => (
                <div key={item.item.ID} className="flex justify-between text-white">
                  <span>{item.item.Descricao}</span>
                  <span>
                    {item.item.Preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              ))}
          </div>
          <div className="flex justify-between text-lg font-bold text-[#E0CEAA] pt-3 border-t border-gray-700/40">
            <span>Total</span>
            <span>
              {
                items
                  .filter(item => selectedDrinks.includes(item.item.Descricao))
                  .reduce((sum, item) => sum + item.item.Preco, 0)
                  .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
              }
            </span>
          </div>
        </motion.div>
      )}
    </FormStepLayout>
  );
}