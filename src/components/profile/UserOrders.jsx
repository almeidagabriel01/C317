'use client';
import React, { useState, useEffect } from 'react';
import { FiFileText, FiCalendar, FiDollarSign, FiUsers, FiEye, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { fetchUserOrders } from '@/services/api';
import { formatDate, formatCurrency, getStatusColor } from '@/utils/formatUtils';
import OrderDetailModal from './OrderDetailModal';

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await fetchUserOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Erro ao carregar orçamentos:', error);
      toast.error('Erro ao carregar orçamentos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-primary p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <FiFileText className="mr-3 text-amber-400" />
            Meus Orçamentos
          </h1>
          <p className="text-gray-300 mt-2">
            Gerencie seus orçamentos de eventos
          </p>
        </div>
        <div className="p-6 flex justify-center items-center">
          <div className="text-gray-300">Carregando orçamentos...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-primary p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <FiFileText className="mr-3 text-amber-400" />
            Meus Orçamentos
          </h1>
          <p className="text-gray-300 mt-2">
            Gerencie seus orçamentos de eventos
          </p>
        </div>

        <div className="p-6">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FiFileText size={64} className="text-gray-500 mb-4" />
              <p className="text-gray-300 mb-4 text-center">
                Você ainda não possui orçamentos. Crie um novo orçamento para seu evento!
              </p>
              <button
                onClick={() => router.push('/pacotes')}
                className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-medium py-3 px-6 rounded-lg flex items-center shadow-lg transition-colors"
              >
                <FiPlus className="mr-2" />
                <span>Solicitar Orçamento</span>
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-gray-700 rounded-lg p-6 border border-gray-600 hover:border-amber-400 transition-colors"
                >
                  {/* Header do Card */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white truncate">
                        {order.nomeEvento}
                      </h3>
                      <p className="text-sm text-gray-400">
                        #{order.id}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Informações principais */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <FiCalendar size={16} className="text-amber-400" />
                      <span className="text-sm">{formatDate(order.dataEvento)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-300">
                      <FiUsers size={16} className="text-amber-400" />
                      <span className="text-sm">{order.numConvidados} convidados</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-300">
                      <FiDollarSign size={16} className="text-amber-400" />
                      <span className="text-sm font-semibold text-green-400">
                        {formatCurrency(order.preco)}
                      </span>
                    </div>
                  </div>

                  {/* Data do orçamento */}
                  <div className="text-xs text-gray-400 mb-4">
                    Orçamento criado em {formatDate(order.dataCompra)}
                  </div>

                  {/* Botão de ação */}
                  <button
                    onClick={() => handleViewDetails(order)}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <FiEye size={16} />
                    <span>Ver Detalhes</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Botão para novo orçamento quando há orçamentos existentes */}
          {orders.length > 0 && (
            <div className="mt-8 text-center">
              <button
                onClick={() => router.push('/pacotes')}
                className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-medium py-3 px-6 rounded-lg inline-flex items-center shadow-lg transition-colors"
              >
                <FiPlus className="mr-2" />
                <span>Novo Orçamento</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalhes */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }}
      />
    </>
  );
}