'use client';
import React, { useState } from 'react';
import { FiFileText, FiCalendar, FiDollarSign, FiUsers, FiEye, FiPlus, FiSend, FiCreditCard } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useOrders } from './useDataManager'; // Usando o hook unificado
import { updateOrderStatus } from '@/services/api';
import { initiateMercadoPagoPayment } from '@/services/mercadopago';
import { formatDate, formatCurrency, getStatusColor } from '@/utils/formatUtils';
import OrderDetailModal from '@/components/pedidos/modals/OrderDetailsModal';

// Função auxiliar para converter data em timestamp de forma segura
const getDateTimestamp = (dateString) => {
  if (!dateString) return 0;
  
  try {
    console.log('Processando data:', dateString); // Debug
    
    let date = new Date(dateString);
    
    // Se a data é inválida, tenta diferentes formatos
    if (isNaN(date.getTime())) {
      // Tenta formato DD/MM/YYYY
      if (dateString.includes('/')) {
        const parts = dateString.split('/');
        if (parts.length === 3) {
          const [day, month, year] = parts.map(p => parseInt(p));
          
          // Validações mais rigorosas
          if (year < 2000 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) {
            console.log('Data inválida (fora do range):', dateString);
            return 0;
          }
          
          date = new Date(year, month - 1, day);
        }
      }
      // Tenta formato YYYY-MM-DD
      else if (dateString.includes('-')) {
        const parts = dateString.split('-');
        if (parts.length === 3) {
          const [year, month, day] = parts.map(p => parseInt(p));
          
          // Validações mais rigorosas
          if (year < 2000 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) {
            console.log('Data inválida (fora do range):', dateString);
            return 0;
          }
          
          date = new Date(year, month - 1, day);
        }
      }
    }
    
    // Validação final mais rigorosa
    const timestamp = date.getTime();
    const year = date.getFullYear();
    
    if (isNaN(timestamp) || year < 2000 || year > 2100) {
      console.log('Data final inválida:', dateString, 'ano:', year);
      return 0; // Retorna 0 para datas inválidas
    }
    
    console.log('Data válida:', dateString, '→', date.toISOString(), 'timestamp:', timestamp);
    return timestamp;
  } catch (error) {
    console.warn('Erro ao processar data:', dateString, error);
    return 0;
  }
};

// Função para obter a prioridade do status
const getStatusPriority = (status) => {
  const priorities = {
    'Pagamento': 1,
    'Aprovado': 2,
    'Pendente': 3,
    'Orcado': 4,
    'Reprovado': 5,
    'Concluido': 6
  };
  
  return priorities[status] || 999; // Status desconhecidos vão para o final
};

// Função para ordenar pedidos por prioridade de status e depois por data
const sortOrdersByPriority = (orders) => {
  return [...orders].sort((a, b) => {
    console.log('Comparando:', a.nomeEvento, '(', a.status, a.dataCompra, ') vs', b.nomeEvento, '(', b.status, b.dataCompra, ')'); // Debug
    
    // 1. Primeiro ordena por prioridade de status
    const priorityA = getStatusPriority(a.status);
    const priorityB = getStatusPriority(b.status);
    
    if (priorityA !== priorityB) {
      console.log('Diferentes status:', priorityA, 'vs', priorityB);
      return priorityA - priorityB; // Menor prioridade = mais importante
    }
    
    // 2. Se o status é o mesmo, ordena por data de criação (mais recente primeiro)
    const timestampA = getDateTimestamp(a.dataCompra);
    const timestampB = getDateTimestamp(b.dataCompra);
    
    console.log('Timestamps:', timestampA, 'vs', timestampB);
    
    // Se ambas as datas são inválidas, mantém ordem original
    if (timestampA === 0 && timestampB === 0) {
      console.log('Ambas datas inválidas, mantendo ordem');
      return 0;
    }
    
    // Se uma das datas é inválida, coloca ela por último
    if (timestampA === 0 && timestampB !== 0) {
      console.log('Data A inválida, B válida - A vai para o final');
      return 1;
    }
    if (timestampB === 0 && timestampA !== 0) {
      console.log('Data B inválida, A válida - B vai para o final');
      return -1;
    }
    
    // Ambas válidas - mais recente primeiro
    const result = timestampB - timestampA;
    console.log('Resultado da comparação de datas:', result > 0 ? 'B mais recente' : result < 0 ? 'A mais recente' : 'iguais');
    return result;
  });
};

export default function UserOrders() {
  // Usando o hook unificado que SEMPRE faz nova requisição
  const { data: ordersRaw, loading, updateOrderInCache } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sendingOrder, setSendingOrder] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(null);
  const router = useRouter();

  // Aplica a ordenação nos pedidos
  const orders = sortOrdersByPriority(ordersRaw);

  const handleSendOrder = async (orderId) => {
    setSendingOrder(orderId);

    try {
      await updateOrderStatus(orderId, 'Pendente');
      toast.success('Pedido enviado com sucesso!');

      // Atualiza o cache local
      updateOrderInCache(orderId, { status: 'Pendente' });

      // Atualiza o selectedOrder se for o mesmo
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: 'Pendente' }));
      }

    } catch (error) {
      console.error('Erro ao enviar pedido:', error);
      toast.error('Erro ao enviar pedido. Tente novamente.');
    } finally {
      setSendingOrder(null);
    }
  };

  const handlePayment = async (orderId) => {
    setProcessingPayment(orderId);
    try {
      const paymentUrl = await initiateMercadoPagoPayment(orderId);
      router.push(paymentUrl);
    } catch (error) {
      console.error('Erro ao iniciar pagamento:', error);
      toast.error(error.message || 'Erro ao processar pagamento.');
    } finally {
      setProcessingPayment(null);
    }
  };

  if (loading) return (
    <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
      <div className="bg-primary p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <FiFileText className="mr-3 text-amber-400" />
          Meus Pedidos
        </h1>
        <p className="text-gray-300 mt-2">Gerencie seus pedidos</p>
      </div>
      <div className="p-6 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400 mx-auto mb-2"></div>
          <div className="text-gray-300">Carregando pedidos...</div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-primary p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <FiFileText className="mr-3 text-amber-400" />
            Meus Pedidos
          </h1>
          <p className="text-gray-300 mt-2">Gerencie seus pedidos</p>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FiFileText size={64} className="text-gray-500 mb-4" />
              <p className="text-gray-300 mb-4 text-center">Nenhum pedido encontrado.</p>
              <button
                onClick={() => router.push('/pacotes')}
                className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-medium py-3 px-6 rounded-lg flex items-center shadow-lg transition-colors"
              >
                <FiPlus className="mr-2" />
                <span>Solicitar Pedido</span>
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {orders.map(order => (
                <div 
                  key={order.id} 
                  className={`bg-gray-700 rounded-lg p-6 border transition-colors flex flex-col min-h-[280px] ${
                    order.status === 'Pagamento' 
                      ? 'border-blue-400 bg-blue-900 bg-opacity-20'
                      : order.status === 'Aprovado'
                      ? 'border-green-400 bg-green-900 bg-opacity-10'
                      : 'border-gray-600 hover:border-amber-400'
                  }`}
                >
                  {/* Header do card - altura fixa para evitar desalinhamento */}
                  <div className="flex justify-between items-start mb-4 gap-3 min-h-[60px]">
                    <div className="flex-1 min-w-0"> {/* min-w-0 permite que o texto seja truncado */}
                      <h3 className="text-lg font-semibold text-white truncate pr-2" title={order.nomeEvento}>
                        {order.nomeEvento}
                      </h3>
                      <p className="text-sm text-gray-400">#{order.id}</p>
                    </div>
                    <div className="flex-shrink-0"> {/* Impede que a tag seja comprimida */}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium text-white whitespace-nowrap ${getStatusColor(order.status)} ${
                        order.status === 'Pagamento' ? 'animate-pulse' : ''
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Badge especial para pedidos de pagamento */}
                  {order.status === 'Pagamento' && (
                    <div className="mb-3 bg-blue-600 bg-opacity-30 border border-blue-400 rounded-lg p-2">
                      <div className="flex items-center gap-2">
                        <FiCreditCard className="text-blue-300 animate-pulse" size={14} />
                        <span className="text-blue-200 text-xs font-medium">Pronto para pagamento!</span>
                      </div>
                    </div>
                  )}

                  {/* Badge especial para pedidos aprovados */}
                  {order.status === 'Aprovado' && (
                    <div className="mb-3 bg-green-600 bg-opacity-30 border border-green-400 rounded-lg p-2">
                      <div className="flex items-center gap-2">
                        <FiUsers className="text-green-300" size={14} />
                        <span className="text-green-200 text-xs font-medium">Pagamento confirmado!</span>
                      </div>
                    </div>
                  )}

                  {/* Informações do pedido - área flexível */}
                  <div className="space-y-3 mb-4 flex-1">
                    <div className="flex items-center gap-2 text-gray-300">
                      <FiCalendar size={16} className="text-amber-400 flex-shrink-0" />
                      <span className="text-sm">{formatDate(order.dataEvento)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <FiUsers size={16} className="text-amber-400 flex-shrink-0" />
                      <span className="text-sm">{order.numConvidados} convidados</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <FiDollarSign size={16} className="text-amber-400 flex-shrink-0" />
                      <span className="text-sm font-semibold text-green-400">{formatCurrency(order.preco)}</span>
                    </div>
                  </div>

                  {/* Botões de ação - sempre no final */}
                  <div className="space-y-2 mt-auto">
                    <button
                      onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <FiEye size={16} /> <span>Ver Detalhes</span>
                    </button>

                    {order.status === 'Orcado' && (
                      <button
                        onClick={() => handleSendOrder(order.id)}
                        disabled={sendingOrder === order.id}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiSend size={16} /> <span>{sendingOrder === order.id ? 'Enviando...' : 'Enviar Pedido'}</span>
                      </button>
                    )}

                    {order.status === 'Pagamento' && (
                      <button
                        onClick={() => handlePayment(order.id)}
                        disabled={processingPayment === order.id}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed animate-pulse"
                      >
                        <FiCreditCard size={16} /> <span>{processingPayment === order.id ? 'Processando...' : 'Pagar Agora'}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedOrder(null); }}
          onSendOrder={handleSendOrder}
          isSendingOrder={sendingOrder === selectedOrder.id}
          onPayment={handlePayment}
          isProcessingPayment={processingPayment === selectedOrder.id}
        />
      )}
    </>
  );
}