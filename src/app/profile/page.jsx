'use client';
import React, { useEffect, useState, useRef } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from "@/components/navbar/Navbar";
import ProfileInfo from "@/components/profile/ProfileInfo";
import UserOrders from "@/hooks/useOrders";

export default function Perfil() {
  const { user, isAuthenticated, logout, refreshUser, loading } = useAuth();
  const router = useRouter();
  const [profileLoading, setProfileLoading] = useState(false);

  // Controle de inicialização e montagem
  const hasInitialized = useRef(false);
  const mountedRef = useRef(true);
  const isRefreshing = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Effect simplificado - remove a chamada automática de refreshUser
  useEffect(() => {
    if (!loading && isAuthenticated && !hasInitialized.current) {
      hasInitialized.current = true;
    }
  }, [isAuthenticated, loading]);

  const handleRefreshProfile = async () => {
    if (!mountedRef.current || isRefreshing.current) return;

    isRefreshing.current = true;
    setProfileLoading(true);

    try {
      await refreshUser();
    } catch (error) {
      console.error('Erro ao recarregar perfil:', error);
    } finally {
      if (mountedRef.current) {
        setProfileLoading(false);
      }
      isRefreshing.current = false;
    }
  };

  const handleProfileUpdate = () => {
    // Callback para futuras implementações
  };

  // Loading state apenas quando realmente necessário
  if (loading) {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={logout} />
        <main className="bg-gradient-to-b from-gray-900 to-gray-800 flex-1 p-4 overflow-auto custom-scrollbar">
          <div className="max-w-4xl mx-auto py-4">
            <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
              <div className="p-6 flex justify-center items-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400 mx-auto mb-2"></div>
                  <div className="text-gray-300">Carregando perfil...</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Se não está autenticado, redireciona
  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  // Loading state apenas quando realmente necessário
  if (loading) {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={logout} />
        <main className="bg-gradient-to-b from-gray-900 to-gray-800 flex-1 p-4 overflow-auto custom-scrollbar">
          <div className="max-w-4xl mx-auto py-4">
            <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
              <div className="p-6 flex justify-center items-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400 mx-auto mb-2"></div>
                  <div className="text-gray-300">Carregando perfil...</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Se não está autenticado, redireciona
  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={logout} />
      <main className="bg-gradient-to-b from-gray-900 to-gray-800 flex-1 p-4 overflow-auto custom-scrollbar">
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

          {/* Loading overlay apenas para refresh manual */}
          {profileLoading && (
            <div className="mb-4 bg-amber-900 bg-opacity-30 border border-amber-500 rounded-lg p-3">
              <div className="flex items-center gap-2 text-amber-300">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-400"></div>
                <span className="text-sm">Atualizando perfil...</span>
              </div>
            </div>
          )}

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