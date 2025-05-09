"use client";

import Navbar from "../../components/home/Navbar";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Stepper from "../../components/customization/Stepper";
import Image from "next/image";
import { useRouter } from "next/navigation";

const drinks = [
  {
    name: "COSMOPOLITAN",
    description: "vodka, licor de laranja, suco de cranberry e suco de limão",
    image: "cosmopolitan.jpg",
  },
  {
    name: "MOJITO",
    description: "rum, o açúcar, hortelã, limão e água gaseificada",
    image: "mojito.jpg",
  },
  {
    name: "BELLINI",
    description: "suco de pêssego e espumante",
    image: "bellini.jpg",
  },
  {
    name: "DRY MARTINI",
    description: "vodka, licor de laranja, suco de cranberry e suco de limão",
    image: "dry-martini.jpeg",
  },
  {
    name: "BLOOD MARY",
    description: "vodka, licor de laranja, suco de cranberry e suco de limão",
    image: "bloody-mary.jpg",
  },
  {
    name: "PINA COLADA",
    description: "vodka, licor de laranja, suco de cranberry e suco de limão",
    image: "pina-colada.jpg",
  },
  {
    name: "MARGARITA TRADICIONAL",
    description: "",
    image: "pina-colada.jpg",
  },
  {
    name: "NEGRONI",
    description: "",
    image: "pina-colada.jpg",
  },
  {
    name: "CLERICOT",
    description: "vodka, licor de laranja, suco de cranberry e suco de limão",
    image: "pina-colada.jpg",
  },
  {
    name: "OLD FASHIONED",
    description: "rum, o açúcar, hortelã, limão e água gaseificada",
    image: "pina-colada.jpg",
  },
  {
    name: "WHISKY SOUR",
    description: "suco de pêssego e espumante",
    image: "pina-colada.jpg",
  },
  {
    name: "TOM COLLINS",
    description: "vodka, licor de laranja, suco de cranberry e suco de limão",
    image: "pina-colada.jpg",
  },
  {
    name: "SEX ON THE BEACH",
    description: "vodka, licor de laranja, suco de cranberry e suco de limão",
    image: "sexonthebeach.jpg",
  },
  {
    name: "MOSCOW MULE",
    description: "vodka, licor de laranja, suco de cranberry e suco de limão",
    image: "moscowmule.jpg",
  },
  {
    name: "GIN TÔNICA",
    description: "",
    image: "gintonica.jpg",
  },
  {
    name: "CAIPIRINHAS",
    description: "",
    image: "caipirinha.jpg",
  },
];

function DrinkSelection() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const router = useRouter();

  const handleBack = () => {
    router.push("/personalizar-1");
  };

  const [selectedDrinks, setSelectedDrinks] = useState([]);

  const toggleDrink = (drinkName) => {
    setSelectedDrinks((prev) =>
      prev.includes(drinkName)
        ? prev.filter((d) => d !== drinkName)
        : [...prev, drinkName]
    );
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#101820] text-white mb-4">
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={logout} />

      <Stepper />
      <div className="bg-white text-black w-full max-w-6xl rounded-2xl p-6 px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-xl font-semibold mb-6">
          DENTRE NOSSOS DRINKS ESPECIAIS SELECIONE QUAIS GOSTARIA DE TER EM SUA
          FESTA:
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 md:px-0">
          {drinks.map((drink) => (
            <label
              key={drink.name}
              className="flex items-start gap-4 border-b pb-2 cursor-pointer"
            >
              <div className="min-w-[24px]">
                <input
                  type="checkbox"
                  checked={selectedDrinks.includes(drink.name)}
                  onChange={() => toggleDrink(drink.name)}
                  className="appearance-none w-4 h-4 rounded-full border-2 border-[#9D4815] checked:bg-[#9D4815] mt-4
             transition duration-200 ease-in-out ring-2 ring-white ring-inset"
                />
              </div>
              <div className="relative w-16 h-16 aspect-w-1 aspect-h-1 min-w-[64px]">
                <Image
                  src={`/assets/${drink.image}`}
                  alt={drink.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded"
                />
              </div>
              <div>
                <div className="font-bold uppercase">{drink.name}</div>
                <div className="text-sm text-gray-600">{drink.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>
      <div className="flex justify-between w-full max-w-6xl mt-6">
        <button
          onClick={handleBack}
          className="rounded-full w-10 sm:w-12 sm:h-12 h-10 bg-transparent font-bold border border-[#F7F6F3] text-[#F7F6F3] hover:bg-[#9D4815] hover:text-white flex items-center justify-center"
        >
          <span className="text-xl">←</span>
        </button>
        <button className="rounded-full w-10 sm:w-12 sm:h-12 h-10 bg-transparent font-bold border border-[#F7F6F3] text-[#F7F6F3] hover:bg-[#9D4815] hover:text-white flex items-center justify-center">
          <span className="text-xl">→</span>
        </button>
      </div>
    </div>
  );
}

export default DrinkSelection;
