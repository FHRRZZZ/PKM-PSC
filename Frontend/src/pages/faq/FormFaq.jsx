import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Button } from '../../components/Button';
import MessageError from '../../components/MessageError';
import { createFaq, getFaqAdminById, updateFaq } from '../../api/faq';

const initial = {
  pertanyaan: '',
  jawaban: '',
  urutan: 0,
  is_active: true,
};

export default function FormFaq() {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const [params] = useSearchParams();
  const navigate = useNavigate();
  const id = params.get('id');

  useEffect(() => {
    let active = true;

    const loadFaq = async () => {
      if (!id) {
        setForm(initial);
        return;
      }

      try {
        setLoading(true);
        const item = await getFaqAdminById(id);

        if (active) {
          setForm({
            pertanyaan: item.pertanyaan || '',
            jawaban: item.jawaban || '',
            urutan: item.urutan ?? 0,
            is_active: item.is_active ?? true,
          });
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Gagal memuat data FAQ.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadFaq();

    return () => {
      active = false;
    };
  }, [id]);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();

    if (saving) return;

    setSaving(true);
    setError('');

    try {
      if (id) {
        await updateFaq(id, form);
      } else {
        await createFaq(form);
      }

      navigate('/admin/faq');
    } catch (err) {
      setError(err.message || 'Gagal menyimpan FAQ.');
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
            Admin &gt; FAQ &gt; <b className="text-slate-800">{id ? 'Edit' : 'Tambah'}</b>
          </p>

          <h1 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
            {id ? 'Edit FAQ' : 'Tambah FAQ'}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Tulis jawaban yang ringkas, jelas, dan mudah dipahami.
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
            Memuat data FAQ...
          </div>
        ) : (
          <form
            onSubmit={submit}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
          >
            <div className="space-y-5 sm:space-y-6">
              {/* Pertanyaan */}
              <label className="block text-sm font-semibold text-slate-800">
                Pertanyaan *

                <input
                  type="text"
                  value={form.pertanyaan}
                  onChange={(event) =>
                    handleChange('pertanyaan', event.target.value)
                  }
                  required
                  maxLength={255}
                  className="mt-2 w-full min-w-0 rounded-xl border border-slate-200 px-3 py-3 text-sm font-normal text-slate-700 outline-none transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-500/10 sm:px-4"
                  placeholder="Contoh: Apakah layanan ambulans tersedia 24 jam?"
                />
              </label>

              {/* Jawaban */}
              <label className="block text-sm font-semibold text-slate-800">
                Jawaban *

                <textarea
                  value={form.jawaban}
                  onChange={(event) =>
                    handleChange('jawaban', event.target.value)
                  }
                  required
                  rows={7}
                  className="mt-2 w-full min-w-0 resize-y rounded-xl border border-slate-200 px-3 py-3 text-sm font-normal leading-relaxed text-slate-700 outline-none transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-500/10 sm:px-4"
                  placeholder="Tulis jawaban FAQ"
                />
              </label>

              {/* Urutan */}
              <label className="block text-sm font-semibold text-slate-800 sm:max-w-xs">
                Urutan

                <input
                  type="number"
                  min="0"
                  value={form.urutan}
                  onChange={(event) =>
                    handleChange('urutan', Number(event.target.value))
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-normal text-slate-700 outline-none transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-500/10 sm:px-4"
                />

                <span className="mt-1 block text-xs font-normal text-slate-400">
                  Angka lebih kecil akan ditampilkan lebih dahulu.
                </span>
              </label>

              {/* Status */}
              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800">
                    Tampilkan di website
                  </p>
                  <p className="mt-1 text-xs font-normal text-slate-500">
                    FAQ akan terlihat oleh pengunjung jika diaktifkan.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(event) =>
                    handleChange('is_active', event.target.checked)
                  }
                  className="h-5 w-5 shrink-0 cursor-pointer accent-red-700"
                />
              </label>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/faq')}
                disabled={saving}
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
    </DashboardLayout>
  );
}