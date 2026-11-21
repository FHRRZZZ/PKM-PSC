export default function ConfirmDialog({
  isOpen,
  title = "Konfirmasi",
  message = "Apakah kamu yakin ingin melanjutkan?",
  confirmText = "Ya, lanjutkan",
  cancelText = "Batal",
  onConfirm,
  onCancel,
  variant = "danger",
}) {
  if (!isOpen) return null;

  const confirmStyle =
    variant === "danger"
      ? "bg-red-600 hover:bg-red-700"
      : "bg-blue-600 hover:bg-blue-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="my-auto w-full max-w-md rounded-xl bg-white p-4 shadow-xl sm:p-6"
      >
        <h2
          id="confirm-dialog-title"
          className="break-words text-base font-semibold text-gray-900 sm:text-lg"
        >
          {title}
        </h2>

        <p className="mt-3 break-words text-sm leading-relaxed text-gray-600">
          {message}
        </p>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-100 sm:w-auto"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors ${confirmStyle} sm:w-auto`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}