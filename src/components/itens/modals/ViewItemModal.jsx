"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  FiPackage,
  FiTag,
  FiActivity,
  FiFileText,
  FiDollarSign,
  FiX,
} from "react-icons/fi";
import { formatCurrency } from "@/utils/formatUtils";

const ViewItemModal = ({ isOpen, onClose, item }) => {
  if (!isOpen || !item) return null;

  const getCategoryColor = (category) => {
    switch (category) {
      case "Alcoólico":
        return "bg-red-900 text-red-300";
      case "Não Alcoólico":
        return "bg-green-900 text-green-300";
      case "Shots":
        return "bg-purple-900 text-purple-300";
      case "Outras Bebidas":
        return "bg-blue-900 text-blue-300";
      case "Estruturas":
        return "bg-yellow-900 text-yellow-300";
      case "Funcionário":
        return "bg-gray-900 text-gray-300";
      default:
        return "bg-gray-700 text-gray-200";
    }
  };

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
        duration: 0.2,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: { duration: 0.15 },
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black bg-opacity-60"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      >
        <motion.div
          className="relative bg-[#1C2431] w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[95vh] overflow-y-auto custom-scrollbar rounded-xl shadow-2xl"
          variants={contentVariants}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#E0CEAA] font-serif">
                Detalhes do Item
              </h2>
              <button onClick={onClose} title="Fechar">
                <FiX size={24} className="text-gray-400 hover:text-white" />
              </button>
            </div>

            {item.image && (
              <div className="flex justify-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-lg bg-gray-700"
                />
              </div>
            )}

            <div className="space-y-4">
              <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
                <div className="flex items-center mb-1">
                  <FiPackage className="text-amber-400 mr-2" size={18} />
                  <span className="text-xs text-gray-300">Nome</span>
                </div>
                <p className="text-white font-medium">{item.name}</p>
              </div>

              <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
                <div className="flex items-center mb-1">
                  <FiFileText className="text-purple-400 mr-2" size={18} />
                  <span className="text-xs text-gray-300">Descrição</span>
                </div>
                <p className="text-white">{item.description}</p>
              </div>

              <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
                <div className="flex items-center mb-1">
                  <FiDollarSign className="text-green-400 mr-2" size={18} />
                  <span className="text-xs text-gray-300">Preço</span>
                </div>
                <p className="text-green-400 font-medium">
                  {formatCurrency(item.price)}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
                  <div className="flex items-center mb-1">
                    <FiTag className="text-blue-400 mr-2" size={18} />
                    <span className="text-xs text-gray-300">Categoria</span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(
                      item.category
                    )}`}
                  >
                    {item.category}
                  </span>
                </div>
                <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
                  <div className="flex items-center mb-1">
                    <FiActivity className="text-green-400 mr-2" size={18} />
                    <span className="text-xs text-gray-300">Status</span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      item.status === "Ativo"
                        ? "bg-green-900 text-green-300"
                        : "bg-red-900 text-red-300"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ViewItemModal;