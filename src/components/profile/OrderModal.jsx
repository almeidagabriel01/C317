'use client';
import React from 'react';
import { FiX, FiCalendar, FiClock, FiUsers, FiDollarSign, FiInfo, FiSend } from 'react-icons/fi';
import { formatDate, formatCurrency, getStatusColor } from '@/utils/formatUtils';

export default function OrderDetailModal({ order, isOpen, onClose, onSendOrder, isSendingOrder }) {
  if (!isOpen || !order) return null;

  const handleSendOrder = () => {
    if (onSendOrder && order.id) {
      onSendOrder(order.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="bg-primary p-6 border-b border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Detalhes do Orçamento
            </h2>
            <p className="text-gray-300 mt-1">
              {order.nomeEvento}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Status */}
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <span className="text-amber-300 font-medium">Status:</span>
              <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
          </div>

          {/* Informações do Evento */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-300">
                <FiCalendar className="text-amber-400" />
                <div>
                  <p className="font-medium text-amber-300">Data do Evento</p>
                  <p>{formatDate(order.dataEvento)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-300">
                <FiClock className="text-amber-400" />
                <div>
                  <p className="font-medium text-amber-300">Horário</p>
                  <p>{order.horarioInicio} - {order.horarioFim}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-300">
                <FiUsers className="text-amber-400" />
                <div>
                  <p className="font-medium text-amber-300">Convidados</p>
                  <p>{order.numConvidados} pessoas</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-300">
                <FiDollarSign className="text-amber-400" />
                <div>
                  <p className="font-medium text-amber-300">Valor Total</p>
                  <p className="text-xl font-bold text-green-400">
                    {formatCurrency(order.preco)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-300">
                <FiCalendar className="text-amber-400" />
                <div>
                  <p className="font-medium text-amber-300">Data do Orçamento</p>
                  <p>{formatDate(order.dataCompra)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-300">
                <FiInfo className="text-amber-400" />
                <div>
                  <p className="font-medium text-amber-300">ID do Pedido</p>
                  <p>#{order.id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Observações */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-amber-300 font-medium mb-2">Observações</h3>
            <p className="text-gray-300 text-sm">
              {order.status === 'Orcado' 
                ? 'Seu orçamento foi calculado e está aguardando aprovação. Você pode enviá-lo como pedido oficial quando estiver pronto.'
                : order.status === 'Pendente'
                ? 'Pedido enviado e aguardando aprovação. Em breve entraremos em contato para confirmar os detalhes.'
                : order.status === 'Aprovado'
                ? 'Orçamento aprovado! Em breve entraremos em contato para finalizar os detalhes do evento.'
                : 'Entre em contato conosco para mais informações sobre este orçamento.'
              }
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-700 px-6 py-4 flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Fechar
          </button>

          {/* Botão Enviar Pedido - só aparece para orçamentos */}
          {order.status === 'Orcado' && (
            <button
              onClick={handleSendOrder}
              disabled={isSendingOrder}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiSend size={16} />
              <span>
                {isSendingOrder ? 'Enviando...' : 'Enviar Pedido'}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}