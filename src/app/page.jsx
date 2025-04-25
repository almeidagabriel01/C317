"use client";

import { motion } from "framer-motion";
import Navbar from "../components/home/Navbar";
import Hero from "../components/home/Hero";
import Carousel from "../components/home/Carousel";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const fadeVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function Home() {
  const { user, isAuthenticated, logout, loading } = useAuth();

  return (
    <div className="flex flex-col overflow-hidden min-h-screen bg-gray-900 text-white">
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={logout} />

      <main className="flex-grow">
        <motion.div
          className="w-full"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeVariants}
        >
          <Hero />
        </motion.div>

        <Carousel />

        <div className="text-center py-10 px-4">
          {loading ? (
            <p>Verificando autenticação...</p>
          ) : isAuthenticated && user?.email ? (
            <p className="text-lg text-green-400">Bem-vindo(a) de volta, {user.email}!</p>
          ) : !isAuthenticated ? (
            <p className="text-lg text-amber-400">Faça <Link href="/login" className="underline hover:text-amber-300">login</Link> ou <Link href="/cadastro" className="underline hover:text-amber-300">cadastre-se</Link> para aproveitar mais.</p>
          ) : null}
        </div>
      </main>
    </div>
  );
}