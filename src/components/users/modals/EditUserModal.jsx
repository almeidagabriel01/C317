"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EditUserModal = ({ isOpen, onClose, user, onSave }) => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    status: ""
  });

  // Reseta o formulário quando o modal abre/fecha ou quando o usuário muda
  useEffect(() => {
    if (isOpen && user) {
      // Se o modal está aberto, carrega os dados do usuário
      setUserData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status
      });
    }
  }, [isOpen, user]);

  const formatPhoneNumber = (phone) => {
    // Remove todos os caracteres não numéricos
    const numbers = phone.replace(/\D/g, '');
    
    // Não permite mais que 11 dígitos (máximo para celular no Brasil: (DD)XXXXX-XXXX)
    const maxNumbers = numbers.slice(0, 11);
    
    // Formata progressivamente conforme digita
    if (maxNumbers.length <= 2) {
      // Apenas DDD ou parte dele
      return maxNumbers.length === 0 ? '' : `(${maxNumbers}`;
    } else if (maxNumbers.length <= 7) {
      // DDD + parte do número
      return `(${maxNumbers.substring(0, 2)})${maxNumbers.substring(2)}`;
    } else {
      // Número completo com hífen
      const hasDDI = maxNumbers.length > 10;
      const baseIndex = 2; // Posição após o DDD
      const hyphenIndex = hasDDI ? 7 : 6; // Posição do hífen (5 ou 4 dígitos antes)
      
      return `(${maxNumbers.substring(0, 2)})${maxNumbers.substring(baseIndex, hyphenIndex)}-${maxNumbers.substring(hyphenIndex)}`;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      setUserData(prev => ({ ...prev, [name]: formatPhoneNumber(value) }));
    } else {
      setUserData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(userData);
    onClose();
  };

  // Função que lida com o fechamento do modal
  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.15 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.2
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: { duration: 0.15 }
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={handleClose}
      >
        <motion.div
          className="relative bg-[#1C2431] w-full max-w-md rounded-xl overflow-hidden shadow-2xl"
          variants={contentVariants}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold text-[#E0CEAA] mb-6 font-serif">Editar Usuário</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1 font-sans">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={userData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-amber-500 focus:border-amber-500 font-sans"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1 font-sans">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-amber-500 focus:border-amber-500 font-sans"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1 font-sans">
                    Telefone
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={userData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-amber-500 focus:border-amber-500 font-sans"
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1 font-sans">
                    Papel
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={userData.role}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-amber-500 focus:border-amber-500 font-sans"
                  >
                    <option value="Comprador">Comprador</option>
                    <option value="Organizador">Organizador</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1 font-sans">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={userData.status}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-amber-500 focus:border-amber-500 font-sans"
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                  </select>
                </div>
              </div>
              <div className="mt-8 flex space-x-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 border border-gray-600 rounded-full text-white hover:bg-gray-700 transition-colors font-sans font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#9D4815] hover:bg-amber-600 rounded-full text-white transition-colors font-sans font-medium"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditUserModal;