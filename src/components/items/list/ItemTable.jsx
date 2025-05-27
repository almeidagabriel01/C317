"use client";

import { motion } from "framer-motion";
import ItemTableRow from "./ItemTableRow";

const ItemTable = ({
  items,
  onEditItem,
  onViewItem,
  onToggleStatus,
}) => {
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
              <th scope="col" className="px-6 py-4 text-center">
                Item
              </th>
              <th scope="col" className="px-6 py-4 text-center">
                Descrição
              </th>
              <th scope="col" className="px-6 py-4 text-center">
                Categoria
              </th>
              <th scope="col" className="px-6 py-4 text-center">
                Preço
              </th>
              <th scope="col" className="px-6 py-4 text-center">
                Status
              </th>
              <th scope="col" className="px-6 py-4 text-center">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
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

      {items.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400 font-sans">Nenhum item encontrado.</p>
        </div>
      )}
    </motion.div>
  );
};

export default ItemTable;