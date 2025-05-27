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
        return "bg-gray-900 text-gray-300";
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
          className="relative bg-[#1C2431] w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl 
                     max-h-[95vh] overflow-y-auto custom-scrollbar rounded-xl shadow-2xl"
          variants={contentVariants}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-3 sm:p-4 md:p-6 custom-scrollbar">
            {/* Header com botão de fechar no mobile */}
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#E0CEAA] font-serif">
                Detalhes do Item
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-white disabled:opacity-50"
                title="Fechar modal"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-4 md:space-y-6">
              {/* Imagem do Item */}
              {item.image && (
                <div className="flex justify-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 object-cover rounded-lg bg-gray-700"
                  />
                </div>
              )}

              {/* Informações do Item - Layout adaptativo */}

              {/* Nome */}
              <div className="sm:col-span-2 bg-gray-700 bg-opacity-50 p-3 md:p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <FiPackage className="text-amber-400 mr-2" size={18} />
                  <span className="text-xs sm:text-sm text-gray-300 font-sans">
                    Nome
                  </span>
                </div>
                <p className="text-white font-medium font-sans text-sm sm:text-base break-words">
                  {item.name}
                </p>
              </div>

              {/* Descrição */}
              <div className="bg-gray-700 bg-opacity-50 p-3 md:p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <FiFileText className="text-purple-400 mr-2" size={18} />
                  <span className="text-xs sm:text-sm text-gray-300 font-sans">
                    Descrição
                  </span>
                </div>
                <p className="text-white font-sans leading-relaxed text-sm sm:text-base break-words">
                  {item.description}
                </p>
              </div>

              {/* Preço */}
              <div className="bg-gray-700 bg-opacity-50 p-3 md:p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <FiDollarSign className="text-green-400 mr-2" size={18} />
                  <span className="text-xs sm:text-sm text-gray-300 font-sans">
                    Preço
                  </span>
                </div>
                <p className="text-green-400 font-medium text-base sm:text-lg md:text-xl font-sans">
                  R${" "}
                  {item.price
                    ? (item.price / 100).toFixed(2).replace(".", ",")
                    : "0,00"}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {/* Categoria */}
                <div className="bg-gray-700 bg-opacity-50 p-3 md:p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FiTag className="text-blue-400 mr-2" size={18} />
                    <span className="text-xs sm:text-sm text-gray-300 font-sans">
                      Categoria
                    </span>
                  </div>
                  <span
                    className={`text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full ${getCategoryColor(
                      item.category
                    )} inline-block`}
                  >
                    {item.category}
                  </span>
                </div>

                {/* Status */}
                <div className="bg-gray-700 bg-opacity-50 p-3 md:p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FiActivity className="text-green-400 mr-2" size={18} />
                    <span className="text-xs sm:text-sm text-gray-300 font-sans">
                      Status
                    </span>
                  </div>
                  <span
                    className={`text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full ${item.status === "Ativo"
                        ? "bg-green-900 text-green-300"
                        : "bg-red-900 text-red-300"
                      } inline-block`}
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