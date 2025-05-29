'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiClock, FiHome, FiUser, FiInfo } from 'react-icons/fi';

export default function PaymentPendingPage() {
  const router = useRouter();

  useEffect(() => {
    // Opcional: redirecionar automaticamente após alguns segundos
    const timer = setTimeout(() => {
      router.push('/profile');
    }, 15000); // 15 segundos

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 text-center border border-gray-700">
          {/* Ícone de pendente */}
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <FiClock className="w-10 h-10 text-gray-900" />
            </div>
            <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-500 rounded-full animate-pulse w-2/3"></div>
            </div>
          </div>

          {/* Título e mensagem */}
          <h1 className="text-3xl font-bold text-white mb-4 font-serif">
            Pagamento Pendente
          </h1>
          
          <p className="text-gray-300 mb-6 text-lg leading-relaxed">
            Seu pagamento está sendo processado. Isso pode levar alguns minutos.
          </p>

          {/* Informações sobre pagamento pendente */}
          <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4 mb-8">
            <p className="text-yellow-300 text-sm font-medium mb-2">
              <FiInfo className="inline w-4 h-4 mr-1" />
              Métodos que podem demorar:
            </p>
            <ul className="text-gray-300 text-sm space-y-1 text-left">
              <li>• Boleto bancário (1-3 dias úteis)</li>
              <li>• PIX (alguns minutos)</li>
              <li>• Transferência bancária</li>
            </ul>
          </div>

          <div className="bg-amber-900 bg-opacity-30 border border-amber-700 rounded-lg p-4 mb-8">
            <p className="text-amber-300 text-sm font-medium mb-2">
              📧 Acompanhe seu pagamento:
            </p>
            <p className="text-amber-200 text-sm">
              Você receberá um e-mail de confirmação assim que o pagamento for processado. 
              Fique atento à sua caixa de entrada!
            </p>
          </div>

          {/* Botões de ação */}
          <div className="space-y-3">
            <button
              onClick={() => router.push('/perfil')}
              className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <FiUser className="w-5 h-5" />
              Ver Meus Pedidos
            </button>

            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-600 hover:bg-gray-500 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <FiHome className="w-5 h-5" />
              Voltar ao Início
            </button>
          </div>

          {/* Contador regressivo */}
          <p className="text-gray-500 text-xs mt-6">
            Redirecionando automaticamente em alguns segundos...
          </p>
        </div>

        {/* Elementos decorativos */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-amber-400 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-32 left-20 w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-25 animate-pulse"></div>
      </div>
    </div>
  );
}