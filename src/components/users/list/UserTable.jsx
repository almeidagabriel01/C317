"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSorting } from "@/utils/sortUtils";
import SortableTableHeader from "@/components/common/SortableTableHeader";
import UserTableRow from "./UserTableRow";

const UserTable = ({ users, onEditUser, onToggleStatus }) => {
  const { handleSort, getSortedData, sortField, sortDirection } = useSorting(users);
  const sortedUsers = getSortedData();

  const columns = [
    { field: "name",    label: "Nome",     minW: 120 },
    { field: "email",   label: "Email",    minW: 180 },
    { field: "phone",   label: "Telefone", minW: 140 },
    { field: "role",    label: "Função",   minW: 140 },
    { field: "status",  label: "Status",   minW: 140 },
    { field: "actions", label: "Ações",    minW: 120, sortable: false }
  ];

  return (
    <motion.div className="w-full bg-gray-800 rounded-xl overflow-hidden shadow-lg">
      {/* scroll-x: toda a tabela; scroll-y: apenas o body */}
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
              <AnimatePresence mode="wait">
                {sortedUsers.map((user, idx) => (
                  <UserTableRow
                    key={user.id}
                    user={user}
                    index={idx}
                    onEdit={onEditUser}
                    onToggleStatus={onToggleStatus}
                  />
                ))}
              </AnimatePresence>
            </tbody>
          </motion.table>
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