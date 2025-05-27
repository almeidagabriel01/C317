"use client";

import { motion } from "framer-motion";
import OrderTableRow from "./OrderTableRow";

const OrderTable = ({
  orders,
  onViewOrder,
  onMarkAsReviewed,
  showReviewedOrders = false,
}) => {
  return (
    <motion.div
      className="bg-gray-800 rounded-xl overflow-hidden shadow-lg lg:ml-12 lg:mr-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase bg-gray-700 text-gray-300 sticky top-0 z-10">
            <tr>
              <th scope="col" className="px-6 py-4 text-center">
                Pedido
              </th>
              <th scope="col" className="px-6 py-4 text-center">
                Cliente
              </th>
              <th scope="col" className="px-6 py-4 text-center">
                Data
              </th>
              <th scope="col" className="px-6 py-4 text-center">
                Total
              </th>
              <th scope="col" className="px-6 py-4 text-center">
                Status
              </th>
              <th scope="col" className="px-6 py-4 text-center">
                Ações
              </th>
            </tr>
          </thead>
        </table>
      </div>
      
      {/* Container separado para o body com scroll customizado */}
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
        <table className="w-full text-sm">
          <tbody>
            {orders.map((order, index) => (
              <OrderTableRow
                key={order.id}
                order={order}
                index={index}
                onView={onViewOrder}
                onMarkAsReviewed={onMarkAsReviewed}
                showReviewedOrders={showReviewedOrders}
              />
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400 font-sans">
            {showReviewedOrders
              ? "Nenhum pedido revisado encontrado."
              : "Nenhum pedido pendente encontrado."}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default OrderTable;