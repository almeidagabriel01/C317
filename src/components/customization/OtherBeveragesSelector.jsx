"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import FormStepLayout from "../step/FormStepLayout";

const otherBeverages = [
  { id: 1, name: "ÁGUA MINERAL (500ml)", description: "Água mineral sem gás", image: "agua.jpg", price: 3.5 },
  { id: 2, name: "ÁGUA COM GÁS (500ml)", description: "Água mineral com gás", image: "agua-gas.jpg", price: 4.0 },
  { id: 3, name: "REFRIGERANTE (LATA)", description: "Sabores: Cola, Guaraná, Limão", image: "refrigerante.jpg", price: 5.0 },
  { id: 4, name: "ENERGÉTICO (LATA)", description: "Energy drink tradicional", image: "energetico.jpg", price: 12.0 },
  { id: 5, name: "TÔNICA (LATA)", description: "Água tônica tradicional", image: "tonica.jpg", price: 6.0 },
  { id: 6, name: "CERVEJA (LONG NECK)", description: "Cerveja pilsen premium", image: "cerveja.jpg", price: 8.0 },
  { id: 7, name: "GARRAFA DE VINHO", description: "Vinho tinto ou branco", image: "vinho.jpg", price: 70.0 },
  { id: 8, name: "ESPUMANTE", description: "Espumante brut ou demi-sec", image: "espumante.jpg", price: 80.0 },
];

export default function OtherBeveragesSelector({ beverageQuantities, setBeverageQuantity, onNext, onBack, direction }) {
  // Função para atualizar a quantidade de uma bebida
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 0) return;
    setBeverageQuantity(id, newQuantity);
  };

  // Função para formatar o preço em reais
  const formatPrice = (price) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

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

  return (
    <FormStepLayout
      stepKey="step4"
      direction={direction}
      title="OUTRAS BEBIDAS"
      subtitle="INFORME A QUANTIDADE DE CADA BEBIDA ADICIONAL DESEJADA"
      onBack={onBack}
      onNext={onNext}
      isValid={true}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2 md:px-0 mt-4">
        {otherBeverages.map((beverage) => {
          const quantity = beverageQuantities[beverage.id] || 0;
          
          return (
            <motion.div
              key={beverage.id}
              variants={itemVariants}
              className={`flex items-center gap-3 p-4 rounded-lg border transition-all duration-200 ${
                quantity > 0 
                  ? "border-[#9D4815] bg-[#FFF8E7]/5 shadow-md" 
                  : "border-gray-700/40 hover:border-gray-600/60"
              }`}
            >
              <div className="relative w-16 h-16 min-w-[64px] rounded-lg overflow-hidden border-2 border-[#E0CEAA] shadow-md">
                <Image
                  src={`/assets/${beverage.image}`}
                  alt={beverage.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              
              <div className="flex-1">
                <div className="font-bold text-[#E0CEAA] text-sm md:text-base">{beverage.name}</div>
                <div className="text-xs text-gray-300/80">{beverage.description}</div>
                <div className="text-sm text-[#9D4815] font-semibold mt-1">{formatPrice(beverage.price)} / unidade</div>
              </div>
              
              <div className="flex items-center bg-[#1A222F] rounded-full border border-[#E0CEAA]/30 overflow-hidden">
                <motion.button
                  type="button"
                  onClick={() => updateQuantity(beverage.id, quantity - 1)}
                  className={`w-8 h-8 flex items-center justify-center text-[#E0CEAA] hover:bg-[#9D4815]/20 ${
                    quantity === 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={quantity === 0}
                  whileTap={quantity > 0 ? { scale: 0.9 } : {}}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.button>
                
                <div 
                  className={`w-10 h-8 flex items-center justify-center font-semibold border-l border-r transition-colors duration-300 ${
                    quantity > 0 
                      ? "text-[#E0CEAA] border-[#E0CEAA]/30" 
                      : "text-gray-400 border-gray-700/40"
                  }`}
                >
                  {quantity}
                </div>
                
                <motion.button
                  type="button"
                  onClick={() => updateQuantity(beverage.id, quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-[#E0CEAA] hover:bg-[#9D4815]/20"
                  whileTap={{ scale: 0.9 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Total calculado */}
      {Object.keys(beverageQuantities).length > 0 && (
        <motion.div 
          className="mt-8 bg-[#1A222F] p-5 rounded-lg border border-[#E0CEAA]/20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-[#E0CEAA] font-semibold mb-3">Resumo das bebidas adicionais:</h3>
          <div className="space-y-2 mb-4">
            {otherBeverages.filter(b => beverageQuantities[b.id] > 0).map(beverage => (
              <div key={beverage.id} className="flex justify-between text-white">
                <span>{beverage.name} <span className="text-gray-400">x {beverageQuantities[beverage.id]}</span></span>
                <span>{formatPrice(beverage.price * beverageQuantities[beverage.id])}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-lg font-bold text-[#E0CEAA] pt-3 border-t border-gray-700/40">
            <span>Total</span>
            <span>
              {formatPrice(
                otherBeverages.reduce((sum, beverage) => {
                  return sum + (beverage.price * (beverageQuantities[beverage.id] || 0));
                }, 0)
              )}
            </span>
          </div>
        </motion.div>
      )}
    </FormStepLayout>
  );
}