"use client";

import {
  FiTag,
  FiActivity,
  FiEdit2,
  FiEye,
} from "react-icons/fi";
import StatusToggle from "../toggle/StatusToggle";

const ItemTableRow = ({
  item,
  index,
  onEdit,
  onView,
  onToggleStatus,
}) => {
  const getCategoryColor = (category) => {
    const normalizedCategory = category?.toLowerCase();
    switch (normalizedCategory) {
      case "alcoolicos":
        return "bg-red-900 text-red-300";
      case "nao_alcoolicos":
        return "bg-green-900 text-green-300";
      case "shots":
        return "bg-purple-900 text-purple-300";
      case "outras_bebidas":
        return "bg-blue-900 text-blue-300";
      case "estrutura":
        return "bg-yellow-900 text-yellow-300";
      case "funcionarios":
        return "bg-gray-900 text-gray-300";
      default:
        return "bg-gray-900 text-gray-300";
    }
  };

  const formatCategoryName = (category) => {
    switch (category?.toLowerCase()) {
      case "alcoolicos":
        return "Alcoólicos";
      case "nao_alcoolicos":
        return "Não Alcoólicos";
      case "shots":
        return "Shots";
      case "outras_bebidas":
        return "Outras Bebidas";
      case "estrutura":
        return "Estruturas";
      case "funcionarios":
        return "Funcionários";
      default:
        return category || "Não definido";
    }
  };

  return (
    <tr
      className={`border-b border-gray-700 ${
        index % 2 === 0
          ? "bg-gray-700 bg-opacity-20 hover:bg-gray-800 hover:bg-opacity-30"
          : "bg-gray-700 bg-opacity-10 hover:bg-gray-800 hover:bg-opacity-30"
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
            {formatCategoryName(item.category)}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex items-center justify-center">
          <span className="text-green-400 font-medium">
            R$ {item.price ? (item.price / 100).toFixed(2).replace('.', ',') : "0,00"}
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