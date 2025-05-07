"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { FiUser, FiLogOut, FiChevronDown, FiLogIn } from "react-icons/fi";

export default function Navbar({ isAuthenticated, user, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  // Adicionar um handler para fechar o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Formatar o nome de usuário para exibição
  const userDisplay = user?.email 
    ? user.email.split('@')[0] 
    : 'Usuário';

  return (
    <nav className="bg-primary py-4 px-4 sm:px-6 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
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

        <div className="flex items-center">
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 bg-opacity-20 bg-amber-800 hover:bg-opacity-30 px-3 py-2 rounded-lg transition-all duration-200"
              >
                <div className="flex flex-col items-end mr-2">
                  <span className="text-sm text-amber-200 font-medium truncate max-w-[120px] md:max-w-[150px]">
                    {userDisplay}
                  </span>
                  <span className="text-xs text-amber-100/70">Minha conta</span>
                </div>

                <div className="bg-amber-700 rounded-full p-1.5">
                  <FiUser className="h-4 w-4 text-white" />
                </div>

                <FiChevronDown
                  className={`h-4 w-4 text-amber-200 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''
                    }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-700">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <div className="flex items-center">
                      <FiUser className="mr-2" />
                      Meu Perfil
                    </div>
                  </Link>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onLogout();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                  >
                    <div className="flex items-center text-red-400">
                      <FiLogOut className="mr-2" />
                      Sair
                    </div>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center space-x-2 border-2 border-light text-light bg-transparent px-3 py-1.5 rounded-full shadow-md hover:bg-light hover:text-primary transition"
            >
              <FiLogIn size={16} />
              <span className="font-medium">Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}