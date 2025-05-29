"use client";

import { motion } from "framer-motion";
import { useSorting } from "@/utils/sortUtils";
import SortableTableHeader from "@/components/common/SortableTableHeader";
import OrderTableRow from "./OrderTableRow";

const OrderTable = ({ orders, onViewOrder, onUpdateStatus }) => {
  const {
    handleSort,
    getSortedData,
    sortField,
    sortDirection
  } = useSorting(orders);

  const sortedOrders = getSortedData();

  const columns = [
    { field: 'id',         label: 'Pedido',  width: 'w-[120px]' },
    { field: 'nomeEvento', label: 'Cliente', width: 'w-[200px]' },
    { field: 'dataCompra', label: 'Data',    width: 'w-[140px]' },
    { field: 'preco',      label: 'Total',   width: 'w-[120px]' },
    { field: 'status',     label: 'Status',  width: 'w-[140px]' },
    { field: 'actions',    label: 'Ações',   width: 'w-[180px]', sortable: false }
  ];

  return (
    <motion.div
      className="bg-gray-800 rounded-xl overflow-hidden shadow-lg lg:ml-12 lg:mr-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="overflow-x-auto">
        {/* Cabeçalho fixo */}
        <table className="table-fixed w-full text-sm">
          <thead className="text-xs uppercase bg-gray-700 text-gray-300">
            <tr>
              {columns.map((col) => (
                <SortableTableHeader
                  key={col.field}
                  field={col.field}
                  label={col.label}
                  onSort={handleSort}
                  sortDirection={sortDirection}
                  activeSortField={sortField}
                  sortable={col.sortable !== false}
                  className={col.width}
                />
              ))}
            </tr>
          </thead>
        </table>

        {/* Corpo rolável */}
        <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
          <table className="table-fixed w-full text-sm">
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
          </table>
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