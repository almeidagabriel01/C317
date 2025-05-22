"use client";

import { FiUser, FiMail, FiPhone, FiTag, FiActivity, FiEdit2 } from "react-icons/fi";
import StatusToggle from "../toggle/StatusToggle";

const UserTableRow = ({ user, index, onEdit, onToggleStatus }) => {
  return (
    <tr
      className={`border-b border-gray-700 ${index % 2 === 0 ? 'bg-gray-700 bg-opacity-20' : 'bg-gray-700 bg-opacity-10'}`}
    >
      <td className="px-6 py-4 font-medium text-white text-center">
        <div className="flex items-center justify-center">
          <FiUser className="mr-2 text-amber-400" />
          {user.name}
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex items-center justify-center">
          <FiMail className="mr-2 text-blue-400" />
          {user.email}
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex items-center justify-center">
          <FiPhone className="mr-2 text-green-400" />
          {user.phone}
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex items-center justify-center">
          <FiTag className="mr-2" />
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${user.role === 'Organizador'
            ? 'bg-purple-900 text-purple-300'
            : 'bg-blue-900 text-blue-300'
            }`}>
            {user.role}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex items-center justify-center">
          <FiActivity className="mr-2" />
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${user.status === 'Ativo'
            ? 'bg-green-900 text-green-300'
            : 'bg-red-900 text-red-300'
            }`}>
            {user.status}
          </span>
        </div>
      </td>
      <td className="px-2 md:px-4 py-4 text-center align-middle min-w-[120px]">
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => onEdit(user)}
            className="p-2 text-amber-400 hover:text-amber-300 hover:bg-gray-700 rounded-full"
            title="Editar usuário"
          >
            <FiEdit2 size={18} />
          </button>
          <StatusToggle
            isActive={user.status === 'Ativo'}
            onChange={() => onToggleStatus(user)}
          />
        </div>
      </td>
    </tr>
  );
};

export default UserTableRow;