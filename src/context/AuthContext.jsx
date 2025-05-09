"use client";

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { loginUser } from '@/services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

const PRIVATE_ROUTES = ['/profile', '/pagamento', '/personalizar', '/pacotes'];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Verificar se a rota atual é privada
  const isPrivateRoute = useCallback((path) => {
    return PRIVATE_ROUTES.some(route => 
      path === route || path.startsWith(`${route}/`)
    );
  }, []);

  // Inicializar autenticação do localStorage
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('authUser');

      if (storedToken) {
        setToken(storedToken);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
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

  // Verificar acesso à rota atual
  useEffect(() => {
    if (!loading) {
      const isVoluntaryLogout = sessionStorage.getItem('voluntaryLogout') === 'true';
      
      if (isPrivateRoute(pathname) && !token) {
        if (!isVoluntaryLogout) {
          // Apenas mostrar mensagem se não for um logout voluntário
          toast.warning('Você precisa estar logado para acessar esta página.');
        } else {
          // Limpar a flag após usar
          sessionStorage.removeItem('voluntaryLogout');
        }
        
        if (pathname !== '/login') {
          router.push('/login');
        }
      }
    }
  }, [pathname, token, loading, router, isPrivateRoute]);

  const login = async (email, password) => {
    const toastId = toast.loading("Tentando fazer login...");
    try {
      const data = await loginUser(email, password);
      const currentToken = data.access_token || data.acess_token;

      if (currentToken) {
        const userData = { email: email };
        setToken(currentToken);
        setUser(userData);
        localStorage.setItem('authToken', currentToken);
        localStorage.setItem('authUser', JSON.stringify(userData));

        toast.update(toastId, { 
          render: "Login realizado com sucesso!", 
          type: "success", 
          isLoading: false, 
          autoClose: 3000 
        });
        router.push('/');
      } else {
        throw new Error('Token de acesso não recebido da API.');
      }
    } catch (error) {
      console.error("Erro no login:", error);
      toast.update(toastId, { 
        render: `Erro no login: ${error.message}`, 
        type: "error", 
        isLoading: false, 
        autoClose: 5000 
      });
    }
  };

  const logout = useCallback(() => {
    // flag para logout voluntário para evitar redirecionamentos desnecessários
    sessionStorage.setItem('voluntaryLogout', 'true');
    
    // Limpar dados de autenticação
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    
    // Mostrar mensagem de sucesso
    toast.info('Logout realizado com sucesso.');
    
    // Redirecionar para a página de login
    router.push('/login');
  }, [router]);

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    logout,
    isPrivateRoute
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};