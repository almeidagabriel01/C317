"use client";

import { useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import Navbar from "../../components/home/Navbar";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
    image: "debutante2.jpeg",
  },
  {
    title: "Casamento",
    guests: 200,
    hours: 8,
    price: "R$ 20.000,00",
    image: "casamento1.jpg",
  },
  {
    title: "Festa Debutante",
    guests: 200,
    hours: 6,
    price: "R$ 17.000,00",
    image: "debutante1.jpg",
  },
  {
    title: "Festa Corporativa",
    guests: 100,
    hours: 5,
    price: "R$ 8.000,00",
    image: "corporativa.jpg",
  },
];

export default function PackagesSection() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const carouselRef = useRef(null);
  const router = useRouter();

  const handleNext = () => {
    router.push("/personalizar");
  };

  const scrollLeft = () => {
    carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="bg-[#101820] text-white ">
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={logout} />
      {/* Título e subtítulo */}
      <h1
        className="text-3xl md:text-4xl lg:text-5xl ml-16 mb-4 font-croissant m-8"
        style={{ color: "#E0CEAA" }}
      >
        Pacotes disponíveis:
      </h1>
      <p className="text-lg md:text-xl m-8 ml-16">
        Confira algumas opções já montadas para facilitar e escolha a que melhor
        combina com seu evento
      </p>

      {/* Carrossel */}
      <div className="relative no-scrollbar">
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full m-5"
        >
          <ChevronLeftIcon className="h-6 w-6 text-white" />
        </button>

        <div
          ref={carouselRef}
          className="flex overflow-x-auto gap-6 scroll-smooth snap-x snap-mandatory mt-8 mb-8 ml-16 mr-16"
          style={{
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // Internet Explorer 10+
          }}
        >
          {/* Chrome, Safari e outros navegadores baseados em WebKit */}
          <style>
            {`
                div::-webkit-scrollbar {
                    display: none;
                }
            `}
          </style>

          {packages.map((pkg, index) => (
            <div
              key={index}
              className="bg-white text-black rounded-xl overflow-hidden shadow-lg min-w-[280px] md:min-w-[320px] snap-start"
            >
              <Image
                src={`/assets/${pkg.image}`}
                alt={pkg.title}
                width={320}
                height={200}
                className="w-full h-48 object-cover"
              />

              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{pkg.title}</h3>
                <p className="flex items-center gap-2">
                  <span>👥 {pkg.guests} convidados</span>
                </p>
                <p className="flex items-center gap-2">
                  <span>⏱ {pkg.hours} horas de open bar</span>
                </p>
                <p className="text-[#a85532] mt-2 mb-4 cursor-pointer hover:underline">
                  + informações
                </p>
                <p className="text-xl font-bold">{pkg.price}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full m-5"
        >
          <ChevronRightIcon className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Botão de personalizar */}
      <div className="flex flex-row items-center mt-10">
        <p className="text-xl mb-4 ml-16 mr-8 ">
          Não encontrou um pacote? Que tal montar um do seu jeito!
        </p>
        <button
          onClick={handleNext}
          className="bg-[#9D4815] hover:bg-[#924d2b] text-white font-bold py-3 -mt-4 px-6 rounded-full transition-all"
        >
          Personalizar Pacote
        </button>
      </div>
    </div>
  );
}
