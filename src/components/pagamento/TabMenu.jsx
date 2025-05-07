'use client';
import { FaQrcode, FaCreditCard } from 'react-icons/fa';
import { useEffect, useState } from 'react';

const tabs = [
  { key: 'pix', label: 'PIX', icon: FaQrcode },
  { key: 'credit', label: 'Crédito', icon: FaCreditCard },
  { key: 'debit', label: 'Débito', icon: FaCreditCard },
];

export default function TabMenu({ selected, onSelect }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Desktop layout
  if (!isMobile) {
    return (
      <div className="bg-gray-900 p-4 md:p-6 lg:p-8 flex-shrink-0 w-52 md:w-56 lg:w-64 border-r border-gray-700">
        <nav className="flex flex-col justify-start space-y-3 md:space-y-4">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const active = selected === tab.key;
            // tamanho dinâmico: PIX = 28px, Cartões = 32px
            const iconSize = tab.key === 'pix' ? 28 : 32;

            return (
              <button
                key={tab.key}
                onClick={() => onSelect(tab.key)}
                className={`flex items-center justify-start py-3 md:py-4 px-4 md:px-6 rounded-xl transition-all duration-500 ease-in-out ${
                  active
                    ? 'bg-gray-800 text-orange-400 font-semibold shadow-lg'
                    : 'text-gray-200 bg-gray-700 bg-opacity-30 hover:bg-opacity-50 hover:text-orange-300'
                }`}
              >
                <Icon
                  className={`${
                    active ? 'text-orange-400' : 'text-gray-200'
                  } mr-3 md:mr-4 transition-all duration-500 ease-in-out`}
                  size={iconSize}
                />
                <span className="text-sm md:text-base whitespace-nowrap transition-all duration-500 ease-in-out">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    );
  }

  // Mobile layout (sem alterações)
  return (
    <div className="bg-gray-900 p-3 sm:p-4 w-full border-b border-gray-700">
      <div className="flex justify-center items-center space-x-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const active = selected === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => onSelect(tab.key)}
              className={`flex flex-col items-center px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-300 flex-1 ${
                active
                  ? 'bg-gray-800 text-orange-400 font-semibold shadow-lg'
                  : 'text-gray-200 bg-gray-700 bg-opacity-30 hover:bg-opacity-50'
              }`}
            >
              <Icon
                className={`${active ? 'text-orange-400' : 'text-gray-200'} text-lg sm:text-xl mb-1`}
                size={20}
              />
              <span className="text-xs whitespace-nowrap">
                {tab.key === 'credit' ? 'Crédito' : tab.key === 'debit' ? 'Débito' : 'PIX'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
