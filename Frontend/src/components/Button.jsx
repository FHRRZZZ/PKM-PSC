import React from 'react';

// Komponen Reusable Button
export const Button = ({ variant = 'admin', children, className = '', ...props }) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 shadow-md active:scale-95 focus:outline-none";

  // Varian gaya berdasarkan props
  const variants = {
    // Tombol Darurat: Gradien linier #D32F2F ke #A80E0E
    darurat: "bg-gradient-to-r from-[#D32F2F] to-[#A80E0E] text-white hover:brightness-110 shadow-red-500/30 px-6 py-3.5 text-base tracking-wide animate-pulse",
    
    // Tombol Admin: Warna Solid #A30A0A
    admin: "bg-[#A30A0A] text-white hover:bg-[#850808] px-4 py-2 text-sm shadow-stone-900/10"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant] || variants.admin} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
