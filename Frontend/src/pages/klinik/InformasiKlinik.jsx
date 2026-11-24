import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Button } from '../../components/Button';
import { buildBody, getProfil, updateProfil } from '../../api/klinik';
import { getLayananAdmin } from '../../api/layanan';

const inputClass = 'mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10';

export default function InformasiKlinik() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ nama: '', deskripsi: '', alamat: '', telepon: '', whatsapp: '', email: '', maps_embed: '', akreditasi: '', akreditasi_tahun: '', izin_operasional_nomor: '', izin_operasional_penerbit: '', izin_operasional_file: '' });
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getProfil(), getLayananAdmin('klinik')])
      .then(([profile, services]) => {
        setItems(services || []);
        setForm((current) => ({ ...current, ...profile }));
        const currentServices = String(profile.melayani || '').split(',').map((value) => value.trim()).filter(Boolean);
        setSelectedServices((services || []).filter((service) => currentServices.includes(service.nama)).map((service) => String(service.id)));
      })
      .catch((err) => setError(err.message || 'Gagal memuat informasi klinik.'))
      .finally(() => setLoading(false));
  }, []);

  const change = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const toggleService = (id) => {
    setSelectedServices((current) => current.includes(String(id))
      ? current.filter((value) => value !== String(id))
      : [...current, String(id)]);
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const melayani = items.filter((service) => selectedServices.includes(String(service.id))).map((service) => service.nama).join(', ');
      const fields = { ...form, melayani };
      const saved = await updateProfil(buildBody(fields));
      setForm((current) => ({ ...current, ...saved }));
      setMessage('Informasi klinik berhasil disimpan.');
    } catch (err) {
      setError(err.message || 'Gagal menyimpan informasi klinik.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen min-w-0 bg-slate-50">
        <div className="mb-6">
          <p className="text-xs text-slate-500">Admin &gt; Layanan Klinik &gt; <b className="text-slate-800">Informasi Klinik</b></p>
          <h1 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">Edit Informasi Klinik</h1>
          <p className="mt-1 text-sm text-slate-500">Kelola informasi tentang klinik, bukan detail satu layanan tertentu.</p>
        </div>

        {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        {message && <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div>}

        {loading ? <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">Memuat informasi klinik...</div> : (
          <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                <h2 className="mb-5 text-base font-bold text-slate-900">Identitas & Kontak Klinik</h2>
                <div className="space-y-5">
                  <label className="block text-sm font-semibold text-slate-800">Nama Klinik<input value={form.nama} onChange={change('nama')} className={inputClass} required /></label>
                  <label className="block text-sm font-semibold text-slate-800">Deskripsi<textarea value={form.deskripsi} onChange={change('deskripsi')} rows={4} className={`${inputClass} resize-y`} /></label>
                  <fieldset className="block text-sm font-semibold text-slate-800">
                    <legend>Layanan Klinik</legend>
                    <span className="mt-1 block text-xs font-normal text-slate-400">Pilih layanan yang tersedia di klinik.</span>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {items.map((service) => (
                        <label key={service.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-red-300 hover:bg-red-50">
                          <input type="checkbox" checked={selectedServices.includes(String(service.id))} onChange={() => toggleService(service.id)} className="h-4 w-4 accent-red-700" />
                          <span>{service.nama}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <label className="block text-sm font-semibold text-slate-800">Alamat<textarea value={form.alamat} onChange={change('alamat')} rows={3} className={`${inputClass} resize-y`} /></label>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block text-sm font-semibold text-slate-800">Telepon<input value={form.telepon} onChange={change('telepon')} className={inputClass} /></label>
                    <label className="block text-sm font-semibold text-slate-800">WhatsApp<input value={form.whatsapp} onChange={change('whatsapp')} className={inputClass} /></label>
                  </div>
                  <label className="block text-sm font-semibold text-slate-800">Email<input type="email" value={form.email} onChange={change('email')} className={inputClass} /></label>
                  <label className="block text-sm font-semibold text-slate-800">Maps Embed<textarea value={form.maps_embed} onChange={change('maps_embed')} rows={2} className={`${inputClass} resize-y`} /></label>
                </div>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                <h2 className="mb-5 text-base font-bold text-slate-900">Akreditasi & Izin Operasional Klinik</h2>
                <div className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block text-sm font-semibold text-slate-800">Akreditasi<input value={form.akreditasi} onChange={change('akreditasi')} className={inputClass} placeholder="Mis. Paripurna" /></label>
                    <label className="block text-sm font-semibold text-slate-800">Tahun Akreditasi<input value={form.akreditasi_tahun} onChange={change('akreditasi_tahun')} className={inputClass} /></label>
                  </div>
                  <label className="block text-sm font-semibold text-slate-800">Nomor Izin Operasional<input value={form.izin_operasional_nomor} onChange={change('izin_operasional_nomor')} className={inputClass} /></label>
                  <label className="block text-sm font-semibold text-slate-800">Penerbit Izin<input value={form.izin_operasional_penerbit} onChange={change('izin_operasional_penerbit')} className={inputClass} /></label>
                  <label className="block text-sm font-semibold text-slate-800">File Izin Operasional<input value={form.izin_operasional_file} onChange={change('izin_operasional_file')} className={inputClass} placeholder="/uploads/izin.pdf" /></label>
                </div>
              </section>
            </div>

            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <h2 className="mb-1 text-base font-bold text-slate-900">Informasi Pendukung Klinik</h2>
              <p className="mb-5 text-sm text-slate-500">Kelola data struktur layanan dan informasi pasien dari halaman informasi klinik.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Link to="/admin/klinik/struktur-organisasi" className="rounded-xl border border-slate-200 p-4 transition hover:border-red-300 hover:bg-red-50">
                  <p className="font-bold text-slate-900">Struktur Layanan</p>
                  <p className="mt-1 text-sm text-slate-500">Kelola penanggung jawab dan struktur pengelola klinik.</p>
                  <span className="mt-3 inline-block text-sm font-bold text-red-700">Kelola data →</span>
                </Link>
                <Link to="/admin/klinik/informasi-pasien" className="rounded-xl border border-slate-200 p-4 transition hover:border-red-300 hover:bg-red-50">
                  <p className="font-bold text-slate-900">Informasi Pasien</p>
                  <p className="mt-1 text-sm text-slate-500">Kelola alur berobat dan pilihan penjaminan pasien.</p>
                  <span className="mt-3 inline-block text-sm font-bold text-red-700">Kelola data →</span>
                </Link>
              </div>
            </section>

            <div className="flex justify-end">
              <Button type="submit" disabled={saving} className="w-full sm:w-auto">{saving ? 'Menyimpan...' : 'Simpan Informasi Klinik'}</Button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}
