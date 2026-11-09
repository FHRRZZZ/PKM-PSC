import React from 'react';
import { Search } from './Icons';

const SearchInput = ({
  value,
  onChange,
  placeholder = "Cari...",
  className = "",
}) => {
  return (
    <div className={`relative w-full min-w-0 max-w-xl flex-1 ${className}`}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 sm:left-4"
      />

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={placeholder}
        className="
          w-full min-w-0 rounded-xl
          border border-gray-200
          bg-gray-50/50
          py-2.5 pl-9 pr-3
          text-sm text-gray-800
          placeholder:text-gray-400
          transition-colors duration-150
          focus:border-red-600
          focus:outline-none
          focus:ring-2 focus:ring-red-500/20
          sm:pl-11 sm:pr-4
        "
      />
    </div>
  );
};

export default SearchInput;