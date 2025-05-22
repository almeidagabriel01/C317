"use client";

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { loginUser } from '@/services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

// Rotas privadas por tipo de usuário
const BUYER_ROUTES = ['/profile', '/pagamento', '/personalizar', '/pacotes'];
const ORGANIZER_ROUTES = ['/dashboard', '/users'];
// Rotas restritas para organizadores (incluindo a página inicial)
const ORGANIZER_RESTRICTED = [...BUYER_ROUTES, '/'];
// Rotas restritas para compradores
const BUYER_RESTRICTED = ORGANIZER_ROUTES;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Verificar se a rota atual é privada e se o usuário pode acessá-la
  const isPrivateRoute = useCallback((path) => {
    return [...BUYER_ROUTES, ...ORGANIZER_ROUTES].some(route => 
      path === route || path.startsWith(`${route}/`)
    );
  }, []);

  // Verificar se a rota é restrita ao tipo de usuário
  const isRestrictedRoute = useCallback((path) => {
    if (role === 'Comprador') {
      return BUYER_RESTRICTED.some(route => 
        path === route || path.startsWith(`${route}/`)
      );
    } else if (role === 'Organizador') {
      return ORGANIZER_RESTRICTED.some(route => 
        path === route || path.startsWith(`${route}/`)
      );
    }
    return false;
  }, [role]);

  // Inicializar autenticação do localStorage
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUserName = localStorage.getItem('userName');
      const storedUserData = sessionStorage.getItem('userData');

      if (storedToken) {
        setToken(storedToken);
        
        // Se temos dados completos na sessionStorage, use-os
        if (storedUserData) {
          const parsedUser = JSON.parse(storedUserData);
          setUser(parsedUser);
          setRole(parsedUser.role);
        } 
        // Se não, crie um objeto de usuário temporário apenas com o nome
        else if (storedUserName) {
          // Criamos um objeto de usuário temporário com o nome
          // O restante das informações serão preenchidas quando necessário
          setUser({ userName: storedUserName });
          // Note: o role não está disponível aqui, pode ser necessário
          // uma chamada à API para obter os dados completos do usuário
        }
      }
    } catch (error) {
      console.error("Erro ao ler autenticação do localStorage:", error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('userName');
      sessionStorage.removeItem('userData');
    } finally {
      setLoading(false);
    }
  }, []);

  // Verificar acesso à rota atual
  useEffect(() => {
    if (!loading) {
      const isVoluntaryLogout = sessionStorage.getItem('voluntaryLogout') === 'true';
      
      // Verificar se o usuário está tentando acessar uma rota que não pode
      if (isRestrictedRoute(pathname) && token) {
        
        // Redirecionar para a página adequada com base no papel
        if (role === 'Organizador') {
          router.push('/dashboard');
        } else {
          router.push('/');
        }
        return;
      }
      
      // Verificar se a rota é privada e o usuário não está autenticado
      if (isPrivateRoute(pathname) && !token) {
        if (!isVoluntaryLogout) {
          toast.warning('Você precisa estar logado para acessar esta página.');
        } else {
          sessionStorage.removeItem('voluntaryLogout');
        }
        
        if (pathname !== '/login') {
          router.push('/login');
        }
      }
    }
  }, [pathname, token, role, loading, router, isPrivateRoute, isRestrictedRoute]);

  const login = async (email, password) => {
    const toastId = toast.loading("Tentando fazer login...");
    try {
      const data = await loginUser(email, password);
      const currentToken = data.access_token;

      if (currentToken && data.user) {
        // Usar os dados completos do usuário retornados pela API
        const userData = {
          ID: data.user.ID,
          userName: data.user.userName,
          Email: data.user.Email,
          role: data.user.role,
          NumCel: data.user.NumCel,
          Ativo: data.user.Ativo
        };
        
        setToken(currentToken);
        setUser(userData);
        setRole(userData.role);
        
        // Armazenar apenas o nome do usuário no localStorage
        localStorage.setItem('authToken', currentToken);
        localStorage.setItem('userName', userData.userName);
        
        // Armazenar dados completos na sessionStorage para uso interno
        sessionStorage.setItem('userData', JSON.stringify(userData));

        toast.update(toastId, { 
          render: "Login realizado com sucesso!", 
          type: "success", 
          isLoading: false, 
          autoClose: 3000 
        });
        
        // Redirecionar com base no papel do usuário
        if (userData.role === 'Organizador') {
          router.push('/dashboard');
        } else {
          router.push('/');
        }
      } else {
        throw new Error('Token de acesso ou dados do usuário não recebidos da API.');
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
    sessionStorage.setItem('voluntaryLogout', 'true');
    
    setUser(null);
    setToken(null);
    setRole(null);
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    sessionStorage.removeItem('userData');
    
    toast.info('Logout realizado com sucesso.');
    router.push('/login');
  }, [router]);

  const value = {
    user,
    token,
    role,
    isAuthenticated: !!token,
    loading,
    login,
    logout,
    isPrivateRoute,
    isRestrictedRoute
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