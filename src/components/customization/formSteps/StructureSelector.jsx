"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import FormStepLayout from "../stepIndicator/FormStepLayout";
import { formatCurrency } from "@/utils/formatUtils";

export default function StructureSelector({ items, selectedStructure, setSelectedStructure, onNext, onBack, direction, isValid }) {
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
    // Se clicar na estrutura já selecionada, deseleciona
    if (selectedStructure === id) {
      setSelectedStructure(null);
    } else {
      setSelectedStructure(id);
    }
  };

  // Se não há itens ainda, mostrar um indicador de carregamento
  if (items.length === 0) {
    return (
      <FormStepLayout
        stepKey="step6"
        direction={direction}
        title="ESTRUTURA"
        subtitle="SELECIONE A ESTRUTURA DESEJADA PARA O SEU EVENTO"
        onBack={onBack}
        onNext={onNext}
        isValid={typeof isValid === "boolean" ? isValid : true}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-[#E0CEAA] text-lg">Carregando as opções de estrutura...</div>
        </div>
      </FormStepLayout>
    );
  }

  return (
    <FormStepLayout
      stepKey="step6"
      direction={direction}
      title="ESTRUTURA"
      subtitle="SELECIONE A ESTRUTURA DESEJADA PARA O SEU EVENTO (OPCIONAL)"
      onBack={onBack}
      onNext={onNext}
      isValid={typeof isValid === "boolean" ? isValid : true}
    >
      <div className="flex flex-col items-center px-2 md:px-0 mt-4 space-y-8">
        {/* Botão para remover seleção */}
        {selectedStructure && (
          <motion.div
            className="w-full max-w-4xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <button
              onClick={() => setSelectedStructure(null)}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg border border-gray-600 hover:border-gray-500 transition-all duration-200 text-sm"
            >
              Remover seleção de estrutura
            </button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          {items.map((item) => (
            <motion.div
              key={item.item.ID}
              variants={itemVariants}
              className={`flex flex-col items-center cursor-pointer transition-all duration-300 transform ${selectedStructure === item.item.ID
                  ? "scale-105"
                  : "hover:scale-102"
                }`}
              onClick={() => handleSelectStructure(item.item.ID)}
            >
              <div className={`relative w-full aspect-video rounded-xl overflow-hidden border-4 transition-all duration-300 ${selectedStructure === item.item.ID
                  ? "border-[#9D4815] shadow-lg shadow-[#9D4815]/20"
                  : "border-[#E0CEAA]/30 hover:border-[#E0CEAA]/60"
                }`}>
                {item.imageURL ? (
                  <Image
                    src={item.imageURL}
                    alt={item.item.Nome}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, 400px"
                    className={`transition-all duration-300 ${selectedStructure === item.item.ID
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
                <h3 className={`text-xl font-bold transition-colors duration-300 ${selectedStructure === item.item.ID
                    ? "text-[#E0CEAA]"
                    : "text-white"
                  }`}>
                  {item.item.Nome}
                </h3>
                <p className="text-xs text-gray-300/80 mt-1">{item.item.Descricao}</p>
                <p className={`mt-1 text-lg font-semibold transition-colors duration-300 ${selectedStructure === item.item.ID
                    ? "text-[#9D4815]"
                    : "text-[#E0CEAA]/70"
                  }`}>
                  {formatCurrency(item.item.Preco)}
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
              <span>{items.find(item => item.item.ID === selectedStructure)?.item.Nome}</span>
              <span className="font-semibold text-[#E0CEAA]">
                {formatCurrency(items.find(item => item.item.ID === selectedStructure)?.item.Preco || 0)}
              </span>
            </div>
          </motion.div>
        )}

        {/* Informação sobre a opcionalidade */}
        <motion.div
          className="text-center text-gray-400 text-sm max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p>A seleção de estrutura é opcional. Você pode prosseguir sem selecionar nenhuma estrutura ou clicar novamente em uma estrutura selecionada para removê-la.</p>
        </motion.div>
      </div>
    </FormStepLayout>
  );
}