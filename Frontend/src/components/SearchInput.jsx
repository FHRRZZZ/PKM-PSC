import React from 'react';
import { Search } from 'lucide-react';

const SearchInput = ({ 
  value, 
  onChange, 
  placeholder = "Cari...", 
  className = "" 
}) => {
  return (
    <div className={`relative flex-1 max-w-xl ${className}`}>
      <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input 
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all placeholder:text-gray-400 text-gray-800"
      />
    </div>
  );
};

export default SearchInput;