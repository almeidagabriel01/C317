"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import Navbar from "../navbar/Navbar";
import EditUserModal from "./modals/EditUserModal";
import ConfirmationModal from "./modals/ConfirmationModal";
import UserSearchBar from "./list/UserSearchBar";
import UserTable from "./list/UserTable";

// Sample user data
const SAMPLE_USERS = [
  { id: 1, name: "João Silva", email: "joao@example.com", phone: "(11) 98765-4321", role: "Comprador", status: "Ativo" },
  { id: 2, name: "Maria Oliveira", email: "maria@example.com", phone: "(11) 91234-5678", role: "Comprador", status: "Ativo" },
  { id: 3, name: "Pedro Santos", email: "pedro@example.com", phone: "(11) 99876-5432", role: "Comprador", status: "Inativo" },
  { id: 4, name: "Ana Ferreira", email: "ana@example.com", phone: "(11) 95555-4444", role: "Comprador", status: "Ativo" },
  { id: 5, name: "Carlos Costa", email: "carlos@example.com", phone: "(11) 96666-7777", role: "Organizador", status: "Ativo" },
  { id: 6, name: "Luciana Mendes", email: "luciana@example.com", phone: "(11) 97777-8888", role: "Comprador", status: "Ativo" },
  { id: 7, name: "Roberto Alves", email: "roberto@example.com", phone: "(11) 98888-9999", role: "Comprador", status: "Inativo" },
  { id: 8, name: "Juliana Rocha", email: "juliana@example.com", phone: "(11) 99999-0000", role: "Comprador", status: "Ativo" },
];

export default function GerenciarUsuarios() {
  const { user, role, isAuthenticated, logout, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState(SAMPLE_USERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [toggleUser, setToggleUser] = useState(null);
  
  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  
  // Authentication check
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    } else if (!loading && isAuthenticated && role !== 'Organizador') {
      router.push('/');
    }
  }, [isAuthenticated, loading, router, role]);

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  // Handle edit user
  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  // Handle user status toggle
  const handleToggleStatus = (userId, isActive) => {
    setUsers(prevUsers => 
      prevUsers.map(u => 
        u.id === userId 
          ? { ...u, status: isActive ? 'Ativo' : 'Inativo' } 
          : u
      )
    );
    toast.success(`Status do usuário alterado com sucesso!`);
  };

  // Save user changes
  const handleSaveUser = (updatedData) => {
    setUsers(prevUsers => 
      prevUsers.map(u => 
        u.id === editingUser.id 
          ? { ...u, ...updatedData } 
          : u
      )
    );
    toast.success('Usuário atualizado com sucesso!');
  };

  // Confirm toggle
  const handleConfirmToggle = () => {
    if (toggleUser) {
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === toggleUser.id 
            ? { ...u, status: u.status === 'Ativo' ? 'Inativo' : 'Ativo' } 
            : u
        )
      );
      toast.success(`Usuário ${toggleUser.status === 'Ativo' ? 'desativado' : 'ativado'} com sucesso!`);
    }
  };

  // Show loader during verification
  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white text-xl">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={logout} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-amber-400 mb-4 md:mb-0 font-serif">Gerenciar Usuários</h1>
          
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
          onToggleStatus={handleToggleStatus}
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