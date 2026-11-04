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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-gray-900">
          {title}
        </h2>

        <p className="mt-3 text-sm text-gray-600">
          {message}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2 text-sm text-white ${confirmStyle}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}