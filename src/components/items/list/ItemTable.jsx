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
    getSortIcon,
    sortField,
    sortDirection
  } = useSorting(items);

  const sortedItems = getSortedData();

  const columns = [
    { field: 'name', label: 'Item' },
    { field: 'description', label: 'Descrição' },
    { field: 'category', label: 'Categoria' },
    { field: 'price', label: 'Preço' },
    { field: 'status', label: 'Status' },
    { field: 'actions', label: 'Ações', sortable: false }
  ];

  return (
    <motion.div
      className="bg-gray-800 rounded-xl overflow-hidden shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Container unificado para header e body */}
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase bg-gray-700 text-gray-300 sticky top-0 z-10">
            <tr>
              {columns.map((column) => (
                <SortableTableHeader
                  key={column.field}
                  field={column.field}
                  label={column.label}
                  onSort={handleSort}
                  sortDirection={sortDirection}
                  activeSortField={sortField}
                  sortable={column.sortable !== false}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item, index) => (
              <ItemTableRow
                key={item.id}
                item={item}
                index={index}
                onEdit={onEditItem}
                onView={onViewItem}
                onToggleStatus={onToggleStatus}
              />
            ))}
          </tbody>
        </table>
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