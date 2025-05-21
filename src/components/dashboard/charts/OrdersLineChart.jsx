import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const completedOrdersData = [
  { name: 'Jan', completados: 10, cancelados: 2 },
  { name: 'Fev', completados: 16, cancelados: 3 },
  { name: 'Mar', completados: 14, cancelados: 1 },
  { name: 'Abr', completados: 18, cancelados: 3 },
  { name: 'Mai', completados: 25, cancelados: 3 },
  { name: 'Jun', completados: 22, cancelados: 2 },
  { name: 'Jul', completados: 30, cancelados: 2 },
  { name: 'Ago', completados: 33, cancelados: 3 },
  { name: 'Set', completados: 27, cancelados: 2 },
  { name: 'Out', completados: 28, cancelados: 3 },
  { name: 'Nov', completados: 35, cancelados: 3 },
  { name: 'Dez', completados: 42, cancelados: 3 },
];

const OrdersLineChart = () => {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={completedOrdersData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563', color: '#F3F4F6' }}
            itemStyle={{ color: '#F3F4F6' }}
          />
          <Legend />
          <Line type="monotone" dataKey="completados" stroke="#E0CEAA" strokeWidth={2} name="Completados" />
          <Line type="monotone" dataKey="cancelados" stroke="#EF4444" strokeWidth={2} name="Cancelados" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrdersLineChart;