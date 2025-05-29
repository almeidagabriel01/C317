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
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

const BUYER_ROUTES = ['/profile','/pagamento','/personalizar','/pacotes'];
const ORGANIZER_ROUTES = ['/dashboard','/users','/pedidos','/gerenciar-itens'];
const ORGANIZER_RESTRICTED = [...BUYER_ROUTES,'/'];
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

  // Inicialização - executa apenas uma vez
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
        console.error('Erro ao buscar usuário atual:', error);
        if (mountedRef.current) {
          localStorage.removeItem('authToken');
          setToken(null);
          setUser(null);
          setRole(null);
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };
    
    init();
  }, [normalizeUser]);

  // Proteção de rotas - usando useEffect para evitar setState durante render
  useEffect(() => {
    // Limpa timeout anterior se existir
    if (routeProtectionTimeoutRef.current) {
      clearTimeout(routeProtectionTimeoutRef.current);
    }

    // Só executa proteção se não estiver carregando e tiver inicializado
    if (loading || !hasInitialized.current) return;
    
    const isVoluntaryLogout = sessionStorage.getItem('voluntaryLogout') === 'true';

    // Usa timeout para evitar múltiplas execuções e problemas de setState durante render
    routeProtectionTimeoutRef.current = setTimeout(() => {
      if (!mountedRef.current) return;

      // Rota restrita para o role atual - SOMENTE se não estivermos já na rota correta
      if (isRestrictedRoute(pathname) && token && role) {
        const targetRoute = role === 'Administrador' ? '/dashboard' : '/';
        if (pathname !== targetRoute) {
          router.replace(targetRoute); // Usa replace em vez de push
        }
        return;
      }
      
      // Rota privada sem autenticação
      if (isPrivateRoute(pathname) && !token) {
        if (!isVoluntaryLogout) {
          toast.warning('Você precisa estar logado para acessar esta página.');
        } else {
          sessionStorage.removeItem('voluntaryLogout');
        }
        if (pathname !== '/login') {
          router.replace('/login'); // Usa replace em vez de push
        }
      }
    }, 50); // Reduzido para 50ms para ser mais responsivo

    // Cleanup do timeout
    return () => {
      if (routeProtectionTimeoutRef.current) {
        clearTimeout(routeProtectionTimeoutRef.current);
      }
    };
  }, [pathname, token, role, loading, router, isPrivateRoute, isRestrictedRoute]);

  const login = async (email, password) => {
    const idToast = toast.loading("Entrando...");
    try {
      const data = await loginUser(email, password);
      const t = data.access_token;
      const me = data.user;

      // Normalizar dados do usuário
      const normalizedUser = normalizeUser(me);

      // Determina a rota de destino ANTES de atualizar o estado
      const targetRoute = normalizedUser.role === 'Administrador' ? '/dashboard' : '/';

      if (mountedRef.current) {
        setToken(t);
        setUser(normalizedUser);
        setRole(normalizedUser.role);

        // Salva apenas o token, dados serão buscados via API
        localStorage.setItem('authToken', t);
      }

      toast.update(idToast, {
        render: "Login realizado!",
        type: "success",
        isLoading: false,
        autoClose: 2000
      });

      // Navega IMEDIATAMENTE para a rota correta, sem timeout
      if (mountedRef.current) {
        router.replace(targetRoute); // Usa replace em vez de push para evitar histórico
      }
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
    // Limpa qualquer timeout pendente
    if (routeProtectionTimeoutRef.current) {
      clearTimeout(routeProtectionTimeoutRef.current);
    }

    sessionStorage.setItem('voluntaryLogout','true');
    
    if (mountedRef.current) {
      setUser(null);
      setToken(null);
      setRole(null);
    }
    
    localStorage.removeItem('authToken');
    toast.info('Logout realizado.');
    
    // Navega imediatamente para login
    if (mountedRef.current) {
      router.replace('/login'); // Usa replace em vez de push
    }
  }, [router]);

  // Função para recarregar dados do usuário
  const refreshUser = useCallback(async () => {
    if (!token) return null;
    try {
      const me = await fetchCurrentUser();
      if (mountedRef.current) {
        const normalizedUser = normalizeUser(me);
        setUser(normalizedUser);
        setRole(normalizedUser.role);
        return normalizedUser;
      }
      return null;
    } catch (error) {
      console.error('Erro ao recarregar dados do usuário:', error);
      return null;
    }
  }, [token, normalizeUser]);

  // Cleanup
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      // Limpa timeout ao desmontar
      if (routeProtectionTimeoutRef.current) {
        clearTimeout(routeProtectionTimeoutRef.current);
      }
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