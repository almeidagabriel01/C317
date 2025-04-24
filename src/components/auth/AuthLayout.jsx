"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

import logoImg    from "./../../../public/assets/logo2.png";

const AuthLayout = ({ children, type }) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => setIsVisible(true), []);

  const bgImage   = type === "login" ? "/assets/drink.jpg" : "/assets/drink2.jpg";
  const otherPath = type === "login" ? "/cadastro" : "/login";
  const otherText = type === "login"
    ? "Ainda não tenho uma conta"
    : "Já tenho uma conta";
  const title = type === "login" ? "LOGIN" : "CADASTRO";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl shadow-xl">
        <div className="flex flex-col md:flex-row">
          <AnimatePresence mode="wait">
            <motion.div
              key={type}
              initial={{ x: type === "login" ? -50 : 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: type === "login" ? 50 : -50, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full md:w-1/2 bg-white p-12 flex flex-col"
              style={{ height: 650 }}
            >
              <h2
                className="text-4xl font-semibold text-center mb-4 font-serif"
                style={{ color: "#5A5040" }}
              >
                {title}
              </h2>

              <div className="flex-1 flex flex-col">
                {children}
              </div>

              <div className="text-center mt-2">
                <Link
                  href={otherPath}
                  className="text-sm text-amber-800 hover:text-amber-600 transition-colors"
                >
                  {otherText}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="relative w-full md:w-1/2 h-[650px] overflow-hidden">
            <Image
              src={bgImage}
              alt={`${title} background`}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover filter brightness-70"
              priority
            />

            {/* logo centralizada sem overlay opaco */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-70 h-70 relative">
                <Image
                  src={logoImg}
                  alt="Elo Drinks Logo"
                  fill
                  className="object-contain"
                  priority
                  sizes="460px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;