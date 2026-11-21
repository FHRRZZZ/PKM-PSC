export default function FormField({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  required = false,
  error = '',
  className = '',
  ...inputProps
}) {
  const fieldClass = `mt-1.5 block w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:bg-white ${error ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-200 focus:border-red-500'} ${className}`;
  const fieldProps = { id: name, name, value, onChange, placeholder, required, className: fieldClass, ...inputProps };

  return (
    <div>
      <label htmlFor={name} className="block text-xs font-bold text-gray-800">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {type === 'textarea' ? <textarea {...fieldProps} rows={4} /> : <input {...fieldProps} type={type} />}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
