"use client";

import Navbar from "../../components/home/Navbar";
import { useAuth } from "@/context/AuthContext";
import Stepper from "../../components/customization/Stepper";
import { useRouter } from "next/navigation";

export default function EventForm() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const router = useRouter();

  const handleNext = () => {
    router.push("/personalizar-2");
  };

  return (
    <div className="flex flex-col overflow-hidden min-h-screen bg-[#101820] text-white">
      {/* Navbar */}
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={logout} />

      {/* Stepper */}
      <Stepper />

      {/* Form */}
      <div className="w-full px-4 py-6 flex items-center flex-col">
        <div className="w-full max-w-[500px] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px]">
          <h2 className="text-center text-xl sm:text-2xl font-semibold mb-6 px-2">
            VAMOS INICIAR COM AS PRIMEIRAS INFORMAÇÕES
          </h2>

          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Nome"
              className="bg-[#F7F6F3] h-12 text-black px-4 py-2 mb-2 rounded w-full"
            />

            <input
              type="date"
              className="bg-[#F7F6F3] text-black h-12 px-4 py-2 rounded mb-2 pr-10 w-full appearance-none placeholder-transparent"
              placeholder="Data do evento"
            />

            <input
              type="number"
              placeholder="Número de convidados"
              className="bg-[#F7F6F3] text-black h-12 mb-2 px-4 py-2 rounded"
            />

            <input
              type="text"
              placeholder="Carga horária da festa"
              className="bg-[#F7F6F3] text-black mb-2 h-12 px-4 py-2 rounded"
            />

            <div className="flex justify-center  mt-6">
              <button
                type="button"
                onClick={handleNext}
                className="rounded-full w-10 sm:w-12 sm:h-12 h-10 bg-transparent font-bold border border-[#F7F6F3] text-[#F7F6F3] hover:bg-[#9D4815] hover:text-white flex items-center justify-center"
              >
                ➝
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
