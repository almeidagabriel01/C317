"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import FormStepLayout from "../stepIndicator/FormStepLayout";
import { formatCurrency } from "@/utils/formatUtils";

export default function StaffSelector({ items, staffQuantities, setStaffQuantity, onNext, onBack, direction, isValid }) {
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 0) return;
    setStaffQuantity(id, newQuantity);
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 10, duration: 0.2 }
    },
  };

  // Se não há itens ainda, mostrar um indicador de carregamento
  if (items.length === 0) {
    return (
      <FormStepLayout
        stepKey="step7"
        direction={direction}
        title="BARTENDERS & STAFF"
        subtitle="SELECIONE A EQUIPE PARA O SEU EVENTO"
        onBack={onBack}
        onNext={onNext}
        isValid={typeof isValid === "boolean" ? isValid : true}
        nextButtonText="RESUMO DO PEDIDO"
        isLastStep={true}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-[#E0CEAA] text-lg">Carregando as opções de equipe...</div>
        </div>
      </FormStepLayout>
    );
  }

  return (
    <FormStepLayout
      stepKey="step7"
      direction={direction}
      title="BARTENDERS & STAFF"
      subtitle="SELECIONE A EQUIPE PARA O SEU EVENTO"
      onBack={onBack}
      onNext={onNext}
      isValid={typeof isValid === "boolean" ? isValid : true}
      nextButtonText="RESUMO DO PEDIDO"
      isLastStep={true}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-2 md:px-0 mt-4">
        {items.map((item) => {
          const quantity = staffQuantities[item.item.ID] || 0;

          return (
            <motion.div
              key={item.item.ID}
              variants={itemVariants}
              className={`flex flex-col border rounded-xl overflow-hidden transition-all duration-300 ${quantity > 0
                ? "border-[#9D4815] shadow-lg bg-[#FFF8E7]/5"
                : "border-gray-700/40 hover:border-gray-600/60"
                }`}
            >
              {/* imagem com altura reduzida */}
              <div className="relative w-full h-48 overflow-hidden">
                {item.imageURL ? (
                  <Image
                    src={item.imageURL}
                    alt={item.item.Nome}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, 400px"
                    className={`transition-all duration-300 ${quantity > 0
                      ? "brightness-110"
                      : "brightness-90 hover:brightness-100"
                      }`}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#1C2431] text-[#E0CEAA]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-bold text-[#E0CEAA] text-lg">{item.item.Nome}</h3>
                <p className="text-xs text-gray-300/80 mt-1">{item.item.Descricao}</p>
                <p className="text-[#9D4815] font-semibold mt-1">{formatCurrency(item.item.Preco)} / profissional</p>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-white text-sm">Quantidade:</span>
                  <div className="flex items-center bg-[#1A222F] rounded-full border border-[#E0CEAA]/30 overflow-hidden">
                    <motion.button
                      onClick={() => updateQuantity(item.item.ID, quantity - 1)}
                      disabled={quantity === 0}
                      className={`w-8 h-8 flex items-center justify-center text-[#E0CEAA] hover:bg-[#9D4815]/20 ${quantity === 0 ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      whileTap={quantity > 0 ? { scale: 0.9 } : {}}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </motion.button>
                    <div className={`w-10 h-8 flex items-center justify-center font-semibold border-l border-r ${quantity > 0 ? "text-[#E0CEAA] border-[#E0CEAA]/30" : "text-gray-400 border-gray-700/40"
                      }`}>
                      {quantity}
                    </div>
                    <motion.button
                      onClick={() => updateQuantity(item.item.ID, quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-[#E0CEAA] hover:bg-[#9D4815]/20"
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </motion.button>
                  </div>
                </div>

                {quantity > 0 && (
                  <div className="mt-2 text-right text-white">
                    Total: <span className="font-semibold text-[#E0CEAA]">{formatCurrency(item.item.Preco * quantity)}</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Resumo da equipe selecionada */}
      {Object.keys(staffQuantities).length > 0 && (
        <motion.div
          className="mt-8 bg-[#1A222F] p-5 rounded-lg border border-[#E0CEAA]/20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-[#E0CEAA] font-semibold mb-3">Resumo da equipe selecionada:</h3>
          <div className="space-y-2 mb-4">
            {items
              .filter(item => staffQuantities[item.item.ID] > 0)
              .map(item => (
                <div key={item.item.ID} className="flex justify-between text-white">
                  <span>
                    {item.item.Nome} <span className="text-gray-400">x {staffQuantities[item.item.ID]}</span>
                  </span>
                  <span>{formatCurrency(item.item.Preco * staffQuantities[item.item.ID])}</span>
                </div>
              ))}
          </div>
          <div className="flex justify-between text-lg font-bold text-[#E0CEAA] pt-3 border-t border-gray-700/40">
            <span>Total</span>
            <span>
              {formatCurrency(
                items.reduce((sum, item) => {
                  return sum + (item.item.Preco * (staffQuantities[item.item.ID] || 0));
                }, 0)
              )}
            </span>
          </div>
        </motion.div>
      )}
    </FormStepLayout>
  );
}