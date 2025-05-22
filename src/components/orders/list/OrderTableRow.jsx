"use client";

import {
  FiUser,
  FiShoppingCart,
  FiCalendar,
  FiDollarSign,
  FiActivity,
  FiEye,
  FiCheckCircle,
} from "react-icons/fi";

const OrderTableRow = ({
  order,
  index,
  onView,
  onMarkAsReviewed,
  showReviewedOrders = false,
}) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
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
        <div className="flex items-center justify-center">
          <FiShoppingCart className="mr-2 text-amber-400" />#{order.id}
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex items-center justify-center">
          <FiUser className="mr-2 text-blue-400" />
          {order.customerName}
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex items-center justify-center">
          <FiCalendar className="mr-2 text-green-400" />
          {formatDate(order.date)}
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex items-center justify-center">
          <FiDollarSign className="mr-2 text-yellow-400" />
          {formatCurrency(order.total)}
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex items-center justify-center">
          <FiActivity className="mr-2" />
          <span
            className={`text-xs font-medium px-2.5 py-0.5 rounded ${
              order.status === "Pendente"
                ? "bg-orange-900 text-orange-300"
                : order.status === "Revisado"
                ? "bg-green-900 text-green-300"
                : "bg-red-900 text-red-300"
            }`}
          >
            {order.status}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex justify-center items-center space-x-3">
          <button
            onClick={() => onView(order)}
            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-gray-700 rounded-full"
            title="Ver detalhes do pedido"
          >
            <FiEye size={18} />
          </button>
          {!showReviewedOrders && order.status === "Pendente" && (
            <button
              onClick={() => onMarkAsReviewed(order)}
              className="p-2 text-green-400 hover:text-green-300 hover:bg-gray-700 rounded-full"
              title="Marcar como revisado"
            >
              <FiCheckCircle size={18} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default OrderTableRow;
