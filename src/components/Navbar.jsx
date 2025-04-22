"use client";
import Link from "next/link";
import Image from "next/image";
import { FiLogIn } from "react-icons/fi";

export default function Navbar() {
  return (
    <nav className="bg-primary w-full">
      <div className="w-full flex justify-between items-center px-4 sm:px-6 py-3">
        {/* logo à esquerda */}
        <Image
          src="/assets/logo.png"
          alt="Elo Drinks"
          width={110}
          height={32}
          className="w-24 sm:w-auto h-auto"
        />

        {/* botão à direita */}
        <Link
          href="/login"
          className="
            flex items-center space-x-1 sm:space-x-2
            border-2 border-light
            text-light bg-transparent
            px-2 sm:px-3 py-1 sm:py-1.5 rounded-full
            shadow-md text-sm sm:text-base
            hover:bg-light hover:text-primary
            transition
          "
        >
          <FiLogIn size={16} />
          <span className="font-spline font-medium">Login</span>
        </Link>
      </div>
    </nav>
  );
}