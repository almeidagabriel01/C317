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
  FiClock,
} from "react-icons/fi";
import {
  formatDateTime,
  formatDate,
  formatCurrency,
  getStatusColor,
} from "@/utils/formatUtils";

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
      transition: { type: "spring", damping: 25, stiffness: 300, duration: 0.2 },
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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
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
          {/* Header --------------------------------------------------- */}
          <div className="flex justify-between items-center p-6 border-b border-gray-600">
            <h2 className="text-2xl font-bold text-[#E0CEAA] font-serif">
              Pedido #{order.id}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Body com scrollbar personalizado ----------------------- */}
          <div className="p-6 max-h-96 overflow-y-auto custom-scrollbar space-y-6">
            {/* Informações do Evento */}
            <section>
              <h3 className="text-lg font-semibold text-[#E0CEAA] mb-3 font-serif">
                Informações do Evento
              </h3>
              <div className="bg-gray-700/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center">
                  <FiShoppingCart className="mr-3 text-amber-400" />
                  <div>
                    <span className="text-gray-400 text-sm">Nome do Evento:</span>
                    <p className="text-white font-medium">{order.nomeEvento || 'Não informado'}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <FiCalendar className="mr-3 text-green-400" />
                  <div>
                    <span className="text-gray-400 text-sm">Data do Evento:</span>
                    <p className="text-white font-medium">
                      {order.dataEvento ? formatDate(order.dataEvento) : 'Não informado'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FiClock className="mr-3 text-purple-400" />
                  <div>
                    <span className="text-gray-400 text-sm">Horário:</span>
                    <p className="text-white font-medium">
                      {order.horarioInicio && order.horarioFim 
                        ? `${order.horarioInicio} - ${order.horarioFim}`
                        : 'Não informado'
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FiUsers className="mr-3 text-blue-400" />
                  <div>
                    <span className="text-gray-400 text-sm">Número de Convidados:</span>
                    <p className="text-white font-medium">
                      {order.numConvidados || 'Não informado'}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Informações do Pedido */}
            <section>
              <h3 className="text-lg font-semibold text-[#E0CEAA] mb-3 font-serif">
                Informações do Pedido
              </h3>
              <div className="bg-gray-700/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center">
                  <FiCalendar className="mr-3 text-orange-400" />
                  <div>
                    <span className="text-gray-400 text-sm">Data da Compra:</span>
                    <p className="text-white font-medium">
                      {order.dataCompra ? formatDate(order.dataCompra) : 'Não informado'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FiDollarSign className="mr-3 text-green-400" />
                  <div>
                    <span className="text-gray-400 text-sm">Valor Total:</span>
                    <p className="text-white font-medium text-lg">
                      {formatCurrency(order.preco || order.total || 0)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FiShoppingCart className="mr-3 text-amber-400" />
                  <div>
                    <span className="text-gray-400 text-sm">Status:</span>
                    <div className="mt-1">
                      <span
                        className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(
                          order.status
                        ).replace("-500", "-900")} text-white`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <FiUser className="mr-3 text-indigo-400" />
                  <div>
                    <span className="text-gray-400 text-sm">ID do Comprador:</span>
                    <p className="text-white font-medium">#{order.idComprador}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Footer ---------------------------------------------------- */}
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