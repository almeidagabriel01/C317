"use client";
import { motion } from "framer-motion";

export const containerVariants = {
  hidden: (direction) => ({
    opacity: 0,
    x: direction > 0 ? 100 : -100,
    transition: { duration: 0.4 }
  }),
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 18,
      duration: 0.4 // ajuste aqui!
    }
  },
  exit: (direction) => ({
    opacity: 0,
    x: direction < 0 ? 100 : -100,
    transition: {
      duration: 0.4 // agora igual ao enter!
    }
  }),
};

export default function FormStepLayout({
  stepKey,
  direction,
  title,
  subtitle,
  children,
  onBack,
  onNext,
  isValid = true,
}) {
  return (
    <motion.div
      key={stepKey}
      className="flex-grow flex flex-col items-center w-full overflow-hidden"
      custom={direction}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex items-center flex-col">
        <div
          className="w-full max-w-screen-xl bg-[#1C2431] rounded-2xl shadow-xl flex flex-col mb-6"
          style={{ height: 'auto', maxHeight: '75vh' }}
        >
          {/* Cabeçalho fixo */}
          <div className="p-4 sm:p-5 pb-3 bg-[#1C2431] rounded-t-2xl">
            <h2 className="text-center font-semibold px-2">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-[#E0CEAA] mb-2">
                {title}
              </div>
              {subtitle && (
                <div className="text-sm sm:text-lg text-[#A8937E]">
                  {subtitle}
                </div>
              )}
              <div className="h-1 w-20 sm:w-24 bg-[#E0CEAA] mx-auto mt-3" />
            </h2>
          </div>
          {/* Conteúdo com scroll */}
          <div
            className="p-4 sm:px-5 pt-2 pb-2 overflow-y-auto custom-scrollbar"
            style={{ maxHeight: 'calc(75vh - 160px)' }}
          >
            {children}
          </div>
          {/* Rodapé fixo */}
          <div className="p-4 sm:px-5 pt-3 pb-4 bg-[#1C2431] rounded-b-2xl border-t border-gray-700/30">
            <div className="flex justify-between">
              <button
                type="button"
                onClick={onBack}
                className="rounded-full w-10 h-10 sm:w-12 sm:h-12 bg-transparent font-bold border-2 border-[#E0CEAA] text-[#E0CEAA] flex items-center justify-center"
              >
                <span className="text-lg">←</span>
              </button>
              <button
                type="button"
                onClick={onNext}
                disabled={!isValid}
                className={`rounded-full w-10 h-10 sm:w-12 sm:h-12 font-bold border-2 flex items-center justify-center transition-all duration-200 ${isValid ? "border-[#E0CEAA] text-[#E0CEAA]" : "border-gray-500 text-gray-500 opacity-50 cursor-not-allowed"
                  }`}
              >
                <span className="text-lg">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}