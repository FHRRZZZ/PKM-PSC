import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/layout/PageHeader';
import MessageError from '../../components/MessageError';
import ToggleSwitch from '../../components/ToggleSwitch';
import { Button } from '../../components/Button';
import { createHeroSlide, deleteHeroSlide, getHeroSlidesAdmin, updateHeroSlide } from '../../api/hero';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const empty = { eyebrow: 'Dinas Kesehatan Kota Depok', title: '', description: '', primary_label: 'Telepon 119', primary_link: 'tel:119', secondary_label: '', secondary_link: '', urutan: 0, is_active: true, background_image: '', logo: '' };

function assetUrl(path) { return path?.startsWith('http') ? path : path ? `${API_URL}${path}` : ''; }

export default function HeroPage() {
  const [slides, setSlides] = useState([]);
  const [form, setForm] = useState(empty);
  const [backgroundFile, setBackgroundFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try { setLoading(true); setSlides(await getHeroSlidesAdmin()); }
    catch (err) { setError(err.message || 'Gagal memuat slide hero.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const edit = (slide) => {
    setEditingId(slide.id);
    setForm({ ...empty, ...slide });
    setBackgroundFile(null); setLogoFile(null); setError('');
  };
  const reset = () => { setEditingId(null); setForm(empty); setBackgroundFile(null); setLogoFile(null); };
  const change = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError('');
    const body = new FormData();
    ['eyebrow', 'title', 'description', 'primary_label', 'primary_link', 'secondary_label', 'secondary_link', 'urutan', 'is_active'].forEach((field) => body.append(field, String(form[field] ?? '')));
    if (backgroundFile) body.append('background_image', backgroundFile);
    if (logoFile) body.append('logo', logoFile);
    try { if (editingId) await updateHeroSlide(editingId, body); else await createHeroSlide(body); reset(); await load(); }
    catch (err) { setError(err.message || 'Gagal menyimpan slide hero.'); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm('Hapus slide hero ini?')) return;
    try { await deleteHeroSlide(id); if (editingId === id) reset(); await load(); }
    catch (err) { setError(err.message || 'Gagal menghapus slide hero.'); }
  };

  return <DashboardLayout><div className="min-h-screen min-w-0 bg-slate-50">
    <PageHeader breadcrumb={[{ label: 'CMS' }, { label: 'Hero Landing Page' }]} title="Hero Landing Page" subtitle="Atur slide, background, logo, dan tombol utama yang tampil di halaman depan." actions={<Button type="button" onClick={reset}>+ Slide Baru</Button>} />
    <MessageError message={error} onClose={() => setError('')} />
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="text-sm font-bold text-slate-900">Daftar slide</h2>
        <p className="mt-1 text-xs text-slate-500">Slide aktif akan diputar otomatis di hero.</p>
        <div className="mt-5 space-y-3">
          {loading ? <p className="text-sm text-slate-500">Memuat slide...</p> : slides.length === 0 ? <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">Belum ada slide. Buat slide pertama untuk mengisi hero.</p> : slides.map((slide) => <article key={slide.id} className={`overflow-hidden rounded-xl border ${editingId === slide.id ? 'border-red-300 ring-2 ring-red-50' : 'border-slate-200'}`}>
            <div className="flex gap-4 p-3">
              <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-slate-200">{slide.background_image && <img src={assetUrl(slide.background_image)} alt="" className="h-full w-full object-cover" />}</div>
              <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h3 className="truncate text-sm font-bold text-slate-900">{slide.title}</h3><span className={`rounded px-2 py-0.5 text-[10px] font-semibold ${slide.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{slide.is_active ? 'Aktif' : 'Nonaktif'}</span></div><p className="mt-1 line-clamp-2 text-xs text-slate-500">{slide.description || 'Tanpa deskripsi'}</p><div className="mt-2 flex gap-3 text-xs font-semibold"><button type="button" onClick={() => edit(slide)} className="text-blue-700 hover:underline">Edit</button><button type="button" onClick={() => remove(slide.id)} className="text-red-700 hover:underline">Hapus</button></div></div>
            </div>
          </article>)}
        </div>
      </section>
      <form onSubmit={submit} className="space-y-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div><h2 className="text-sm font-bold text-slate-900">{editingId ? 'Edit slide' : 'Slide baru'}</h2><p className="mt-1 text-xs text-slate-500">Gunakan gambar JPG/PNG maksimal 5 MB.</p></div>
        {['eyebrow', 'title', 'description', 'primary_label', 'primary_link', 'secondary_label', 'secondary_link'].map((field) => <label key={field} className="block text-sm font-semibold text-slate-800">{field.replaceAll('_', ' ')}{field === 'title' && ' *'}{field === 'description' ? <textarea required={field === 'description'} value={form[field] || ''} onChange={(event) => change(field, event.target.value)} rows={3} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-red-500" /> : <input required={field === 'title'} value={form[field] || ''} onChange={(event) => change(field, event.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-red-500" />}</label>)}
        <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold text-slate-800">Urutan<input type="number" min="0" value={form.urutan} onChange={(event) => change('urutan', event.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal" /></label><div className="rounded-lg border border-slate-100 p-3"><ToggleSwitch checked={Boolean(form.is_active)} onChange={(value) => change('is_active', value?.target ? value.target.checked : value)} label="Tampilkan slide" description="Slide dapat muncul di landing page." /></div></div>
        <label className="block text-sm font-semibold text-slate-800">Background hero<input type="file" accept="image/jpeg,image/png" onChange={(event) => setBackgroundFile(event.target.files?.[0] || null)} className="mt-2 block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-red-50 file:px-3 file:py-2 file:font-semibold file:text-red-700" />{form.background_image && <img src={assetUrl(form.background_image)} alt="Background saat ini" className="mt-3 h-24 w-full rounded-lg object-cover" />}</label>
        <label className="block text-sm font-semibold text-slate-800">Logo hero<input type="file" accept="image/jpeg,image/png" onChange={(event) => setLogoFile(event.target.files?.[0] || null)} className="mt-2 block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-red-50 file:px-3 file:py-2 file:font-semibold file:text-red-700" />{form.logo && <img src={assetUrl(form.logo)} alt="Logo saat ini" className="mt-3 h-16 w-16 rounded-lg object-contain" />}</label>
        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end"><Button type="button" variant="outline" onClick={reset}>Batal</Button><Button type="submit" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan Slide'}</Button></div>
      </form>
    </div>
  </div></DashboardLayout>;
}
