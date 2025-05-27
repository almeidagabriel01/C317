"use client";

import { FiSearch } from "react-icons/fi";

const ItemSearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="w-full md:w-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <FiSearch className="w-4 h-4 text-gray-400" />
        </div>
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="block w-full p-3 pl-10 text-sm text-white border border-gray-600 rounded-lg bg-gray-700 focus:ring-amber-500 focus:border-amber-500 font-sans"
          placeholder="Buscar itens..."
        />
      </div>
    </div>
  );
};

export default ItemSearchBar;
