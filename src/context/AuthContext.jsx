"use client";

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { loginUser } from '@/services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('authUser');

      if (storedToken) {
        setToken(storedToken);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      }
    } catch (error) {
      console.error("Erro ao ler autenticação do localStorage:", error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const toastId = toast.loading("Tentando fazer login...");
    try {
      const data = await loginUser(email, password);

      // Verifica se 'access_token' existe (use 'acess_token' se for o caso no seu backend)
      const currentToken = data.access_token || data.acess_token;

      if (currentToken) {
        const userData = { email: email };

        setToken(currentToken);
        setUser(userData);
        localStorage.setItem('authToken', currentToken);
        localStorage.setItem('authUser', JSON.stringify(userData));

        toast.update(toastId, { render: "Login realizado com sucesso!", type: "success", isLoading: false, autoClose: 3000 });
        router.push('/');
      } else {
        throw new Error('Token de acesso não recebido da API.');
      }
    } catch (error) {
      console.error("Erro no login:", error);
      toast.update(toastId, { render: `Erro no login: ${error.message}`, type: "error", isLoading: false, autoClose: 5000 });
      setToken(null);
      setUser(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    toast.info('Logout realizado.');
    router.push('/login');
  }, [router]);

  // Efeito para redirecionar se logado tentando acessar /login ou /cadastro
  useEffect(() => {
    if (!loading && token) {
      if (pathname === '/login' || pathname === '/cadastro') {
        router.push('/');
      }
    }
  }, [pathname, token, loading, router]);

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook customizado
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};