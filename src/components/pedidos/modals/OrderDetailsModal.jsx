'use client';
import React from 'react';
import { FiX, FiCalendar, FiClock, FiUsers, FiDollarSign, FiInfo, FiSend, FiCreditCard } from 'react-icons/fi';
import { formatDate, formatCurrency, getStatusColor } from '@/utils/formatUtils';

export default function OrderDetailModal({ 
  order, 
  isOpen, 
  onClose, 
  onSendOrder, 
  isSendingOrder,
  onPayment,
  isProcessingPayment 
}) {
  if (!isOpen || !order) return null;

  const handleSendOrder = () => {
    if (onSendOrder && order.id) {
      onSendOrder(order.id);
    }
  };

  const handlePayment = () => {
    if (onPayment && order.id) {
      onPayment(order.id);
    }
  };

  const getStatusDescription = (status) => {
    switch (status) {
      case 'Orcado':
        return 'Seu orçamento foi calculado e está pronto. Você pode enviá-lo como pedido oficial quando estiver preparado.';
      case 'Pendente':
        return 'Pedido enviado e aguardando aprovação do administrador. Em breve entraremos em contato para confirmar os detalhes.';
      case 'Pagamento':
        return 'Seu pedido foi aprovado! Clique no botão "Pagar Agora" para finalizar o pagamento através do Mercado Pago.';
      case 'Aprovado':
        return 'Pagamento aprovado com sucesso! Em breve entraremos em contato para finalizar os detalhes do evento.';
      case 'Concluido':
        return 'Evento concluído! Esperamos que tenha sido um sucesso. Obrigado por escolher a Elo Drinks!';
      case 'Reprovado':
        return 'Pedido não foi aprovado. Entre em contato conosco para mais informações e possíveis ajustes.';
      default:
        return 'Entre em contato conosco para mais informações sobre este orçamento.';
    }
  };

  const getActionButtons = () => {
    const buttons = [];

    // Botão Enviar Pedido - só aparece para orçamentos
    if (order.status === 'Orcado') {
      buttons.push(
        <button
          key="send"
          onClick={handleSendOrder}
          disabled={isSendingOrder}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiSend size={16} />
          <span>
            {isSendingOrder ? 'Enviando...' : 'Enviar Pedido'}
          </span>
        </button>
      );
    }

    // Botão Pagar - só aparece para status "Pagamento"
    if (order.status === 'Pagamento') {
      buttons.push(
        <button
          key="pay"
          onClick={handlePayment}
          disabled={isProcessingPayment}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed animate-pulse"
        >
          <FiCreditCard size={16} />
          <span>
            {isProcessingPayment ? 'Processando...' : 'Pagar Agora'}
          </span>
        </button>
      );
    }

    return buttons;
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
            <div className="flex items-center gap-3 mb-3">
              <span className="text-amber-300 font-medium">Status:</span>
              <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            
            {/* Status com destaque especial para Pagamento */}
            <div className={`p-4 rounded-lg border ${
              order.status === 'Pagamento' 
                ? 'bg-blue-900 bg-opacity-30 border-blue-500' 
                : order.status === 'Aprovado'
                ? 'bg-green-900 bg-opacity-30 border-green-500'
                : order.status === 'Reprovado'
                ? 'bg-red-900 bg-opacity-30 border-red-500'
                : 'bg-gray-700 bg-opacity-50 border-gray-600'
            }`}>
              <p className={`text-sm ${
                order.status === 'Pagamento' ? 'text-blue-300' :
                order.status === 'Aprovado' ? 'text-green-300' :
                order.status === 'Reprovado' ? 'text-red-300' :
                'text-gray-300'
              }`}>
                {getStatusDescription(order.status)}
              </p>
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

          {/* Alertas especiais baseados no status */}
          {order.status === 'Pagamento' && (
            <div className="bg-blue-900 bg-opacity-20 border border-blue-500 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <FiCreditCard className="text-blue-400" />
                <h3 className="text-blue-300 font-medium">Pronto para Pagamento</h3>
              </div>
              <p className="text-blue-200 text-sm">
                Seu pedido foi aprovado! Clique no botão "Pagar Agora" para ser redirecionado ao Mercado Pago e finalizar o pagamento de forma segura.
              </p>
            </div>
          )}

          {order.status === 'Aprovado' && (
            <div className="bg-green-900 bg-opacity-20 border border-green-500 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <FiCreditCard className="text-green-400" />
                <h3 className="text-green-300 font-medium">Pagamento Confirmado</h3>
              </div>
              <p className="text-green-200 text-sm">
                Seu pagamento foi processado com sucesso! Em breve nossa equipe entrará em contato para finalizar os detalhes do seu evento.
              </p>
            </div>
          )}

          {order.status === 'Reprovado' && (
            <div className="bg-red-900 bg-opacity-20 border border-red-500 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <FiInfo className="text-red-400" />
                <h3 className="text-red-300 font-medium">Pedido Não Aprovado</h3>
              </div>
              <p className="text-red-200 text-sm">
                Infelizmente seu pedido não pôde ser aprovado. Entre em contato conosco através do WhatsApp ou e-mail para mais informações.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-700 px-6 py-4 flex justify-between items-center">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Fechar
          </button>

          {/* Botões de ação */}
          <div className="flex gap-3">
            {getActionButtons()}
          </div>
        </div>
      </div>
    </div>
  );
}