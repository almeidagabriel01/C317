"use client";

import { motion } from "framer-motion";
import { useSorting } from "@/utils/sortUtils";
import SortableTableHeader from "@/components/common/SortableTableHeader";
import ItemTableRow from "./ItemTableRow";

const ItemTable = ({
  items,
  onEditItem,
  onViewItem,
  onToggleStatus,
}) => {
  const {
    handleSort,
    getSortedData,
    sortField,
    sortDirection
  } = useSorting(items);

  const sortedItems = getSortedData();

  // Larguras iguais para alinhar colunas
  const columns = [
    { field: 'name',        label: 'Item',       width: 'w-1/6' },
    { field: 'description', label: 'Descrição',  width: 'w-1/6' },
    { field: 'category',    label: 'Categoria',  width: 'w-1/6' },
    { field: 'price',       label: 'Preço',      width: 'w-1/6' },
    { field: 'status',      label: 'Status',     width: 'w-1/6' },
    { field: 'actions',     label: 'Ações',      width: 'w-1/6', sortable: false }
  ];

  return (
    <motion.div
      className="bg-gray-800 rounded-xl overflow-hidden shadow-lg"
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
              {sortedItems.map((item, idx) => (
                <ItemTableRow
                  key={item.id}
                  item={item}
                  index={idx}
                  onEdit={onEditItem}
                  onView={onViewItem}
                  onToggleStatus={onToggleStatus}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {sortedItems.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400 font-sans">Nenhum item encontrado.</p>
        </div>
      )}
    </motion.div>
  );
};

export default ItemTable;