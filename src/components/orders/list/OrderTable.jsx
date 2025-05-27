"use client";

import { motion } from "framer-motion";
import OrderTableRow from "./OrderTableRow";

const OrderTable = ({ orders, onViewOrder, onUpdateStatus, statusOrder }) => (
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
            {[
              { key: "Pedido", width: "w-[120px]" },
              { key: "Cliente", width: "w-[200px]" },
              { key: "Data", width: "w-[140px]" },
              { key: "Total", width: "w-[120px]" },
              { key: "Status", width: "w-[140px]" },
              { key: "Ações", width: "w-[180px]" }
            ].map((header) => (
              <th
                key={header.key}
                scope="col"
                className={`${header.width} px-6 py-4 text-center align-middle font-medium`}
              >
                {header.key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((order, i) => (
            <OrderTableRow
              key={order.id}
              order={order}
              index={i}
              onView={() => onViewOrder(order)}
              onUpdateStatus={onUpdateStatus}
              statusOrder={statusOrder}
            />
          ))}
        </tbody>
      </table>
    </div>

    {orders.length === 0 && (
      <div className="text-center py-8">
        <p className="text-gray-400 font-sans">Nenhum pedido encontrado.</p>
      </div>
    )}
  </motion.div>
);

export default OrderTable;