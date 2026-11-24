import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Button } from '../../components/Button';
import { getProfil, updateProfil, buildBody } from '../../api/klinik';
import {
  Field,
  LoadingBox,
  Notice,
  PageHeader,
  PhotoInput,
  fotoSrc,
  inputCls,
  useFlash,
} from './KlinikUI';

const FIELDS = [
  'nama', 'deskripsi', 'melayani', 'alamat', 'telepon', 'whatsapp', 'email',
  'maps_embed', 'akreditasi', 'akreditasi_tahun',
  'izin_operasional_nomor', 'izin_operasional_penerbit', 'izin_operasional_file',
];

const toForm = (p = {}) => ({
  ...Object.fromEntries(FIELDS.map((f) => [f, p[f] ?? ''])),
  foto: null,
  fotoUrl: p.foto || '',
});

const Card = ({ title, children }) => (
  <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
    <h2 className="mb-5 text-base font-bold text-slate-900">{title}</h2>
    <div className="space-y-5">{children}</div>
  </section>
);

export default function ProfilKlinik() {
  const [form, setForm] = useState(toForm());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [msg, flash] = useFlash();

  useEffect(() => {
    getProfil()
      .then((p) => setForm(toForm(p)))
      .catch((err) => setError(err.message || 'Gagal memuat profil klinik.'))
      .finally(() => setLoading(false));
  }, []);

  const change = (f) => (e) => setForm((c) => ({ ...c, [f]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.nama.trim()) return setError('Nama klinik wajib diisi.');

    setSaving(true);
    setError('');
    try {
      const data = Object.fromEntries(FIELDS.map((f) => [f, form[f]]));
      const saved = await updateProfil(buildBody(data, form.foto));
      setForm(toForm(saved));
      flash('Profil klinik berhasil disimpan.');
    } catch (err) {
      setError(err.message || 'Gagal menyimpan profil klinik.');
    } finally {
      setSaving(false);
    }
  };

  const text = (name, label, props = {}) => (
    <Field label={label} required={props.required}>
      <input
        value={form[name]}
        onChange={change(name)}
        className={inputCls}
        {...props}
      />
    </Field>
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen min-w-0 bg-slate-50">
        <PageHeader
          title="Profil Klinik"
          desc="Kelola identitas, kontak, akreditasi, dan informasi izin klinik."
        />
        <Notice message={msg} error={error} onCloseError={() => setError('')} />

        {loading ? (
          <LoadingBox text="Memuat profil klinik..." />
        ) : (
          <form onSubmit={submit} className="space-y-6">
            <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-2">
              <Card title="Profil & Kontak">
                {text('nama', 'Nama Klinik', { required: true, placeholder: 'Nama klinik' })}
                <Field label="Deskripsi">
                  <textarea rows={4} value={form.deskripsi} onChange={change('deskripsi')} className={`${inputCls} resize-y`} />
                </Field>
                <Field label="Melayani" hint="(siapa saja yang dilayani)">
                  <textarea rows={3} value={form.melayani} onChange={change('melayani')} className={`${inputCls} resize-y`} />
                </Field>
                <Field label="Alamat">
                  <textarea rows={3} value={form.alamat} onChange={change('alamat')} className={`${inputCls} resize-y`} />
                </Field>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {text('telepon', 'Telepon')}
                  {text('whatsapp', 'WhatsApp')}
                </div>
                {text('email', 'Email', { type: 'email' })}
                <Field label="Maps Embed" hint="(URL embed Google Maps)">
                  <textarea rows={2} value={form.maps_embed} onChange={change('maps_embed')} className={`${inputCls} resize-y`} />
                </Field>
              </Card>

              <div className="min-w-0 space-y-6">
                <Card title="Foto Klinik">
                  <PhotoInput
                    file={form.foto}
                    url={form.fotoUrl}
                    label="Foto Utama"
                    onChange={(foto) => setForm((c) => ({ ...c, foto }))}
                  />
                </Card>

                <Card title="Akreditasi & Izin Operasional">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {text('akreditasi', 'Akreditasi', { placeholder: 'Mis. Paripurna' })}
                    {text('akreditasi_tahun', 'Tahun Akreditasi', { maxLength: 10 })}
                  </div>
                  {text('izin_operasional_nomor', 'Nomor Izin Operasional')}
                  {text('izin_operasional_penerbit', 'Penerbit Izin')}
                  <Field label="File Izin Operasional" hint="(URL/path file)">
                    <input
                      value={form.izin_operasional_file}
                      onChange={change('izin_operasional_file')}
                      placeholder="/uploads/izin.pdf"
                      className={inputCls}
                    />
                  </Field>
                  {form.izin_operasional_file && (
                    <a
                      href={fotoSrc(form.izin_operasional_file)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block text-xs font-semibold text-blue-700 hover:text-blue-900"
                    >
                      Buka file izin
                    </a>
                  )}
                </Card>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={saving} className="w-full sm:w-auto">
                {saving ? 'Menyimpan...' : 'Simpan Profil'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}