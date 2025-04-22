"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { useAnimation, motion } from "framer-motion";
import Footer from "./Footer";

import "swiper/css";
import "swiper/css/navigation";

const drinks = [
  { img: "mojito.jpg", name: "MOJITO" },
  { img: "pina-colada.jpg", name: "PINA COLADA" },
  { img: "bloody-mary.jpg", name: "BLOODY MARY" },
  { img: "mojito.jpg", name: "MOJITO" },
  { img: "pina-colada.jpg", name: "PINA COLADA" },
  { img: "bloody-mary.jpg", name: "BLOODY MARY" },
];

const fadeVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function Carousel() {
  const controls = useAnimation();
  const ref = useRef(null);
  const [slidesPerView, setSlidesPerView] = useState(4);

  // Função para ajustar o número de slides por visualização com base na largura da janela
  const handleResize = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) {
        setSlidesPerView(1);
      } else if (window.innerWidth < 768) {
        setSlidesPerView(2);
      } else if (window.innerWidth < 1024) {
        setSlidesPerView(3);
      } else {
        setSlidesPerView(4);
      }
    }
  };

  useEffect(() => {
    // Configurar o Observer de interseção
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) controls.start("visible");
        else controls.start("hidden");
      },
      { threshold: 0.2 }
    );
    const el = ref.current;
    if (el) obs.observe(el);

    // Configurar o listener de redimensionamento
    handleResize();
    window.addEventListener("resize", handleResize);
    
    // Cleanup
    return () => {
      if (el) obs.unobserve(el);
      obs.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [controls]);

  return (
    <section
      ref={ref}
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#5A5040" }}
    >
      <motion.div
        initial="hidden"
        animate={controls}
        variants={fadeVariants}
        className="flex-1 flex flex-col justify-center pt-6"
      >
        <h2
          className="text-3xl md:text-4xl lg:text-5xl text-center mb-4 md:mb-6 font-croissant"
          style={{ color: "#E0CEAA" }}
        >
          Conheça nossos drinks
        </h2>
        <p
          className="text-center mb-6 md:mb-8 font-spline text-base md:text-xl px-4"
          style={{ color: "#F7F6F3" }}
        >
          Inovações e personalizações para cada tipo de festa
        </p>

        <div className="flex-1 flex items-center justify-center px-4 relative">
          <div className="w-full mx-auto relative">
            <Swiper
              modules={[Navigation]}
              navigation={{
                prevEl: '.swiper-button-prev-custom',
                nextEl: '.swiper-button-next-custom',
              }}
              spaceBetween={20}
              slidesPerView={slidesPerView}
              centeredSlides={slidesPerView === 1}
              initialSlide={0}
              loop={true}
              className="w-full px-4 md:px-12"
            >
              {drinks.map((d, i) => (
                <SwiperSlide key={i} className="flex flex-col items-center justify-center text-center">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full overflow-hidden mb-3 md:mb-4 mx-auto">
                    <Image
                      src={`/assets/${d.img}`}
                      alt={d.name}
                      width={160}
                      height={160}
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="w-full text-center">
                    <span
                      className="font-code uppercase inline-block text-sm sm:text-base"
                      style={{ color: "#FFFFFF" }}
                    >
                      {d.name}
                    </span>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            
            <div 
              className="swiper-button-prev-custom flex" 
              style={{ 
                position: 'absolute', 
                left: '10px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                zIndex: 10,
                cursor: 'pointer',
                color: '#9D4815',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="#9D4815" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div 
              className="swiper-button-next-custom flex" 
              style={{ 
                position: 'absolute', 
                right: '10px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                zIndex: 10,
                cursor: 'pointer',
                color: '#9D4815',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 6L15 12L9 18" stroke="#9D4815" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </motion.div>

      <Footer />
    </section>
  );
}