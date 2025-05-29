import { useState } from "react";
import { FiInfo } from "react-icons/fi";
import InfoModal from "../modal/InfoModal";

const StatCardWithInfo = ({ title, value, icon, color, description, loading = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg relative">{/* Removido group class */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-gray-400 text-sm font-sans">{title}</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="p-1.5 rounded-full text-gray-400 hover:text-amber-300 hover:bg-gray-700 transition-colors"
                title="Mais informações"
              >
                <FiInfo className="w-4 h-4" />
              </button>
            </div>
            {loading ? (
              <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
            ) : (
              <h3 className="text-2xl font-bold text-white mt-1 font-serif">{value}</h3>
            )}
          </div>
          <div className={`p-3 rounded-full ${color} ${loading ? 'animate-pulse' : ''}`}>
            {icon}
          </div>
        </div>
      </div>

      <InfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        description={description}
      />
    </>
  );
};

export default StatCardWithInfo;