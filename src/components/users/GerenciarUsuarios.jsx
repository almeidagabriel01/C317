"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import { fetchUsers, updateUser, updateUserStatus } from "@/services/api";
import Navbar from "../navbar/Navbar";
import EditUserModal from "./modals/EditUserModal";
import ConfirmationModal from "./modals/ConfirmationModal";
import UserSearchBar from "./list/UserSearchBar";
import UserTable from "./list/UserTable";

export default function GerenciarUsuarios() {
  const { user, role, isAuthenticated, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [toggleUser, setToggleUser] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Authentication check
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    } else if (!authLoading && isAuthenticated && role !== 'Organizador') {
      router.push('/');
    }
  }, [isAuthenticated, authLoading, router, role]);

  // Load users from API
  useEffect(() => {
    const loadUsers = async () => {
      if (!authLoading && isAuthenticated && role === 'Organizador') {
        try {
          setLoadingUsers(true);
          setError(null);
          const usersData = await fetchUsers();
          setUsers(usersData);
        } catch (err) {
          console.error('Erro ao carregar usuários:', err);
          setError(err.message);
          toast.error(`Erro ao carregar usuários: ${err.message}`);
        } finally {
          setLoadingUsers(false);
        }
      }
    };

    loadUsers();
  }, [authLoading, isAuthenticated, role]);

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

      const usersData = await fetchUsers();
      setUsers(usersData);
    } catch (err) {
      console.error('Erro ao alterar status:', err);
      toast.error(`Erro ao alterar status: ${err.message}`);
    }
  };

  // Save user changes
  const handleSaveUser = async (updatedData) => {
    try {
      // Passa o ID do usuário e os dados atualizados
      await updateUser(editingUser.id, updatedData);

      // Atualiza a lista local de usuários
      setUsers(prevUsers =>
        prevUsers.map(u =>
          u.id === editingUser.id
            ? { ...u, name: updatedData.name, phone: updatedData.phone, role: updatedData.role }
            : u
        )
      );
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
              onClick={() => window.location.reload()}
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
            Gerenciar Usuários ({users.length})
          </h1>

          {/* Search bar component */}
          <UserSearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>

        {/* User table component */}
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