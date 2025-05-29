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
  FiSend,
} from "react-icons/fi";
import {
  formatDate,
  formatCurrency,
  getStatusColor,
} from "@/utils/formatUtils";
import React, { useState } from "react";

/* Novo fluxo principal */
const FLOW = ["Pendente", "Pagamento", "Aprovado", "Concluido"];

/* ícone representativo de cada status */
const STATUS_ICON = {
  Orcado: FiClock,
  Pendente: FiSend,
  Pagamento: FiCreditCard,
  Aprovado: FiCheckCircle,
  Concluido: FiCheckSquare,
  Reprovado: FiXCircle,
};

const OrderTableRow = ({ order, index, onView, onUpdateStatus }) => {
  // Estado local para o status, para atualização imediata
  const [currentStatus, setCurrentStatus] = useState(order.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const isReprovado = currentStatus === "Reprovado";
  const isConcluido = currentStatus === "Concluido";
  const isOrcado = currentStatus === "Orcado";

  /* posição no fluxo principal */
  const flowPos = FLOW.indexOf(currentStatus);
  
  // Para orçamentos, o próximo status é "Pendente"
  // Para outros status, segue o fluxo normal
  let prevStatus = null;
  let nextStatus = null;

  if (isOrcado) {
    // Orçamento não pode voltar, mas pode ir para Pendente
    nextStatus = "Pendente";
  } else if (isReprovado) {
    // Reprovado pode voltar para Pendente
    prevStatus = "Pendente";
  } else if (flowPos > -1) {
    // Está no fluxo principal
    if (flowPos > 0) {
      prevStatus = FLOW[flowPos - 1];
    }
    if (flowPos < FLOW.length - 1) {
      nextStatus = FLOW[flowPos + 1];
    }
  }

  // Casos especiais:
  // - De "Pendente" pode voltar para "Orcado" (caso admin queira reverter)
  if (currentStatus === "Pendente") {
    prevStatus = "Orcado";
  }

  // Handler para atualizar status com estado local
  const handleStatusUpdate = async (newStatus) => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    const oldStatus = currentStatus;
    
    try {
      // Atualiza estado local imediatamente
      setCurrentStatus(newStatus);
      
      // Chama o handler do parent
      await onUpdateStatus(order.id, newStatus);
      
    } catch (error) {
      // Em caso de erro, reverte o estado local
      setCurrentStatus(oldStatus);
      console.error('Erro ao atualizar status:', error);
    } finally {
      setIsUpdating(false);
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

      {/* Status (badge com indicação especial) */}
      <td className="w-[140px] px-6 py-4 text-center align-middle">
        <div className="flex items-center justify-center">
          <FiActivity className="mr-2" />
          <span
            className={`text-xs font-medium px-2.5 py-0.5 rounded flex items-center gap-1 ${getStatusColor(
              currentStatus
            ).replace("-500", "-900")} text-white ${
              currentStatus === "Pagamento" ? "animate-pulse" : ""
            } ${isUpdating ? "opacity-75" : ""}`}
          >
            {currentStatus === "Pagamento" && <FiCreditCard size={12} />}
            {currentStatus}
            {isUpdating && (
              <div className="ml-1 w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
            )}
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
              onClick={() => handleStatusUpdate(prevStatus)}
              disabled={isUpdating}
              className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-gray-700 rounded-full transition-colors disabled:opacity-50"
              title={`Voltar para ${prevStatus}`}
            >
              {React.createElement(STATUS_ICON[prevStatus], { size: 18 })}
            </button>
          )}

          {/* avançar 1 estágio (se existir) - COR VERDE */}
          {nextStatus && (
            <button
              onClick={() => handleStatusUpdate(nextStatus)}
              disabled={isUpdating}
              className={`p-2 hover:bg-gray-700 rounded-full transition-colors disabled:opacity-50 ${
                nextStatus === "Concluido" 
                  ? "text-purple-400 hover:text-purple-300" 
                  : "text-green-400 hover:text-green-300"
              } ${
                currentStatus === "Pagamento" && !isUpdating ? "animate-pulse" : ""
              }`}
              title={`Avançar para ${nextStatus}`}
            >
              {React.createElement(STATUS_ICON[nextStatus], { size: 18 })}
            </button>
          )}

          {/* reprovar (permitido se não concluido nem reprovado) */}
          {!isConcluido && !isReprovado && (
            <button
              onClick={() => handleStatusUpdate("Reprovado")}
              disabled={isUpdating}
              className="p-2 text-red-500 hover:text-red-400 hover:bg-gray-700 rounded-full transition-colors disabled:opacity-50"
              title="Reprovar pedido"
            >
              <FiXCircle size={18} />
            </button>
          )}

          {/* Botão especial para reativar orçamentos reprovados */}
          {isReprovado && (
            <button
              onClick={() => handleStatusUpdate("Orcado")}
              disabled={isUpdating}
              className="p-2 text-orange-400 hover:text-orange-300 hover:bg-gray-700 rounded-full transition-colors disabled:opacity-50"
              title="Reativar como orçamento"
            >
              <FiClock size={18} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default OrderTableRow;