"use client";

import { useState } from 'react';

const FloatingLabelInput = ({ id, label, type = 'text', value, onChange, required = false }) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className="relative mb-8 group"> {/* Aumentado para mb-8 */}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(value !== '')}
        className="block w-full px-0 py-4 text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:border-amber-600 peer"
        placeholder=" "
        required={required}
      />
      <label
        htmlFor={id}
        className={`absolute text-sm text-amber-800 duration-300 transform scale-75 -translate-y-6 top-5 origin-[0] ${
          (isFocused || value !== '') ? 'scale-75 -translate-y-6' : 'scale-100 translate-y-0'
        } peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-amber-600 cursor-text`}
      >
        {label}
      </label>
    </div>
  );
};

export default FloatingLabelInput;