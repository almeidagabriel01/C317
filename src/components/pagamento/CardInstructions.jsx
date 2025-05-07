'use client';
import { useState } from 'react';
import { FiCreditCard, FiCalendar, FiLock, FiUser } from 'react-icons/fi';

export default function CardInstructions({ method }) {
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');

  const formatNumber = v =>
    (v.replace(/\D/g, '').slice(0,16).match(/.{1,4}/g) || []).join(' ');
  const formatExpiry = v => {
    const d = v.replace(/\D/g,'').slice(0,4);
    return d.length>2 ? `${d.slice(0,2)}/${d.slice(2)}` : d;
  };

  const handleNumber = e => setNumber(formatNumber(e.target.value));
  const handleExpiry = e => setExpiry(formatExpiry(e.target.value));
  const handleCvc = e => setCvc(e.target.value.replace(/\D/g,'').slice(0,3));
  const handleName = e => setName(e.target.value.slice(0,30));

  const ready =
    number.replace(/\s/g,'').length === 16 &&
    expiry.length === 5 &&
    cvc.length === 3 &&
    name.trim().length > 0;

  return (
    <div className="space-y-4 md:space-y-5 h-full flex flex-col justify-between">
      <h3 className="text-lg font-semibold text-center text-orange-400 mb-2 md:mb-4">
        {method === 'credit' ? 'Cartão de crédito' : 'Cartão de débito'}
      </h3>

      <form className="space-y-4 md:space-y-5 flex-grow flex flex-col">
        <div className="flex-grow space-y-4 md:space-y-5">
          <div className="relative">
            <label className="block mb-1 md:mb-2 text-sm font-medium text-orange-400">Número do cartão</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiCreditCard className="text-gray-400 w-4 h-4 md:w-6 md:h-6" />
              </div>
              <input
                type="text"
                inputMode="numeric"
                maxLength={19}
                value={number}
                onChange={handleNumber}
                placeholder="0000 0000 0000 0000"
                className="w-full pl-10 md:pl-12 p-2 md:p-3 bg-gray-700 border border-gray-600 focus:border-orange-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="relative">
              <label className="block mb-1 md:mb-2 text-sm font-medium text-orange-400">Validade</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FiCalendar className="text-gray-400 w-4 h-4 md:w-6 md:h-6" />
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  value={expiry}
                  onChange={handleExpiry}
                  placeholder="MM/AA"
                  className="w-full pl-10 md:pl-12 p-2 md:p-3 bg-gray-700 border border-gray-600 focus:border-orange-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 text-white"
                />
              </div>
            </div>
            <div className="relative">
              <label className="block mb-1 md:mb-2 text-sm font-medium text-orange-400">CVC</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FiLock className="text-gray-400 w-4 h-4 md:w-6 md:h-6" />
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={3}
                  value={cvc}
                  onChange={handleCvc}
                  placeholder="123"
                  className="w-full pl-10 md:pl-12 p-2 md:p-3 bg-gray-700 border border-gray-600 focus:border-orange-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 text-white"
                />
              </div>
            </div>
          </div>

          <div className="relative">
            <label className="block mb-1 md:mb-2 text-sm font-medium text-orange-400">Nome no cartão</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiUser className="text-gray-400 w-4 h-4 md:w-6 md:h-6" />
              </div>
              <input
                type="text"
                maxLength={30}
                value={name}
                onChange={handleName}
                placeholder="Como escrito no cartão"
                className="w-full pl-10 md:pl-12 p-2 md:p-3 bg-gray-700 border border-gray-600 focus:border-orange-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-auto pt-4">
          <button
            type="submit"
            disabled={!ready}
            className="w-full max-w-xs px-6 md:px-8 py-2 md:py-3 rounded-xl font-semibold transition-all duration-500 ease-in-out
              bg-orange-500 hover:bg-orange-600 text-gray-900 shadow-lg
              disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:scale-105 transform"
          >
            Pagar
          </button>
        </div>
      </form>
    </div>
  );
}