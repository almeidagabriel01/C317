"use client";

import { useRouter } from "next/navigation";

const CustomizeSection = () => {
  const router = useRouter();

  const handleNext = () => {
    router.push("/personalizar");
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 py-10 px-4 md:px-16">
      <p className="text-xl text-center md:text-left">
        Não encontrou um pacote? Que tal montar um do seu jeito!
      </p>
      <button
        onClick={handleNext}
        className="bg-[#9D4815] hover:bg-[#924d2b] text-white font-bold py-3 px-6 rounded-full transition-all"
      >
        Personalizar Pacote
      </button>
    </div>
  );
};

export default CustomizeSection;