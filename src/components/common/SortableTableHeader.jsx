"use client";

import { FiChevronUp, FiChevronDown } from "react-icons/fi";

const SortableTableHeader = ({
  field,
  label,
  onSort,
  sortDirection,
  activeSortField,
  className = "",
  sortable = true
}) => {
  const isActive = activeSortField === field;
  const showAscIcon = isActive && sortDirection === 'asc';
  const showDescIcon = isActive && sortDirection === 'desc';

  const handleClick = () => {
    if (sortable && onSort) {
      onSort(field);
    }
  };

  const baseClasses = "px-6 py-4 text-center align-middle font-medium";
  const sortableClasses = sortable 
    ? "cursor-pointer hover:bg-gray-600 hover:bg-opacity-50 transition-colors duration-200 select-none" 
    : "";

  return (
    <th
      scope="col"
      className={`${baseClasses} ${sortableClasses} ${className} relative`}
      onClick={handleClick}
      title={sortable ? `Clique para ordenar por ${label}` : undefined}
    >
      <div className="flex items-center justify-center w-full h-full">
        <span className="select-none text-center">{label}</span>
        {sortable && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col items-center justify-center w-5 h-5">
            {showAscIcon && (
              <FiChevronUp 
                className="w-5 h-5 text-white" 
                title="Ordenação crescente"
              />
            )}
            {showDescIcon && (
              <FiChevronDown 
                className="w-5 h-5 text-white" 
                title="Ordenação decrescente"
              />
            )}
            {!isActive && (
              <div className="w-5 h-5 opacity-50 hover:opacity-80 transition-opacity duration-200 flex flex-col items-center justify-center">
                <FiChevronUp className="w-3.5 h-3.5 text-gray-200 transform -translate-y-0.5" />
                <FiChevronDown className="w-3.5 h-3.5 text-gray-200 transform translate-y-0.5" />
              </div>
            )}
          </div>
        )}
      </div>
    </th>
  );
};

export default SortableTableHeader;