"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchUsers, fetchUserOrders, fetchItemsForAdmin } from '@/services/api';
import { toast } from 'react-toastify';

// Cache global para evitar chamadas duplicadas
const dataCache = {
  users: { data: null, timestamp: null, loading: false },
  orders: { data: null, timestamp: null, loading: false },
  items: { data: null, timestamp: null, loading: false }
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const useAdminData = (dataType) => {
  const { isAuthenticated, role, loading: authLoading } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  // Funções de fetch para cada tipo de dados
  const fetchFunctions = {
    users: fetchUsers,
    orders: fetchUserOrders,
    items: fetchItemsForAdmin
  };

  // Verifica se os dados em cache ainda são válidos
  const isCacheValid = useCallback((cacheEntry) => {
    return cacheEntry.data &&
      cacheEntry.timestamp &&
      (Date.now() - cacheEntry.timestamp) < CACHE_DURATION;
  }, []);

  // Função para buscar dados com cache
  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!isAuthenticated || role !== 'Administrador' || authLoading) {
      return;
    }

    const cacheEntry = dataCache[dataType];

    // Se já está carregando, aguarda
    if (cacheEntry.loading) {
      return;
    }

    // Se tem cache válido e não é refresh forçado, usa o cache
    if (!forceRefresh && isCacheValid(cacheEntry)) {
      setData(cacheEntry.data);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      // Marca como carregando no cache global
      cacheEntry.loading = true;
      setLoading(true);
      setError(null);

      const fetchFunction = fetchFunctions[dataType];
      const result = await fetchFunction();

      if (mountedRef.current) {
        // Atualiza cache global
        cacheEntry.data = result;
        cacheEntry.timestamp = Date.now();
        cacheEntry.loading = false;

        // Atualiza estado local
        setData(result);
        setLoading(false);
      }
    } catch (err) {
      console.error(`Erro ao carregar ${dataType}:`, err);

      if (mountedRef.current) {
        cacheEntry.loading = false;
        setError(err.message);
        setLoading(false);
        toast.error(`Erro ao carregar ${dataType}: ${err.message}`);
      }
    }
  }, [isAuthenticated, role, authLoading, dataType, isCacheValid, fetchFunctions]);

  // Função para invalidar cache específico
  const invalidateCache = useCallback(() => {
    dataCache[dataType] = { data: null, timestamp: null, loading: false };
  }, [dataType]);

  // Função para refresh dos dados
  const refreshData = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  // Carrega dados iniciais
  useEffect(() => {
    mountedRef.current = true;
    fetchData();

    return () => {
      mountedRef.current = false;
    };
  }, [fetchData]);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    data,
    loading,
    error,
    refreshData,
    invalidateCache
  };
};

// Hook específico para usuários
export const useUsers = () => {
  const result = useAdminData('users');

  const updateUserInCache = useCallback((userId, updatedData) => {
    const cacheEntry = dataCache.users;
    if (cacheEntry.data) {
      cacheEntry.data = cacheEntry.data.map(user =>
        user.id === userId
          ? { ...user, ...updatedData }
          : user
      );
    }
  }, []);

  return {
    ...result,
    updateUserInCache
  };
};

// Hook específico para pedidos
export const useOrders = () => {
  const result = useAdminData('orders');

  const updateOrderInCache = useCallback((orderId, updatedData) => {
    const cacheEntry = dataCache.orders;
    if (cacheEntry.data) {
      cacheEntry.data = cacheEntry.data.map(order =>
        order.id === orderId
          ? { ...order, ...updatedData }
          : order
      );
    }
  }, []);

  return {
    ...result,
    updateOrderInCache
  };
};

// Hook específico para itens
export const useItems = () => {
  const result = useAdminData('items');

  const updateItemInCache = useCallback((itemId, updatedData) => {
    const cacheEntry = dataCache.items;
    if (cacheEntry.data) {
      cacheEntry.data = cacheEntry.data.map(item =>
        item.id === itemId
          ? { ...item, ...updatedData }
          : item
      );
    }
  }, []);

  const addItemToCache = useCallback((newItem) => {
    const cacheEntry = dataCache.items;
    if (cacheEntry.data) {
      cacheEntry.data = [...cacheEntry.data, newItem];
    }
  }, []);

  return {
    ...result,
    updateItemInCache,
    addItemToCache
  };
};