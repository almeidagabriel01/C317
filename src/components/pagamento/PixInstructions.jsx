'use client';
import { useState } from 'react';
import { FaRegHandPointer, FaMobileAlt, FaCheckCircle } from 'react-icons/fa';

export default function PixInstructions() {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-5 h-full flex flex-col">
      <h3 className="text-base sm:text-lg font-semibold text-center text-orange-400 mb-2 sm:mb-3 md:mb-4">
        PIX
      </h3>

      <ol className="space-y-2 sm:space-y-3 md:space-y-4 text-white flex-grow">
        <li className="flex items-start bg-gray-800 bg-opacity-30 p-2 sm:p-3 md:p-4 rounded-lg">
          <div className="flex items-center justify-center bg-orange-500 rounded-full p-1.5 sm:p-2 mr-2 sm:mr-3 md:mr-4 shrink-0">
            <FaRegHandPointer className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-900" />
          </div>
          <div>
            <p className="font-medium text-sm sm:text-base">Clique em <strong>Finalizar</strong></p>
            <p className="text-xs md:text-sm text-orange-300">Para gerar o QR de pagamento</p>
          </div>
        </li>
        <li className="flex items-start bg-gray-800 bg-opacity-30 p-2 sm:p-3 md:p-4 rounded-lg">
          <div className="flex items-center justify-center bg-orange-500 rounded-full p-1.5 sm:p-2 mr-2 sm:mr-3 md:mr-4 shrink-0">
            <FaMobileAlt className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-900" />
          </div>
          <div>
            <p className="font-medium text-sm sm:text-base">Faça o PIX</p>
            <p className="text-xs md:text-sm text-orange-300">No app de sua preferência</p>
          </div>
        </li>
        <li className="flex items-start bg-gray-800 bg-opacity-30 p-2 sm:p-3 md:p-4 rounded-lg">
          <div className="flex items-center justify-center bg-orange-500 rounded-full p-1.5 sm:p-2 mr-2 sm:mr-3 md:mr-4 shrink-0">
            <FaCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-900" />
          </div>
          <div>
            <p className="font-medium text-sm sm:text-base">Pronto!</p>
            <p className="text-xs md:text-sm text-orange-300">Seu pagamento será confirmado automaticamente</p>
          </div>
        </li>
      </ol>

      <div className="mt-auto">
        <div className="bg-gray-800 bg-opacity-20 p-2 sm:p-3 md:p-4 rounded-lg">
          <label className="flex items-center cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                checked={agreed}
                onChange={() => setAgreed(!agreed)}
                className="opacity-0 absolute h-4 w-4 sm:h-5 sm:w-5 cursor-pointer"
              />
              <div className={`border-2 rounded h-4 w-4 sm:h-5 sm:w-5 flex flex-shrink-0 justify-center items-center focus-within:border-orange-500 ${
                agreed ? 'bg-orange-500 border-orange-500' : 'border-orange-300 group-hover:border-orange-500'
              }`}>
                {agreed && <FaCheckCircle className="h-2 w-2 sm:h-3 sm:w-3 text-gray-900 pointer-events-none" />}
              </div>
            </div>
            <div className="ml-2 sm:ml-3 text-xs md:text-sm text-white">
              Concordo com os 
              <a href="#" className="text-orange-500 hover:underline ml-1 font-medium">
                termos e condições
              </a>
            </div>
          </label>
        </div>

        <div className="flex justify-center pt-4 mt-4">
          <button
            disabled={!agreed}
            className="w-full max-w-xs px-5 sm:px-6 md:px-8 py-2 md:py-3 rounded-xl font-semibold transition-all duration-300
              bg-orange-500 hover:bg-orange-600 text-gray-900 shadow-lg
              disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:scale-105 transform"
          >
            Finalizar
          </button>
        </div>
      </div>
    </div>
  );
}