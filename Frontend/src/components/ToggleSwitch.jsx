const ToggleSwitch = ({
  checked,
  onChange,
  label = "",
  description = "",
  size = "default",
}) => {
  if (size === "large") {
    return (
      <div className="flex w-full flex-col gap-3 rounded-2xl bg-[#F5F5F5] p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-5">
        {/* Informasi */}
        <div className="min-w-0 flex-1">
          <h4 className="break-words text-sm font-bold text-gray-900">
            {label}
          </h4>

          {description && (
            <p className="mt-1 break-words text-xs leading-relaxed text-gray-500">
              {description}
            </p>
          )}
        </div>

        {/* Toggle */}
        <label className="relative inline-flex w-fit shrink-0 cursor-pointer items-center">
          <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="peer sr-only"
            aria-label={label || "Toggle"}
          />

          <div
            className="
              relative h-6 w-12 rounded-full bg-gray-300
              transition-colors duration-200
              after:absolute after:left-[2px] after:top-[2px]
              after:h-5 after:w-5 after:rounded-full
              after:border after:border-gray-300 after:bg-white
              after:transition-transform after:duration-200 after:content-['']
              peer-checked:bg-red-700
              peer-checked:after:translate-x-6
              peer-checked:after:border-white
              peer-focus-visible:ring-2 peer-focus-visible:ring-red-500
              peer-focus-visible:ring-offset-2
            "
          />
        </label>
      </div>
    );
  }

  return (
    <label className="relative inline-flex w-fit cursor-pointer items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
        aria-label={label || "Toggle"}
      />

      <div
        className="
          relative h-5 w-9 shrink-0 rounded-full bg-gray-200
          transition-colors duration-200
          after:absolute after:left-[2px] after:top-[2px]
          after:h-4 after:w-4 after:rounded-full
          after:border after:border-gray-300 after:bg-white
          after:transition-transform after:duration-200 after:content-['']
          peer-checked:bg-red-700
          peer-checked:after:translate-x-4
          peer-checked:after:border-white
          peer-focus-visible:ring-2 peer-focus-visible:ring-red-500
          peer-focus-visible:ring-offset-2
        "
      />

      {label && (
        <span className="break-words text-xs font-medium text-gray-600">
          {label}
        </span>
      )}
    </label>
  );
};

export default ToggleSwitch;