import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MessageError from '../../components/MessageError';
import { createKontak, getKontak, updateKontak } from '../../api/kontak';

const initialForm = {
  no_darurat: '',
  hotline: '',
  email: '',
  alamat: '',
};

export default function KontakPage() {
  const [formData, setFormData] = useState(initialForm);
  const [contactId, setContactId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  useEffect(() => {
    let active = true;

    const loadKontak = async () => {
      try {
        const contacts = await getKontak();

        if (!active) return;

        const contact = contacts[0];

        if (contact) {
          setContactId(contact.id);
          setFormData({
            no_darurat: contact.no_darurat || '',
            hotline: contact.hotline || '',
            email: contact.email || '',
            alamat: contact.alamat || '',
          });
        }
      } catch (err) {
        if (active) setError(err.message || 'Gagal memuat informasi kontak.');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadKontak();

    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const contact = contactId
        ? await updateKontak(contactId, formData)
        : await createKontak(formData);

      setContactId(contact.id);

      setFormData({
        no_darurat: contact.no_darurat || formData.no_darurat,
        hotline: contact.hotline || formData.hotline,
        email: contact.email || formData.email,
        alamat: contact.alamat || formData.alamat,
      });

      setSuccess('Perubahan berhasil disimpan.');
    } catch (err) {
      setError(err.message || 'Gagal menyimpan informasi kontak.');
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
            Admin &gt;{' '}
            <b className="text-slate-800">Kontak</b>
          </p>

          <h1 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
            CMS Informasi Kontak Darurat &amp; Operasional
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Konfigurasi saluran komunikasi resmi untuk masyarakat.
          </p>
        </div>

        {/* Notifications */}
        <div className="mb-6 space-y-3">
          <MessageError
            message={error}
            onClose={() => setError('')}
          />

          <MessageError
            message={success}
            type="success"
            onClose={() => setSuccess('')}
          />
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full space-y-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
        >
          <h2 className="border-b border-slate-100 pb-4 text-sm font-bold tracking-wide text-red-800">
            PARAMETER SALURAN DARURAT
          </h2>

          {/* Input Fields */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {[
              ['no_darurat', 'Nomor Darurat', 'Contoh: 119'],
              ['hotline', 'Nomor Hotline', 'Contoh: 021...'],
              ['email', 'Email Resmi', 'admin@psc.depok.go.id'],
              ['alamat', 'Alamat Operasional', 'Masukkan alamat lengkap'],
            ].map(([name, label, placeholder]) => (
              <label
                key={name}
                className="block min-w-0 text-sm font-semibold text-slate-800"
              >
                {label}

                <input
                  type={name === 'email' ? 'email' : 'text'}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  required
                  disabled={loading || saving}
                  className="mt-2 block w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-normal text-slate-700 outline-none transition-colors focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </label>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setFormData(initialForm)}
              className="w-full rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              disabled={loading || saving}
            >
              Reset
            </button>

            <button
              type="submit"
              className="w-full rounded-xl bg-red-800 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-red-900 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              disabled={loading || saving}
            >
              {loading
                ? 'Memuat...'
                : saving
                  ? 'Menyimpan...'
                  : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}