import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import ProfileLayout from '../../components/public/ProfileLayout';
import { getLayananPublik } from '../../api/layanan';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const rupiah = (v) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(v));

function Foto({ src, alt }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  if (!src || failed) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-gradient-to-br from-red-900 to-red-600">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-xl font-bold text-red-700 shadow-lg">
          119
        </span>
      </div>
    );
  }
  return (
    <img
      src={`${API_URL}${src}`}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className="aspect-video w-full rounded-xl bg-slate-100 object-cover"
    />
  );
}

export default function LayananDetail() {
  const { slug } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Satu request: daftar layanan aktif dipakai untuk sidebar, detail, dan prev/next
  useEffect(() => {
    getLayananPublik()
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message || 'Gagal memuat layanan.'))
      .finally(() => setLoading(false));
  }, []);

  const index = items.findIndex((i) => i.slug === slug);
  const current = index >= 0 ? items[index] : null;

  const menu = useMemo(
    () => items.map((i) => ({ label: i.nama, to: `/layanan/${i.slug}` })),
    [items]
  );

  if (!loading && !error && !slug && items.length > 0) {
    return <Navigate to={`/layanan/${items[0].slug}`} replace />;
  }

  const prev = index > 0 ? menu[index - 1] : null;
  const next = index >= 0 && index < menu.length - 1 ? menu[index + 1] : null;

  const showTarif = current?.tarif_is_active && current.tarif !== null && current.tarif !== '';

  return (
    <ProfileLayout
      title={current?.nama || 'Layanan'}
      crumbs={[{ label: 'Layanan', to: '/layanan' }, ...(current ? [{ label: current.nama }] : [])]}
      menu={menu}
      prev={prev}
      next={next}
    >
      {loading ? (
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
          Memuat layanan...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      ) : !current ? (
        <div className="rounded-xl border border-slate-200 p-8 text-center">
          <p className="font-medium text-slate-700">
            {items.length === 0 ? 'Belum ada layanan.' : 'Layanan tidak ditemukan.'}
          </p>
          {items.length > 0 && (
            <Link
              to={`/layanan/${items[0].slug}`}
              className="mt-3 inline-block text-sm font-semibold text-red-700 hover:text-red-900"
            >
              Lihat layanan lainnya
            </Link>
          )}
        </div>
      ) : (
        <article>
          <h2 className="break-words text-2xl font-bold text-slate-900 sm:text-3xl">{current.nama}</h2>

          <div className="mt-6">
            <Foto src={current.foto} alt={current.nama} />
          </div>

          <p className="mt-6 whitespace-pre-line break-words text-base leading-relaxed text-slate-700">
            {current.deskripsi}
          </p>

          {showTarif && (
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tarif</p>
              <p className="mt-1 text-xl font-bold text-red-700">{rupiah(current.tarif)}</p>
            </div>
          )}
        </article>
      )}
    </ProfileLayout>
  );
}