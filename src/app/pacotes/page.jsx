"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Navbar from "@/components/navbar/Navbar";
import { useAuth } from "@/context/AuthContext";
import HeaderSection from "@/components/pacotes/HeaderSection";
import PackagesCarousel from "@/components/pacotes/PackagesCarousel";
import CustomizeSection from "@/components/pacotes/CustomizeSection";

const fadeVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const packages = [
  {
    title: "Casamento",
    guests: 100,
    hours: 6,
    price: "R$ 9.000,00",
    image: "casamento.jpg",
  },
  {
    title: "Festa Debutante",
    guests: 150,
    hours: 6,
    price: "R$ 14.000,00",
    image: "debutante1.jpg",
  },
  {
    title: "Festa Debutante 2",
    guests: 200,
    hours: 8,
    price: "R$ 20.000,00",
    image: "debutante2.jpeg",
  },
  {
    title: "Festa Corporativa",
    guests: 100,
    hours: 5,
    price: "R$ 8.000,00",
    image: "corporativa.jpg",
  },
  {
    title: "Festa Corporativa 2",
    guests: 120,
    hours: 7,
    price: "R$ 9.000,00",
    image: "corporativa.jpg",
  },
];

export default function PackagesPage() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Verificar se o usuário está autenticado
    if (!loading && !isAuthenticated) {
      toast.warning('Você precisa estar logado para acessar os pacotes.');
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Mostrar um loader enquanto verifica autenticação
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#101820] text-white justify-center items-center">
        <Navbar isAuthenticated={false} />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-xl">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, não renderiza o conteúdo
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#101820] text-white">
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={logout} />
      
      <main className="flex-grow flex flex-col">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeVariants}
          className="flex-grow flex flex-col"
        >
          <HeaderSection />
          
          <div className="flex-grow flex items-center justify-center my-4">
            <PackagesCarousel packages={packages} />
          </div>
          
          <CustomizeSection />
        </motion.div>
      </main>
    </div>
  );
}