"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { loginUser, fetchCurrentUser } from '@/services/api';
import { useClearAllCache } from '@/hooks/useDataManager';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

const BUYER_ROUTES = ['/profile', '/pagamento', '/personalizar', '/pacotes'];
const ORGANIZER_ROUTES = ['/dashboard', '/users', '/pedidos', '/itens'];
const ORGANIZER_RESTRICTED = [...BUYER_ROUTES, '/'];
const BUYER_RESTRICTED = ORGANIZER_ROUTES;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const hasInitialized = useRef(false);
  const mountedRef = useRef(true);
  const routeProtectionTimeoutRef = useRef(null);
  const clearAllCache = useClearAllCache();

  const isPrivateRoute = useCallback(path =>
    [...BUYER_ROUTES, ...ORGANIZER_ROUTES]
      .some(r => path === r || path.startsWith(`${r}/`)),
  []);

  const isRestrictedRoute = useCallback(path => {
    if (role === 'Cliente') {
      return BUYER_RESTRICTED.some(r => path === r || path.startsWith(`${r}/`));
    }
    if (role === 'Administrador') {
      return ORGANIZER_RESTRICTED.some(r => path === r || path.startsWith(`${r}/`));
    }
    return false;
  }, [role]);

  const normalizeUser = useCallback((userData) => ({
    ID: userData.ID || userData.id,
    nome: userData.nome || userData.userName || userData.name,
    email: userData.email || userData.Email,
    role: userData.role,
    celular: userData.celular || userData.NumCel,
    ativo: userData.ativo !== undefined ? userData.ativo : userData.Ativo,
    originalData: userData.originalData || userData,
  }), []);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const init = async () => {
      const t = localStorage.getItem('authToken');
      if (!t) {
        setLoading(false);
        return;
      }

      setToken(t);
      try {
        const me = await fetchCurrentUser();
        if (mountedRef.current) {
          const normalizedUser = normalizeUser(me);
          setUser(normalizedUser);
          setRole(normalizedUser.role);
        }
      } catch (error) {
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
        setRole(null);
        clearAllCache();
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [normalizeUser, clearAllCache]);

  useEffect(() => {
    if (loading || !hasInitialized.current) return;

    routeProtectionTimeoutRef.current = setTimeout(() => {
      if (!mountedRef.current) return;

      const isVoluntaryLogout = sessionStorage.getItem('voluntaryLogout') === 'true';

      if (isRestrictedRoute(pathname) && token && role) {
        router.replace(role === 'Administrador' ? '/dashboard' : '/');
        return;
      }

      if (isPrivateRoute(pathname) && !token) {
        if (!isVoluntaryLogout) {
          toast.warning('Você precisa estar logado para acessar esta página.');
        } else {
          sessionStorage.removeItem('voluntaryLogout');
        }
        router.replace('/login');
      }
    }, 50);

    return () => clearTimeout(routeProtectionTimeoutRef.current);
  }, [pathname, token, role, loading, router, isPrivateRoute, isRestrictedRoute]);

  const login = async (email, password) => {
    const idToast = toast.loading("Entrando...");
    try {
      const data = await loginUser(email, password);
      const normalizedUser = normalizeUser(data.user);

      clearAllCache();

      setToken(data.access_token);
      setUser(normalizedUser);
      setRole(normalizedUser.role);
      localStorage.setItem('authToken', data.access_token);

      toast.update(idToast, {
        render: "Login realizado!",
        type: "success",
        isLoading: false,
        autoClose: 2000
      });

      router.replace(normalizedUser.role === 'Administrador' ? '/dashboard' : '/');
    } catch (err) {
      toast.update(idToast, {
        render: `Erro: ${err.message}`,
        type: "error",
        isLoading: false,
        autoClose: 4000
      });
    }
  };

  const logout = useCallback(async () => {
    sessionStorage.setItem('voluntaryLogout', 'true');
    clearAllCache();

    setUser(null);
    setToken(null);
    setRole(null);
    localStorage.removeItem('authToken');
    toast.info('Logout realizado.');

    // Aguarde estado atualizar antes de redirecionar
    await new Promise(res => setTimeout(res, 100));
    router.replace('/login');
  }, [router, clearAllCache]);

  const refreshUser = useCallback(async () => {
    if (!token) return null;
    try {
      const me = await fetchCurrentUser();
      const normalizedUser = normalizeUser(me);
      setUser(normalizedUser);
      setRole(normalizedUser.role);
      return normalizedUser;
    } catch (error) {
      return null;
    }
  }, [token, normalizeUser]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearTimeout(routeProtectionTimeoutRef.current);
    };
  }, []);

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