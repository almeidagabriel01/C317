"use client";

import { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import PackageModal from "./PackageModal";

import "swiper/css";
import "swiper/css/navigation";

const PackagesCarousel = ({ packages }) => {
  const [slidesPerView, setSlidesPerView] = useState(4);
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [imageErrors, setImageErrors] = useState(new Set());

  // Ajusta slidesPerView conforme largura
  useEffect(() => {
    const updateSlides = () => {
      const w = window.innerWidth;
      if (w < 640) setSlidesPerView(1);
      else if (w < 768) setSlidesPerView(2);
      else if (w < 1024) setSlidesPerView(3);
      else setSlidesPerView(4);
    };
    updateSlides();
    window.addEventListener("resize", updateSlides);
    return () => window.removeEventListener("resize", updateSlides);
  }, []);

  // Só ativa loop quando realmente há mais slides que o slidesPerView
  const loopEnabled = packages.length > slidesPerView;

  const handleShowDetails = (pkg) => {
    setSelectedPackage(pkg);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
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

  return (
    <div className="relative overflow-hidden px-4">
      <div className="max-w-screen-2xl mx-auto px-16 relative">
        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={slidesPerView}
          loop={loopEnabled}
          centerInsufficientSlides={true}
          navigation={{ prevEl, nextEl }}
          onInit={(swiper) => {
            swiper.params.navigation.prevEl = prevEl;
            swiper.params.navigation.nextEl = nextEl;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          className="py-4"
        >
          {packages.map((pkg, idx) => (
            <SwiperSlide key={idx} className="flex justify-center">
              <div className="cursor-pointer bg-white text-black rounded-xl overflow-hidden shadow-lg w-full">
                <div className="relative w-full h-48">
                  <Image
                    src={getImageSrc(pkg.image)}
                    alt={pkg.title || 'Evento'}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    priority={idx < 2}
                    className="object-cover"
                    onError={() => handleImageError(pkg.image)}
                    unoptimized={imageErrors.has(pkg.image)}
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
            </SwiperSlide>
          ))}
        </Swiper>

        {/* seta esquerda */}
        <div
          ref={(el) => setPrevEl(el)}
          className="swiper-button-prev-custom hidden sm:flex"
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            cursor: "pointer",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#9D4815" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* seta direita */}
        <div
          ref={(el) => setNextEl(el)}
          className="swiper-button-next-custom hidden sm:flex"
          style={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            cursor: "pointer",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 6L15 12L9 18" stroke="#9D4815" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Modal para exibir detalhes do pacote */}
      <PackageModal 
        isOpen={modalOpen} 
        onClose={closeModal} 
        packageInfo={selectedPackage} 
      />
    </div>
  );
};

export default PackagesCarousel;