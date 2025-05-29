'use client';
import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiSave, FiPhone } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { formatPhoneInput } from '@/utils/formatUtils';
import { updateUserProfile } from '@/services/api';

export default function ProfileInfo({ user, onUpdate }) {
  const [formData, setFormData] = useState({ nome: '', email: '', celular: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || '',
        email: user.email || '',
        celular: formatPhoneInput(user.celular || ''),
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'celular') {
      setFormData(prev => ({ ...prev, celular: formatPhoneInput(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const rawPhone = formData.celular.replace(/\D/g, '');
      await updateUserProfile({
        ID: user.ID,
        userName: formData.nome,
        NumCel: rawPhone
      });
      toast.success('Perfil atualizado com sucesso!');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden mb-4">
      <div className="bg-primary p-5 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <FiUser className="mr-3 text-amber-400" />
          Meu Perfil
        </h1>
        <p className="text-gray-300 mt-2">Gerencie suas informações pessoais</p>
      </div>

      <div className="p-5 max-h-[60vh] overflow-y-auto custom-scrollbar">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 mb-5 md:grid-cols-2">
            {/* Nome */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-amber-300">Nome</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className="bg-gray-700 text-white pl-10 pr-4 py-3 border-2 border-gray-600 focus:border-amber-400 rounded-lg w-full focus:outline-none transition-colors"
                  placeholder="Seu nome"
                />
              </div>
            </div>

            {/* Email (readonly) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-amber-300">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="bg-gray-700 text-white pl-10 pr-4 py-3 border-2 border-gray-600 rounded-lg w-full opacity-50"
                  placeholder="Seu email"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">O email não pode ser alterado.</p>
            </div>

            {/* Celular */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-amber-300">Celular</label>
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
                  className="bg-gray-700 text-white pl-10 pr-4 py-3 border-2 border-gray-600 focus:border-amber-400 rounded-lg w-full transition-colors"
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
              {loading
                ? 'Salvando...'
                : (
                  <>
                    <FiSave className="mr-2" />
                    <span>Salvar Alterações</span>
                  </>
                )
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}