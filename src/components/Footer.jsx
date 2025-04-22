"use client";
import { FiPhone, FiMail } from "react-icons/fi";

export default function Footer() {
  return (
    <footer
      className="text-center py-8 md:py-12 font-spline text-lg md:text-2xl px-4"
      style={{ backgroundColor: "#9D4815", color: "#F7F6F3" }}
    >
      <h2
        className="mb-3 md:mb-4 font-croissant text-3xl md:text-5xl"
        style={{ color: "#E0CEAA" }}
      >
        Temos muito à oferecer para sua festa
      </h2>
      <p className="mb-6 md:mb-8 max-w-xl mx-auto text-base md:text-lg">
        Quer saber mais ou ficou alguma dúvida? Entre em contato com a gente!
      </p>
      <div className="flex flex-col sm:flex-row justify-center sm:space-x-6 space-y-4 sm:space-y-0 text-sm md:text-lg">
        <div className="flex items-center justify-center space-x-2">
          <FiPhone size={20} style={{ color: "#E0CEAA" }} />
          <span>(11) 99466-3100</span>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <FiMail size={20} style={{ color: "#E0CEAA" }} />
          <span>elodrinks@gmail.com</span>
        </div>
      </div>
    </footer>
  );
}