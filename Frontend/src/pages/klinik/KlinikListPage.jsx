import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/layout/PageHeader';
import { klinikApi, setSelectedKlinikId } from '../../api/klinik';

const empty = { nama: '', slug: '', alamat: '', telepon: '', deskripsi: '', is_active: true };

export default function KlinikListPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    try { setLoading(true); setItems(await klinikApi.list()); setError(''); }
    catch (err) { setError(err.message || 'Gagal memuat daftar klinik.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const submit = async (event) => {
    event.preventDefault();
    if (!form.nama.trim()) return setError('Nama klinik wajib diisi.');
    try {
      setSaving(true); setError('');
      if (editing) await klinikApi.update(editing.id, form);
      else await klinikApi.create(form);
      setForm(empty); setEditing(null); setMessage('Data klinik berhasil disimpan.'); await load();
    } catch (err) { setError(err.message || 'Gagal menyimpan klinik.'); }
    finally { setSaving(false); }
  };

  const edit = (item) => { setEditing(item); setForm({ nama: item.nama || '', slug: item.slug || '', alamat: item.alamat || '', telepon: item.telepon || '', deskripsi: item.deskripsi || '', is_active: item.is_active }); setMessage(''); };
  const remove = async (item) => {
    if (!window.confirm(`Hapus klinik "${item.nama}"?`)) return;
    try { await klinikApi.remove(item.id); setMessage('Klinik berhasil dihapus.'); await load(); }
    catch (err) { setError(err.message || 'Gagal menghapus klinik.'); }
  };
  const change = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  return <DashboardLayout><div className="min-h-screen min-w-0 bg-slate-50">
    <PageHeader breadcrumb={[{ label: 'Klinik' }, { label: 'Daftar Klinik' }]} title="Daftar Klinik" subtitle="Kelola klinik yang tersedia beserta informasi dasarnya." />
    {(message || error) && <div className={`mb-5 rounded-xl p-3 text-sm ${error ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>{error || message}</div>}
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="grid gap-4 sm:grid-cols-2">
        {loading ? <p className="text-sm text-slate-500">Memuat daftar klinik...</p> : items.map((item) => <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${item.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{item.is_active ? 'Aktif' : 'Nonaktif'}</span><h2 className="mt-3 text-lg font-bold text-slate-900">{item.nama}</h2></div><span className="text-xs text-slate-400">#{item.id}</span></div><p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{item.deskripsi || 'Belum ada deskripsi klinik.'}</p><p className="mt-3 text-xs text-slate-500">{item.alamat || 'Alamat belum diisi'}</p><div className="mt-5 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4 text-xs font-semibold"><Link to={`/admin/klinik/kelola?klinik_id=${item.id}`} onClick={() => setSelectedKlinikId(item.id)} className="rounded-lg bg-red-700 px-3 py-2 text-white">Lengkapi Data</Link><button type="button" onClick={() => edit(item)} className="text-blue-700">Edit Identitas</button>{item.id !== 1 && <button type="button" onClick={() => remove(item)} className="text-red-600">Hapus</button>}</div></article>)}
      </section>
      <form onSubmit={submit} className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-bold text-slate-900">{editing ? 'Edit Klinik' : 'Tambah Klinik'}</h2><div className="mt-5 space-y-4"><label className="block text-sm font-semibold text-slate-700">Nama Klinik<input value={form.nama} onChange={change('nama')} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-red-500" /></label><label className="block text-sm font-semibold text-slate-700">Slug URL<input value={form.slug} onChange={change('slug')} placeholder="otomatis dari nama" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-red-500" /></label><label className="block text-sm font-semibold text-slate-700">Alamat<textarea value={form.alamat} onChange={change('alamat')} rows={2} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-red-500" /></label><label className="block text-sm font-semibold text-slate-700">Deskripsi<textarea value={form.deskripsi} onChange={change('deskripsi')} rows={3} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-red-500" /></label><label className="flex items-center gap-2 text-sm font-semibold text-slate-700"><input type="checkbox" checked={form.is_active} onChange={(event) => setForm((current) => ({ ...current, is_active: event.target.checked }))} /> Tampilkan di website</label></div><div className="mt-5 flex gap-2"><button disabled={saving} className="rounded-xl bg-red-700 px-4 py-2.5 text-sm font-semibold text-white">{saving ? 'Menyimpan...' : 'Simpan'}</button>{editing && <button type="button" onClick={() => { setEditing(null); setForm(empty); }} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600">Batal</button>}</div></form>
    </div>
  </div></DashboardLayout>;
}
