"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { loginUser, fetchCurrentUser } from '@/services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

const BUYER_ROUTES = ['/profile','/pagamento','/personalizar','/pacotes'];
const ORGANIZER_ROUTES = ['/dashboard','/users','/pedidos','/gerenciar-itens'];
const ORGANIZER_RESTRICTED = [...BUYER_ROUTES,'/'];
const BUYER_RESTRICTED = ORGANIZER_ROUTES;

export const AuthProvider = ({ children }) => {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole]   = useState(null);
  const [loading, setLoading] = useState(true);
  const router   = useRouter();
  const pathname = usePathname();

  const isPrivateRoute = useCallback(path =>
    [...BUYER_ROUTES, ...ORGANIZER_ROUTES]
      .some(r => path === r || path.startsWith(`${r}/`)),
  [],);

  const isRestrictedRoute = useCallback(path => {
    if (role === 'Cliente') {
      return BUYER_RESTRICTED.some(r => path === r || path.startsWith(`${r}/`));
    }
    if (role === 'Administrador') {
      return ORGANIZER_RESTRICTED.some(r => path === r || path.startsWith(`${r}/`));
    }
    return false;
  }, [role]);

  // Função para normalizar dados do usuário
  const normalizeUser = useCallback((userData) => {
    return {
      ID: userData.ID || userData.id,
      nome: userData.nome || userData.userName || userData.name,
      email: userData.email || userData.Email,
      role: userData.role,
      celular: userData.celular || userData.NumCel,
      ativo: userData.ativo !== undefined ? userData.ativo : userData.Ativo,
      originalData: userData.originalData || userData,
    };
  }, []);

  // Ao iniciar, lê token e busca dados do usuário via API
  useEffect(() => {
    const init = async () => {
      const t = localStorage.getItem('authToken');
      if (!t) {
        setLoading(false);
        return;
      }
      setToken(t);
      try {
        const me = await fetchCurrentUser();
        const normalizedUser = normalizeUser(me);
        setUser(normalizedUser);
        setRole(normalizedUser.role);
      } catch {
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [normalizeUser]);

  // Proteção de rotas
  useEffect(() => {
    if (loading) return;
    const isVoluntaryLogout = sessionStorage.getItem('voluntaryLogout') === 'true';

    if (isRestrictedRoute(pathname) && token) {
      router.push(role === 'Administrador' ? '/dashboard' : '/');
      return;
    }
    if (isPrivateRoute(pathname) && !token) {
      if (!isVoluntaryLogout) {
        toast.warning('Você precisa estar logado para acessar esta página.');
      } else {
        sessionStorage.removeItem('voluntaryLogout');
      }
      if (pathname !== '/login') router.push('/login');
    }
  }, [pathname, token, role, loading, router, isPrivateRoute, isRestrictedRoute]);

  const login = async (email, password) => {
    const idToast = toast.loading("Entrando...");
    try {
      const data = await loginUser(email, password);
      const t = data.access_token;
      const me = data.user;

      // Normalizar dados do usuário
      const normalizedUser = normalizeUser(me);

      setToken(t);
      setUser(normalizedUser);
      setRole(normalizedUser.role);

      // Salva apenas o token, dados serão buscados via API
      localStorage.setItem('authToken', t);

      toast.update(idToast, {
        render: "Login realizado!",
        type: "success",
        isLoading: false,
        autoClose: 2000
      });

      router.push(normalizedUser.role === 'Administrador' ? '/dashboard' : '/');
    } catch (err) {
      toast.update(idToast, {
        render: `Erro: ${err.message}`,
        type: "error",
        isLoading: false,
        autoClose: 4000
      });
    }
  };

  const logout = useCallback(() => {
    sessionStorage.setItem('voluntaryLogout','true');
    setUser(null);
    setToken(null);
    setRole(null);
    localStorage.removeItem('authToken');
    toast.info('Logout realizado.');
    router.push('/login');
  }, [router]);

  // Função para recarregar dados do usuário
  const refreshUser = useCallback(async () => {
    if (!token) return null;
    try {
      const me = await fetchCurrentUser();
      const normalizedUser = normalizeUser(me);
      setUser(normalizedUser);
      setRole(normalizedUser.role);
      return normalizedUser;
    } catch (error) {
      console.error('Erro ao recarregar dados do usuário:', error);
      return null;
    }
  }, [token, normalizeUser]);

  return (
    <AuthContext.Provider value={{
      user, token, role,
      isAuthenticated: !!token,
      loading, login, logout,
      isPrivateRoute, isRestrictedRoute,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
};