"use client";

import Navbar from "../../components/home/Navbar";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { useRouter } from "next/navigation";

const events = [
  { img: "casamento.jpg", name: "Casamento" },
  { img: "aniversario.jpg", name: "Aniversário" },
  { img: "coorporativo.jpg", name: "Festa Corporativa" },
];

export default function App() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const router = useRouter();

  const handleClick = (eventName) => {
    router.push(`/personalizar-1?`);
  };

  return (
    <div className="bg-[#101820] text-white h-full">
      {/* Navbar */}
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={logout} />

      <section className="text-center py-16 px-4">
        <h1
          className="text-2xl md:text-4xl lg:text-5xl ml-16 mb-4 font-croissant m-8"
          style={{ color: "#E0CEAA" }}
        >
          Personalize o evento do seu jeito!
        </h1>
        <p className="text-lg text-white mt-4 mb-10">
          Para começar, selecione qual o evento iremos oferecer a melhor
          experiência com drinks:
        </p>

        {/* Event Options */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-12 mb-12">
          {events.map((event, idx) => (
            <button
              key={idx}
              onClick={handleClick}
              className="flex flex-col items-center focus:outline-none"
            >
              <div>
                <Image
                  src={`/assets/${event.img}`}
                  alt={event.name}
                  width={250}
                  height={250}
                  className="rounded-full object-cover w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 shadow-lg hover:scale-105 transition"
                />
              </div>
              <p className="mt-4 text-white text-lg">{event.name}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
