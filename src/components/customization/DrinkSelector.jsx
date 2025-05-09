"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import FormStepLayout from "./FormStepLayout";

const drinks = [
  { name: "COSMOPOLITAN", description: "vodka, licor de laranja, suco de cranberry e suco de limão", image: "cosmopolitan.jpg" },
  { name: "MOJITO", description: "rum, o açúcar, hortelã, limão e água gaseificada", image: "mojito.jpg" },
  { name: "BELLINI", description: "suco de pêssego e espumante", image: "bellini.jpg" },
  { name: "DRY MARTINI", description: "vodka, licor de laranja, suco de cranberry e suco de limão", image: "dry-martini.jpeg" },
  { name: "BLOOD MARY", description: "vodka, licor de laranja, suco de cranberry e suco de limão", image: "bloody-mary.jpg" },
  { name: "PINA COLADA", description: "vodka, licor de laranja, suco de cranberry e suco de limão", image: "pina-colada.jpg" },
  { name: "MARGARITA TRADICIONAL", description: "tequila, licor de laranja e suco de limão", image: "pina-colada.jpg" },
  { name: "NEGRONI", description: "gin, vermute rosso e Campari", image: "pina-colada.jpg" },
  { name: "CLERICOT", description: "vinho, frutas frescas e refrigerante", image: "pina-colada.jpg" },
  { name: "OLD FASHIONED", description: "whisky, açúcar, angostura e água", image: "pina-colada.jpg" },
  { name: "WHISKY SOUR", description: "whisky, limão, açúcar e clara de ovo", image: "pina-colada.jpg" },
  { name: "TOM COLLINS", description: "gin, limão, açúcar e água com gás", image: "pina-colada.jpg" },
  { name: "SEX ON THE BEACH", description: "vodka, licor de pêssego, suco de laranja e grenadine", image: "sexonthebeach.jpg" },
  { name: "MOSCOW MULE", description: "vodka, limão e cerveja de gengibre", image: "moscowmule.jpg" },
  { name: "GIN TÔNICA", description: "gin e água tônica", image: "gintonica.jpg" },
  { name: "CAIPIRINHAS", description: "cachaça, limão e açúcar", image: "caipirinha.jpg" },
];

export default function DrinkSelector({ selectedDrinks, toggleDrink, onNext, onBack, direction }) {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 px-2 md:px-0 mt-4">
        {drinks.map((drink) => (
          <div
            key={drink.name}
            className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
              selectedDrinks.includes(drink.name)
                ? "border-[#9D4815] bg-[#FFF8E7]"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => toggleDrink(drink.name)}
          >
            <div className="min-w-[24px] pt-1">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedDrinks.includes(drink.name)
                  ? "border-[#9D4815] bg-[#9D4815]"
                  : "border-gray-300"
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
              <div className="font-bold text-[#9D4815] text-xs md:text-sm lg:text-base">{drink.name}</div>
              <div className="text-xs text-gray-600 md:leading-snug">{drink.description}</div>
            </div>
          </div>
        ))}
      </div>
    </FormStepLayout>
  );
}