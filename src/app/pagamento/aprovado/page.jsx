'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiCheckCircle, FiHome, FiUser } from 'react-icons/fi';

export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/profile');
    }, 10000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 text-center border border-gray-700">
          {/* Ícone de sucesso */}
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <FiCheckCircle className="w-10 h-10 text-white" />
            </div>
            <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Título e mensagem */}
          <h1 className="text-3xl font-bold text-white mb-4 font-serif">
            Pagamento Aprovado!
          </h1>

          <p className="text-gray-300 mb-6 text-lg leading-relaxed">
            Obrigado por escolher a <span className="text-amber-400 font-semibold">Elo Drinks</span>!
            Seu pagamento foi processado com sucesso.
          </p>

          <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4 mb-8">
            <p className="text-amber-300 text-sm font-medium mb-2">
              📧 Próximos passos:
            </p>
            <p className="text-gray-300 text-sm">
              Em breve entraremos em contato para finalizar os detalhes do seu evento.
              Fique atento ao seu e-mail e WhatsApp!
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
        <div className="absolute top-20 left-10 w-2 h-2 bg-amber-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-green-400 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-32 left-20 w-1.5 h-1.5 bg-amber-300 rounded-full opacity-25 animate-pulse"></div>
      </div>
    </div>
  );
}