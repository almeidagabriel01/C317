"use client";

import { motion } from "framer-motion";
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
        <table className="w-full text-sm">
          <thead className="text-xs uppercase bg-gray-700 text-gray-300">
            <tr>
              <th scope="col" className="px-6 py-4 text-center">Nome</th>
              <th scope="col" className="px-6 py-4 text-center">Email</th>
              <th scope="col" className="px-6 py-4 text-center">Telefone</th>
              <th scope="col" className="px-6 py-4 text-center">Papel</th>
              <th scope="col" className="px-6 py-4 text-center">Status</th>
              <th scope="col" className="px-6 py-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <UserTableRow 
                key={user.id}
                user={user}
                index={index}
                onEdit={onEditUser}
                onToggleStatus={onToggleStatus}
              />
            ))}
          </tbody>
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