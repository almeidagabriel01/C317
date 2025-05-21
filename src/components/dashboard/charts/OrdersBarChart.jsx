import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const monthlyOrdersData = [
  { name: 'Jan', pedidos: 12 },
  { name: 'Fev', pedidos: 19 },
  { name: 'Mar', pedidos: 15 },
  { name: 'Abr', pedidos: 21 },
  { name: 'Mai', pedidos: 28 },
  { name: 'Jun', pedidos: 24 },
  { name: 'Jul', pedidos: 32 },
  { name: 'Ago', pedidos: 36 },
  { name: 'Set', pedidos: 29 },
  { name: 'Out', pedidos: 31 },
  { name: 'Nov', pedidos: 38 },
  { name: 'Dez', pedidos: 45 },
];

const OrdersBarChart = () => {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyOrdersData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563', color: '#F3F4F6' }}
            itemStyle={{ color: '#F3F4F6' }}
            cursor={{ fill: 'rgba(107, 114, 128, 0.2)' }}
          />
          <Legend />
          <Bar dataKey="pedidos" fill="#9D4815" name="Pedidos" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrdersBarChart;