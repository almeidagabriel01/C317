import { motion } from "framer-motion";
import StatCard from "./StatCard";
import { FiFileText, FiCalendar, FiDollarSign, FiUsers } from "react-icons/fi";

const DashboardStats = () => {
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <StatCard 
        title="Total de Pedidos" 
        value="328" 
        icon={<FiFileText className="w-6 h-6" />} 
        color="bg-amber-700"
      />
      <StatCard 
        title="Pedidos Este Mês" 
        value="45" 
        icon={<FiCalendar className="w-6 h-6" />} 
        color="bg-blue-700"
      />
      <StatCard 
        title="Receita Total" 
        value="R$ 78.450,00" 
        icon={<FiDollarSign className="w-6 h-6" />} 
        color="bg-green-700"
      />
      <StatCard 
        title="Clientes Ativos" 
        value="186" 
        icon={<FiUsers className="w-6 h-6" />} 
        color="bg-purple-700"
      />
    </motion.div>
  );
};

export default DashboardStats;