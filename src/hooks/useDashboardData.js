import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/services/api';
import { formatCurrency, formatNumber } from '@/utils/formatUtils';

// Cache global
const dashboardCache = {
  stats: null,
  chartData: null,
  loading: false,
  promise: null,
  isPageActive: false
};

export const useDashboardData = () => {
  const { isAuthenticated, role, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({
    receita: 0,
    pedidosParaPagar: 0,
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

  // Processa valor de receita vindo da API (sempre em reais)
  const processReceitaValue = useCallback((value) => {
    if ((value === null) || (value === undefined)) return 0;
    const numValue = typeof value === 'string'
      ? parseFloat(value.replace(',', '.'))
      : Number(value);
    if (isNaN(numValue)) return 0;
    return Math.round(numValue * 100) / 100;  // só arredonda para 2 decimais
  }, []);

  // Busca estatísticas
  const fetchStats = useCallback(async () => {
    const [rRec, rAtivos, rPend, rMes] = await Promise.allSettled([
      apiClient.get('/dash/get/receita'),
      apiClient.get('/dash/get/ativos'),
      apiClient.get('/dash/get/pendentes'),
      apiClient.get('/dash/get/thisMonth'),
    ]);

    const newStats = { receita: 0, pedidosParaPagar: 0, pedidosPendentes: 0, pedidosMes: 0 };

    if (rRec.status === 'fulfilled') {
      newStats.receita = processReceitaValue(rRec.value.data);
    }
    if (rAtivos.status === 'fulfilled') {
      newStats.pedidosParaPagar = rAtivos.value.data || 0;
    }
    if (rPend.status === 'fulfilled') {
      newStats.pedidosPendentes = rPend.value.data || 0;
    }
    if (rMes.status === 'fulfilled') {
      newStats.pedidosMes = rMes.value.data || 0;
    }

    return newStats;
  }, [processReceitaValue]);

  // Busca dados de gráfico (sem alteração)
  const fetchChartData = useCallback(async () => {
    const [rEvt, rCP] = await Promise.allSettled([
      apiClient.get('/dash/get/eventosPorMes'),
      apiClient.get('/dash/get/completados_vs_pendentes'),
    ]);

    const newChart = { eventosPorMes: [], completadosVsPendentes: [] };
    // ... mesma lógica de antes para popular newChart
    return newChart;
  }, []);

  // Função principal com cache
  const fetchDashboardData = useCallback(async (forceRefresh = false) => {
    if (!isAuthenticated || role !== 'Administrador' || authLoading) return;
    if (!forceRefresh && dashboardCache.stats && dashboardCache.chartData) {
      setStats(dashboardCache.stats);
      setChartData(dashboardCache.chartData);
      setLoading(false);
      return;
    }
    if (dashboardCache.loading && dashboardCache.promise && !forceRefresh) {
      try {
        await dashboardCache.promise;
        if (mountedRef.current && dashboardCache.stats && dashboardCache.chartData) {
          setStats(dashboardCache.stats);
          setChartData(dashboardCache.chartData);
          setLoading(false);
        }
        return;
      } catch {}
    }

    setLoading(true);
    setError(null);
    dashboardCache.loading = true;
    try {
      const promise = Promise.all([fetchStats(), fetchChartData()]);
      dashboardCache.promise = promise;
      const [statsData, chartDataResult] = await promise;
      dashboardCache.stats = statsData;
      dashboardCache.chartData = chartDataResult;
      dashboardCache.loading = false;
      if (mountedRef.current) {
        setStats(statsData);
        setChartData(chartDataResult);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      dashboardCache.loading = false;
      dashboardCache.promise = null;
      if (mountedRef.current) {
        setError(`Erro ao carregar dados: ${err.message}`);
        setLoading(false);
      }
    }
  }, [isAuthenticated, role, authLoading, fetchStats, fetchChartData]);

  // Inicialização / invalidação de cache
  useEffect(() => {
    if (!authLoading && isAuthenticated && role === 'Administrador') {
      const shouldFetch = !hasInitialized.current || !dashboardCache.stats;
      if (shouldFetch) {
        hasInitialized.current = true;
        fetchDashboardData();
      } else {
        setStats(dashboardCache.stats);
        setChartData(dashboardCache.chartData);
        setLoading(false);
      }
    }
  }, [authLoading, isAuthenticated, role, fetchDashboardData]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      dashboardCache.stats = null;
      dashboardCache.chartData = null;
      hasInitialized.current = false;
    };
  }, []);

  return {
    stats: {
      receita: formatCurrency(stats.receita),
      pedidosParaPagar: formatNumber(stats.pedidosParaPagar),
      pedidosPendentes: formatNumber(stats.pedidosPendentes),
      pedidosMes: formatNumber(stats.pedidosMes),
    },
    chartData,
    loading,
    error,
    refreshData: () => fetchDashboardData(true),
  };
};