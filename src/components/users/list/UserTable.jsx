"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSorting } from "@/utils/sortUtils";
import SortableTableHeader from "@/components/common/SortableTableHeader";
import UserTableRow from "./UserTableRow";

const UserTable = ({ users, onEditUser, onToggleStatus }) => {
  const {
    handleSort,
    getSortedData,
    getSortIcon,
    sortField,
    sortDirection
  } = useSorting(users);

  const sortedUsers = getSortedData();

  const columns = [
    { field: 'name', label: 'Nome' },
    { field: 'email', label: 'Email' },
    { field: 'phone', label: 'Telefone' },
    { field: 'role', label: 'Função' },
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
      <div className="overflow-x-auto">
        <table className="min-w-[600px] md:min-w-0 w-full text-sm">
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
          <AnimatePresence mode="wait">
            <motion.tbody
              key={sortedUsers.length}
              initial={{ opacity: 0.8, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              {sortedUsers.map((user, index) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  index={index}
                  onEdit={onEditUser}
                  onToggleStatus={onToggleStatus}
                />
              ))}
            </motion.tbody>
          </AnimatePresence>
        </table>
      </div>

      {sortedUsers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400 font-sans">Nenhum usuário encontrado.</p>
        </div>
      )}
    </motion.div>
  );
};

export default UserTable;