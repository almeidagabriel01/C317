"use client";

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import GerenciarUsuarios from '@/components/users/GerenciarUsuarios';

export default function GerenciarUsuariosPage() {
  const { isAuthenticated, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Verificação de autenticação e papel na camada de rota
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (role !== 'Organizador') {
        router.push('/');
      }
    }
  }, [isAuthenticated, role, loading, router]);

  // Mostrar loader enquanto verifica autenticação
  if (loading || !isAuthenticated || role !== 'Organizador') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white text-xl">Carregando...</p>
      </div>
    );
  }

  return <GerenciarUsuarios />;
}