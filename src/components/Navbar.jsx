"use client";
import Link from "next/link";
import Image from "next/image";
import { FiLogIn } from "react-icons/fi";

export default function Navbar() {
  return (
    <nav className="bg-primary w-full">
      <div className="w-full flex justify-between items-center px-14 py-4">
        {/* logo à esquerda */}
        <Image
          src="/assets/logo.png"
          alt="Elo Drinks"
          width={110}
          height={32}
        />

        {/* botão à direita */}
        <Link
          href="/login"
          className="
            flex items-center space-x-2
            border-2 border-light
            text-light bg-transparent
            px-3 py-1.5 rounded-full
            shadow-md
            hover:bg-light hover:text-primary
            transition
          "
        >
          <FiLogIn size={18} />
          <span className="font-spline font-medium">Login</span>
        </Link>
      </div>
    </nav>
  );
}