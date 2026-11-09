import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Button } from '../../components/Button';
import ConfirmDialog from '../../components/ConfirmDialog';
import MessageError from '../../components/MessageError';
import { Calendar, Upload } from '../../components/Icons';
import {
  createBerita,
  createKategoriBerita,
  deleteKategoriBerita,
  getBeritaAdminById,
  getKategoriBerita,
  updateBerita,
  updateKategoriBerita,
} from '../../api/berita';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const initial = {
  judul: '',
  tanggal_terbit: '',
  deskripsi: '',
  kategori_id: '',
  status: 'draft',
  foto: null,
  fotoUrl: '',
};

export default function FormBerita() {
  const [form, setForm] = useState(initial);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const [params] = useSearchParams();
  const navigate = useNavigate();
  const id = params.get('id');

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      try {
        setLoading(true);

        const [categoryData, item] = await Promise.all([
          getKategoriBerita(),
          id ? getBeritaAdminById(id) : Promise.resolve(null),
        ]);

        if (!active) return;

        setCategories(Array.isArray(categoryData) ? categoryData : []);

        if (item) {
          setForm({
            judul: item.judul || '',
            tanggal_terbit: item.tanggal_terbit
              ? item.tanggal_terbit.slice(0, 10)
              : '',
            deskripsi: item.deskripsi || '',
            kategori_id: String(item.kategori_id || ''),
            status: item.status || 'draft',
            foto: null,
            fotoUrl: item.foto || '',
          });
        }
      } catch (err) {
        if (active) setError(err.message || 'Gagal memuat data berita.');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, [id]);

  const change = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const closeCategoryModal = () => {
    setCategoryOpen(false);
    setCategoryName('');
    setEditingCategory(null);
  };

  const saveCategory = async (event) => {
    event.preventDefault();

    if (!categoryName.trim()) return;

    try {
      const category = editingCategory
        ? await updateKategoriBerita(editingCategory.id, {
            nama: categoryName.trim(),
          })
        : await createKategoriBerita({
            nama: categoryName.trim(),
          });

      const updatedCategories = await getKategoriBerita();
      setCategories(updatedCategories);

      if (!editingCategory && category?.id) {
        setForm((current) => ({
          ...current,
          kategori_id: String(category.id),
        }));
      }

      closeCategoryModal();
    } catch (err) {
      setError(err.message || 'Gagal menyimpan kategori.');
    }
  };

  const removeCategory = async () => {
    if (!pendingDelete) return;

    try {
      await deleteKategoriBerita(pendingDelete.id);

      const updatedCategories = await getKategoriBerita();
      setCategories(updatedCategories);

      if (form.kategori_id === String(pendingDelete.id)) {
        setForm((current) => ({
          ...current,
          kategori_id: '',
        }));
      }

      setPendingDelete(null);
    } catch (err) {
      setError(err.message || 'Gagal menghapus kategori.');
      setPendingDelete(null);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    const body = form.foto
      ? new FormData()
      : {
          judul: form.judul,
          deskripsi: form.deskripsi,
          kategori_id: form.kategori_id,
          status: form.status,
          ...(form.tanggal_terbit
            ? { tanggal_terbit: form.tanggal_terbit }
            : {}),
          ...(form.fotoUrl ? { foto: form.fotoUrl } : {}),
        };

    if (form.foto) {
      body.append('judul', form.judul);
      body.append('deskripsi', form.deskripsi);
      body.append('kategori_id', form.kategori_id);
      body.append('status', form.status);

      if (form.tanggal_terbit) {
        body.append('tanggal_terbit', form.tanggal_terbit);
      }

      body.append('foto', form.foto);
    }

    try {
      if (id) {
        await updateBerita(id, body);
      } else {
        await createBerita(body);
      }

      navigate('/admin/berita');
    } catch (err) {
      setError(err.message || 'Gagal menyimpan berita.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen min-w-0 bg-slate-50">
        {/* Header */}
        <div className="mb-6">
          <p className="text-xs text-slate-500">
            Admin &gt; Berita &gt; <b className="text-slate-800">{id ? 'Edit' : 'Tambah'}</b>
          </p>

          <h1 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
            {id ? 'Edit Berita' : 'Tambah Berita'}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Kelola informasi dan publikasi berita.
          </p>
        </div>

        {/* Error */}
        <div className="mb-6">
          <MessageError
            message={error}
            onClose={() => setError('')}
          />
        </div>

        {loading ? (
          <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
            Memuat data berita...
          </div>
        ) : (
          <form
            onSubmit={submit}
            className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
          >
            <div className="grid min-w-0 grid-cols-1 gap-7 lg:grid-cols-2 lg:gap-8">
              {/* Informasi Berita */}
              <div className="min-w-0 space-y-5">
                <label className="block text-sm font-semibold text-slate-800">
                  Judul Berita *
                  <input
                    value={form.judul}
                    onChange={change('judul')}
                    required
                    className="mt-2 w-full min-w-0 rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10 sm:px-4"
                    placeholder="Masukkan judul berita"
                  />
                </label>

                <label className="block text-sm font-semibold text-slate-800">
                  Tanggal Publikasi
                  <div className="relative mt-2">
                    <input
                      type="date"
                      value={form.tanggal_terbit}
                      onChange={change('tanggal_terbit')}
                      className="w-full min-w-0 rounded-xl border border-slate-200 px-3 py-3 pr-10 text-sm text-slate-700 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10 sm:px-4"
                    />
                    <Calendar className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 sm:right-4" />
                  </div>
                </label>

                {/* Kategori */}
                <div className="min-w-0">
                  <label className="block text-sm font-semibold text-slate-800">
                    Kategori Berita *
                  </label>

                  <div className="mt-2 flex min-w-0 flex-col gap-2 sm:flex-row">
                    <select
                      value={form.kategori_id}
                      onChange={change('kategori_id')}
                      required
                      className="w-full min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10 sm:px-4"
                    >
                      <option value="">Pilih kategori</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.nama}
                        </option>
                      ))}
                    </select>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCategoryOpen(true)}
                      className="w-full whitespace-nowrap sm:w-auto"
                    >
                      + Tambah Kategori
                    </Button>
                  </div>
                </div>

                <label className="block text-sm font-semibold text-slate-800">
                  Deskripsi / Ringkasan *
                  <textarea
                    value={form.deskripsi}
                    onChange={change('deskripsi')}
                    required
                    rows={7}
                    className="mt-2 w-full min-w-0 resize-y rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10 sm:px-4"
                    placeholder="Tuliskan ringkasan berita..."
                  />
                </label>
              </div>

              {/* Foto dan Status */}
              <div className="min-w-0 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-800">
                    Foto Utama{' '}
                    <span className="font-normal text-slate-400">
                      (opsional)
                    </span>
                  </label>

                  <div className="mt-2 flex min-h-[220px] w-full min-w-0 flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 text-center sm:min-h-[280px] sm:p-5">
                    {form.foto ? (
                      <img
                        src={URL.createObjectURL(form.foto)}
                        alt="Preview berita"
                        className="max-h-56 max-w-full rounded-lg object-contain"
                      />
                    ) : form.fotoUrl ? (
                      <img
                        src={`${API_URL}${form.fotoUrl}`}
                        alt="Foto berita saat ini"
                        className="max-h-56 max-w-full rounded-lg object-contain"
                      />
                    ) : (
                      <>
                        <Upload className="h-9 w-9 text-red-700 sm:h-10 sm:w-10" />
                        <p className="mt-3 text-sm font-semibold text-slate-700">
                          Pilih foto JPG/PNG
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Unggah gambar untuk berita.
                        </p>
                      </>
                    )}

                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          foto: event.target.files?.[0] || null,
                        }))
                      }
                      className="mt-4 w-full max-w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-red-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-red-700 hover:file:bg-red-100"
                    />
                  </div>
                </div>

                <label className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm font-semibold sm:p-4">
                  <span className="min-w-0">
                    Tampilkan di website
                    <span className="mt-1 block text-xs font-normal text-slate-500">
                      Aktifkan untuk menerbitkan berita.
                    </span>
                  </span>

                  <input
                    type="checkbox"
                    checked={form.status === 'terbit'}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        status: event.target.checked ? 'terbit' : 'draft',
                      }))
                    }
                    className="h-5 w-5 shrink-0 accent-red-700"
                  />
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/berita')}
                className="w-full sm:w-auto"
              >
                Batal
              </Button>

              <Button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto"
              >
                {saving ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Modal Kategori */}
      {categoryOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-black/40 p-3 sm:p-5">
          <div className="my-auto flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-4 sm:p-5">
              <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                Kelola Kategori Berita
              </h2>

              <button
                type="button"
                onClick={closeCategoryModal}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xl text-slate-500 hover:bg-slate-100"
                aria-label="Tutup"
              >
                &times;
              </button>
            </div>

            <div className="min-h-0 overflow-y-auto p-4 sm:p-5">
              <form
                onSubmit={saveCategory}
                className="flex flex-col gap-2 sm:flex-row"
              >
                <input
                  value={categoryName}
                  onChange={(event) => setCategoryName(event.target.value)}
                  placeholder="Nama kategori"
                  className="w-full min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-red-500"
                  required
                />

                <Button type="submit" className="w-full sm:w-auto">
                  {editingCategory ? 'Simpan' : 'Tambah'}
                </Button>
              </form>

              <div className="mt-5 max-h-64 overflow-y-auto rounded-xl border border-slate-200">
                {categories.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4"
                      >
                        <span className="min-w-0 break-words text-sm font-medium text-slate-700">
                          {category.nama}
                        </span>

                        <div className="flex shrink-0 items-center gap-4 text-xs">
                          <button
                            type="button"
                            className="font-semibold text-blue-700"
                            onClick={() => {
                              setEditingCategory(category);
                              setCategoryName(category.nama);
                            }}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="font-semibold text-red-600"
                            onClick={() =>
                              setPendingDelete({ id: category.id })
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
        onConfirm={removeCategory}
        message="Kategori yang masih dipakai berita tidak dapat dihapus."
      />
    </DashboardLayout>
  );
}