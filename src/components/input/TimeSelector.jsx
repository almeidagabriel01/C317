"use client";

import { useState, useEffect } from "react";

export default function TimeSelector({ value, onChange }) {
  // Parsing das horas e minutos do valor inicial (formato: "HH:MM")
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');

  useEffect(() => {
    if (value) {
      const parts = value.split(":");
      if (parts.length === 2) {
        setHours(parseInt(parts[0]) || '');
        setMinutes(parseInt(parts[1]) || 0); // Aqui permitimos 0 como valor válido
      }
    }
  }, [value]);

  // Função para atualizar o valor quando horas ou minutos mudam
  const updateValue = (newHours, newMinutes) => {
    // Tratar valores vazios
    const h = newHours === '' ? '' : Math.max(0, Math.min(24, newHours));
    // Permitir zero explicitamente para minutos, mas não vazio
    const m = newMinutes === '' ? '' : Math.max(0, Math.min(59, newMinutes));
    
    // Atualizar estados locais
    setHours(h);
    setMinutes(m);
    
    // Verificar se horas está preenchido e minutos não é undefined
    if (h !== '' && m !== undefined) {
      // Formatar como "HH:MM" e chamar onChange
      const formattedValue = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      onChange(formattedValue);
    } else {
      // Se algum valor estiver vazio, passar string vazia para indicar campo incompleto
      onChange('');
    }
  };

  // Função para incrementar ou decrementar
  const adjustValue = (type, increment) => {
    if (type === 'hours') {
      const currentValue = hours === '' ? 0 : parseInt(hours);
      updateValue(currentValue + increment, minutes);
    } else {
      // Para minutos, permitimos incrementos em 1 unidade
      const currentValue = minutes === '' ? 0 : parseInt(minutes);
      updateValue(hours, currentValue + increment);
    }
  };

  // Função para validar input direto
  const handleDirectInput = (e, type) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      const numValue = value === '' ? (type === 'minutes' ? 0 : '') : parseInt(value);
      if (type === 'hours') {
        updateValue(numValue, minutes);
      } else {
        updateValue(hours, numValue);
      }
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-xs text-[#E0CEAA] mb-1">Horas</label>
        <div className="flex items-center bg-[#F7F6F3] rounded-md border-2 border-transparent focus-within:border-[#9D4815] transition-colors overflow-hidden">
          <button
            type="button"
            onClick={() => adjustValue('hours', -1)}
            className={`flex items-center justify-center w-10 h-10 bg-[#E0CEAA]/10 text-[#9D4815] hover:bg-[#E0CEAA]/20 ${
              hours === '' || hours <= 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={hours === '' || hours <= 0}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <input
            type="text"
            value={hours}
            onChange={(e) => handleDirectInput(e, 'hours')}
            className="w-full h-10 text-black text-center focus:outline-none bg-transparent"
            placeholder="0"
            min="0"
            max="24"
          />
          <button
            type="button"
            onClick={() => adjustValue('hours', 1)}
            className={`flex items-center justify-center w-10 h-10 bg-[#E0CEAA]/10 text-[#9D4815] hover:bg-[#E0CEAA]/20 ${
              hours !== '' && hours >= 24 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={hours !== '' && hours >= 24}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div>
        <label className="block text-xs text-[#E0CEAA] mb-1">Minutos</label>
        <div className="flex items-center bg-[#F7F6F3] rounded-md border-2 border-transparent focus-within:border-[#9D4815] transition-colors overflow-hidden">
          <button
            type="button"
            onClick={() => adjustValue('minutes', -1)} // Alterar para decrementar 1 minuto em vez de 5
            className={`flex items-center justify-center w-10 h-10 bg-[#E0CEAA]/10 text-[#9D4815] hover:bg-[#E0CEAA]/20 ${
              minutes === '' || minutes <= 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={minutes === '' || minutes <= 0}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <input
            type="text"
            value={minutes === 0 ? "0" : minutes} // Garantir que 0 seja exibido como "0"
            onChange={(e) => handleDirectInput(e, 'minutes')}
            className="w-full h-10 text-black text-center focus:outline-none bg-transparent"
            placeholder="0"
            min="0"
            max="59"
          />
          <button
            type="button"
            onClick={() => adjustValue('minutes', 1)} // Alterar para incrementar 1 minuto em vez de 5
            className={`flex items-center justify-center w-10 h-10 bg-[#E0CEAA]/10 text-[#9D4815] hover:bg-[#E0CEAA]/20 ${
              minutes !== '' && minutes >= 59 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={minutes !== '' && minutes >= 59}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}