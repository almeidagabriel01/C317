"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiShoppingCart,
  FiCalendar,
  FiDollarSign,
  FiUsers,
} from "react-icons/fi";
import { formatDateTime, formatCurrency, getStatusColor } from "@/utils/formatUtils";

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

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
        duration: 0.2,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: { duration: 0.15 },
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
        onClick={onClose}
      >
        <motion.div
          className="relative bg-[#1C2431] w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl"
          variants={contentVariants}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-600">
            <h2 className="text-2xl font-bold text-[#E0CEAA] font-serif">
              Detalhes do Pedido #{order.id}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>

          <div className="p-6 max-h-96 overflow-y-auto">
            {/* Informações do Cliente */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#E0CEAA] mb-3 font-serif">
                Informações do Cliente
              </h3>
              <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center">
                  <FiUser className="mr-2 text-blue-400" />
                  <span className="text-gray-300 font-sans">
                    {order.customerName}
                  </span>
                </div>
                <div className="flex items-center">
                  <FiMail className="mr-2 text-green-400" />
                  <span className="text-gray-300 font-sans">
                    {order.customerEmail}
                  </span>
                </div>
                <div className="flex items-center">
                  <FiPhone className="mr-2 text-yellow-400" />
                  <span className="text-gray-300 font-sans">
                    {order.customerPhone}
                  </span>
                </div>
                {order.deliveryAddress && (
                  <div className="flex items-start">
                    <FiMapPin className="mr-2 text-red-400 mt-1" />
                    <span className="text-gray-300 font-sans">
                      {order.deliveryAddress}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Informações do Pedido */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#E0CEAA] mb-3 font-serif">
                Informações do Pedido
              </h3>
              <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center">
                  <FiCalendar className="mr-2 text-purple-400" />
                  <span className="text-gray-300 font-sans">
                    {formatDateTime(order.date)}
                  </span>
                </div>
                <div className="flex items-center">
                  <FiUsers className="mr-2 text-purple-400" />
                  <span className="text-gray-300 font-sans">
                    {order.convidados} convidados
                  </span>
                </div>
                <div className="flex items-center">
                  <FiDollarSign className="mr-2 text-green-400" />
                  <span className="text-gray-300 font-sans">
                    {formatCurrency(order.total)}
                  </span>
                </div>
                <div className="flex items-center">
                  <FiShoppingCart className="mr-2 text-amber-400" />
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded ${order.status === "Pendente"
                        ? "bg-orange-900 text-orange-300"
                        : order.status === "Revisado"
                          ? "bg-green-900 text-green-300"
                          : "bg-red-900 text-red-300"
                      }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Itens do Pedido */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#E0CEAA] mb-3 font-serif">
                Itens do Pedido
              </h3>
              <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center border-b border-gray-600 pb-2 last:border-b-0 last:pb-0"
                    >
                      <div>
                        <p className="text-white font-medium font-sans">
                          {item.name}
                        </p>
                        <p className="text-gray-400 text-sm font-sans">
                          Quantidade: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium font-sans">
                          {formatCurrency(item.price)}
                        </p>
                        <p className="text-gray-400 text-sm font-sans">
                          {formatCurrency(item.total)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-600">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-[#E0CEAA] font-serif">
                      Total:
                    </span>
                    <span className="text-lg font-bold text-green-400 font-sans">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {order.notes && (
              <div>
                <h3 className="text-lg font-semibold text-[#E0CEAA] mb-3 font-serif">
                  Observações
                </h3>
                <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                  <p className="text-gray-300 font-sans">{order.notes}</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-600">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-[#9D4815] hover:bg-amber-600 rounded-full text-white transition-colors font-sans font-medium"
            >
              Fechar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OrderDetailsModal;