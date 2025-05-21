import { FiFileText, FiCalendar, FiDollarSign, FiUsers } from "react-icons/fi";

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-sans">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-1 font-serif">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;