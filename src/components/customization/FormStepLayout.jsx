"use client";

import { motion } from "framer-motion";

export const containerVariants = {
  hidden: (direction) => ({ opacity: 0, x: direction > 0 ? 100 : -100 }),
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 70, damping: 20, when: "beforeChildren", staggerChildren: 0.1 } },
  exit: (direction) => ({ opacity: 0, x: direction < 0 ? 100 : -100, transition: { type: "spring", stiffness: 80, damping: 15 } }),
};

export const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 10 } },
};

export const buttonVariants = {
  hover: { scale: 1.05, backgroundColor: "#9D4815", color: "#fff", transition: { type: "spring", stiffness: 400, damping: 10 } },
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
      className="flex-grow flex flex-col items-center w-full py-4 sm:py-6"
      custom={direction}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 flex items-center flex-col flex-grow">
        <motion.div
          className="w-full max-w-screen-xl bg-[#1C2431] rounded-2xl p-6 sm:p-8 shadow-xl"
          variants={itemVariants}
        >
          <h2 className="text-center font-semibold mb-6 sm:mb-12 px-2">
            <motion.div className="text-xl sm:text-2xl md:text-3xl font-bold text-[#E0CEAA] mb-2" variants={itemVariants}>
              {title}
            </motion.div>
            {subtitle && (
              <motion.div className="text-sm sm:text-lg text-[#A8937E]" variants={itemVariants}>
                {subtitle}
              </motion.div>
            )}
            <motion.div className="h-1 w-20 sm:w-24 bg-[#E0CEAA] mx-auto mt-4" variants={itemVariants} />
          </h2>

          {children}

          <motion.div className="flex justify-between mt-6 sm:mt-8" variants={itemVariants}>
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
              className={`rounded-full w-10 h-10 sm:w-12 sm:h-12 font-bold border-2 flex items-center justify-center transition-all duration-200 ${
                isValid ? "border-[#E0CEAA] text-[#E0CEAA]" : "border-gray-500 text-gray-500 opacity-50 cursor-not-allowed"
              }`}
              variants={isValid ? buttonVariants : {}}
              whileHover={isValid ? "hover" : undefined}
              whileTap={isValid ? "tap" : undefined}
            >
              <span className="text-lg">→</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}