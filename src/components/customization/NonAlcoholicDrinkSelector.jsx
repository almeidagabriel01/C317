"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import FormStepLayout from "../step/FormStepLayout";

const nonAlcoholicDrinks = [
  { name: "LIMONADA SUÍÇA", description: "água, limão e açúcar batidos com gelo", image: "limonada.jpg" },
  { name: "SUCO DE LARANJA", description: "laranja natural espremida", image: "laranja.jpg" },
  { name: "SUCO DE ABACAXI", description: "abacaxi, hortelã, limão e água", image: "abacaxi.jpg" },
  { name: "SUCO DE MORANGO", description: "morango, limão e água", image: "morango.jpg" },
  { name: "ICE TEA", description: "chá gelado com limão e hortelã", image: "icetea.jpg" },
  { name: "ÁGUA DE COCO", description: "água de coco natural", image: "agua-coco.jpg" },
  { name: "MOJITO SEM ÁLCOOL", description: "limão, hortelã, açúcar e água gaseificada", image: "mojito.jpg" },
  { name: "SHIRLEY TEMPLE", description: "ginger ale e grenadine", image: "gintonica.jpg" },
  { name: "PIÑA COLADA SEM ÁLCOOL", description: "leite de coco, suco de abacaxi e açúcar", image: "pina-colada.jpg" },
  { name: "COQUETEL DE FRUTAS", description: "mix de sucos de frutas, xarope de açúcar e água gaseificada", image: "frutas.jpg" },
  { name: "SMOOTHIE DE FRUTAS VERMELHAS", description: "frutas vermelhas, iogurte e mel", image: "frutas-vermelhas.jpg" },
  { name: "MATE COM LIMÃO", description: "chá mate gelado com limão e açúcar", image: "mate.jpg" },
];

export default function NonAlcoholicDrinkSelector({ selectedDrinks, toggleDrink, onNext, onBack, direction }) {
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
      stepKey="step3"
      direction={direction}
      title="BEBIDAS NÃO ALCOÓLICAS"
      subtitle="SELECIONE AS BEBIDAS NÃO ALCOÓLICAS PARA O SEU EVENTO"
      onBack={onBack}
      onNext={onNext}
      isValid={true}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 px-2 md:px-0 mt-4">
        {nonAlcoholicDrinks.map((drink) => (
          <div
            key={drink.name}
            className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
              selectedDrinks.includes(drink.name)
                ? "border-[#9D4815] bg-[#FFF8E7]/5"
                : "border-gray-700/40 hover:border-gray-600/60"
            }`}
            onClick={() => toggleDrink(drink.name)}
          >
            <div className="min-w-[24px] pt-1">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedDrinks.includes(drink.name)
                  ? "border-[#9D4815] bg-[#9D4815]"
                  : "border-gray-500"
              }`}>
                {selectedDrinks.includes(drink.name) && (
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
              <Image
                src={`/assets/${drink.image}`}
                alt={drink.name}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
            <div className="flex flex-col flex-1">
              <div className="font-bold text-[#E0CEAA] text-xs md:text-sm lg:text-base">{drink.name}</div>
              <div className="text-xs text-gray-300/80 md:leading-snug">{drink.description}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Resumo das bebidas não alcoólicas selecionadas */}
      {selectedDrinks.length > 0 && (
        <motion.div 
          className="mt-8 bg-[#1A222F] p-5 rounded-lg border border-[#E0CEAA]/20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-[#E0CEAA] font-semibold mb-3">Resumo das bebidas sem álcool selecionadas:</h3>
          <div className="space-y-2 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {selectedDrinks.map(drinkName => (
                <div key={drinkName} className="flex items-center text-white">
                  <span className="text-[#9D4815] mr-2">•</span>
                  <span>{drinkName}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between text-lg font-bold text-[#E0CEAA] pt-3 border-t border-gray-700/40">
            <span>Total de bebidas sem álcool</span>
            <span>{selectedDrinks.length}</span>
          </div>
        </motion.div>
      )}
    </FormStepLayout>
  );
}