import { Link } from 'react-router-dom';

export default function ForbiddenPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <section className="max-w-md rounded-xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Akses ditolak</h1>
        <p className="mt-2 text-sm text-slate-600">
          Anda tidak memiliki izin untuk membuka halaman ini.
        </p>
        <Link
          to="/admin"
          className="mt-6 inline-block rounded-lg bg-red-800 px-4 py-2 text-sm font-semibold text-white hover:bg-red-900"
        >
          Kembali ke CMS
        </Link>
      </section>
    </main>
  );
}
