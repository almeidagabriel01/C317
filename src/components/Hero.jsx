"use client";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* imagem ocupa metade esquerda */}
      <div className="md:w-1/2 w-full relative">
        <Image
          src="/assets/hero.jpg"
          alt="Drink sendo servido"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* texto ocupa metade direita */}
      <div
        className="md:w-1/2 w-full flex flex-col justify-center p-8"
        style={{ backgroundColor: "#101820" }}
      >
        <h1
          className="text-5xl mb-4 font-croissant"
          style={{ color: "#E0CEAA" }}
        >
          Eleve seus eventos
        </h1>
        <p
          className="mb-6 text-lg font-spline"
          style={{ color: "#F7F6F3" }}
        >
          Trabalhamos com os melhores produtos do mercado, insumos frescos e
          ingredientes artesanais. Somos especializados em serviços de
          coquetelaria para eventos sociais e eventos corporativos.
        </p>
        <button
          className="
            flex items-center justify-center
            bg-primary text-accent
            px-6 py-3 rounded-full
            text-lg font-medium
            shadow-lg
            hover:opacity-90
            transition
          "
        >
          Faça um orçamento
        </button>
      </div>
    </section>
  );
}