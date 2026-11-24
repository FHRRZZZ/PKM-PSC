import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProfileLayout from '../../components/public/ProfileLayout';
import { getBeritaPublikBySlug } from '../../api/berita';
import { BeritaFoto, formatTanggal } from './BeritaUtils';

function TombolBagikan({ judul }) {
  const [tersalin, setTersalin] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';

  const salin = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setTersalin(true);
      setTimeout(() => setTersalin(false), 2000);
    } catch {
      window.prompt('Salin tautan berikut:', url);
    }
  };

  const waUrl = `https://wa.me/?text=${encodeURIComponent(`${judul}\n${url}`)}`;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-slate-500">Bagikan:</span>
      <button
        type="button"
        onClick={salin}
        className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 transition-colors hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
      >
        {tersalin ? 'Tautan disalin ✓' : 'Salin tautan'}
      </button>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full border border-red-700 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
      >
        WhatsApp
      </a>
    </div>
  );
}

export default function BeritaDetailPublikPage() {
  const { slug } = useParams();
  const [berita, setBerita] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tidakDitemukan, setTidakDitemukan] = useState(false);

  const muat = useCallback(async () => {
    setLoading(true);
    setError('');
    setTidakDitemukan(false);
    setBerita(null);
    try {
      const res = await getBeritaPublikBySlug(slug);
      const item = res && res.judul === undefined && res.data ? res.data : res;
      if (!item || item.status !== 'terbit') {
        setTidakDitemukan(true);
      } else {
        setBerita(item);
      }
    } catch (err) {
      if (err?.status === 404 || /404|tidak ditemukan|not found/i.test(err?.message || '')) {
        setTidakDitemukan(true);
      } else {
        setError(err?.message || 'Gagal memuat berita.');
      }
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    muat();
  }, [muat]);

  return (
    <ProfileLayout
      title="Berita"
      crumbs={[{ label: 'Berita', to: '/berita' }, ...(berita ? [{ label: berita.judul }] : [])]}
    >
      <div className="mb-6">
        <Link
          to="/berita"
          className="inline-flex items-center gap-1 text-sm font-semibold text-red-700 hover:text-red-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
        >
          <span aria-hidden="true">←</span> Kembali ke Berita
        </Link>
      </div>

      {loading && (
        <div
          className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700"
          aria-busy="true"
          aria-live="polite"
        >
          Memuat berita...
        </div>
      )}

      {!loading && error && (
        <div role="alert" className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          <p>{error}</p>
          <button
            type="button"
            onClick={muat}
            className="mt-3 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
          >
            Coba lagi
          </button>
        </div>
      )}

      {!loading && tidakDitemukan && (
        <div className="rounded-xl border border-slate-200 p-8 text-center">
          <p className="font-medium text-slate-700">Berita tidak ditemukan.</p>
          <p className="mt-1 text-sm text-slate-500">
            Berita ini mungkin sudah dihapus atau belum diterbitkan.
          </p>
          <Link
            to="/berita"
            className="mt-3 inline-block text-sm font-semibold text-red-700 hover:text-red-900"
          >
            Lihat semua berita
          </Link>
        </div>
      )}

      {!loading && berita && (
        <article className="max-w-3xl">
          {berita.kategori?.nama && (
            <span className="inline-block rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
              {berita.kategori.nama}
            </span>
          )}
          <h2 className="mt-3 break-words text-2xl font-bold text-slate-900 sm:text-3xl">
            {berita.judul}
          </h2>
          <time dateTime={berita.tanggal_terbit} className="mt-2 block text-sm text-slate-500">
            {formatTanggal(berita.tanggal_terbit)}
          </time>

          <div className="mt-6">
            <BeritaFoto foto={berita.foto} alt={berita.judul} className="aspect-video w-full rounded-xl" />
          </div>

          <p className="mt-6 whitespace-pre-line break-words text-base leading-relaxed text-slate-700">
            {berita.deskripsi}
          </p>

          <div className="mt-10 border-t border-slate-200 pt-6">
            <TombolBagikan judul={berita.judul} />
          </div>
        </article>
      )}
    </ProfileLayout>
  );
}