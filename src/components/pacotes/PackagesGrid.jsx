"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import PackageModal from "./packageModal";

import "swiper/css";
import "swiper/css/navigation";

const PackagesGrid = ({ packages }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);
  const [imageErrors, setImageErrors] = useState(new Set());

  useEffect(() => {
    const checkScreenSize = () => setIsSmallScreen(window.innerWidth < 1024);
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

  // Função para lidar com erro de imagem
  const handleImageError = (imageName) => {
    setImageErrors(prev => new Set([...prev, imageName]));
  };

  // Função para obter o src da imagem com fallback
  const getImageSrc = (imageName) => {
    if (imageErrors.has(imageName)) {
      return '/assets/default-event.jpg';
    }
    return `/assets/${imageName}?v=${Date.now()}`; // Cache busting
  };

  const PackageCard = ({ pkg, index = 0 }) => (
    <div className="cursor-pointer bg-white text-black rounded-xl overflow-hidden shadow-lg w-full max-w-sm mx-auto">
      <div className="relative w-full h-48">
        <Image
          src={getImageSrc(pkg.image)}
          alt={pkg.title || 'Evento'}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={index < 3}
          className="object-cover"
          onError={() => handleImageError(pkg.image)}
          unoptimized={imageErrors.has(pkg.image)}
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{pkg.title}</h3>
        <p className="flex items-center gap-2"><span>👥 {pkg.guests} convidados</span></p>
        <p className="flex items-center gap-2"><span>⏱ {pkg.hours} horas de open bar</span></p>
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
        <div className="max-w-screen-2xl mx-auto relative overflow-visible px-16">
          {/* Botões de navegação ajustados ao lado */}
          <div
            ref={setPrevEl}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white rounded-full shadow-md cursor-pointer hover:bg-[#FFF8E7] transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-[#CC5E00]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 18L9 12L15 6" />
            </svg>
          </div>
          <div
            ref={setNextEl}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white rounded-full shadow-md cursor-pointer hover:bg-[#FFF8E7] transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-[#CC5E00]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6L15 12L9 18" />
            </svg>
          </div>

          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={1}
            centeredSlides={true}
            loop={packages.length > 1}
            navigation={{ prevEl, nextEl }}
            onInit={(swiper) => {
              swiper.params.navigation.prevEl = prevEl;
              swiper.params.navigation.nextEl = nextEl;
              swiper.navigation.init();
              swiper.navigation.update();
            }}
            breakpoints={{
              640: { slidesPerView: 2, centeredSlides: false },
              768: { slidesPerView: 2, centeredSlides: false }
            }}
            className="py-4"
          >
            {packages.map((pkg, index) => (
              <SwiperSlide key={pkg.id} className="flex justify-center">
                <PackageCard pkg={pkg} index={index} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-3 gap-8 justify-items-center">
            {packages.map((pkg, index) => (
              <PackageCard key={pkg.id} pkg={pkg} index={index} />
            ))}
          </div>
        </div>
      )}
      <PackageModal
        isOpen={modalOpen}
        onClose={closeModal}
        packageInfo={selectedPackage}
      />
    </div>
  );
};

export default PackagesGrid;