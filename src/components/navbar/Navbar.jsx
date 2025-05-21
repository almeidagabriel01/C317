"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { FiUser, FiLogOut, FiChevronDown, FiLogIn, FiHome, FiUsers } from "react-icons/fi";

export default function Navbar({ isAuthenticated, user, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  
  // Determine user role for conditional rendering
  const isOrganizer = user?.role === 'Organizador';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format username for display
  const userDisplay = user?.email
    ? user.email.split('@')[0]
    : isOrganizer ? 'Admin' : 'Usuário';
    
  // Function to check if a link is active
  const isLinkActive = (path) => {
    return pathname === path;
  };

  return (
    <nav className="bg-primary py-4 px-4 sm:px-6 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo section - left */}
        <div className="flex-shrink-0">
          <Link href={isOrganizer ? "/dashboard" : "/"}>
            <Image
              src="/assets/logo.png"
              alt="Elo Drinks"
              width={110}
              height={32}
              priority
              className="w-24 sm:w-auto h-auto cursor-pointer"
            />
          </Link>
        </div>
        
        {/* Navigation links - center */}
        {isAuthenticated && isOrganizer && (
          <div className="hidden md:flex items-center justify-center flex-grow mx-4">
            <div className="flex space-x-8">
              <Link
                href="/dashboard"
                className={`flex items-center transition-colors font-medium px-3 py-2 rounded-lg ${
                  isLinkActive('/dashboard')
                    ? 'bg-amber-700 text-white'
                    : 'text-amber-100 hover:bg-amber-800/30 hover:text-amber-300'
                }`}
              >
                <FiHome className="mr-2" />
                Dashboard
              </Link>
              <Link
                href="/users"
                className={`flex items-center transition-colors font-medium px-3 py-2 rounded-lg ${
                  isLinkActive('/users')
                    ? 'bg-amber-700 text-white'
                    : 'text-amber-100 hover:bg-amber-800/30 hover:text-amber-300'
                }`}
              >
                <FiUsers className="mr-2" />
                Gerenciar Usuários
              </Link>
            </div>
          </div>
        )}

        {/* User menu - right */}
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
                  <span className="text-xs text-amber-100/70">
                    {isOrganizer ? 'Organizador' : 'Minha conta'}
                  </span>
                </div>

                <div className="bg-amber-700 rounded-full p-1.5">
                  <FiUser className="h-4 w-4 text-white" />
                </div>

                <FiChevronDown
                  className={`h-4 w-4 text-amber-200 transition-transform duration-200 ${
                    dropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-700">
                  {/* Mobile nav links for organizers */}
                  {isOrganizer && (
                    <div className="md:hidden">
                      <Link
                        href="/dashboard"
                        className={`block px-4 py-2 text-sm hover:bg-gray-700 ${
                          isLinkActive('/dashboard') 
                            ? 'text-amber-400 font-medium bg-gray-700/50' 
                            : 'text-gray-200'
                        }`}
                        onClick={() => setDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <FiHome className="mr-2" />
                          Dashboard
                        </div>
                      </Link>
                      <Link
                        href="/users"
                        className={`block px-4 py-2 text-sm hover:bg-gray-700 ${
                          isLinkActive('/users') 
                            ? 'text-amber-400 font-medium bg-gray-700/50' 
                            : 'text-gray-200'
                        }`}
                        onClick={() => setDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <FiUsers className="mr-2" />
                          Gerenciar Usuários
                        </div>
                      </Link>
                      <hr className="border-gray-700 my-1" />
                    </div>
                  )}

                  {/* Only show profile link for regular users */}
                  {!isOrganizer && (
                    <Link
                      href="/profile"
                      className={`block px-4 py-2 text-sm hover:bg-gray-700 ${
                        isLinkActive('/profile') 
                          ? 'text-amber-400 font-medium bg-gray-700/50' 
                          : 'text-gray-200'
                      }`}
                      onClick={() => setDropdownOpen(false)}
                    >
                      <div className="flex items-center">
                        <FiUser className="mr-2" />
                        Meu Perfil
                      </div>
                    </Link>
                  )}

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
              className="
              flex items-center space-x-2 
              border-2 border-light text-light 
              bg-transparent px-3 py-1.5 
              rounded-full shadow-md 
              transition
              hover:bg-amber-400 hover:text-primary
              focus:bg-amber-400 focus:text-primary
              active:bg-amber-500 active:text-primary"
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