"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import { updateUser, updateUserStatus } from "@/services/api";
import { useUsers } from "@/hooks/useAdminData";
import Navbar from "../navbar/Navbar";
import EditUserModal from "./modals/EditUserModal";
import ConfirmationModal from "./modals/ConfirmationModal";
import UserSearchBar from "./list/UserSearchBar";
import UserTable from "./list/UserTable";

export default function GerenciarUsuarios() {
  const { user, role, isAuthenticated, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  
  // Usar o hook personalizado para dados de usuários
  const { 
    data: users, 
    loading: loadingUsers, 
    error, 
    refreshData, 
    updateUserInCache 
  } = useUsers();

  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [toggleUser, setToggleUser] = useState(null);

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Authentication check
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    } else if (!authLoading && isAuthenticated && role !== 'Administrador') {
      router.push('/');
    }
  }, [isAuthenticated, authLoading, router, role]);

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.phone.includes(searchTerm)
    );
  });

  // Handle edit user
  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  // Handle user status toggle
  const handleToggleStatus = async (userId) => {
    try {
      const response = await updateUserStatus(userId);
      toast.success(response.message || `Status do usuário alterado com sucesso!`);

      // Refresh data to get updated status
      await refreshData();
    } catch (err) {
      console.error('Erro ao alterar status:', err);
      toast.error(`Erro ao alterar status: ${err.message}`);
    }
  };

  // Save user changes
  const handleSaveUser = async (updatedData) => {
    try {
      await updateUser(editingUser.id, updatedData);

      // Atualiza o usuário no cache local
      updateUserInCache(editingUser.id, {
        name: updatedData.name,
        phone: updatedData.phone,
        role: updatedData.role
      });

      toast.success('Usuário atualizado com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar usuário:', err);
      toast.error(`Erro ao atualizar usuário: ${err.message}`);
    }
  };

  // Handle toggle confirmation
  const handleToggleConfirmation = (user) => {
    setToggleUser(user);
    setIsConfirmModalOpen(true);
  };

  // Confirm toggle
  const handleConfirmToggle = async () => {
    if (toggleUser) {
      await handleToggleStatus(toggleUser.id);
    }
  };

  // Show loader during verification or loading users
  if (authLoading || !isAuthenticated || loadingUsers) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-white text-xl">
            {authLoading ? "Verificando autenticação..." : "Carregando usuários..."}
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !loadingUsers) {
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-amber-400 mb-4 md:mb-0 font-serif">
            Gerenciar Usuários ({filteredUsers.length})
          </h1>

          {/* Search bar component */}
          <UserSearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>

        {/* User table component - agora com ordenação */}
        <UserTable
          users={filteredUsers}
          onEditUser={handleEditUser}
          onToggleStatus={handleToggleConfirmation}
        />
      </main>

      {/* Modals */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={editingUser}
        onSave={handleSaveUser}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmToggle}
        title={toggleUser?.status === 'Ativo' ? 'Desativar Usuário' : 'Ativar Usuário'}
        message={
          toggleUser?.status === 'Ativo'
            ? `Tem certeza que deseja desativar o usuário ${toggleUser?.name}?`
            : `Tem certeza que deseja ativar o usuário ${toggleUser?.name}?`
        }
        actionText={toggleUser?.status === 'Ativo' ? 'Desativar' : 'Ativar'}
      />
    </div>
  );
}