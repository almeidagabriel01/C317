"use client";

const StatusToggle = ({ isActive, onChange, disabled = false }) => {
  const handleToggle = () => {
    if (disabled) return;
    // Só chama onChange, não mexe em estado local!
    if (onChange) onChange(!isActive);
  };

  return (
    <div
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
        disabled ? "opacity-50         cursor-not-allowed" : "cursor-pointer"
      } ${isActive ? "bg-green-600" : "bg-gray-600"}`}
      onClick={handleToggle}
    >
      <span className="sr-only">{isActive ? "Ativo" : "Inativo"}</span>
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow-lg transition-transform duration-150 ${
          isActive ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </div>
  );
};

export default StatusToggle;
