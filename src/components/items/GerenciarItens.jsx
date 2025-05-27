"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiPlus } from "react-icons/fi";
import { createItem, updateItem, toggleItemStatus } from "@/services/api";
import { useItems } from "@/hooks/useAdminData";
import Navbar from "../navbar/Navbar";
import CreateItemModal from "./modals/CreateItemModal";
import EditItemModal from "./modals/EditItemModal";
import ViewItemModal from "./modals/ViewItemModal";
import ItemSearchBar from "./list/ItemSearchBar";
import ItemTable from "./list/ItemTable";

export default function GerenciarItens() {
  const { user, role, isAuthenticated, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  // Usar o hook personalizado para dados de itens
  const {
    data: items,
    loading: loadingItems,
    error,
    refreshData,
    refreshDataWithCacheBusting, // Nova função para refresh com cache busting
    updateItemInCache,
    addItemToCache
  } = useItems();

  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Authentication check
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    } else if (!authLoading && isAuthenticated && role !== 'Administrador') {
      router.push('/');
    }
  }, [isAuthenticated, authLoading, router, role]);

  // Filter items based on search term
  const filteredItems = items.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle create new item
  const handleCreateItem = async (newItemData) => {
    try {
      const createdItem = await createItem(newItemData);
      toast.success("Item criado com sucesso!");

      // Refresh data to get the complete item data with ID
      await refreshData();
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Erro ao criar item:', err);
      toast.error(`Erro ao criar item: ${err.message}`);
    }
  };

  // Handle edit item
  const handleEditItem = (item) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  // Handle view item
  const handleViewItem = (item) => {
    setViewingItem(item);
    setIsViewModalOpen(true);
  };

  // Handle item status toggle
  const handleToggleStatus = async (itemId) => {
    try {
      const response = await toggleItemStatus(itemId);
      
      // Extrai o novo status da resposta
      const newStatus = response.includes("True") ? "Ativo" : "Inativo";
      
      // Atualiza no cache local
      updateItemInCache(itemId, { status: newStatus });
      
      toast.success(`Status do item alterado para ${newStatus}!`);
    } catch (err) {
      console.error('Erro ao alterar status:', err);
      toast.error(`Erro ao alterar status: ${err.message}`);
      
      // Em caso de erro, refresh para garantir consistência
      await refreshData();
    }
  };

  // Save item changes
  const handleSaveItem = async (updatedData) => {
    try {
      await updateItem(editingItem.id, updatedData);
      toast.success("Item atualizado com sucesso!");

      // Usa refresh com cache busting para forçar reload das imagens
      await refreshDataWithCacheBusting();
      
      setIsEditModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      console.error('Erro ao atualizar item:', err);
      toast.error(`Erro ao atualizar item: ${err.message}`);
    }
  };

  // Close modals
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingItem(null);
  };

  // Show loader during verification or loading items
  if (authLoading || !isAuthenticated || loadingItems) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-white text-xl">
            {authLoading ? "Verificando autenticação..." : "Carregando itens..."}
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !loadingItems) {
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
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-amber-400 font-serif">
            Gerenciar Itens ({filteredItems.length})
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Search bar component */}
            <ItemSearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />

            {/* Create new item button */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center justify-center px-4 py-3 bg-[#9D4815] hover:bg-amber-600 rounded-lg text-white transition-colors font-sans font-medium whitespace-nowrap"
            >
              <FiPlus className="mr-2" size={18} />
              Novo Item
            </button>
          </div>
        </div>

        {/* Item table component - agora com ordenação */}
        <ItemTable
          items={filteredItems}
          onEditItem={handleEditItem}
          onViewItem={handleViewItem}
          onToggleStatus={handleToggleStatus}
        />
      </main>

      {/* Modals */}
      <CreateItemModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSave={handleCreateItem}
      />

      <EditItemModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        item={editingItem}
        onSave={handleSaveItem}
      />

      <ViewItemModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        item={viewingItem}
      />
    </div>
  );
}