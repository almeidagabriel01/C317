"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiChevronDown } from "react-icons/fi";
import { updateOrderStatus } from "@/services/api";
import { useOrders } from "@/hooks/useDataManager";
import Navbar from "@/components/navbar/Navbar";
import OrderSearchBar from "@/components/pedidos/list/OrderSearchBar";
import OrderTable from "@/components/pedidos/list/OrderTable";
import OrderDetailsModal from "@/components/pedidos/modals/OrderDetailsModal";

const STATUS_FILTER = [
  "Orcado",
  "Pendente", 
  "Pagamento",
  "Aprovado",
  "Concluido",
  "Reprovado",
];

export default function GerenciarPedidos() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  // Usar o hook unificado para dados de pedidos
  const { 
    data: allOrders, 
    loading: loadingOrders, 
    error, 
    refreshData, 
    updateOrderInCache 
  } = useOrders();

  // Filtrar pedidos para remover "Orcado" (Admin não vê)
  const orders = allOrders.filter((o) => o.status !== "Orcado");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Todos");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  /* ───────────────────────────── filtro local ──────────────────────────── */
  const filteredOrders = orders.filter((o) => {
    const s = searchTerm.toLowerCase();
    const matchSearch =
      o.nomeEvento?.toLowerCase().includes(s) || String(o.id).includes(s);

    const matchStatus =
      selectedStatus === "Todos" ||
      o.status?.toLowerCase() === selectedStatus.toLowerCase();

    return matchSearch && matchStatus;
  });

  /* ─────────────────────── atualiza status via API ──────────────────────── */
  const updateOrderStatusHandler = async (id, newStatus) => {
    console.log(`🔄 Iniciando atualização: Pedido ${id} para ${newStatus}`);
    
    try {
      // Chama APENAS a API - o estado local será gerenciado pelo OrderTableRow
      await updateOrderStatus(id, newStatus);
      
      // Atualiza o cache global após sucesso
      updateOrderInCache(id, { status: newStatus });
      
      toast.success(`Pedido #${id} alterado para ${newStatus} com sucesso!`);
      console.log(`✅ Pedido ${id} atualizado com sucesso`);
      
    } catch (error) {
      console.error(`❌ Erro ao atualizar pedido ${id}:`, error);
      toast.error(`Erro ao alterar status: ${error.message}`);
      throw error; // Re-throw para que o OrderTableRow possa reverter o estado local
    }
  };

  // Show loader during loading
  if (loadingOrders) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-white text-xl">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !loadingOrders) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={logout} />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-400 mb-4">Erro ao Carregar</h1>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={refreshData}
              className="bg-amber-700 hover:bg-amber-600 text-white px-6 py-2 rounded-full transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={logout} />

      <main className="container mx-auto px-4 py-8">
        {/* Cabeçalho & filtros */}
        <div className="flex flex-col items-center lg:flex-row justify-between gap-6 mb-8 lg:ml-12 lg:mr-12">
          <h1 className="text-3xl font-bold text-amber-400 font-serif">
            Gerenciar Pedidos ({filteredOrders.length})
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto items-center">
            {/* dropdown de status melhorado */}
            <div className="relative w-full sm:w-52">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-gray-700 text-gray-200 font-sans px-4 py-2 pr-10 rounded-lg border border-none
                         hover:bg-gray-600 hover:border-gray-500 appearance-none cursor-pointer
                         transition-all duration-200 ease-in-out
                         focus:outline-none"
              >
                <option value="Todos" className="bg-gray-700 text-gray-200 py-2">
                  Todos os status
                </option>
                {STATUS_FILTER.map((s) => (
                  <option key={s} value={s} className="bg-gray-700 text-gray-200 py-2">
                    {s}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <FiChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* busca */}
            <OrderSearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>
        </div>

        {/* tabela com ordenação */}
        <OrderTable
          orders={filteredOrders}
          onViewOrder={(o) => {
            setSelectedOrder(o);
            setIsDetailsModalOpen(true);
          }}
          onUpdateStatus={updateOrderStatusHandler}
        />
      </main>

      {/* modal */}
      <OrderDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
}