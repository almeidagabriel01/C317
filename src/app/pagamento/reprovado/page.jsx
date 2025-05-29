'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { FiXCircle, FiRefreshCw, FiHome, FiHelpCircle } from 'react-icons/fi';

export default function PaymentFailedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 text-center border border-gray-700">
          {/* Ícone de erro */}
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <FiXCircle className="w-10 h-10 text-white" />
            </div>
            <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full animate-pulse w-3/4"></div>
            </div>
          </div>

          {/* Título e mensagem */}
          <h1 className="text-3xl font-bold text-white mb-4 font-serif">
            Pagamento Não Processado
          </h1>

          <p className="text-gray-300 mb-6 text-lg leading-relaxed">
            Não foi possível processar seu pagamento.
            Isso pode acontecer por diversos motivos.
          </p>

          {/* Possíveis causas */}
          <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4 mb-8 text-left">
            <p className="text-amber-300 text-sm font-medium mb-2 text-center">
              <FiHelpCircle className="inline w-4 h-4 mr-1" />
              Possíveis causas:
            </p>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Dados do cartão incorretos</li>
              <li>• Limite insuficiente</li>
              <li>• Problema temporário com o cartão</li>
              <li>• Conexão interrompida</li>
            </ul>
          </div>

          {/* Botões de ação */}
          <div className="space-y-3">
            <button
              onClick={handleTryAgain}
              className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <FiRefreshCw className="w-5 h-5" />
              Tentar Novamente
            </button>

            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-600 hover:bg-gray-500 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <FiHome className="w-5 h-5" />
              Voltar ao Início
            </button>
          </div>

          {/* Informação adicional */}
          <div className="mt-6 p-3 bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg">
            <p className="text-blue-300 text-xs">
              💡 Seu pedido permanece ativo. Você pode tentar o pagamento novamente a qualquer momento.
            </p>
          </div>

          {/* Suporte */}
          <p className="text-gray-500 text-xs mt-4">
            Precisa de ajuda? Entre em contato conosco através do WhatsApp ou e-mail.
          </p>
        </div>

        {/* Elementos decorativos */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-red-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-amber-400 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-32 left-20 w-1.5 h-1.5 bg-red-300 rounded-full opacity-25 animate-pulse"></div>
      </div>
    </div>
  );
}