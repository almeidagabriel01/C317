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
const ORGANIZER_ROUTES = ['/dashboard','/users'];
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

  // Ao iniciar, lê token e faz mock fetch do usuário
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
        setUser(me);
        setRole(me.role);
      } catch {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

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

      setToken(t);
      setUser(me);
      setRole(me.role);

      // salva token e dados completos para mock
      localStorage.setItem('authToken', t);
      localStorage.setItem('userData', JSON.stringify(me));

      toast.update(idToast, {
        render: "Login realizado!",
        type: "success",
        isLoading: false,
        autoClose: 2000
      });

      router.push(me.role === 'Administrador' ? '/dashboard' : '/');
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
    localStorage.removeItem('userData');
    toast.info('Logout realizado.');
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{
      user, token, role,
      isAuthenticated: !!token,
      loading, login, logout,
      isPrivateRoute, isRestrictedRoute
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