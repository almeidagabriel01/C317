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

// Definindo os 3 pacotes fixos com itens detalhados
const packages = [
  {
    id: 1,
    title: "Aniversário",
    guests: 80,
    hours: 5,
    price: "R$ 7.500,00",
    priceValue: 750000, // valor em centavos para o backend
    image: "aniversario.jpg",
    items: [
      { ID: 1, quantidade: 1 }, // Gin Tônica
      { ID: 2, quantidade: 1 }, // Mojito
      { ID: 3, quantidade: 1 }, // Caipiroska
      { ID: 4, quantidade: 1 }, // Whisky Sour
      { ID: 5, quantidade: 2 }, // Água mineral
      { ID: 6, quantidade: 2 }, // Refrigerantes
      { ID: 7, quantidade: 1 }, // Estrutura básica
      { ID: 8, quantidade: 2 }, // Bartender
    ],
    details: {
      "Drinks inclusos": [
        "Gin Tônica",
        "Mojito", 
        "Caipiroska",
        "Whisky Sour"
      ],
      "Bebidas não alcoólicas": [
        "Água mineral",
        "Refrigerantes variados",
        "Sucos naturais"
      ],
      "Estrutura": [
        "Bar móvel completo",
        "Decoração temática",
        "Utensílios profissionais"
      ],
      "Equipe": [
        "2 Bartenders profissionais",
        "Montagem e desmontagem"
      ]
    }
  },
  {
    id: 2,
    title: "Casamento",
    guests: 120,
    hours: 6,
    price: "R$ 12.000,00",
    priceValue: 1200000,
    image: "casamento.jpg",
    items: [
      { ID: 1, quantidade: 2 }, // Gin Tônica
      { ID: 2, quantidade: 2 }, // Mojito
      { ID: 3, quantidade: 2 }, // Caipiroska
      { ID: 4, quantidade: 2 }, // Whisky Sour
      { ID: 9, quantidade: 1 }, // Moscow Mule
      { ID: 10, quantidade: 1 }, // Aperol Spritz
      { ID: 5, quantidade: 3 }, // Água mineral
      { ID: 6, quantidade: 3 }, // Refrigerantes
      { ID: 11, quantidade: 1 }, // Estrutura premium
      { ID: 8, quantidade: 3 }, // Bartender
    ],
    details: {
      "Drinks inclusos": [
        "Gin Tônica",
        "Mojito",
        "Caipiroska", 
        "Whisky Sour",
        "Moscow Mule",
        "Aperol Spritz"
      ],
      "Bebidas não alcoólicas": [
        "Água mineral",
        "Refrigerantes variados",
        "Sucos naturais",
        "Água com gás"
      ],
      "Estrutura": [
        "Bar premium completo",
        "Decoração elegante",
        "Utensílios profissionais",
        "Iluminação especial"
      ],
      "Equipe": [
        "3 Bartenders especializados",
        "Montagem e desmontagem",
        "Coordenação do serviço"
      ]
    }
  },
  {
    id: 3,
    title: "Festa Corporativa",
    guests: 100,
    hours: 4,
    price: "R$ 8.500,00",
    priceValue: 850000,
    image: "coorporativo.jpg",
    items: [
      { ID: 1, quantidade: 1 }, // Gin Tônica
      { ID: 4, quantidade: 2 }, // Whisky Sour
      { ID: 12, quantidade: 1 }, // Negroni
      { ID: 13, quantidade: 1 }, // Old Fashioned
      { ID: 5, quantidade: 2 }, // Água mineral
      { ID: 6, quantidade: 2 }, // Refrigerantes
      { ID: 14, quantidade: 1 }, // Café premium
      { ID: 15, quantidade: 1 }, // Estrutura corporativa
      { ID: 8, quantidade: 2 }, // Bartender
    ],
    details: {
      "Drinks inclusos": [
        "Gin Tônica",
        "Whisky Sour",
        "Negroni",
        "Old Fashioned"
      ],
      "Bebidas não alcoólicas": [
        "Água mineral",
        "Refrigerantes",
        "Café premium",
        "Água com gás"
      ],
      "Estrutura": [
        "Bar corporativo",
        "Decoração profissional",
        "Utensílios premium"
      ],
      "Equipe": [
        "2 Bartenders experientes",
        "Montagem e desmontagem",
        "Atendimento corporativo"
      ]
    }
  }
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
            <PackagesGrid packages={packages} />
          </div>
          
          <CustomizeSection />
        </motion.div>
      </main>
    </div>
  );
}