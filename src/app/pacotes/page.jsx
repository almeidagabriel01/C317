"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Navbar from "@/components/navbar/Navbar";
import { useAuth } from "@/context/AuthContext";
import HeaderSection from "@/components/pacotes/HeaderSection";
import PackagesGrid from "@/components/pacotes/PackagesGrid";
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
    id: 1,
    title: "Aniversário",
    guests: 80,
    hours: 5,
    price: "R$ 9.500,00",
    image: "aniversario.jpg",
  },
  {
    id: 2,
    title: "Casamento",
    guests: 120,
    hours: 6,
    price: "R$ 12.500,00",
    image: "casamento.jpg",
  },
  {
    id: 3,
    title: "Festa Corporativa",
    guests: 100,
    hours: 4,
    price: "R$ 9.500,00",
    image: "coorporativo.jpg",
  }
];

export default function PackagesPage() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      const isVoluntaryLogout = sessionStorage.getItem('voluntaryLogout') === 'true';

      if (!isVoluntaryLogout) {
        toast.warning('Você precisa estar logado para acessar os pacotes.');
      } else {
        sessionStorage.removeItem('voluntaryLogout');
      }

      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

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
            <PackagesGrid packages={packages} />
          </div>

          <CustomizeSection />
        </motion.div>
      </main>
    </div>
  );
}