"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function PackageModal({ isOpen, onClose, packageInfo }) {
  if (!isOpen || !packageInfo) return null;

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.15 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        type: "spring", 
        damping: 25, 
        stiffness: 300,
        duration: 0.2
      } 
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      scale: 0.95, 
      transition: { duration: 0.15 } 
    },
  };

  // Informações extras que não estavam disponíveis no card original
  const packageDetails = {
    "Serviços inclusos": [
      "Montagem e desmontagem de bar",
      "Equipe de bartenders profissionais",
      "Todos os insumos inclusos",
      "Copos e taças de qualidade",
      "Bebidas premium"
    ],
    "Especificações": [
      `${packageInfo.hours} horas de serviço`,
      `Atendimento para ${packageInfo.guests} pessoas`,
      "Disponibilidade de menu personalizado",
      "Equipe treinada e uniformizada"
    ],
    "Drinks inclusos": [
      "Gin Tônica",
      "Mojito",
      "Caipiroska",
      "Whisky Sour",
      "Moscow Mule",
      "Aperol Spritz"
    ],
    "Bebidas não alcoólicas": [
      "Água mineral",
      "Refrigerantes",
      "Sucos naturais",
      "Água com gás",
      "Tônica"
    ]
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      >
        <motion.div
          className="relative bg-[#1C2431] max-w-3xl w-full rounded-xl overflow-hidden shadow-2xl flex flex-col"
          variants={contentVariants}
          onClick={(e) => e.stopPropagation()}
          style={{ maxHeight: 'calc(90vh - 40px)' }}
        >
          {/* Cabeçalho com imagem */}
          <div className="relative w-full h-48 sm:h-64">
            <Image
              src={`/assets/${packageInfo.image}`}
              alt={packageInfo.title}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#101820] to-transparent opacity-80"></div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-[#E0CEAA] bg-opacity-80 hover:bg-opacity-100 rounded-full transition-all duration-200 text-[#1C2431]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="absolute bottom-6 left-6 right-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">{packageInfo.title}</h2>
            </div>
          </div>

          {/* Resumo do pacote */}
          <div className="p-6 border-b border-gray-700/30">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-[#E0CEAA]">
                  <span>👥 {packageInfo.guests} convidados</span>
                </div>
                <div className="flex items-center gap-2 text-[#E0CEAA]">
                  <span>⏱ {packageInfo.hours} horas de open bar</span>
                </div>
              </div>
              <div className="mt-4 sm:mt-0">
                <div className="text-sm text-[#A8937E]">Valor total:</div>
                <div className="text-2xl font-bold text-[#E0CEAA]">{packageInfo.price}</div>
              </div>
            </div>
          </div>

          {/* Conteúdo com scroll */}
          <div className="overflow-y-auto p-6 custom-scrollbar" style={{ maxHeight: 'calc(90vh - 320px)' }}>
            <div className="space-y-6">
              {Object.entries(packageDetails).map(([category, items]) => (
                <div key={category} className="pb-4">
                  <h3 className="text-lg font-semibold text-[#E0CEAA] mb-3">{category}</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {items.map((item, index) => (
                      <li key={index} className="flex items-center text-white">
                        <span className="text-[#9D4815] mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Rodapé fixo */}
          <div className="p-6 bg-[#1C2431] border-t border-gray-700/30">
            <button
              onClick={onClose}
              className="w-full py-3 px-6 bg-[#9D4815] hover:bg-[#924d2b] text-white font-bold rounded-full transition-all"
            >
              Fechar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}