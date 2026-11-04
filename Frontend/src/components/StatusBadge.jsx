const statusStyles = {
  aktif: "bg-green-100 text-green-700",
  active: "bg-green-100 text-green-700",
  selesai: "bg-green-100 text-green-700",
  approved: "bg-green-100 text-green-700",

  pending: "bg-yellow-100 text-yellow-700",
  menunggu: "bg-yellow-100 text-yellow-700",

  ditolak: "bg-red-100 text-red-700",
  rejected: "bg-red-100 text-red-700",

  nonaktif: "bg-gray-100 text-gray-700",
  inactive: "bg-gray-100 text-gray-700",

  diproses: "bg-blue-100 text-blue-700",
  processing: "bg-blue-100 text-blue-700",
};

export default function StatusBadge({
  status,
  label,
}) {
  const normalizedStatus = String(status ?? "")
    .toLowerCase()
    .trim();

  const style =
    statusStyles[normalizedStatus] ||
    "bg-gray-100 text-gray-700";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${style}`}
    >
      {label || status || "Tidak diketahui"}
    </span>
  );
}