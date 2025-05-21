import { motion } from "framer-motion";
import OrdersBarChart from './OrdersBarChart';
import OrdersLineChart from './OrdersLineChart';

const DashboardCharts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
      <motion.div 
        className="bg-gray-800 rounded-xl p-6 shadow-lg"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold mb-6 text-amber-300 font-serif">Pedidos por Mês</h2>
        <OrdersBarChart />
      </motion.div>
      
      <motion.div 
        className="bg-gray-800 rounded-xl p-6 shadow-lg"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold mb-6 text-amber-300 font-serif">Pedidos Realizados vs Cancelados</h2>
        <OrdersLineChart />
      </motion.div>
    </div>
  );
};

export default DashboardCharts;