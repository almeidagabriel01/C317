"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import PackageModal from "./PackageModal";

import "swiper/css";
import "swiper/css/navigation";

const PackagesGrid = ({ packages }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  // Detecta se é tela pequena para usar carousel
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleShowDetails = (pkg) => {
    setSelectedPackage(pkg);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPackage(null);
  };

  // Componente do card individual
  const PackageCard = ({ pkg }) => (
    <div className="cursor-pointer bg-white text-black rounded-xl overflow-hidden shadow-lg w-full max-w-sm mx-auto">
      <div className="relative w-full h-48">
        <Image
          src={`/assets/${pkg.image}`}
          alt={pkg.title}
          fill
          priority
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{pkg.title}</h3>
        <p className="flex items-center gap-2">
          <span>👥 {pkg.guests} convidados</span>
        </p>
        <p className="flex items-center gap-2">
          <span>⏱ {pkg.hours} horas de open bar</span>
        </p>
        <p 
          className="text-[#a85532] mt-2 mb-4 cursor-pointer hover:underline"
          onClick={() => handleShowDetails(pkg)}
        >
          + informações
        </p>
        <p className="text-xl font-bold">{pkg.price}</p>
      </div>
    </div>
  );

  return (
    <div className="relative overflow-hidden px-4 w-full">
      {isSmallScreen ? (
        // Carousel para telas menores
        <div className="max-w-screen-2xl mx-auto">
          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={1}
            centeredSlides={true}
            loop={packages.length > 1}
            navigation={true}
            breakpoints={{
              640: {
                slidesPerView: 2,
                centeredSlides: false,
              },
              768: {
                slidesPerView: 2,
                centeredSlides: false,
              }
            }}
            className="py-4"
          >
            {packages.map((pkg) => (
              <SwiperSlide key={pkg.id} className="flex justify-center">
                <PackageCard pkg={pkg} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        // Grid para telas maiores
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-3 gap-8 justify-items-center">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      )}

      {/* Modal para exibir detalhes e formulário do pacote */}
      <PackageModal 
        isOpen={modalOpen} 
        onClose={closeModal} 
        packageInfo={selectedPackage} 
      />
    </div>
  );
};

export default PackagesGrid;