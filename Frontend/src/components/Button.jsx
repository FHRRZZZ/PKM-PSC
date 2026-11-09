// Komponen Reusable Button
export const Button = ({
  variant = 'admin',
  children,
  className = '',
  ...props
}) => {
  const baseStyles =
    "inline-flex max-w-full items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  const variants = {
    darurat:
      "w-full sm:w-auto bg-gradient-to-r from-[#D32F2F] to-[#A80E0E] text-white hover:brightness-110 shadow-red-500/30 px-4 py-3 sm:px-6 sm:py-3.5 text-sm sm:text-base tracking-wide",

    admin:
      "w-full sm:w-auto bg-[#A30A0A] text-white hover:bg-[#850808] px-4 py-2.5 text-sm shadow-stone-900/10",

    secondary:
      "w-full sm:w-auto bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 py-2.5 text-sm shadow-none",

    outline:
      "w-full sm:w-auto border border-gray-200 bg-white text-slate-700 hover:bg-gray-50 px-4 py-2.5 text-sm shadow-none",

    danger:
      "w-full sm:w-auto bg-red-600 text-white hover:bg-red-700 px-4 py-2.5 text-sm",
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