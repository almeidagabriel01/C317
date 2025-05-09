"use client";

import { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";

import "swiper/css";
import "swiper/css/navigation";

const PackagesCarousel = ({ packages }) => {
  const [slidesPerView, setSlidesPerView] = useState(4);
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);

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
                    src={`/assets/${pkg.image}`}
                    alt={pkg.title}
                    fill
                    priority
                    sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, (min-width:640px) 50vw, 100vw"
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
                  <p className="text-[#a85532] mt-2 mb-4 cursor-pointer hover:underline">
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
    </div>
  );
};

export default PackagesCarousel;