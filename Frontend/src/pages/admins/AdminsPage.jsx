import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/layout/PageHeader';
import SearchInput from '../../components/SearchInput';
import MessageError from '../../components/MessageError';

import { getBeritaAdmin } from '../../api/berita';
import { getFaqsAdmin } from '../../api/faq';
import { getKontak } from '../../api/kontak';
import { getLayananAdmin } from '../../api/layanan';

const typeStyles = {
  Layanan: 'bg-rose-50 text-rose-600',
  Berita: 'bg-blue-50 text-blue-600',
  FAQ: 'bg-emerald-50 text-emerald-600',
};

function formatDate(date) {
  if (!date) return 'Belum ada tanggal';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return 'Tanggal tidak valid';

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
  }).format(parsedDate);
}

const filterStyle =
  'w-full min-w-0 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-500/20 sm:w-auto';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    berita: [],
    layanan: [],
    faq: [],
    kontak: [],
  });

  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mengambil data dashboard
  useEffect(() => {
    let isMounted = true;

    const fetchDashboard = async () => {
      try {
        const [berita, layanan, faq, kontak] = await Promise.all([
          getBeritaAdmin(),
          getLayananAdmin(),
          getFaqsAdmin(),
          getKontak(),
        ]);

        if (isMounted) {
          setData({
            berita,
            layanan,
            faq,
            kontak,
          });
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Terjadi kesalahan saat mengambil data.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  // Menggabungkan seluruh konten
  const content = useMemo(() => [
    ...data.berita.map((item) => ({
      id: `berita-${item.id}`,
      title: item.judul,
      subtitle: item.kategori?.nama || 'Tanpa kategori',
      type: 'Berita',
      status: item.status === 'terbit' ? 'Aktif' : 'Draft',
      date: item.updatedAt || item.createdAt,
      editPath: `/admin/berita/tambah?id=${item.id}`,
      listPath: '/admin/berita',
    })),

    ...data.layanan.map((item) => ({
      id: `layanan-${item.id}`,
      title: item.nama,
      subtitle: item.deskripsi,
      type: 'Layanan',
      status: item.is_active ? 'Aktif' : 'Nonaktif',
      editPath: `/admin/layanan/tambah?id=${item.id}`,
      listPath: '/admin/layanan',
    })),

    ...data.faq.map((item) => ({
      id: `faq-${item.id}`,
      title: item.pertanyaan,
      subtitle: item.jawaban,
      type: 'FAQ',
      status: item.is_active ? 'Aktif' : 'Nonaktif',
      editPath: `/admin/faq/tambah?id=${item.id}`,
      listPath: '/admin/faq',
    })),
  ], [data]);

  // Filter dan pencarian
  const filteredContent = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return content
      .filter((item) => {
        const matchesQuery =
          !normalizedQuery ||
          `${item.title || ''} ${item.subtitle || ''}`
            .toLowerCase()
            .includes(normalizedQuery);

        const matchesType =
          typeFilter === 'Semua' || item.type === typeFilter;

        const matchesStatus =
          statusFilter === 'Semua' || item.status === statusFilter;

        return matchesQuery && matchesType && matchesStatus;
      })
      .sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;

        return dateB - dateA;
      });
  }, [content, query, statusFilter, typeFilter]);

  // Ringkasan data
  const summary = useMemo(() => [
    {
      label: 'Layanan Terdaftar',
      total: data.layanan.length,
      active: data.layanan.filter((item) => item.is_active).length,
      inactive: data.layanan.filter((item) => !item.is_active).length,
      path: '/admin/layanan',
    },
    {
      label: 'Artikel Berita',
      total: data.berita.length,
      active: data.berita.filter((item) => item.status === 'terbit').length,
      inactive: data.berita.filter((item) => item.status !== 'terbit').length,
      path: '/admin/berita',
    },
    {
      label: 'Pertanyaan FAQ',
      total: data.faq.length,
      active: data.faq.filter((item) => item.is_active).length,
      inactive: data.faq.filter((item) => !item.is_active).length,
      path: '/admin/faq',
    },
    {
      label: 'Data Kontak',
      total: data.kontak.length,
      active: data.kontak.length,
      inactive: 0,
      path: '/admin/kontak',
    },
  ], [data]);

  return (
    <DashboardLayout>
      <div className="min-h-screen min-w-0 bg-slate-50">

        {/* Header */}
        <PageHeader
          breadcrumb={[{ label: 'Dashboard' }]}
          title="Dashboard Sistem CMS"
          subtitle="Pantau data dan status konten portal ambulans dari satu panel."
        />

        {/* Error */}
        <MessageError
          message={error ? `Gagal memuat data dashboard: ${error}` : ''}
          onClose={() => setError('')}
        />

        {/* Loading */}
        {loading && (
          <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
            Memuat data dashboard...
          </div>
        )}

        {/* Summary Cards */}
        <section
          className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
          aria-label="Ringkasan data"
        >
          {summary.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => navigate(item.path)}
              className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-colors duration-150 hover:border-red-200 hover:bg-red-50/20 sm:p-5"
            >
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                TOTAL
              </p>

              <div className="mb-1 text-3xl font-bold text-slate-900 sm:text-4xl">
                {item.total}
              </div>

              <div className="mb-2 break-words text-sm font-semibold text-slate-800">
                {item.label}
              </div>

              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                <span>{item.active} aktif</span>
                <span>•</span>
                <span>{item.inactive} nonaktif/draft</span>
              </div>
            </button>
          ))}
        </section>

        {/* Quick Actions */}
        <section className="mb-6 flex min-w-0 flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-slate-800">
              Aksi Cepat Manajemen Konten
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Kelola data langsung di halaman modulnya.
            </p>
          </div>

          <div className="flex w-full flex-wrap gap-2 lg:w-auto">
            <button
              type="button"
              onClick={() => navigate('/admin/layanan/tambah')}
              className="flex-1 rounded-lg bg-red-800 px-3 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-red-900 sm:flex-none"
            >
              + Layanan
            </button>

            <button
              type="button"
              onClick={() => navigate('/admin/berita/tambah')}
              className="flex-1 rounded-lg bg-slate-100 px-3 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200 sm:flex-none"
            >
              + Berita Baru
            </button>

            <button
              type="button"
              onClick={() => navigate('/admin/faq/tambah')}
              className="flex-1 rounded-lg bg-slate-100 px-3 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200 sm:flex-none"
            >
              + FAQ
            </button>
          </div>
        </section>

        {/* Latest Content */}
        <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          {/* Toolbar */}
          <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:p-5">
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                Pembaruan Konten Terbaru
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                {filteredContent.length} konten sesuai filter
              </p>
            </div>

            {/* Search and Filters */}
            <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
              <SearchInput
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari konten..."
                className="max-w-none"
              />

              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                className={filterStyle}
                aria-label="Filter tipe konten"
              >
                <option value="Semua">Semua Tipe</option>
                <option value="Berita">Berita</option>
                <option value="Layanan">Layanan</option>
                <option value="FAQ">FAQ</option>
              </select>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className={filterStyle}
                aria-label="Filter status konten"
              >
                <option value="Semua">Semua Status</option>
                <option value="Aktif">Aktif</option>
                <option value="Draft">Draft</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[650px] text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50 uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-3">Judul Konten</th>
                  <th className="px-4 py-3">Tipe</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Pembaruan</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredContent.slice(0, 20).map((item) => (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <td className="max-w-[280px] px-4 py-3">
                      <p className="truncate font-semibold text-slate-800">
                        {item.title}
                      </p>

                      <p className="truncate text-[11px] text-slate-400">
                        {item.subtitle}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <span className={`rounded px-2 py-0.5 text-[10px] font-medium ${typeStyles[item.type]}`}>
                        {item.type}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`font-medium ${
                          item.status === 'Aktif'
                            ? 'text-emerald-600'
                            : item.status === 'Draft'
                              ? 'text-slate-500'
                              : 'text-amber-600'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                      {formatDate(item.date)}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => navigate(item.editPath)}
                        className="mr-3 font-semibold text-blue-700 hover:underline"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate(item.listPath)}
                        className="font-semibold text-slate-600 hover:underline"
                      >
                        Kelola
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="divide-y divide-slate-100 md:hidden">
            {filteredContent.slice(0, 20).map((item) => (
              <article key={item.id} className="min-w-0 space-y-3 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className={`rounded px-2 py-1 text-[10px] font-medium ${typeStyles[item.type]}`}>
                    {item.type}
                  </span>

                  <span
                    className={`text-xs font-semibold ${
                      item.status === 'Aktif'
                        ? 'text-emerald-600'
                        : item.status === 'Draft'
                          ? 'text-slate-500'
                          : 'text-amber-600'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="min-w-0">
                  <h3 className="break-words text-sm font-semibold text-slate-800">
                    {item.title}
                  </h3>

                  <p className="mt-1 line-clamp-2 break-words text-xs leading-relaxed text-slate-500">
                    {item.subtitle}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                  <span className="text-[11px] text-slate-400">
                    {formatDate(item.date)}
                  </span>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => navigate(item.editPath)}
                      className="text-xs font-semibold text-blue-700 hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate(item.listPath)}
                      className="text-xs font-semibold text-slate-600 hover:underline"
                    >
                      Kelola
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Empty State */}
          {!loading && filteredContent.length === 0 && (
            <div className="p-8 text-center sm:p-10">
              <p className="text-sm font-medium text-slate-600">
                Tidak ada konten yang cocok.
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Coba ubah kata pencarian atau filter.
              </p>
            </div>
          )}

          {/* Footer */}
          {filteredContent.length > 20 && (
            <div className="border-t border-slate-100 p-4 text-xs text-slate-500">
              Menampilkan 20 dari {filteredContent.length} konten.
              Gunakan halaman modul untuk mengelola seluruh data.
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}