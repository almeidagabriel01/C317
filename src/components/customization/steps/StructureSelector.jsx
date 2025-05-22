"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import FormStepLayout from "../../step/FormStepLayout";

export default function StructureSelector({ items, selectedStructure, setSelectedStructure, onNext, onBack, direction }) {
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

  const handleSelectStructure = (id) => {
    setSelectedStructure(id);
  };

  return (
    <FormStepLayout
      stepKey="step6"
      direction={direction}
      title="ESTRUTURA"
      subtitle="SELECIONE A ESTRUTURA DESEJADA PARA O SEU EVENTO"
      onBack={onBack}
      onNext={onNext}
      isValid={true}
    >
      <div className="flex flex-col items-center px-2 md:px-0 mt-4 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          {items.map((item) => (
            <motion.div
              key={item.item.ID}
              variants={itemVariants}
              className={`flex flex-col items-center cursor-pointer transition-all duration-300 transform ${
                selectedStructure === item.item.ID 
                  ? "scale-105" 
                  : "hover:scale-102"
              }`}
              onClick={() => handleSelectStructure(item.item.ID)}
            >
              <div className={`relative w-full aspect-video rounded-xl overflow-hidden border-4 transition-all duration-300 ${
                selectedStructure === item.item.ID 
                  ? "border-[#9D4815] shadow-lg shadow-[#9D4815]/20" 
                  : "border-[#E0CEAA]/30 hover:border-[#E0CEAA]/60"
              }`}>
                {item.imageURL ? (
                  <Image
                    src={item.imageURL}
                    alt={item.item.Descricao}
                    layout="fill"
                    objectFit="cover"
                    className={`transition-all duration-300 ${
                      selectedStructure === item.item.ID 
                        ? "brightness-110" 
                        : "brightness-90 hover:brightness-100"
                    }`}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#1C2431] text-[#E0CEAA]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                )}
                
                {selectedStructure === item.item.ID && (
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#9D4815] flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      className="text-white text-lg font-bold"
                    >
                      ✓
                    </motion.div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 text-center">
                <h3 className={`text-xl font-bold transition-colors duration-300 ${
                  selectedStructure === item.item.ID 
                    ? "text-[#E0CEAA]" 
                    : "text-white"
                }`}>
                  {item.item.Descricao}
                </h3>
                <p className={`mt-1 text-lg font-semibold transition-colors duration-300 ${
                  selectedStructure === item.item.ID 
                    ? "text-[#9D4815]" 
                    : "text-[#E0CEAA]/70"
                }`}>
                  {formatPrice(item.item.Preco)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Resumo da estrutura selecionada */}
        {selectedStructure && (
          <motion.div 
            className="mt-8 bg-[#1A222F] p-5 rounded-lg border border-[#E0CEAA]/20 w-full max-w-4xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-[#E0CEAA] font-semibold mb-3">Estrutura selecionada:</h3>
            <div className="flex justify-between text-lg text-white">
              <span>{items.find(item => item.item.ID === selectedStructure)?.item.Descricao}</span>
              <span className="font-semibold text-[#E0CEAA]">
                {formatPrice(items.find(item => item.item.ID === selectedStructure)?.item.Preco || 0)}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </FormStepLayout>
  );
}