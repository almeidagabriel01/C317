"use client";
import { useState, useEffect } from "react";

const StatusToggle = ({ isActive, onChange, disabled = false }) => {
  const [active, setActive] = useState(isActive);

  useEffect(() => {
    setActive(isActive);
  }, [isActive]);

  const handleToggle = () => {
    if (disabled) return;
    
    const newStatus = !active;
    setActive(newStatus);
    if (onChange) onChange(newStatus);
  };

  return (
    <div
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${active ? "bg-green-600" : "bg-gray-600"}`}
      onClick={handleToggle}
    >
      <span className="sr-only">{active ? "Ativo" : "Inativo"}</span>
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow-lg transition-transform duration-150 ${
          active ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </div>
  );
};

export default StatusToggle;