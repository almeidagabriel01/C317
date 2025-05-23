"use client";

import { motion } from "framer-motion";

export default function CustomStepper({ steps, currentStep, direction, onStepClick }) {
  return (
    <div className="flex justify-center mt-4 pt-4 sm:pt-6 pb-4 px-4 sm:px-0 w-full">
      <div className="flex items-center">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center">
            <motion.button
              type="button"
              onClick={() => onStepClick && onStepClick(i)}
              disabled={i === currentStep}
              aria-label={`Ir para etapa ${step}`}
              className={`
                relative w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center
                transition-all duration-200
                ${i <= currentStep ? "border-[#CC5E00] bg-[#CC5E00]" : "border-[#815a1b] bg-transparent"}
                ${i !== currentStep ? "cursor-pointer hover:ring-2 hover:ring-[#E0CEAA]/70" : ""}
                ${i === currentStep ? "cursor-default opacity-80" : ""}
              `}
              initial={false}
              animate={{
                scale: i === currentStep ? 1.2 : 1,
                backgroundColor: i <= currentStep ? "#CC5E00" : "rgba(204, 94, 0, 0)",
                borderColor: i <= currentStep ? "#CC5E00" : "#815a1b",
              }}
              transition={{ duration: 0.4, delay: i === currentStep && direction > 0 ? 0.3 : 0 }}
            >
              {i < currentStep && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center text-white text-[8px] sm:text-xs"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  ✓
                </motion.div>
              )}
            </motion.button>

            {i < steps.length - 1 && (
              <div className="relative h-[1px] w-8 sm:w-10 mx-1 overflow-hidden">
                <div className="absolute inset-0 bg-[#3A3A3A]" />
                <motion.div
                  className="absolute inset-0 bg-[#CC5E00] origin-left"
                  initial={false}
                  animate={{ scaleX: i < currentStep ? 1 : 0 }}
                  transition={{
                    duration: 0.6,
                    ease: "easeOut",
                    delay: direction > 0 ? (i === currentStep - 1 ? 0.2 : 0) : (i === currentStep ? 0.2 : 0),
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}