import React from 'react';

const ToggleSwitch = ({ 
  checked, 
  onChange, 
  label = "", 
  description = "",
  size = "default" // "default" (kecil untuk card) atau "large" (untuk form dengan banner)
}) => {
  if (size === "large") {
    // Digunakan untuk bentuk banner form bawah
    return (
      <div className="bg-[#F5F5F5] rounded-2xl p-5 flex items-center justify-between">
        <div>
          <h4 className="font-bold text-sm text-gray-900">{label}</h4>
          {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            checked={checked} 
            onChange={onChange} 
            className="sr-only peer" 
          />
          <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-700"></div>
        </label>
      </div>
    );
  }

  // Digunakan versi compact untuk card katalog
  return (
    <label className="relative inline-flex items-center cursor-pointer gap-2">
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={onChange} 
        className="sr-only peer" 
      />
      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gray-300"></div>
      {label && <span className="text-gray-600 font-medium text-xs">{label}</span>}
    </label>
  );
};

export default ToggleSwitch;