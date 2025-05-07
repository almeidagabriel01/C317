"use client";

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Footer from '../footer/Footer';

import 'swiper/css';
import 'swiper/css/navigation';

const drinks = [
  { img: 'mojito.jpg', name: 'MOJITO' },
  { img: 'pina-colada.jpg', name: 'PINA COLADA' },
  { img: 'bloody-mary.jpg', name: 'BLOODY MARY' },
  { img: 'mojito.jpg', name: 'MOJITO' },
  { img: 'pina-colada.jpg', name: 'PINA COLADA' },
  { img: 'bloody-mary.jpg', name: 'BLOODY MARY' },
];

const fadeVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

export default function Carousel() {
  const [slidesPerView, setSlidesPerView] = useState(4);
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);

  useEffect(() => {
    function updateSlides() {
      const w = window.innerWidth;
      if (w < 640) setSlidesPerView(1);
      else if (w < 768) setSlidesPerView(2);
      else if (w < 1024) setSlidesPerView(3);
      else setSlidesPerView(4);
    }
    updateSlides();
    window.addEventListener('resize', updateSlides);
    return () => window.removeEventListener('resize', updateSlides);
  }, []);

  return (
    <section className="min-h-screen flex flex-col" style={{ backgroundColor: '#5A5040' }}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={fadeVariants}
        className="flex-1 flex flex-col justify-center pt-6"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl text-center mb-4 md:mb-6 font-croissant" style={{ color: '#E0CEAA' }}>
          Conheça nossos drinks
        </h2>
        <p className="text-center mb-6 md:mb-8 font-spline text-base md:text-xl px-4" style={{ color: '#F7F6F3' }}>
          Inovações e personalizações para cada tipo de festa
        </p>

        <div className="flex-1 flex items-center justify-center px-4 relative">
          <div className="w-full mx-auto px-4 md:px-12 relative">
            <Swiper
              modules={[Navigation]}
              spaceBetween={20}
              slidesPerView={slidesPerView}
              centeredSlides={slidesPerView === 1}
              loop
              navigation={{ prevEl, nextEl }}
              onInit={(swiper) => {
                swiper.params.navigation.prevEl = prevEl;
                swiper.params.navigation.nextEl = nextEl;
                swiper.navigation.init();
                swiper.navigation.update();
              }}
              className="w-full"
            >
              {drinks.map((d, i) => (
                <SwiperSlide key={i} className="flex flex-col items-center justify-center text-center">
                  <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full overflow-hidden mb-3 md:mb-4 mx-auto">
                    <Image
                      src={`/assets/${d.img}`}
                      alt={d.name}
                      fill
                      sizes="(min-width:1024px) 12vw, (min-width:768px) 15vw, 30vw"
                      className="object-cover"
                    />
                  </div>
                  <span className="font-code uppercase inline-block text-sm sm:text-base" style={{ color: '#FFFFFF' }}>
                    {d.name}
                  </span>
                </SwiperSlide>
              ))}
            </Swiper>

            <div
              ref={(el) => setPrevEl(el)}
              className="swiper-button-prev-custom flex"
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                cursor: 'pointer',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="#9D4815" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div
              ref={(el) => setNextEl(el)}
              className="swiper-button-next-custom flex"
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                cursor: 'pointer',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 6L15 12L9 18" stroke="#9D4815" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>
      <Footer />
    </section>
  );
}