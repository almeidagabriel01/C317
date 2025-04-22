"use client";
import { FiPhone, FiMail } from "react-icons/fi";

export default function Footer() {
  return (
    <footer
      className="text-center py-12 font-spline text-2xl"
      style={{ backgroundColor: "#9D4815", color: "#F7F6F3" }}
    >
      <h2
        className="mb-4 font-croissant text-4xl"
        style={{ color: "#E0CEAA" }}
      >
        Temos muito à oferecer
      </h2>
      <p className="mb-8 max-w-xl mx-auto">
        Quer saber mais ou ficou alguma dúvida? Entre em contato com a gente!
      </p>
      <div className="flex justify-center space-x-6 text-lg">
        <div className="flex items-center space-x-2">
          <FiPhone size={24} style={{ color: "#E0CEAA" }} />
          <span>(11) 99466-3100</span>
        </div>
        <div className="flex items-center space-x-2">
          <FiMail size={24} style={{ color: "#E0CEAA" }} />
          <span>elodrinks@gmail.com</span>
        </div>
      </div>
    </footer>
  );
}