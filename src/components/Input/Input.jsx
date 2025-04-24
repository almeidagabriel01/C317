"use client";

import { useId } from "react";

const FloatingLabelInput = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  required = false,
}) => {
  const reactId = useId();
  const inputId = `${id}-${reactId}`;

  return (
    <div className="relative mb-6 md:mb-8">
      <input
        id={inputId}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder=" "
        required={required}
        className="block w-full px-0 py-4 text-gray-900 bg-transparent
                   border-0 border-b-2 border-gray-300 appearance-none
                   focus:outline-none focus:border-amber-600 peer"
      />
      <label
        htmlFor={inputId}
        className="absolute left-0 top-5 text-sm text-amber-800 transform origin-[0]
                   peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
                   peer-focus:duration-300 peer-focus:transition-transform
                   peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-amber-600 cursor-text"
      >
        {label}
      </label>
    </div>
  );
};

export default FloatingLabelInput;