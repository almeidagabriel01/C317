"use client";

const HeaderSection = () => {
  return (
    <div className="text-center px-4 py-8 md:py-10">
      <h1
        className="text-3xl md:text-4xl lg:text-5xl font-croissant mb-4"
        style={{ color: "#E0CEAA" }}
      >
        Pacotes disponíveis:
      </h1>
      <p className="text-lg md:text-xl max-w-3xl mx-auto">
        Confira algumas opções já montadas para facilitar e escolha a que melhor
        combina com seu evento
      </p>
    </div>
  );
};

export default HeaderSection;