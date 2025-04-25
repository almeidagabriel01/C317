"use client";
import Link from "next/link";
import Image from "next/image";
import { FiLogIn, FiLogOut } from "react-icons/fi";

export default function Navbar({ isAuthenticated, user, onLogout }) {
  const userDisplay = user?.email;

  return (
    <nav className="bg-primary w-full sticky top-0 z-50 shadow-md">
      <div className="w-full flex justify-between items-center px-4 sm:px-6 py-3 max-w-7xl mx-auto">
        <Link href="/">
          <Image
            src="/assets/logo.png"
            alt="Elo Drinks"
            width={110}
            height={32}
            priority
            className="w-24 sm:w-auto h-auto cursor-pointer"
          />
        </Link>

        <div className="flex items-center space-x-3">
          {isAuthenticated && userDisplay ? (
            <>
              <span className="text-light text-sm hidden sm:block truncate max-w-[150px] md:max-w-[250px]" title={userDisplay}>
                Olá, {userDisplay}
              </span>
              <button
                onClick={onLogout}
                className="
                        flex items-center space-x-1 sm:space-x-2
                        border-2 border-light text-light bg-transparent
                        px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-md text-sm sm:text-base
                        hover:bg-light hover:text-primary hover:border-primary transition
                      "
                title="Sair"
              >
                <FiLogOut size={16} />
                <span className="font-spline font-medium hidden sm:inline">Sair</span>
                <span className="font-spline font-medium sm:hidden">Logout</span>
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="
                    flex items-center space-x-1 sm:space-x-2
                    border-2 border-light text-light bg-transparent
                    px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-md text-sm sm:text-base
                    hover:bg-light hover:text-primary hover:border-primary transition
                  "
            >
              <FiLogIn size={16} />
              <span className="font-spline font-medium">Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}