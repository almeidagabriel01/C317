"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { FiUser, FiLogOut, FiChevronDown, FiLogIn, FiHome, FiUsers, FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ isAuthenticated, user, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  
  // Determine user role for conditional rendering
  const isOrganizer = user?.role === 'Organizador';

  // Animation variants for mobile menu
  const mobileMenuVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    visible: {
      opacity: 1,
      height: "auto",
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const menuItemVariants = {
    hidden: {
      opacity: 0,
      x: -20,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  // Animation variants for user dropdown
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
        when: "afterChildren",
        staggerChildren: 0.03,
        staggerDirection: -1
      }
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.05
      }
    }
  };

  const dropdownItemVariants = {
    hidden: {
      opacity: 0,
      x: 10,
      transition: {
        duration: 0.15,
        ease: "easeOut"
      }
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
    
  // Function to check if a link is active
  const isLinkActive = (path) => {
    return pathname === path;
  };

  // Close mobile menu when navigating
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-primary py-4 px-4 sm:px-6 shadow-md relative">
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
              className="w-20 sm:w-24 lg:w-auto h-auto cursor-pointer"
            />
          </Link>
        </div>

        {/* Desktop Navigation links - center */}
        {isAuthenticated && isOrganizer && (
          <div className="hidden lg:flex items-center justify-center flex-grow mx-4">
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

        {/* Right side - User menu + Mobile menu button */}
        <div className="flex items-center space-x-2">
          {/* User menu */}
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <motion.button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 bg-opacity-20 bg-amber-800 hover:bg-opacity-30 px-3 py-2 rounded-lg transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col items-end mr-2">
                  <span className="text-sm text-amber-200 font-medium truncate max-w-[100px] sm:max-w-[120px] md:max-w-[150px]">
                    {user.userName}
                  </span>
                  <span className="text-xs text-amber-100/70">
                    {isOrganizer ? 'Organizador' : 'Minha conta'}
                  </span>
                </div>

                <div className="bg-amber-700 rounded-full p-1.5">
                  <FiUser className="h-4 w-4 text-white" />
                </div>

                <motion.div
                  animate={{ rotate: dropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <FiChevronDown className="h-4 w-4 text-amber-200" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-20 border border-gray-700 overflow-hidden"
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    {/* Only show profile link for regular users */}
                    {!isOrganizer && (
                      <motion.div variants={dropdownItemVariants}>
                        <Link
                          href="/profile"
                          className={`block px-4 py-2 text-sm hover:bg-gray-700 transition-colors ${
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
                      </motion.div>
                    )}

                    <motion.div variants={dropdownItemVariants}>
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          onLogout();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center text-red-400">
                          <FiLogOut className="mr-2" />
                          Sair
                        </div>
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
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

          {/* Mobile menu button for organizers */}
          {isAuthenticated && isOrganizer && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-amber-800/20 hover:bg-amber-800/30 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              {mobileMenuOpen ? (
                <FiX className="h-5 w-5 text-amber-200 transition-transform duration-300 rotate-180" />
              ) : (
                <FiMenu className="h-5 w-5 text-amber-200 transition-transform duration-300" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu for Organizers */}
      <AnimatePresence>
        {isAuthenticated && isOrganizer && mobileMenuOpen && (
          <motion.div 
            ref={mobileMenuRef}
            className="lg:hidden absolute top-full left-0 right-0 bg-gray-800 border-t border-gray-700 shadow-lg z-20 overflow-hidden"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="px-4 py-3 space-y-2">
              <motion.div variants={menuItemVariants}>
                <Link
                  href="/dashboard"
                  className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                    isLinkActive('/dashboard')
                      ? 'bg-amber-700 text-white'
                      : 'text-gray-200 hover:bg-gray-700 hover:text-amber-300'
                  }`}
                  onClick={closeMobileMenu}
                >
                  <FiHome className="mr-3 h-5 w-5" />
                  <span className="font-medium">Dashboard</span>
                </Link>
              </motion.div>
              
              <motion.div variants={menuItemVariants}>
                <Link
                  href="/users"
                  className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                    isLinkActive('/users')
                      ? 'bg-amber-700 text-white'
                      : 'text-gray-200 hover:bg-gray-700 hover:text-amber-300'
                  }`}
                  onClick={closeMobileMenu}
                >
                  <FiUsers className="mr-3 h-5 w-5" />
                  <span className="font-medium">Gerenciar Usuários</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}