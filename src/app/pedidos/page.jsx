"use client";

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import GerenciarPedidos from '@/components/pedidos/GerenciarPedidos';

export default function PedidosPage() {
  const { isAuthenticated, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (role !== 'Administrador') {
        router.push('/');
      }
    }
  }, [isAuthenticated, role, loading, router]);

  // Mostrar loader enquanto verifica autenticação
  if (loading || !isAuthenticated || role !== 'Administrador') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-white text-xl">
            {loading ? "Verificando autenticação..." : "Carregando..."}
          </p>
        </div>
      </div>
    );
  }

  return <GerenciarPedidos />;
}