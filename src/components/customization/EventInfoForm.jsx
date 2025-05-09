"use client";

import { motion } from "framer-motion";

export default function EventInfoForm({ 
  formData, 
  onChange, 
  onNext, 
  onBack,
  isValid,
  direction
}) {
  const containerVariants = {
    hidden: (direction) => ({
      opacity: 0,
      x: direction > 0 ? 100 : -100
    }),
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 20,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: (direction) => ({
      opacity: 0,
      x: direction < 0 ? 100 : -100,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15
      }
    })
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 10 }
    }
  };

  const buttonVariants = {
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
    tap: { scale: 0.95 }
  };

  return (
    <motion.div
      key="step1"
      className="flex-grow flex flex-col items-center w-full py-2"
      custom={direction}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="w-full px-4 py-6 flex items-center flex-col flex-grow">
        <motion.div 
          className="w-full max-w-[500px] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] bg-[#1C2431] rounded-lg p-8 shadow-xl"
          variants={itemVariants}
        >
          <h2 className="text-center font-semibold mb-12 px-2">
            <motion.div 
              className="text-2xl sm:text-3xl font-bold text-[#E0CEAA] mb-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              INFORMAÇÕES DO EVENTO
            </motion.div>
            <motion.div 
              className="text-lg text-[#A8937E] mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              Vamos iniciar com as primeiras informações
            </motion.div>
            <motion.div 
              className="h-1 w-24 bg-[#E0CEAA] mx-auto mt-4"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            />
          </h2>

          <form className="flex flex-col gap-6">
            <motion.div className="relative" variants={itemVariants}>
              <label className="text-sm text-[#E0CEAA] mb-1 block">Nome do Evento</label>
              <input
                type="text"
                name="name"
                placeholder="Ex: Casamento Ana e João"
                value={formData.name}
                onChange={onChange}
                className="bg-[#F7F6F3] h-12 text-black px-4 py-2 rounded-md w-full border-2 border-transparent focus:border-[#9D4815] transition-colors focus:outline-none"
              />
            </motion.div>

            <motion.div className="relative" variants={itemVariants}>
              <label className="text-sm text-[#E0CEAA] mb-1 block">Data do Evento</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={onChange}
                className="bg-[#F7F6F3] text-black h-12 px-4 py-2 rounded-md w-full border-2 border-transparent focus:border-[#9D4815] transition-colors focus:outline-none"
                placeholder="Data do evento"
              />
            </motion.div>

            <motion.div className="relative" variants={itemVariants}>
              <label className="text-sm text-[#E0CEAA] mb-1 block">Número de Convidados</label>
              <input
                type="number"
                name="guestCount"
                placeholder="Ex: 100"
                value={formData.guestCount}
                onChange={onChange}
                className="bg-[#F7F6F3] text-black h-12 px-4 py-2 rounded-md w-full border-2 border-transparent focus:border-[#9D4815] transition-colors focus:outline-none"
              />
            </motion.div>

            <motion.div className="relative" variants={itemVariants}>
              <label className="text-sm text-[#E0CEAA] mb-1 block">Duração do Evento</label>
              <input
                type="text"
                name="eventDuration"
                placeholder="Ex: 5 horas"
                value={formData.eventDuration}
                onChange={onChange}
                className="bg-[#F7F6F3] text-black h-12 px-4 py-2 rounded-md w-full border-2 border-transparent focus:border-[#9D4815] transition-colors focus:outline-none"
              />
            </motion.div>

            <motion.div 
              className="flex justify-between mt-8"
              variants={itemVariants}
            >
              <motion.button
                type="button"
                onClick={onBack}
                className="rounded-full w-12 h-12 bg-transparent font-bold border-2 border-[#E0CEAA] text-[#E0CEAA] flex items-center justify-center"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <span className="text-xl">←</span>
              </motion.button>
              
              <motion.button
                type="button"
                onClick={onNext}
                disabled={!isValid}
                className={`rounded-full w-12 h-12 font-bold border-2 flex items-center justify-center transition-all duration-200 ${
                  isValid
                    ? "border-[#E0CEAA] text-[#E0CEAA]"
                    : "border-gray-500 text-gray-500 opacity-50 cursor-not-allowed"
                }`}
                variants={isValid ? buttonVariants : {}}
                whileHover={isValid ? "hover" : undefined}
                whileTap={isValid ? "tap" : undefined}
              >
                <span className="text-xl">→</span>
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}