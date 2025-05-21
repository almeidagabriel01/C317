"use client";

import { motion } from "framer-motion";

export const containerVariants = {
  hidden: (direction) => ({ opacity: 0, x: direction > 0 ? 100 : -100 }),
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 20,
      when: "beforeChildren",
      staggerChildren: 0.05,
      duration: 0.15
    }
  },
  exit: (direction) => ({
    opacity: 0,
    x: direction < 0 ? 100 : -100,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.1
    }
  }),
};

export const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 10,
      duration: 0.1
    }
  },
};

export const buttonVariants = {
  hover: {
    scale: 1.05,
    backgroundColor: "#9D4815",
    color: "#fff",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
  tap: { scale: 0.95 },
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
        <motion.div
          className="w-full max-w-screen-xl bg-[#1C2431] rounded-2xl shadow-xl flex flex-col mb-6"
          variants={itemVariants}
          style={{ height: 'auto', maxHeight: '75vh' }}
        >
          {/* Cabeçalho fixo */}
          <div className="p-4 sm:p-5 pb-3 bg-[#1C2431] rounded-t-2xl">
            <h2 className="text-center font-semibold px-2">
              <motion.div className="text-xl sm:text-2xl md:text-3xl font-bold text-[#E0CEAA] mb-2" variants={itemVariants}>
                {title}
              </motion.div>
              {subtitle && (
                <motion.div className="text-sm sm:text-lg text-[#A8937E]" variants={itemVariants}>
                  {subtitle}
                </motion.div>
              )}
              <motion.div className="h-1 w-20 sm:w-24 bg-[#E0CEAA] mx-auto mt-3" variants={itemVariants} />
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
            <motion.div className="flex justify-between" variants={itemVariants}>
              <motion.button
                type="button"
                onClick={onBack}
                className="rounded-full w-10 h-10 sm:w-12 sm:h-12 bg-transparent font-bold border-2 border-[#E0CEAA] text-[#E0CEAA] flex items-center justify-center"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <span className="text-lg">←</span>
              </motion.button>
              <motion.button
                type="button"
                onClick={onNext}
                disabled={!isValid}
                className={`rounded-full w-10 h-10 sm:w-12 sm:h-12 font-bold border-2 flex items-center justify-center transition-all duration-200 ${isValid ? "border-[#E0CEAA] text-[#E0CEAA]" : "border-gray-500 text-gray-500 opacity-50 cursor-not-allowed"
                  }`}
                variants={isValid ? buttonVariants : {}}
                whileHover={isValid ? "hover" : undefined}
                whileTap={isValid ? "tap" : undefined}
              >
                <span className="text-lg">→</span>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}