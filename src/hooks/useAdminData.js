"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchUsers, fetchUserOrders, fetchItemsForAdmin } from '@/services/api';
import { toast } from 'react-toastify';

// Mapa de requisições em andamento para evitar chamadas duplicadas na mesma sessão
const pendingRequests = new Map();

export const useAdminData = (dataType) => {
  const { isAuthenticated, role, loading: authLoading } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);
  const [refreshKey, setRefreshKey] = useState(0); // Para forçar re-fetch

  // Função para buscar dados
  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!isAuthenticated || role !== 'Administrador' || authLoading) {
      return;
    }

    const requestKey = `${dataType}-${refreshKey}`;
    
    // Se já há uma requisição em andamento para este tipo de dados, aguarda
    if (!forceRefresh && pendingRequests.has(requestKey)) {
      try {
        const result = await pendingRequests.get(requestKey);
        if (mountedRef.current) {
          setData(result);
          setLoading(false);
          setError(null);
        }
        return result;
      } catch (err) {
        // Se a requisição pendente falhou, remove da cache e tenta novamente
        pendingRequests.delete(requestKey);
      }
    }

    try {
      setLoading(true);
      setError(null);

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
          fetchFunction = fetchItemsForAdmin;
          break;
        default:
          throw new Error(`Tipo de dados desconhecido: ${dataType}`);
      }
      
      // Cria uma promise e armazena no mapa para evitar chamadas duplicadas
      const promise = fetchFunction();
      if (!forceRefresh) {
        pendingRequests.set(requestKey, promise);
      }
      
      const result = await promise;

      if (mountedRef.current) {
        setData(result);
        setLoading(false);
      }
      
      return result;
    } catch (err) {
      console.error(`Erro ao carregar ${dataType}:`, err);
      
      if (mountedRef.current) {
        setError(err.message);
        setLoading(false);
        toast.error(`Erro ao carregar ${dataType}: ${err.message}`);
      }
      
      throw err;
    } finally {
      // Remove a requisição do mapa após completar
      pendingRequests.delete(requestKey);
    }
  }, [isAuthenticated, role, authLoading, dataType, refreshKey]);

  // Função para refresh forçado com cache busting (específica para imagens)
  const refreshDataWithCacheBusting = useCallback(async () => {
    if (!isAuthenticated || role !== 'Administrador' || authLoading) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let result;
      if (dataType === 'items') {
        // Para itens, usa fetchItemsForAdmin com forceImageRefresh = true
        result = await fetchItemsForAdmin(true);
      } else if (dataType === 'users') {
        result = await fetchUsers();
      } else if (dataType === 'orders') {
        result = await fetchUserOrders();
      } else {
        throw new Error(`Tipo de dados desconhecido: ${dataType}`);
      }

      if (mountedRef.current) {
        setData(result);
        setLoading(false);
      }
      
      return result;
    } catch (err) {
      console.error(`Erro ao carregar ${dataType}:`, err);

      if (mountedRef.current) {
        setError(err.message);
        setLoading(false);
        toast.error(`Erro ao carregar ${dataType}: ${err.message}`);
      }
      
      throw err;
    }
  }, [isAuthenticated, role, authLoading, dataType]);

  // Função para refresh dos dados (força novo fetch)
  const refreshData = useCallback(() => {
    setRefreshKey(prev => prev + 1);
    return fetchData(true);
  }, [fetchData]);

  // Função para limpar dados
  const clearData = useCallback(() => {
    setData([]);
    setError(null);
    // Limpa requisições pendentes deste tipo
    const keysToDelete = [];
    for (const key of pendingRequests.keys()) {
      if (key.startsWith(dataType)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach(key => pendingRequests.delete(key));
  }, [dataType]);

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
    refreshDataWithCacheBusting,
    clearData
  };
};

// Hook específico para usuários
export const useUsers = () => {
  const result = useAdminData('users');
  const [localData, setLocalData] = useState([]);

  // Sincroniza com os dados do hook principal
  useEffect(() => {
    setLocalData(result.data);
  }, [result.data]);

  const updateUserInCache = useCallback((userId, updatedData) => {
    setLocalData(prev => prev.map(user =>
      user.id === userId
        ? { ...user, ...updatedData }
        : user
    ));
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

  // Sincroniza com os dados do hook principal
  useEffect(() => {
    setLocalData(result.data);
  }, [result.data]);

  const updateOrderInCache = useCallback((orderId, updatedData) => {
    setLocalData(prev => prev.map(order =>
      order.id === orderId
        ? { ...order, ...updatedData }
        : order
    ));
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

  // Sincroniza com os dados do hook principal
  useEffect(() => {
    setLocalData(result.data);
  }, [result.data]);

  const updateItemInCache = useCallback((itemId, updatedData) => {
    setLocalData(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, ...updatedData }
        : item
    ));
  }, []);

  const addItemToCache = useCallback((newItem) => {
    setLocalData(prev => [...prev, newItem]);
  }, []);

  return {
    ...result,
    data: localData,
    updateItemInCache,
    addItemToCache
  };
};