import { motion } from "framer-motion";
import StatCardWithInfo from "./StatCardWithInfo";
import { FiDollarSign, FiUsers, FiClock, FiCalendar } from "react-icons/fi";
import { useDashboardData } from "@/hooks/useDashboardData";

const DashboardStats = () => {
  const { stats, loading } = useDashboardData();

  const cardData = [
    {
      title: "Receita Total",
      value: loading ? "..." : stats.receita,
      icon: <FiDollarSign className="w-6 h-6" />,
      color: "bg-green-700",
      description: "Valor total arrecadado com todos os pedidos confirmados e pagos. Esta métrica é fundamental para avaliar o desempenho financeiro geral da empresa e acompanhar o crescimento da receita."
    },
    {
      title: "Clientes Ativos",
      value: loading ? "..." : stats.clientesAtivos,
      icon: <FiUsers className="w-6 h-6" />,
      color: "bg-purple-700",
      description: "Número de clientes cadastrados e ativos no sistema. Clientes ativos são aqueles que fizeram pelo menos um pedido ou interagiram recentemente com a plataforma, indicando o tamanho da base de clientes engajados."
    },
    {
      title: "Pedidos Pendentes",
      value: loading ? "..." : stats.pedidosPendentes,
      icon: <FiClock className="w-6 h-6" />,
      color: "bg-amber-700",
      description: "Número de pedidos que ainda estão aguardando processamento, confirmação ou finalização. Este indicador é crucial para acompanhar o fluxo de trabalho e garantir que nenhum pedido seja esquecido."
    },
    {
      title: "Pedidos Este Mês",
      value: loading ? "..." : stats.pedidosMes,
      icon: <FiCalendar className="w-6 h-6" />,
      color: "bg-blue-700",
      description: "Mostra quantos novos pedidos foram criados no mês atual. Este indicador ajuda a acompanhar a performance mensal e identificar tendências sazonais no negócio de eventos."
    }
  ];

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {cardData.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <StatCardWithInfo
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            description={card.description}
            loading={loading}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default DashboardStats;