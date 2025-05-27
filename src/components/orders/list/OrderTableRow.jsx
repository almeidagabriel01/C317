"use client";

import {
  FiUser,
  FiShoppingCart,
  FiCalendar,
  FiDollarSign,
  FiActivity,
  FiEye,
  FiClock,
  FiCheckCircle,
  FiCreditCard,
  FiCheckSquare,
  FiXCircle,
} from "react-icons/fi";
import {
  formatDate,
  formatCurrency,
  getStatusColor,
} from "@/utils/formatUtils";
import React from "react";

/* fluxo principal */
const FLOW = ["Pendente", "Aprovado", "Pagamento", "Concluido"];

/* ícone representativo de cada status */
const STATUS_ICON = {
  Pendente: FiClock,
  Aprovado: FiCheckCircle,
  Pagamento: FiCreditCard,
  Concluido: FiCheckSquare,
  Reprovado: FiXCircle,
};

const OrderTableRow = ({ order, index, onView, onUpdateStatus }) => {
  const isReprovado = order.status === "Reprovado";
  const isConcluido = order.status === "Concluido";

  /* posição no fluxo */
  const flowPos = FLOW.indexOf(order.status);
  const prevStatus =
    isReprovado
      ? "Pendente"
      : flowPos > 0
      ? FLOW[flowPos - 1]
      : null;
  const nextStatus =
    !isReprovado && flowPos > -1 && flowPos < FLOW.length - 1
      ? FLOW[flowPos + 1]
      : null;

  return (
    <tr
      className={`border-b border-gray-700 ${
        index % 2 === 0
          ? "bg-gray-700 bg-opacity-20"
          : "bg-gray-700 bg-opacity-10"
      }`}
    >
      {/* ID */}
      <td className="w-[120px] px-6 py-4 text-center align-middle">
        <div className="flex items-center justify-center">
          <FiShoppingCart className="mr-2 text-amber-400" />#{order.id}
        </div>
      </td>

      {/* Cliente */}
      <td className="w-[200px] px-6 py-4 text-center align-middle">
        <div className="flex items-center justify-center">
          <FiUser className="mr-2 text-blue-400" />
          <span className="truncate max-w-[150px]" title={order.customerName || order.nomeEvento}>
            {order.customerName || order.nomeEvento}
          </span>
        </div>
      </td>

      {/* Data */}
      <td className="w-[140px] px-6 py-4 text-center align-middle">
        <div className="flex items-center justify-center">
          <FiCalendar className="mr-2 text-green-400" />
          {formatDate(order.date || order.dataCompra)}
        </div>
      </td>

      {/* Total */}
      <td className="w-[120px] px-6 py-4 text-center align-middle">
        <div className="flex items-center justify-center">
          <FiDollarSign className="mr-2 text-yellow-400" />
          {formatCurrency(order.total || order.preco)}
        </div>
      </td>

      {/* Status (badge) */}
      <td className="w-[140px] px-6 py-4 text-center align-middle">
        <div className="flex items-center justify-center">
          <FiActivity className="mr-2" />
          <span
            className={`text-xs font-medium px-2.5 py-0.5 rounded ${getStatusColor(
              order.status
            ).replace("-500", "-900")} text-white`}
          >
            {order.status}
          </span>
        </div>
      </td>

      {/* Ações */}
      <td className="w-[180px] px-6 py-4 text-center align-middle">
        <div className="flex justify-center items-center gap-2">
          {/* detalhes */}
          <button
            onClick={onView}
            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-gray-700 rounded-full transition-colors"
            title="Ver detalhes"
          >
            <FiEye size={18} />
          </button>

          {/* voltar 1 estágio (se existir) - COR AMARELA */}
          {prevStatus && (
            <button
              onClick={() => onUpdateStatus(order.id, prevStatus)}
              className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-gray-700 rounded-full transition-colors"
              title={`Voltar para ${prevStatus}`}
            >
              {React.createElement(STATUS_ICON[prevStatus], { size: 18 })}
            </button>
          )}

          {/* avançar 1 estágio (se existir) - COR VERDE */}
          {nextStatus && (
            <button
              onClick={() => onUpdateStatus(order.id, nextStatus)}
              className="p-2 text-green-400 hover:text-green-300 hover:bg-gray-700 rounded-full transition-colors"
              title={`Avançar para ${nextStatus}`}
            >
              {React.createElement(STATUS_ICON[nextStatus], { size: 18 })}
            </button>
          )}

          {/* reprovar (permitido se não concluido nem reprovado) */}
          {!isConcluido && !isReprovado && (
            <button
              onClick={() => onUpdateStatus(order.id, "Reprovado")}
              className="p-2 text-red-500 hover:text-red-400 hover:bg-gray-700 rounded-full transition-colors"
              title="Reprovar pedido"
            >
              <FiXCircle size={18} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default OrderTableRow;