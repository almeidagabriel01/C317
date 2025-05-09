"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const events = [
  { img: "casamento.jpg", name: "Casamento" },
  { img: "aniversario.jpg", name: "Aniversário" },
  { img: "coorporativo.jpg", name: "Festa Corporativa" },
];

export default function EventTypeSelector({ onSelect, direction }) {
  // Animation settings for smooth transitions
  const containerVariants = {
    hidden: (direction) => ({
      opacity: 0,
      x: direction > 0 ? 100 : -100,
    }),
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 65,
        damping: 15,
        when: "beforeChildren",
        staggerChildren: 0.15,
      },
    },
    exit: (direction) => ({
      opacity: 0,
      x: direction < 0 ? 100 : -100,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 15,
      }
    })
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 80, 
        damping: 14 
      }
    },
    exit: { 
      y: -20, 
      opacity: 0,
      transition: { 
        duration: 0.3 
      }
    }
  };

  return (
    <motion.section
      key="step0"
      className="flex-grow flex flex-col items-center justify-center py-10 px-4 sm:py-12 lg:py-16"
      custom={direction}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.h1
        className="text-2xl md:text-4xl lg:text-5xl mb-6 font-croissant text-center"
        style={{ color: "#E0CEAA" }}
        variants={itemVariants}
        custom={direction}
      >
        Personalize o evento do seu jeito!
      </motion.h1>
      
      <motion.p 
        className="text-lg text-white mt-2 mb-10 text-center max-w-2xl"
        variants={itemVariants}
        custom={direction}
      >
        Para começar, selecione qual o evento iremos oferecer a melhor
        experiência com drinks:
      </motion.p>

      <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 mb-8 md:mb-12">
        {events.map((event, idx) => (
          <motion.button
            key={idx}
            onClick={() => onSelect(event.name)}
            className="flex flex-col items-center focus:outline-none group transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            variants={itemVariants}
            custom={direction}
          >
            <div className="overflow-hidden rounded-full border-2 border-transparent group-hover:border-[#E0CEAA] transition-all duration-300">
              <Image
                src={`/assets/${event.img}`}
                alt={event.name}
                width={250}
                height={250}
                className="rounded-full object-cover w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 shadow-lg transition-transform duration-300 group-hover:brightness-110"
              />
            </div>
            <p className="mt-4 text-[#E0CEAA] text-lg font-medium">{event.name}</p>
          </motion.button>
        ))}
      </div>
    </motion.section>
  );
}