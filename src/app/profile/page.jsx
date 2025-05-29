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
  const hasInitialized = useRef(false);
  const mountedRef = useRef(true);
  const isRefreshing = useRef(false);

  useEffect(() => { mountedRef.current = true; return () => { mountedRef.current = false; }; }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace('/login');
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (!loading && isAuthenticated && !hasInitialized.current) {
      hasInitialized.current = true;
    }
  }, [loading, isAuthenticated]);

  // Faz refresh dos dados do perfil
  const handleRefreshProfile = async () => {
    if (!mountedRef.current || isRefreshing.current) return;
    isRefreshing.current = true;
    setProfileLoading(true);
    try {
      await refreshUser();
    } catch (err) {
      console.error('Erro ao recarregar perfil:', err);
    } finally {
      if (mountedRef.current) setProfileLoading(false);
      isRefreshing.current = false;
    }
  };

  // Passa esta função para o ProfileInfo
  const handleProfileUpdate = () => {
    handleRefreshProfile();
  };

  if (loading || (!loading && !isAuthenticated)) {
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

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={logout} />
      <main className="bg-gradient-to-b from-gray-900 to-gray-800 flex-1 p-4 overflow-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto py-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center text-amber-400 hover:text-amber-300 mb-4 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            <span>Voltar para a página inicial</span>
          </button>

          {profileLoading && (
            <div className="mb-4 bg-amber-900 bg-opacity-30 border border-amber-500 rounded-lg p-3">
              <div className="flex items-center gap-2 text-amber-300">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-400"></div>
                <span className="text-sm">Atualizando perfil...</span>
              </div>
            </div>
          )}

          <ProfileInfo user={user} onUpdate={handleProfileUpdate} />
          <UserOrders />
        </div>
      </main>
    </div>
  );
}