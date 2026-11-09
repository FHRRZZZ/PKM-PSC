import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Button } from '../../components/Button';
import ConfirmDialog from '../../components/ConfirmDialog';
import MessageError from '../../components/MessageError';
import SearchInput from '../../components/SearchInput';
import { Image, Trash2 } from '../../components/Icons';
import { deleteLayanan, getLayananAdmin, updateLayanan } from '../../api/layanan';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function LayananPage() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [reordering, setReordering] = useState(null);

  const navigate = useNavigate();

  const load = async () => {
    try {
      setLoading(true);
      const data = await getLayananAdmin();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Gagal mengambil data layanan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return items.filter((item) =>
      (item.nama || '').toLowerCase().includes(query.toLowerCase())
    );
  }, [items, query]);

  const remove = async () => {
    if (!pending) return;

    try {
      setDeleting(true);
      await deleteLayanan(pending);
      setPending(null);
      await load();
    } catch (err) {
      setError(err.message || 'Gagal menghapus layanan.');
      setPending(null);
    } finally {
      setDeleting(false);
    }
  };

  const move = async (id, direction) => {
    const currentIndex = items.findIndex((item) => item.id === id);
    const targetIndex = currentIndex + direction;
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= items.length) return;

    const current = items[currentIndex];
    const target = items[targetIndex];
    const currentOrder = Number(current.urutan) === Number(target.urutan)
      ? targetIndex
      : Number(current.urutan);
    const targetOrder = Number(current.urutan) === Number(target.urutan)
      ? currentIndex
      : Number(target.urutan);

    try {
      setReordering(id);
      await Promise.all([
        updateLayanan(current.id, { urutan: targetOrder }),
        updateLayanan(target.id, { urutan: currentOrder }),
      ]);
      setItems((previous) => {
        const next = [...previous];
        [next[currentIndex], next[targetIndex]] = [next[targetIndex], next[currentIndex]];
        next[currentIndex] = { ...next[currentIndex], urutan: targetOrder };
        next[targetIndex] = { ...next[targetIndex], urutan: currentOrder };
        return next;
      });
    } catch (err) {
      setError(err.message || 'Gagal mengubah urutan layanan.');
      await load();
    } finally {
      setReordering(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen min-w-0 bg-slate-50">
        {/* Header */}
        <div className="mb-6">
          <p className="text-xs text-slate-500">
            Admin &gt; <b className="text-slate-800">Layanan</b>
          </p>

          <h1 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
            CMS Layanan Ambulans
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Kelola layanan yang tersedia untuk masyarakat.
          </p>
        </div>

        {/* Error */}
        <div className="mb-6">
          <MessageError
            message={error}
            onClose={() => setError('')}
          />
        </div>

        {/* Toolbar */}
        <div className="mb-6 flex min-w-0 flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <SearchInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari nama layanan..."
            className="w-full sm:max-w-md"
          />

          <Button
            type="button"
            onClick={() => navigate('/admin/layanan/tambah')}
            className="w-full sm:w-auto"
          >
            + Tambah Layanan
          </Button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
            Memuat data layanan...
          </div>
        )}

        {/* Content */}
        {!loading && (
          <>
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
                {filtered.map((item) => {
                  const itemIndex = items.findIndex((entry) => entry.id === item.id);
                  return (
                  <article
                    key={item.id}
                    className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
                  >
                    {/* Image */}
                    {item.foto ? (
                      <img
                        src={`${API_URL}${item.foto}`}
                        alt={item.nama}
                        loading="lazy"
                        className="aspect-video w-full bg-slate-100 object-cover"
                      />
                    ) : (
                      <div className="flex aspect-video w-full items-center justify-center bg-slate-100 text-slate-400">
                        <Image className="h-9 w-9" />
                      </div>
                    )}

                    {/* Information */}
                    <div className="flex-1 p-4 sm:p-5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          item.is_active
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.is_active ? 'Tampil' : 'Disembunyikan'}
                      </span>

                      <h3 className="mt-3 break-words font-bold text-slate-900">
                        {item.nama}
                      </h3>

                      <p className="mt-2 line-clamp-3 break-words text-xs leading-relaxed text-slate-500">
                        {item.deskripsi || 'Tidak ada deskripsi.'}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-4 border-t border-slate-100 p-4 text-xs">
                      <div className="mr-auto flex items-center gap-1">
                        <button
                          type="button"
                          aria-label={`Geser ${item.nama} ke kiri`}
                          disabled={itemIndex === 0 || reordering !== null}
                          onClick={() => move(item.id, -1)}
                          className="rounded border border-slate-200 px-2 py-1 text-base leading-none text-slate-600 transition-colors hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          ←
                        </button>
                        <button
                          type="button"
                          aria-label={`Geser ${item.nama} ke kanan`}
                          disabled={itemIndex === items.length - 1 || reordering !== null}
                          onClick={() => move(item.id, 1)}
                          className="rounded border border-slate-200 px-2 py-1 text-base leading-none text-slate-600 transition-colors hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          →
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/admin/layanan/tambah?id=${item.id}`)
                        }
                        className="font-semibold text-blue-700 transition-colors hover:text-blue-900"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => setPending(item.id)}
                        className="flex items-center gap-1.5 font-semibold text-red-600 transition-colors hover:text-red-800"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Hapus
                      </button>
                    </div>
                  </article>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white p-8 text-center sm:p-10">
                <p className="text-sm font-medium text-slate-700">
                  {query
                    ? 'Layanan tidak ditemukan.'
                    : 'Belum ada layanan.'}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {query
                    ? 'Coba gunakan kata kunci lain.'
                    : 'Tambahkan layanan baru untuk mulai mengelola data.'}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        isOpen={Boolean(pending)}
        onCancel={() => setPending(null)}
        onConfirm={remove}
        message="Layanan ini akan dihapus."
      />
    </DashboardLayout>
  );
}
