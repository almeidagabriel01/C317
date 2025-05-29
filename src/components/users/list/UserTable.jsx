"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSorting } from "@/utils/sortUtils";
import SortableTableHeader from "@/components/common/SortableTableHeader";
import UserTableRow from "./UserTableRow";

const UserTable = ({ users, onEditUser, onToggleStatus }) => {
  const {
    handleSort,
    getSortedData,
    sortField,
    sortDirection
  } = useSorting(users);

  const sortedUsers = getSortedData();

  const columns = [
    { field: 'name',    label: 'Nome',     width: 'w-1/6' },
    { field: 'email',   label: 'Email',    width: 'w-1/6' },
    { field: 'phone',   label: 'Telefone', width: 'w-1/6' },
    { field: 'role',    label: 'Função',   width: 'w-1/6' },
    { field: 'status',  label: 'Status',   width: 'w-1/6' },
    { field: 'actions', label: 'Ações',    width: 'w-1/6', sortable: false }
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
          <AnimatePresence mode="wait">
            <motion.table
              className="table-fixed w-full text-sm"
              initial={{ opacity: 0.8, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <tbody>
                {sortedUsers.map((user, idx) => (
                  <UserTableRow
                    key={user.id}
                    user={user}
                    index={idx}
                    onEdit={onEditUser}
                    onToggleStatus={onToggleStatus}
                  />
                ))}
              </tbody>
            </motion.table>
          </AnimatePresence>
        </div>
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