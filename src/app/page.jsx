"use client";

import { motion } from "framer-motion";

import Navbar   from "../components/Navbar";
import Hero     from "../components/Hero";
import Carousel from "../components/Carousel";

const fadeVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function Home() {
  return (
    <div className="flex flex-col overflow-hidden">
      <Navbar />

      <motion.div
        className="w-full bg-dark"
        style={{ backgroundColor: "#101820" }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={fadeVariants}
      >
        <Hero />
      </motion.div>

      <Carousel />
    </div>
  );
}