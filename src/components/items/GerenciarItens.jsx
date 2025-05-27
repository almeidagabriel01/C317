"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiPlus } from "react-icons/fi";
import Navbar from "../../components/navbar/Navbar";
import CreateItemModal from "../../components/items/modals/CreateItemModal";
import EditItemModal from "../../components/items/modals/EditItemModal";
import ViewItemModal from "../../components/items/modals/ViewItemModal";
import ConfirmationModal from "../../components/items/modals/ConfirmationModal";
import ItemSearchBar from "../../components/items/list/ItemSearchBar";
import ItemTable from "../../components/items/list/ItemTable";

// Sample item data
const SAMPLE_ITEMS = [
  {
    id: 1,
    name: "Cerveja Heineken",
    description: "Cerveja premium holandesa com sabor único e refrescante",
    category: "Alcoólico",
    price: 8.5,
    status: "Ativo",
    image:
      "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop",
  },
  {
    id: 2,
    name: "Refrigerante Coca-Cola",
    description: "Refrigerante clássico para refrescar qualquer momento",
    category: "Não Alcoólico",
    price: 8.5,
    status: "Ativo",
    image:
      "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&h=400&fit=crop",
  },
  {
    id: 3,
    name: "Tequila Shot",
    description: "Shot de tequila premium servido com limão e sal",
    category: "Shots",
    price: 8.5,
    status: "Ativo",
    image:
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=400&fit=crop",
  },
  {
    id: 4,
    name: "Caipirinha",
    description: "Drink tradicional brasileiro com cachaça, limão e açúcar",
    category: "Outras Bebidas",
    price: 8.5,
    status: "Ativo",
    image:
      "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop",
  },
  {
    id: 5,
    name: "Palco Principal",
    description: "Estrutura completa para shows e apresentações",
    category: "Estruturas",
    price: 8.5,
    status: "Ativo",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
  },
  {
    id: 6,
    name: "Bartender Especialista",
    description: "Profissional especializado em drinks e coquetéis",
    category: "Funcionário",
    price: 8.5,
    status: "Ativo",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
  },
  {
    id: 7,
    name: "Whisky Johnnie Walker",
    description: "Whisky escocês premium para ocasiões especiais",
    category: "Alcoólico",
    status: "Inativo",
    price: 8.5,
    image:
      "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400&h=400&fit=crop",
  },
  {
    id: 8,
    name: "Água Mineral",
    description: "Água mineral natural sem gás",
    category: "Não Alcoólico",
    price: 8.5,
    status: "Ativo",
    image:
      "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=400&fit=crop",
  },
];

export default function GerenciarItens() {
  const { user, role, isAuthenticated, logout, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState(SAMPLE_ITEMS);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Authentication check

  // Filter items based on search term
  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle create new item
  const handleCreateItem = (newItemData) => {
    const newItem = {
      id: Math.max(...items.map((i) => i.id)) + 1,
      ...newItemData,
    };
    setItems((prevItems) => [...prevItems, newItem]);
    toast.success("Item criado com sucesso!");
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

  // Handle delete item
  const handleDeleteItem = (item) => {
    setDeletingItem(item);
    setIsConfirmModalOpen(true);
  };

  // Handle item status toggle
  const handleToggleStatus = (itemId, isActive) => {
    setItems((prevItems) =>
      prevItems.map((i) =>
        i.id === itemId ? { ...i, status: isActive ? "Ativo" : "Inativo" } : i
      )
    );
    toast.success(`Status do item alterado com sucesso!`);
  };

  // Save item changes
  const handleSaveItem = (updatedData) => {
    setItems((prevItems) =>
      prevItems.map((i) =>
        i.id === editingItem.id ? { ...i, ...updatedData } : i
      )
    );
    toast.success("Item atualizado com sucesso!");
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    if (deletingItem) {
      setItems((prevItems) =>
        prevItems.filter((i) => i.id !== deletingItem.id)
      );
      toast.success("Item excluído com sucesso!");
    }
  };

  // Show loader during verification

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={logout} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-amber-400 font-serif">
            Gerenciar Itens
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

        {/* Item table component */}
        <ItemTable
          items={filteredItems}
          onEditItem={handleEditItem}
          onDeleteItem={handleDeleteItem}
          onViewItem={handleViewItem}
          onToggleStatus={handleToggleStatus}
        />
      </main>

      {/* Modals */}
      <CreateItemModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateItem}
      />

      <EditItemModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        item={editingItem}
        onSave={handleSaveItem}
      />

      <ViewItemModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        item={viewingItem}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Excluir Item"
        message={`Tem certeza que deseja excluir o item "${deletingItem?.name}"? Esta ação não pode ser desfeita.`}
        actionText="Excluir"
      />
    </div>
  );
}
