'use client';
import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiSave, FiArrowLeft, FiPhone, FiFileText } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from "@/components/navbar/Navbar";

export default function Perfil() {
  const { user, updateProfile, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    celular: '',
  });
  const [loading, setLoading] = useState(false);

  // Função de formatação de telefone
  const formatTelefone = (value) => {
    // Remove tudo que não for dígito
    let digits = value.replace(/\D/g, '');
    // Limita a até 11 dígitos (2 do DDD + 9 do número)
    if (digits.length > 11) digits = digits.slice(0, 11);
    if (digits.length === 0) return '';
    if (digits.length <= 2) {
      // Só DDD parcial
      return `(${digits}`;
    }
    const ddd = digits.slice(0, 2);
    const resto = digits.slice(2);
    if (resto.length <= 4) {
      // (DD) XXXX…
      return `(${ddd}) ${resto}`;
    }
    // Insere hífen antes dos últimos 4 dígitos
    const parte1 = resto.slice(0, resto.length - 4);
    const parte2 = resto.slice(-4);
    return `(${ddd}) ${parte1}-${parte2}`;
  };


  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || '',
        email: user.email || '',
        celular: user.celular || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'celular') {
      // Aplica a formatação dinâmica
      const celularFormatado = formatTelefone(value);
      setFormData(prev => ({ ...prev, celular: celularFormatado }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Aqui você pode implementar a lógica para atualizar o perfil
      await updateProfile({
        nome: formData.nome,
        email: formData.email,
        celular: formData.celular,
      });

      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar perfil. Tente novamente.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={logout} />
      <main className="bg-gradient-to-b from-gray-900 to-gray-800 flex-1 p-4 overflow-auto">
        <div className="max-w-4xl mx-auto py-4">
          <div className="mb-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center text-amber-400 hover:text-amber-300 transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              <span>Voltar para a página inicial</span>
            </button>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden mb-4">
            <div className="bg-primary p-5 border-b border-gray-700">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <FiUser className="mr-3 text-amber-400" />
                Meu Perfil
              </h1>
              <p className="text-gray-300 mt-2">
                Gerencie suas informações pessoais
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-5">
              <div className="grid gap-5 mb-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-amber-300">
                    Nome
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      className="bg-gray-700 text-white pl-10 pr-4 py-3 border-2 border-gray-600 focus:border-amber-400 rounded-lg block w-full focus:outline-none transition-colors"
                      placeholder="Seu nome"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-amber-300">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-gray-700 text-white pl-10 pr-4 py-3 border-2 border-gray-600 focus:border-amber-400 rounded-lg block w-full focus:outline-none transition-colors"
                      placeholder="Seu email"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    O email não pode ser alterado.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-amber-300">
                    Celular
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="celular"
                      value={formData.celular}
                      onChange={handleChange}
                      maxLength={15}
                      className="bg-gray-700 text-white pl-10 pr-4 py-3 border-2 border-gray-600 focus:border-amber-400 rounded-lg block w-full focus:outline-none transition-colors"
                      placeholder="(DD) XXXXX-XXXX"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-medium py-2 px-5 rounded-lg flex items-center shadow-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span>Salvando...</span>
                  ) : (
                    <>
                      <FiSave className="mr-2" />
                      <span>Salvar Alterações</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Seção Meus Orçamentos */}
          <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
            <div className="bg-primary p-6 border-b border-gray-700">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <FiFileText className="mr-3 text-amber-400" />
                Meus Orçamentos
              </h1>
              <p className="text-gray-300 mt-2">
                Gerencie seus orçamentos de eventos
              </p>
            </div>

            <div className="p-5 flex flex-col items-center justify-center">
              <p className="text-gray-300 mb-4 text-center">
                Você ainda não possui orçamentos. Crie um novo orçamento para seu evento!
              </p>

              <button
                onClick={() => router.push('/orcamento')}
                className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-medium py-2 px-5 rounded-lg flex items-center shadow-lg transition-colors"
              >
                <FiFileText className="mr-2" />
                <span>Solicitar Orçamento</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}