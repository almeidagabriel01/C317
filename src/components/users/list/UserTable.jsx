"use client";

import { motion, AnimatePresence } from "framer-motion";
import UserTableRow from "./UserTableRow";

const UserTable = ({ users, onEditUser, onToggleStatus }) => {
  return (
    <motion.div
      className="bg-gray-800 rounded-xl overflow-hidden shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="overflow-x-auto">
        <table className="min-w-[600px] md:min-w-0 w-full text-sm">
          <thead className="text-xs uppercase bg-gray-700 text-gray-300">
            <tr>
              <th className="px-2 md:px-4 py-4 text-center">Nome</th>
              <th className="px-2 md:px-4 py-4 text-center">Email</th>
              <th className="px-2 md:px-4 py-4 text-center">Telefone</th>
              <th className="px-2 md:px-4 py-4 text-center">Função</th>
              <th className="px-2 md:px-4 py-4 text-center">Status</th>
              <th className="px-2 md:px-4 py-4 text-center min-w-[120px]">Ações</th>
            </tr>
          </thead>
          <AnimatePresence mode="wait">
            <motion.tbody
              key={users.length}
              initial={{ opacity: 0.8, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              {users.map((user, index) => (
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

      {users.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400 font-sans">Nenhum usuário encontrado.</p>
        </div>
      )}
    </motion.div>
  );
};

export default UserTable;