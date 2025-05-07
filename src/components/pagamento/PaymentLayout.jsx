'use client';
import TabMenu from './TabMenu';

export default function PaymentLayout({ selected, onSelect, children }) {
  return (
    <div className="flex flex-col md:flex-row bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl overflow-hidden max-w-xs sm:max-w-lg md:max-w-3xl lg:max-w-4xl w-full mx-auto">
      <TabMenu selected={selected} onSelect={onSelect} />
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col space-y-3 sm:space-y-4 md:space-y-6 w-full max-w-sm sm:max-w-md mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center mb-2 sm:mb-4 md:mb-6 lg:mb-10 font-spline">
          Pagamento
        </h2>
        <div className="bg-gray-900 bg-opacity-80 p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg sm:rounded-xl shadow-inner h-[450px] sm:h-[480px] md:h-[500px] lg:h-[520px] overflow-y-auto flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}