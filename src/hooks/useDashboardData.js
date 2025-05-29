import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/services/api';

// Cache global para evitar múltiplas chamadas
const dashboardCache = {
  stats: null,
  chartData: null,
  loading: false,
  promise: null,
  isPageActive: false // Flag para controlar se a página está ativa
};

export const useDashboardData = () => {
  const { isAuthenticated, role, loading: authLoading } = useAuth();
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);
  const hasInitialized = useRef(false);

  // Função para buscar estatísticas dos cards
  const fetchStats = useCallback(async () => {
    const responses = await Promise.allSettled([
      apiClient.get('/dash/get/receita'),
      apiClient.get('/dash/get/ativos'),
      apiClient.get('/dash/get/pendentes'),
      apiClient.get('/dash/get/thisMonth'),
    ]);

    const newStats = {
      receita: 0,
      clientesAtivos: 0,
      pedidosPendentes: 0,
      pedidosMes: 0,
    };

    if (responses[0].status === 'fulfilled') {
      const receita = responses[0].value.data || 0;
      newStats.receita = receita > 1000 ? receita / 100 : receita;
    }

    if (responses[1].status === 'fulfilled') {
      newStats.clientesAtivos = responses[1].value.data || 0;
    }

    if (responses[2].status === 'fulfilled') {
      newStats.pedidosPendentes = responses[2].value.data || 0;
    }

    if (responses[3].status === 'fulfilled') {
      newStats.pedidosMes = responses[3].value.data || 0;
    }

    return newStats;
  }, []);

  // Função para buscar dados dos gráficos
  const fetchChartData = useCallback(async () => {
    const responses = await Promise.allSettled([
      apiClient.get('/dash/get/eventosPorMes'),
      apiClient.get('/dash/get/completados_vs_pendentes'),
    ]);

    const newChartData = {
      eventosPorMes: [],
      completadosVsPendentes: [],
    };

    // Eventos por mês
    if (responses[0].status === 'fulfilled') {
      const data = responses[0].value.data;
      if (Array.isArray(data)) {
        newChartData.eventosPorMes = data.map(item => ({
          name: item.mes || item.month || item.name || 'N/A',
          pedidos: item.total || item.pedidos || item.count || 0,
        }));
      }
    }

    // Completados vs Pendentes - nova estrutura de dados
    if (responses[1].status === 'fulfilled') {
      const data = responses[1].value.data;
      
      if (data && typeof data === 'object') {
        // Mapear nomes dos meses
        const monthNames = [
          'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
          'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
        ];

        // Criar um mapa para organizar os dados por mês
        const monthlyData = {};

        // Processar completados
        if (Array.isArray(data.completados)) {
          data.completados.forEach(item => {
            const monthKey = item.mes || item.month;
            if (monthKey && monthKey >= 1 && monthKey <= 12) {
              const monthName = monthNames[monthKey - 1];
              if (!monthlyData[monthName]) {
                monthlyData[monthName] = { name: monthName, completados: 0, pendentes: 0 };
              }
              monthlyData[monthName].completados = item.total || 0;
            }
          });
        }

        // Processar pendentes/orçados
        if (Array.isArray(data.pendentes_ou_orcados)) {
          data.pendentes_ou_orcados.forEach(item => {
            const monthKey = item.mes || item.month;
            if (monthKey && monthKey >= 1 && monthKey <= 12) {
              const monthName = monthNames[monthKey - 1];
              if (!monthlyData[monthName]) {
                monthlyData[monthName] = { name: monthName, completados: 0, pendentes: 0 };
              }
              monthlyData[monthName].pendentes = item.total || 0;
            }
          });
        }

        // Converter para array ordenado pelos meses
        newChartData.completadosVsPendentes = monthNames.map(monthName => 
          monthlyData[monthName] || { name: monthName, completados: 0, pendentes: 0 }
        );
      }
    }

    return newChartData;
  }, []);

  // Função principal para buscar todos os dados com cache
  const fetchDashboardData = useCallback(async (forceRefresh = false) => {
    if (!isAuthenticated || role !== 'Administrador' || authLoading) {
      return;
    }

    // Se tem dados no cache e não é refresh forçado, usa o cache
    if (!forceRefresh && dashboardCache.stats && dashboardCache.chartData) {
      setStats(dashboardCache.stats);
      setChartData(dashboardCache.chartData);
      setLoading(false);
      return;
    }

    // Se já está carregando, aguarda a promise existente
    if (dashboardCache.loading && dashboardCache.promise && !forceRefresh) {
      try {
        await dashboardCache.promise;
        if (mountedRef.current && dashboardCache.stats && dashboardCache.chartData) {
          setStats(dashboardCache.stats);
          setChartData(dashboardCache.chartData);
          setLoading(false);
        }
        return;
      } catch (error) {
        // Se a promise pendente falhou, continua com nova requisição
      }
    }

    setLoading(true);
    setError(null);
    dashboardCache.loading = true;

    try {
      // Cria promise única para evitar múltiplas chamadas
      const promise = Promise.all([fetchStats(), fetchChartData()]);
      dashboardCache.promise = promise;

      const [statsData, chartDataResult] = await promise;

      // Atualiza cache
      dashboardCache.stats = statsData;
      dashboardCache.chartData = chartDataResult;
      dashboardCache.loading = false;

      if (mountedRef.current) {
        setStats(statsData);
        setChartData(chartDataResult);
        setLoading(false);
      }

    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
      dashboardCache.loading = false;
      dashboardCache.promise = null;
      
      if (mountedRef.current) {
        setError(`Erro ao carregar dados do dashboard: ${err.message}`);
        setLoading(false);
      }
    }
  }, [isAuthenticated, role, authLoading, fetchStats, fetchChartData]);

  // Função para refresh dos dados
  const refreshData = useCallback(() => {
    return fetchDashboardData(true);
  }, [fetchDashboardData]);

  // Effect principal - executa quando as condições são atendidas ou quando volta para a página
  useEffect(() => {
    if (!authLoading && isAuthenticated && role === 'Administrador') {
      // Marca que a página está ativa
      dashboardCache.isPageActive = true;
      
      // Se não foi inicializado ainda OU se não tem dados no cache, busca dados
      const shouldFetch = !hasInitialized.current || !dashboardCache.stats || !dashboardCache.chartData;

      if (shouldFetch) {
        hasInitialized.current = true;
        fetchDashboardData();
      } else {
        // Usa dados do cache
        setStats(dashboardCache.stats);
        setChartData(dashboardCache.chartData);
        setLoading(false);
      }
    }
  }, [isAuthenticated, role, authLoading, fetchDashboardData]);

  // Effect para invalidar cache quando sair da página
  useEffect(() => {
    return () => {
      // Quando o componente é desmontado (sai da página), invalida o cache
      dashboardCache.isPageActive = false;
      dashboardCache.stats = null;
      dashboardCache.chartData = null;
      hasInitialized.current = false;
    };
  }, []);

  // Cleanup
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Formatar valor em reais
  const formatCurrency = useCallback((value) => {
    const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numericValue);
  }, []);

  // Função para formatar números grandes
  const formatNumber = useCallback((num) => {
    const numericValue = typeof num === 'number' ? num : parseInt(num) || 0;
    if (numericValue >= 1000) {
      return new Intl.NumberFormat('pt-BR').format(numericValue);
    }
    return numericValue.toString();
  }, []);

  return {
    stats: {
      receita: formatCurrency(stats.receita),
      clientesAtivos: formatNumber(stats.clientesAtivos),
      pedidosPendentes: formatNumber(stats.pedidosPendentes),
      pedidosMes: formatNumber(stats.pedidosMes),
    },
    chartData,
    loading,
    error,
    refreshData,
  };
};