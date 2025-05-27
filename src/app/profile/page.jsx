'use client';
import React, { useEffect, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from "@/components/navbar/Navbar";
import ProfileInfo from "@/components/profile/ProfileInfo";
import UserOrders from "@/components/profile/UserOrders";

export default function Perfil() {
  const { user, isAuthenticated, logout, refreshUser, loading } = useAuth();
  const router = useRouter();
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    // Recarrega os dados do usuário quando a página é acessada
    if (isAuthenticated && !loading) {
      handleRefreshProfile();
    }
  }, [isAuthenticated, loading]);

  const handleRefreshProfile = async () => {
    setProfileLoading(true);
    try {
      await refreshUser();
    } catch (error) {
      console.error('Erro ao recarregar perfil:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleProfileUpdate = () => {
    // Callback chamado após atualização do perfil
    handleRefreshProfile();
  };

  // Loading state
  if (loading || profileLoading) {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={logout} />
        <main className="bg-gradient-to-b from-gray-900 to-gray-800 flex-1 p-4 overflow-auto">
          <div className="max-w-4xl mx-auto py-4">
            <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
              <div className="p-6 flex justify-center items-center">
                <div className="text-gray-300">Carregando perfil...</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={logout} />
      <main className="bg-gradient-to-b from-gray-900 to-gray-800 flex-1 p-4 overflow-auto">
        <div className="max-w-4xl mx-auto py-4">
          {/* Botão Voltar */}
          <div className="mb-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center text-amber-400 hover:text-amber-300 transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              <span>Voltar para a página inicial</span>
            </button>
          </div>

          {/* Componente de Informações do Perfil */}
          <ProfileInfo 
            user={user} 
            onUpdate={handleProfileUpdate}
          />

          {/* Componente de Orçamentos do Usuário */}
          <UserOrders />
        </div>
      </main>
    </div>
  );
}