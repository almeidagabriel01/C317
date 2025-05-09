"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Hero() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleOrcamentoClick = () => {
    if (isAuthenticated) {
      router.push("/pacotes");
    } else {
      router.push("/login");
    }
  };

  return (
    <section className="flex flex-col md:flex-row min-h-screen overflow-hidden">
      {/* imagem ocupa toda a largura em mobile e metade em desktop */}
      <div className="w-full md:w-1/2 relative h-80 sm:h-96 md:h-auto">
        <Image
          src="/assets/hero.jpg"
          alt="Drink sendo servido"
          fill
          priority
          style={{ objectFit: "cover" }}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      {/* texto ocupa toda a largura em mobile e metade em desktop */}
      <div
        className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-8 flex-1"
        style={{ backgroundColor: "#101820" }}
      >
        <h1
          className="text-3xl md:text-4xl lg:text-5xl mb-4 font-croissant"
          style={{ color: "#E0CEAA" }}
        >
          Eleve seus eventos
        </h1>
        <p
          className="mb-6 text-base md:text-lg font-spline"
          style={{ color: "#F7F6F3" }}
        >
          Trabalhamos com os melhores produtos do mercado, insumos frescos e
          ingredientes artesanais. Somos especializados em serviços de
          coquetelaria para eventos sociais e eventos corporativos.
        </p>
        <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#b45309" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOrcamentoClick}
            className="bg-amber-700 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-amber-600 transition-colors"
          >
            Faça um orçamento
          </motion.button>
      </div>
    </section>
  );
}