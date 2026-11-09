import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Button } from '../../components/Button';
import SearchInput from '../../components/SearchInput';
import ConfirmDialog from '../../components/ConfirmDialog';
import MessageError from '../../components/MessageError';
import { Image, Plus, Trash2 } from '../../components/Icons';
import {
  deleteBerita,
  deleteKategoriBerita,
  getBeritaAdmin,
  getKategoriBerita,
  createKategoriBerita,
  updateKategoriBerita,
} from '../../api/berita';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function BeritaPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingCategory, setSavingCategory] = useState(false);

  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setLoading(true);
      const [news, categoryData] = await Promise.all([
        getBeritaAdmin(),
        getKategoriBerita(),
      ]);

      setItems(Array.isArray(news) ? news : []);
      setCategories(Array.isArray(categoryData) ? categoryData : []);
      setError('');
    } catch (err) {
      setError(err.message || 'Gagal memuat data berita.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      (item.judul || '').toLowerCase().includes(query.toLowerCase())
    );
  }, [items, query]);

  const saveCategory = async (event) => {
    event.preventDefault();

    if (!categoryName.trim()) return;

    try {
      setSavingCategory(true);

      if (editingCategory) {
        await updateKategoriBerita(editingCategory.id, {
          nama: categoryName.trim(),
        });
      } else {
        await createKategoriBerita({
          nama: categoryName.trim(),
        });
      }

      setCategoryName('');
      setEditingCategory(null);
      await loadData();
    } catch (err) {
      setError(err.message || 'Gagal menyimpan kategori.');
    } finally {
      setSavingCategory(false);
    }
  };

  const removeItem = async () => {
    if (!pendingDelete) return;

    try {
      if (pendingDelete.type === 'news') {
        await deleteBerita(pendingDelete.id);
      } else {
        await deleteKategoriBerita(pendingDelete.id);
      }

      setPendingDelete(null);
      await loadData();
    } catch (err) {
      setError(err.message || 'Gagal menghapus data.');
      setPendingDelete(null);
    }
  };

  const closeCategoryModal = () => {
    setCategoryOpen(false);
    setCategoryName('');
    setEditingCategory(null);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen min-w-0 bg-slate-50">
        {/* Header */}
        <div className="mb-6">
          <p className="text-xs text-slate-500">
            Admin &gt; <b className="text-slate-800">Berita</b>
          </p>

          <h1 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
            CMS Berita &amp; Informasi Medis
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Kelola artikel, pengumuman, dan informasi kesehatan.
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
            placeholder="Cari nama berita..."
            className="w-full sm:max-w-md"
          />

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCategoryOpen(true)}
              className="w-full sm:w-auto"
            >
              Kelola Kategori
            </Button>

            <Button
              type="button"
              onClick={() => navigate('/admin/berita/tambah')}
              className="flex w-full items-center justify-center gap-2 sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Tambah Berita
            </Button>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
            Memuat data berita...
          </div>
        ) : (
          <>
            {/* News Cards */}
            {filteredItems.length > 0 ? (
              <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
                {filteredItems.map((item) => (
                  <article
                    key={item.id}
                    className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
                  >
                    {/* Image */}
                    {item.foto ? (
                      <img
                        src={`${API_URL}${item.foto}`}
                        alt={item.judul}
                        loading="lazy"
                        className="aspect-video w-full bg-slate-100 object-cover"
                      />
                    ) : (
                      <div className="flex aspect-video items-center justify-center bg-slate-100 text-slate-400">
                        <Image className="h-9 w-9" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="min-w-0 flex-1 p-4 sm:p-5">
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                            item.status === 'terbit'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.status}
                        </span>

                        <span className="max-w-full truncate text-xs text-slate-400">
                          {item.kategori?.nama || '-'}
                        </span>
                      </div>

                      <h3 className="break-words font-bold text-slate-900">
                        {item.judul}
                      </h3>

                      <p className="mt-2 line-clamp-3 break-words text-xs leading-relaxed text-slate-500">
                        {item.deskripsi || 'Tidak ada deskripsi.'}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-4 border-t border-slate-100 p-4 text-xs">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/admin/berita/tambah?id=${item.id}`)
                        }
                        className="font-semibold text-blue-700 transition-colors hover:text-blue-900"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setPendingDelete({
                            type: 'news',
                            id: item.id,
                          })
                        }
                        className="flex items-center gap-1.5 font-semibold text-red-600 transition-colors hover:text-red-800"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Hapus
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white p-8 text-center sm:p-10">
                <p className="text-sm font-medium text-slate-700">
                  {query
                    ? 'Berita tidak ditemukan.'
                    : 'Belum ada berita.'}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {query
                    ? 'Coba gunakan kata kunci lain.'
                    : 'Tambahkan berita baru untuk mulai mengelola data.'}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Category Modal */}
      {categoryOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-black/40 p-3 sm:p-5">
          <div className="my-auto flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 p-4 sm:p-5">
              <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                Kelola Kategori Berita
              </h2>

              <button
                type="button"
                onClick={closeCategoryModal}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100"
                aria-label="Tutup modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="min-h-0 overflow-y-auto p-4 sm:p-5">
              <form
                onSubmit={saveCategory}
                className="flex flex-col gap-2 sm:flex-row"
              >
                <input
                  value={categoryName}
                  onChange={(event) => setCategoryName(event.target.value)}
                  placeholder="Nama kategori"
                  className="w-full min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                  required
                />

                <Button
                  type="submit"
                  disabled={savingCategory}
                  className="w-full sm:w-auto"
                >
                  {savingCategory
                    ? 'Menyimpan...'
                    : editingCategory
                      ? 'Simpan'
                      : 'Tambah'}
                </Button>
              </form>

              <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
                {categories.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="flex min-w-0 flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4"
                      >
                        <span className="min-w-0 break-words text-sm font-medium text-slate-700">
                          {category.nama}
                        </span>

                        <div className="flex shrink-0 items-center gap-4 text-xs">
                          <button
                            type="button"
                            className="font-semibold text-blue-700 hover:text-blue-900"
                            onClick={() => {
                              setEditingCategory(category);
                              setCategoryName(category.nama);
                            }}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="font-semibold text-red-600 hover:text-red-800"
                            onClick={() =>
                              setPendingDelete({
                                type: 'category',
                                id: category.id,
                              })
                            }
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="p-5 text-center text-sm text-slate-500">
                    Belum ada kategori berita.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(pendingDelete)}
        onCancel={() => setPendingDelete(null)}
        onConfirm={removeItem}
        message={
          pendingDelete?.type === 'category'
            ? 'Kategori yang masih dipakai tidak dapat dihapus.'
            : 'Berita ini akan dihapus.'
        }
      />
    </DashboardLayout>
  );
}