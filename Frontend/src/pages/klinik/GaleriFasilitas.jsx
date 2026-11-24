import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Button } from '../../components/Button';
import SearchInput from '../../components/SearchInput';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Image, Plus, Trash2 } from '../../components/Icons';
import { buildBody, galeriApi } from '../../api/klinik';
import {
  ActiveBadge,
  EmptyBox,
  Field,
  FormModal,
  LoadingBox,
  Notice,
  PageHeader,
  PhotoInput,
  Toggle,
  Toolbar,
  fotoSrc,
  inputCls,
  useFlash,
} from './KlinikUI';

const initial = { judul: '', deskripsi: '', urutan: 0, is_active: true, foto: null, fotoUrl: '' };

export default function GaleriFasilitas() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [msg, flash] = useFlash();

  const [editing, setEditing] = useState(null); // null | 'new' | item
  const [form, setForm] = useState(initial);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await galeriApi.list();
      setItems(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError(err.message || 'Gagal memuat galeri fasilitas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () => items.filter((i) => (i.judul || '').toLowerCase().includes(query.toLowerCase())),
    [items, query]
  );

  const openForm = (item) => {
    setFormError('');
    setEditing(item || 'new');
    setForm(
      item
        ? {
            judul: item.judul || '',
            deskripsi: item.deskripsi || '',
            urutan: item.urutan ?? 0,
            is_active: item.is_active,
            foto: null,
            fotoUrl: item.foto || '',
          }
        : { ...initial, urutan: items.length + 1 }
    );
  };

  const set = (f) => (v) => setForm((c) => ({ ...c, [f]: v }));
  const onChange = (f) => (e) => set(f)(e.target.value);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.judul.trim()) return setFormError('Judul wajib diisi.');
    if (!form.foto && !form.fotoUrl) return setFormError('Foto wajib diunggah.');
    if (Number(form.urutan) < 0 || !Number.isInteger(Number(form.urutan)))
      return setFormError('Urutan harus bilangan bulat ≥ 0.');

    const body = buildBody(
      {
        judul: form.judul,
        deskripsi: form.deskripsi,
        urutan: Number(form.urutan || 0),
        is_active: form.is_active,
      },
      form.foto
    );

    try {
      setSaving(true);
      setFormError('');
      if (editing === 'new') await galeriApi.create(body);
      else await galeriApi.update(editing.id, body);
      setEditing(null);
      flash('Foto galeri berhasil disimpan.');
      await load();
    } catch (err) {
      setFormError(err.message || 'Gagal menyimpan foto galeri.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    try {
      await galeriApi.remove(pendingDelete.id);
      flash('Foto galeri berhasil dihapus.');
      await load();
    } catch (err) {
      setError(err.message || 'Gagal menghapus foto galeri.');
    } finally {
      setPendingDelete(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen min-w-0 bg-slate-50">
        <PageHeader title="Galeri Fasilitas" desc="Kelola foto fasilitas klinik." />
        <Notice message={msg} error={error} onCloseError={() => setError('')} />

        <Toolbar>
          <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
            <p className="shrink-0 text-sm font-bold text-slate-800">Koleksi fasilitas</p>
            <SearchInput
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari judul foto..."
              className="w-full sm:max-w-md"
            />
          </div>
          <Button
            type="button"
            onClick={() => openForm()}
            className="flex w-full items-center justify-center gap-2 sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Tambah Foto
          </Button>
        </Toolbar>

        {loading ? (
          <LoadingBox />
        ) : filtered.length === 0 ? (
          <EmptyBox
            title={query ? 'Foto tidak ditemukan.' : 'Belum ada foto galeri.'}
            hint={query ? 'Coba gunakan kata kunci lain.' : 'Tambahkan foto fasilitas pertama.'}
          />
        ) : (
          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
            {filtered.map((item) => (
              <article
                key={item.id}
                className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-xl"
              >
                {item.foto ? (
                  <img
                    src={fotoSrc(item.foto)}
                    alt={item.judul}
                    loading="lazy"
                    className="aspect-[4/3] w-full bg-slate-100 object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
                    <Image className="h-9 w-9" />
                  </div>
                )}

                <div className="min-w-0 flex-1 p-4 sm:p-5">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <ActiveBadge active={item.is_active} on="Tampil" off="Disembunyikan" />
                    <span className="text-xs text-slate-400">Urutan {item.urutan}</span>
                  </div>
                  <h3 className="break-words font-bold text-slate-900">{item.judul}</h3>
                  <p className="mt-2 line-clamp-3 break-words text-xs leading-relaxed text-slate-500">
                    {item.deskripsi || 'Tidak ada deskripsi.'}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-4 border-t border-slate-100 bg-slate-50/70 p-4 text-xs">
                  <button
                    type="button"
                    onClick={() => openForm(item)}
                    className="font-semibold text-blue-700 transition-colors hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingDelete(item)}
                    className="flex items-center gap-1.5 font-semibold text-red-600 transition-colors hover:text-red-800"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Hapus
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {editing && (
        <FormModal
          title={editing === 'new' ? 'Tambah Foto Galeri' : 'Edit Foto Galeri'}
          onClose={() => setEditing(null)}
          onSubmit={submit}
          saving={saving}
          error={formError}
          onCloseError={() => setFormError('')}
        >
          <Field label="Judul" required>
            <input value={form.judul} onChange={onChange('judul')} className={inputCls} />
          </Field>
          <Field label="Deskripsi" hint="(opsional)">
            <textarea
              rows={3}
              value={form.deskripsi}
              onChange={onChange('deskripsi')}
              className={`${inputCls} resize-y`}
            />
          </Field>
          <PhotoInput file={form.foto} url={form.fotoUrl} onChange={set('foto')} label="Foto" required />
          <Field label="Urutan" hint="(angka kecil tampil lebih dulu)">
            <input
              type="number"
              min={0}
              step={1}
              value={form.urutan}
              onChange={onChange('urutan')}
              className={inputCls}
            />
          </Field>
          <Toggle label="Tampilkan di website" checked={form.is_active} onChange={set('is_active')} />
        </FormModal>
      )}

      <ConfirmDialog
        isOpen={Boolean(pendingDelete)}
        onCancel={() => setPendingDelete(null)}
        onConfirm={remove}
        message={`Foto "${pendingDelete?.judul || ''}" akan dihapus.`}
      />
    </DashboardLayout>
  );
}
