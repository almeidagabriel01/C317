"use client";

import { motion } from "framer-motion";
import { useSorting } from "@/utils/sortUtils";
import SortableTableHeader from "@/components/common/SortableTableHeader";
import OrderTableRow from "./OrderTableRow";

const OrderTable = ({ orders, onViewOrder, onUpdateStatus }) => {
  const { handleSort, getSortedData, sortField, sortDirection } = useSorting(orders);
  const sortedOrders = getSortedData();

  const columns = [
    { field: "id",         label: "Pedido",  minW: 120 },
    { field: "nomeEvento", label: "Cliente", minW: 200 },
    { field: "dataCompra", label: "Data",    minW: 140 },
    { field: "preco",      label: "Total",   minW: 120 },
    { field: "status",     label: "Status",  minW: 140 },
    { field: "actions",    label: "Ações",   minW: 180, sortable: false }
  ];

  return (
    <motion.div className="w-full bg-gray-800 rounded-xl overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
          <motion.table
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="table-auto min-w-full text-sm"
          >
            <thead className="sticky top-0 z-10 text-xs uppercase bg-gray-700 text-gray-300">
              <tr>
                {columns.map(col => (
                  <SortableTableHeader
                    key={col.field}
                    field={col.field}
                    label={col.label}
                    onSort={handleSort}
                    sortDirection={sortDirection}
                    activeSortField={sortField}
                    sortable={col.sortable !== false}
                    className={`px-4 py-2 text-center align-middle font-medium min-w-[${col.minW}px]`}
                  />
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((order, idx) => (
                <OrderTableRow
                  key={order.id}
                  order={order}
                  index={idx}
                  onView={() => onViewOrder(order)}
                  onUpdateStatus={onUpdateStatus}
                />
              ))}
            </tbody>
          </motion.table>
        </div>
      </div>

      {sortedOrders.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400 font-sans">Nenhum pedido encontrado.</p>
        </div>
      )}
    </motion.div>
  );
};

export default OrderTable;