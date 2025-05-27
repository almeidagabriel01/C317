"use client";

import {
  FiPackage,
  FiTag,
  FiActivity,
  FiEdit2,
  FiTrash2,
  FiEye,
} from "react-icons/fi";
import StatusToggle from "../toggle/StatusToggle";

const ItemTableRow = ({
  item,
  index,
  onEdit,
  onDelete,
  onView,
  onToggleStatus,
}) => {
  const getCategoryColor = (category) => {
    switch (category) {
      case "Alcoólico":
        return "bg-red-900 text-red-300";
      case "Não Alcoólico":
        return "bg-green-900 text-green-300";
      case "Shots":
        return "bg-purple-900 text-purple-300";
      case "Outras Bebidas":
        return "bg-blue-900 text-blue-300";
      case "Estruturas":
        return "bg-yellow-900 text-yellow-300";
      case "Funcionário":
        return "bg-gray-900 text-gray-300";
      default:
        return "bg-gray-900 text-gray-300";
    }
  };

  return (
    <tr
      className={`border-b border-gray-700 ${
        index % 2 === 0
          ? "bg-gray-700 bg-opacity-20"
          : "bg-gray-700 bg-opacity-10"
      }`}
    >
      <td className="px-6 py-4 font-medium text-white text-center">
        <div className="flex items-center justify-center">{item.name}</div>
      </td>
      <td className="px-3 py-4 text-center">
        <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl truncate text-gray-300">
          {item.description}
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex items-center justify-center">
          <FiTag className="mr-2" />
          <span
            className={`text-xs font-medium px-2.5 py-0.5 rounded ${getCategoryColor(
              item.category
            )}`}
          >
            {item.category}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex items-center justify-center">
          <span className="text-green-400 font-medium">
            R$ {item.price ? item.price.toFixed(2) : "0,00"}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex items-center justify-center">
          <FiActivity className="mr-2" />
          <span
            className={`text-xs font-medium px-2.5 py-0.5 rounded ${
              item.status === "Ativo"
                ? "bg-green-900 text-green-300"
                : "bg-red-900 text-red-300"
            }`}
          >
            {item.status}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => onView(item)}
            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-gray-700 rounded-full"
            title="Visualizar item"
          >
            <FiEye size={18} />
          </button>
          <button
            onClick={() => onEdit(item)}
            className="p-2 text-amber-400 hover:text-amber-300 hover:bg-gray-700 rounded-full"
            title="Editar item"
          >
            <FiEdit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(item)}
            className="p-2 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded-full"
            title="Excluir item"
          >
            <FiTrash2 size={18} />
          </button>
          <StatusToggle
            isActive={item.status === "Ativo"}
            onChange={(isActive) => onToggleStatus(item.id, isActive)}
          />
        </div>
      </td>
    </tr>
  );
};

export default ItemTableRow;
