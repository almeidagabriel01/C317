"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchUsers, fetchUserOrders, fetchItemsForAdmin } from '@/services/api';
import { toast } from 'react-toastify';

// Cache global para cada tipo de dados
const globalCache = {
  users: { data: null, timestamp: null, loading: false, promise: null },
  orders: { data: null, timestamp: null, loading: false, promise: null },
  items: { data: null, timestamp: null, loading: false, promise: null }
};

const CACHE_DURATION = 3 * 60 * 1000; // 3 minutos

export const useAdminData = (dataType) => {
  const { isAuthenticated, role, loading: authLoading } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);
  const hasInitialized = useRef(false);

  // Função para buscar dados com cache global
  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!isAuthenticated || role !== 'Administrador' || authLoading) {
      setLoading(false);
      return;
    }

    const cache = globalCache[dataType];
    if (!cache) {
      throw new Error(`Tipo de dados desconhecido: ${dataType}`);
    }

    // Verifica cache se não for refresh forçado
    if (!forceRefresh && cache.data && cache.timestamp &&
      (Date.now() - cache.timestamp) < CACHE_DURATION) {
      if (mountedRef.current) {
        setData(cache.data);
        setLoading(false);
        setError(null);
      }
      return cache.data;
    }

    // Se já está carregando, aguarda a promise existente
    if (cache.loading && cache.promise && !forceRefresh) {
      try {
        const result = await cache.promise;
        if (mountedRef.current) {
          setData(result);
          setLoading(false);
          setError(null);
        }
        return result;
      } catch (err) {
        // Se a promise pendente falhou, continua com nova requisição
      }
    }

    setLoading(true);
    setError(null);
    cache.loading = true;

    try {
      // Seleciona a função de fetch baseada no tipo
      let fetchFunction;
      switch (dataType) {
        case 'users':
          fetchFunction = fetchUsers;
          break;
        case 'orders':
          fetchFunction = fetchUserOrders;
          break;
        case 'items':
          fetchFunction = () => fetchItemsForAdmin(forceRefresh);
          break;
        default:
          throw new Error(`Tipo de dados desconhecido: ${dataType}`);
      }

      // Cria promise única para evitar chamadas duplicadas
      const promise = fetchFunction();
      cache.promise = promise;

      const result = await promise;

      // Atualiza cache
      cache.data = result;
      cache.timestamp = Date.now();
      cache.loading = false;

      if (mountedRef.current) {
        setData(result);
        setLoading(false);
      }

      return result;
    } catch (err) {
      console.error(`Erro ao carregar ${dataType}:`, err);
      cache.loading = false;
      cache.promise = null;

      if (mountedRef.current) {
        setError(err.message);
        setLoading(false);
        toast.error(`Erro ao carregar ${dataType}: ${err.message}`);
      }

      throw err;
    }
  }, [isAuthenticated, role, authLoading, dataType]);

  // Função para refresh forçado com cache busting (específica para imagens)
  const refreshDataWithCacheBusting = useCallback(async () => {
    // Invalida cache
    globalCache[dataType].timestamp = null;
    return fetchData(true);
  }, [fetchData, dataType]);

  // Função para refresh dos dados (força novo fetch)
  const refreshData = useCallback(() => {
    globalCache[dataType].timestamp = null; // Invalida cache
    return fetchData(true);
  }, [fetchData, dataType]);

  // Função para limpar dados
  const clearData = useCallback(() => {
    setData([]);
    setError(null);
    // Limpa cache
    const cache = globalCache[dataType];
    if (cache) {
      cache.data = null;
      cache.timestamp = null;
      cache.loading = false;
      cache.promise = null;
    }
  }, [dataType]);

  // Effect principal - executa apenas uma vez quando as condições são atendidas
  useEffect(() => {
    if (!hasInitialized.current && !authLoading && isAuthenticated && role === 'Administrador') {
      hasInitialized.current = true;
      fetchData();
    }
  }, [isAuthenticated, role, authLoading, fetchData]);

  // Cleanup ao desmontar
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    data,
    loading,
    error,
    refreshData,
    refreshDataWithCacheBusting,
    clearData
  };
};

// Hook específico para usuários
export const useUsers = () => {
  const result = useAdminData('users');
  const [localData, setLocalData] = useState([]);

  // Sincroniza com os dados do hook principal apenas quando necessário
  useEffect(() => {
    if (JSON.stringify(localData) !== JSON.stringify(result.data)) {
      setLocalData(result.data);
    }
  }, [result.data, localData]);

  const updateUserInCache = useCallback((userId, updatedData) => {
    setLocalData(prev => prev.map(user =>
      user.id === userId
        ? { ...user, ...updatedData }
        : user
    ));

    // Atualiza também o cache global
    const cache = globalCache.users;
    if (cache.data) {
      cache.data = cache.data.map(user =>
        user.id === userId
          ? { ...user, ...updatedData }
          : user
      );
    }
  }, []);

  return {
    ...result,
    data: localData,
    updateUserInCache
  };
};

// Hook específico para pedidos
export const useOrders = () => {
  const result = useAdminData('orders');
  const [localData, setLocalData] = useState([]);

  // Sincroniza com os dados do hook principal apenas quando necessário
  useEffect(() => {
    if (JSON.stringify(localData) !== JSON.stringify(result.data)) {
      setLocalData(result.data);
    }
  }, [result.data, localData]);

  const updateOrderInCache = useCallback((orderId, updatedData) => {
    console.log('🔄 Atualizando order cache:', orderId, updatedData);
    
    // ← Força atualização imediata do estado local usando callback
    setLocalData(prev => {
      const newData = prev.map(order =>
        order.id === orderId
          ? { ...order, ...updatedData }
          : order
      );
      console.log('✅ Cache local atualizado');
      return newData;
    });

    // Atualiza também o cache global de forma síncrona
    const cache = globalCache.orders;
    if (cache.data) {
      cache.data = cache.data.map(order =>
        order.id === orderId
          ? { ...order, ...updatedData }
          : order
      );
      console.log('✅ Cache global atualizado');
    }
  }, []);

  return {
    ...result,
    data: localData,
    updateOrderInCache
  };
};

// Hook específico para itens
export const useItems = () => {
  const result = useAdminData('items');
  const [localData, setLocalData] = useState([]);

  // Sincroniza com os dados do hook principal apenas quando necessário
  useEffect(() => {
    if (JSON.stringify(localData) !== JSON.stringify(result.data)) {
      setLocalData(result.data);
    }
  }, [result.data, localData]);

  const updateItemInCache = useCallback((itemId, updatedData) => {
    setLocalData(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, ...updatedData }
        : item
    ));

    // Atualiza também o cache global
    const cache = globalCache.items;
    if (cache.data) {
      cache.data = cache.data.map(item =>
        item.id === itemId
          ? { ...item, ...updatedData }
          : item
      );
    }
  }, []);

  const addItemToCache = useCallback((newItem) => {
    setLocalData(prev => [...prev, newItem]);

    // Atualiza também o cache global
    const cache = globalCache.items;
    if (cache.data) {
      cache.data = [...cache.data, newItem];
    }
  }, []);

  return {
    ...result,
    data: localData,
    updateItemInCache,
    addItemToCache
  };
};