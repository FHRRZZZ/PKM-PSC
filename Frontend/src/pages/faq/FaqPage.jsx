import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Button } from '../../components/Button';
import SearchInput from '../../components/SearchInput';
import ConfirmDialog from '../../components/ConfirmDialog';
import MessageError from '../../components/MessageError';
import { Edit3, Plus, ShieldCheck, Trash2 } from '../../components/Icons';
import { deleteFaq, getFaqsAdmin } from '../../api/faq';

export default function FaqPage() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [pending, setPending] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const load = async () => {
    try {
      setLoading(true);
      const data = await getFaqsAdmin();
      setItems(data);
    } catch (err) {
      setError(err.message || 'Gagal memuat data FAQ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return items.filter((item) =>
      `${item.pertanyaan} ${item.jawaban}`
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [items, query]);

  const remove = async () => {
    if (!pending) return;

    try {
      await deleteFaq(pending.id);
      setPending(null);
      await load();
    } catch (err) {
      setError(err.message || 'Gagal menghapus FAQ.');
      setPending(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen min-w-0 bg-slate-50">
        {/* Header */}
        <div className="mb-6">
          <p className="text-xs text-slate-500">
            Admin &gt; <b className="text-slate-800">FAQ</b>
          </p>

          <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
            CMS FAQ (Tanya Jawab Layanan)
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Kelola pertanyaan dan jawaban yang tampil di portal publik.
          </p>
        </div>

        {/* Error */}
        <div className="mb-6">
          <MessageError
            message={error}
            onClose={() => setError('')}
          />
        </div>

        {/* Search and Add */}
        <div className="mb-6 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="w-full min-w-0 sm:flex-1">
            <SearchInput
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari pertanyaan..."
            />
          </div>

          <Button
            type="button"
            onClick={() => navigate('/admin/faq/tambah')}
            className="flex w-full items-center justify-center gap-2 sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Tambah FAQ
          </Button>
        </div>

        {/* FAQ List */}
        {loading ? (
          <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
            Memuat data FAQ...
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
            {filtered.map((faq) => (
              <article
                key={faq.id}
                className="flex min-w-0 flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
              >
                <div>
                  {/* Status and Actions */}
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                        faq.is_active
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {faq.is_active ? 'Tampil' : 'Disembunyikan'}
                    </span>

                    <div className="grid grid-cols-2 gap-2 sm:flex">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/admin/faq/tambah?id=${faq.id}`)
                        }
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => setPending(faq)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Hapus
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <h4 className="mb-2 break-words font-bold text-slate-900">
                    {faq.pertanyaan}
                  </h4>

                  <p className="break-words text-sm leading-relaxed text-slate-500">
                    {faq.jawaban}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center sm:p-10">
            <p className="text-sm font-medium text-slate-700">
              {query
                ? 'FAQ yang dicari tidak ditemukan.'
                : 'Belum ada FAQ.'}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {query
                ? 'Coba gunakan kata kunci lain.'
                : 'Tambahkan FAQ baru untuk mulai mengelola data.'}
            </p>
          </div>
        )}

        {/* Information */}
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-4 sm:p-5">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />

          <div className="min-w-0">
            <h4 className="font-bold text-blue-950">
              Standar Komunikasi Publik Darurat
            </h4>

            <p className="mt-1 text-xs leading-relaxed text-blue-900/80 sm:text-sm">
              Pastikan setiap pembaruan FAQ memuat informasi yang akurat
              dan mudah dipahami masyarakat.
            </p>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={Boolean(pending)}
        title="Hapus FAQ"
        message={`FAQ "${pending?.pertanyaan || ''}" akan dihapus.`}
        confirmText="Hapus"
        onConfirm={remove}
        onCancel={() => setPending(null)}
      />
    </DashboardLayout>
  );
}