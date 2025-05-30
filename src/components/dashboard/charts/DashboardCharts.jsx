import { motion } from "framer-motion";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDashboardData } from "@/hooks/useDataManager"; // USANDO SISTEMA UNIFICADO

const DashboardCharts = () => {
  const { chartData, loading } = useDashboardData();

  const defaultMonthlyData = [
    { name: 'Jan', pedidos: 0 },
    { name: 'Fev', pedidos: 0 },
    { name: 'Mar', pedidos: 0 },
    { name: 'Abr', pedidos: 0 },
    { name: 'Mai', pedidos: 0 },
    { name: 'Jun', pedidos: 0 },
    { name: 'Jul', pedidos: 0 },
    { name: 'Ago', pedidos: 0 },
    { name: 'Set', pedidos: 0 },
    { name: 'Out', pedidos: 0 },
    { name: 'Nov', pedidos: 0 },
    { name: 'Dez', pedidos: 0 },
  ];

  const defaultCompletedData = [
    { name: 'Jan', completados: 0, pendentes: 0 },
    { name: 'Fev', completados: 0, pendentes: 0 },
    { name: 'Mar', completados: 0, pendentes: 0 },
    { name: 'Abr', completados: 0, pendentes: 0 },
    { name: 'Mai', completados: 0, pendentes: 0 },
    { name: 'Jun', completados: 0, pendentes: 0 },
    { name: 'Jul', completados: 0, pendentes: 0 },
    { name: 'Ago', completados: 0, pendentes: 0 },
    { name: 'Set', completados: 0, pendentes: 0 },
    { name: 'Out', completados: 0, pendentes: 0 },
    { name: 'Nov', completados: 0, pendentes: 0 },
    { name: 'Dez', completados: 0, pendentes: 0 },
  ];

  const monthlyData = chartData.eventosPorMes.length > 0 ? chartData.eventosPorMes : defaultMonthlyData;
  const completedData = chartData.completadosVsPendentes.length > 0 ? chartData.completadosVsPendentes : defaultCompletedData;

  const LoadingOverlay = () => (
    <div className="absolute inset-0 bg-gray-800/50 backdrop-blur-sm flex items-center justify-center rounded-xl">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 border-2 border-amber-300 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-amber-300 font-sans">Carregando dados...</span>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
      <motion.div 
        className="bg-gray-800 rounded-xl p-6 shadow-lg relative"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold mb-6 text-amber-300 font-serif">Eventos por Mês</h2>
        {loading && <LoadingOverlay />}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  borderColor: '#4B5563', 
                  color: '#F3F4F6',
                  borderRadius: '8px',
                  border: '1px solid #4B5563'
                }}
                itemStyle={{ color: '#F3F4F6' }}
                cursor={{ fill: 'rgba(107, 114, 128, 0.2)' }}
              />
              <Legend />
              <Bar 
                dataKey="pedidos" 
                fill="#9D4815" 
                name="Pedidos" 
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
      
      <motion.div 
        className="bg-gray-800 rounded-xl p-6 shadow-lg relative"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold mb-6 text-amber-300 font-serif">Pedidos Completados vs Pendentes</h2>
        {loading && <LoadingOverlay />}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={completedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  borderColor: '#4B5563', 
                  color: '#F3F4F6',
                  borderRadius: '8px',
                  border: '1px solid #4B5563'
                }}
                itemStyle={{ color: '#F3F4F6' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="completados" 
                stroke="#E0CEAA" 
                strokeWidth={3} 
                name="Completados"
                dot={{ fill: '#E0CEAA', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#E0CEAA', strokeWidth: 2 }}
                animationDuration={1000}
              />
              <Line 
                type="monotone" 
                dataKey="pendentes" 
                stroke="#EF4444" 
                strokeWidth={3} 
                name="Pendentes"
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#EF4444', strokeWidth: 2 }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardCharts;