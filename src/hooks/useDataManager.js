import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchUsers, fetchUserOrders, fetchItemsForAdmin, apiClient } from '@/services/api';
import { toast } from 'react-toastify';
import { formatCurrency, formatNumber } from '@/utils/formatUtils';

// Sistema para prevenir apenas chamadas simultâneas - sem cache persistente
let currentRequests = new Map();

// Função para limpar requisições ativas
const clearCurrentRequests = () => {
  currentRequests.clear();
};

// Hook principal unificado - SEMPRE faz nova requisição por montagem
export const useDataManager = (dataType) => {
  const { isAuthenticated, role, loading: authLoading, user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);
  const componentId = useRef(`${dataType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  // Função para processar dados de dashboard
  const processDashboardData = useCallback(async () => {
    // Busca estatísticas em paralelo
    const [rRec, rAtivos, rPend, rMes, rEvt, rCP] = await Promise.allSettled([
      apiClient.get('/dash/get/receita'),
      apiClient.get('/dash/get/ativos'),
      apiClient.get('/dash/get/pendentes'),
      apiClient.get('/dash/get/thisMonth'),
      apiClient.get('/dash/get/eventosPorMes'),
      apiClient.get('/dash/get/completados_vs_pendentes'),
    ]);

    // Processa estatísticas básicas
    const stats = {
      receita: 0,
      clientesAtivos: 0,
      pedidosPendentes: 0,
      pedidosMes: 0,
    };

    if (rRec.status === 'fulfilled') {
      const value = rRec.value.data;
      const numValue = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : Number(value);
      stats.receita = isNaN(numValue) ? 0 : Math.round(numValue * 100) / 100;
    }
    if (rAtivos.status === 'fulfilled') {
      stats.clientesAtivos = rAtivos.value.data || 0;
    }
    if (rPend.status === 'fulfilled') {
      stats.pedidosPendentes = rPend.value.data || 0;
    }
    if (rMes.status === 'fulfilled') {
      stats.pedidosMes = rMes.value.data || 0;
    }

    // Processa dados de gráficos
    const chartData = {
      eventosPorMes: [],
      completadosVsPendentes: []
    };

    // Processa eventos por mês
    if (rEvt.status === 'fulfilled' && Array.isArray(rEvt.value.data)) {
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      
      // Cria array com todos os meses zerados
      const allMonths = monthNames.map((name, index) => ({ name, pedidos: 0 }));
      
      // Preenche com dados reais
      rEvt.value.data.forEach(item => {
        const monthIndex = item.mes - 1; // API retorna 1-12, array é 0-11
        if (monthIndex >= 0 && monthIndex < 12) {
          allMonths[monthIndex].pedidos = item.total_eventos;
        }
      });
      
      chartData.eventosPorMes = allMonths;
    }

    // Processa completados vs pendentes
    if (rCP.status === 'fulfilled' && rCP.value.data) {
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      
      // Cria array com todos os meses zerados
      const allMonths = monthNames.map((name, index) => ({ name, completados: 0, pendentes: 0 }));
      
      // Preenche completados
      if (Array.isArray(rCP.value.data.completados)) {
        rCP.value.data.completados.forEach(item => {
          const monthIndex = item.mes - 1;
          if (monthIndex >= 0 && monthIndex < 12) {
            allMonths[monthIndex].completados = item.total;
          }
        });
      }
      
      // Preenche pendentes
      if (Array.isArray(rCP.value.data.pendentes_ou_orcados)) {
        rCP.value.data.pendentes_ou_orcados.forEach(item => {
          const monthIndex = item.mes - 1;
          if (monthIndex >= 0 && monthIndex < 12) {
            allMonths[monthIndex].pendentes = item.total;
          }
        });
      }
      
      chartData.completadosVsPendentes = allMonths;
    }

    return { stats, chartData };
  }, []);

  // Função para buscar dados - SEMPRE faz nova requisição
  const fetchData = useCallback(async () => {
    if (!isAuthenticated || authLoading) {
      setLoading(false);
      return;
    }

    // Verifica se é admin para certas operações
    if ((dataType === 'users' || dataType === 'items' || dataType === 'dashboard') && role !== 'Administrador') {
      setLoading(false);
      return;
    }

    const requestKey = `${dataType}_${user?.ID}_${role}`;
    
    // Se já tem uma requisição idêntica em andamento, aguarda ela
    if (currentRequests.has(requestKey)) {
      console.log(`⏳ ${componentId.current}: Aguardando requisição em andamento para ${dataType}`);
      try {
        const result = await currentRequests.get(requestKey);
        if (mountedRef.current) {
          setData(result || []);
          setLoading(false);
        }
        return result;
      } catch (err) {
        // Se a requisição em andamento falhou, remove e faz nova
        currentRequests.delete(requestKey);
      }
    }

    console.log(`🔄 ${componentId.current}: NOVA requisição para ${dataType} - User: ${user?.email} - Role: ${role}`);

    setLoading(true);
    setError(null);

    try {
      let fetchFunction;

      switch (dataType) {
        case 'users':
          console.log(`📊 ${componentId.current}: Buscando usuários (Admin)`);
          fetchFunction = fetchUsers;
          break;
        case 'orders':
          console.log(`📋 ${componentId.current}: Buscando pedidos - Role: ${role}`);
          fetchFunction = fetchUserOrders;
          break;
        case 'items':
          console.log(`📦 ${componentId.current}: Buscando itens (Admin)`);
          fetchFunction = () => fetchItemsForAdmin(true);
          break;
        case 'dashboard':
          console.log(`📊 ${componentId.current}: Buscando dados dashboard`);
          fetchFunction = processDashboardData;
          break;
        default:
          throw new Error(`Tipo de dados desconhecido: ${dataType}`);
      }

      // Cria e armazena a promise da requisição
      const requestPromise = fetchFunction();
      currentRequests.set(requestKey, requestPromise);

      const result = await requestPromise;
      
      // Remove a requisição quando termina
      currentRequests.delete(requestKey);
      
      console.log(`✅ ${componentId.current}: ${dataType} carregado com sucesso:`, result?.length || 'dados', 'itens/dados');

      if (mountedRef.current) {
        setData(result || []);
        setLoading(false);
      }

      return result;
    } catch (err) {
      console.error(`❌ ${componentId.current}: Erro ao carregar ${dataType}:`, err);
      
      // Remove a requisição em caso de erro
      currentRequests.delete(requestKey);
      
      if (mountedRef.current) {
        setError(err.message);
        setLoading(false);
        if (dataType !== 'dashboard') { // Evita toast para dashboard
          toast.error(`Erro ao carregar ${dataType}: ${err.message}`);
        }
      }

      throw err;
    }
  }, [isAuthenticated, role, authLoading, dataType, user?.email, user?.ID, processDashboardData]);

  // Função para refresh manual
  const refreshData = useCallback(() => {
    console.log(`🔄 ${componentId.current}: Refresh manual solicitado para ${dataType}`);
    // Remove qualquer requisição em andamento para forçar nova
    const requestKey = `${dataType}_${user?.ID}_${role}`;
    currentRequests.delete(requestKey);
    return fetchData();
  }, [fetchData, dataType, user?.ID, role]);

  // Função para limpar dados
  const clearData = useCallback(() => {
    console.log(`🧹 ${componentId.current}: Limpando dados de ${dataType}`);
    setData([]);
    setError(null);
    setLoading(false);
    const requestKey = `${dataType}_${user?.ID}_${role}`;
    currentRequests.delete(requestKey);
  }, [dataType, user?.ID, role]);

  // Effect para carregar dados SEMPRE que o componente monta
  useEffect(() => {
    console.log(`🚀 ${componentId.current}: Componente ${dataType} montado - iniciando fetch`);
    
    if (!authLoading && isAuthenticated) {
      // Para orders, sempre carrega independente do role
      // Para users, items e dashboard, só carrega se for admin
      if (dataType === 'orders' || (role === 'Administrador' && ['users', 'items', 'dashboard'].includes(dataType))) {
        fetchData();
      } else {
        setLoading(false);
      }
    }
  }, []); // Array vazio INTENCIONAL - queremos que execute SEMPRE que montar

  // Cleanup ao desmontar
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      console.log(`🏁 ${componentId.current}: Componente ${dataType} desmontado`);
    };
  }, []);

  return {
    data,
    loading,
    error,
    refreshData,
    clearData
  };
};

// Hook específico para usuários
export const useUsers = () => {
  const result = useDataManager('users');
  const [localData, setLocalData] = useState([]);

  useEffect(() => {
    setLocalData(result.data);
  }, [result.data]);

  const updateUserInCache = useCallback((userId, updatedData) => {
    console.log('🔄 Atualizando user cache:', userId);
    setLocalData(prev => prev.map(user =>
      user.id === userId ? { ...user, ...updatedData } : user
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
  const result = useDataManager('orders');
  const [localData, setLocalData] = useState([]);

  // Sincroniza os dados quando chegam do hook principal
  useEffect(() => {
    setLocalData(result.data);
  }, [result.data]);

  const updateOrderInCache = useCallback((orderId, updatedData) => {
    console.log('🔄 Atualizando order cache:', orderId, updatedData);
    setLocalData(prev => {
      const newData = prev.map(order =>
        order.id === orderId ? { ...order, ...updatedData } : order
      );
      console.log('✅ Cache local de orders atualizado');
      return newData;
    });
  }, []);

  return {
    ...result,
    data: localData,
    updateOrderInCache
  };
};

// Hook específico para itens
export const useItems = () => {
  const result = useDataManager('items');
  const [localData, setLocalData] = useState([]);

  useEffect(() => {
    setLocalData(result.data);
  }, [result.data]);

  const updateItemInCache = useCallback((itemId, updatedData) => {
    console.log('🔄 Atualizando item cache:', itemId);
    setLocalData(prev => prev.map(item =>
      item.id === itemId ? { ...item, ...updatedData } : item
    ));
  }, []);

  const addItemToCache = useCallback((newItem) => {
    console.log('➕ Adicionando item ao cache:', newItem.id);
    setLocalData(prev => [...prev, newItem]);
  }, []);

  return {
    ...result,
    data: localData,
    updateItemInCache,
    addItemToCache,
    refreshDataWithCacheBusting: result.refreshData
  };
};

// Hook para dashboard unificado - CORRIGIDO para processar dados reais
export const useDashboardData = () => {
  const result = useDataManager('dashboard');
  const [stats, setStats] = useState({
    receita: 0,
    clientesAtivos: 0,
    pedidosPendentes: 0,
    pedidosMes: 0,
  });
  const [chartData, setChartData] = useState({
    eventosPorMes: [],
    completadosVsPendentes: [],
  });

  // Processa os dados quando chegam
  useEffect(() => {
    if (result.data && typeof result.data === 'object') {
      // Os dados já vêm processados do useDataManager
      if (result.data.stats) {
        setStats(result.data.stats);
      }
      if (result.data.chartData) {
        setChartData(result.data.chartData);
      }
    }
  }, [result.data]);

  return {
    stats: {
      receita: formatCurrency(stats.receita),
      clientesAtivos: formatNumber(stats.clientesAtivos),
      pedidosPendentes: formatNumber(stats.pedidosPendentes),
      pedidosMes: formatNumber(stats.pedidosMes),
    },
    chartData,
    loading: result.loading,
    error: result.error,
    refreshData: result.refreshData,
  };
};

// Hook para limpar requisições ativas (útil no logout)
export const useClearAllCache = () => {
  return useCallback(() => {
    console.log('🧹 Limpando todas as requisições ativas');
    clearCurrentRequests();
  }, []);
};