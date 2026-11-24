import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ProfileLayout from '../../components/public/ProfileLayout';
import { getBeritaPublik } from '../../api/berita';
import {
  BeritaFoto,
  formatTanggal,
  ringkasan,
  urutkanTerbit,
} from './BeritaUtils';

const JUMLAH_AWAL = 6;

function Skeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <div className="aspect-[16/7] animate-pulse rounded-xl bg-slate-200" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="aspect-video animate-pulse bg-slate-200" />
            <div className="space-y-3 p-4">
              <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200" />
              <div className="h-5 w-4/5 animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Kategori({ nama }) {
  if (!nama) return null;
  return (
    <span className="inline-block max-w-full truncate rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
      {nama}
    </span>
  );
}

function Featured({ berita }) {
  return (
    <Link
      to={`/berita/${berita.slug}`}
      className="group grid min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 md:grid-cols-2"
    >
      <BeritaFoto
        foto={berita.foto}
        alt={berita.judul}
        className="aspect-video h-full w-full md:aspect-auto md:min-h-72"
      />
      <div className="flex min-w-0 flex-col justify-center gap-3 p-5 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-red-700 px-3 py-1 text-xs font-semibold text-white">
            Terbaru
          </span>
          <Kategori nama={berita.kategori?.nama} />
        </div>
        <h2 className="break-words text-2xl font-bold leading-snug text-slate-900 group-hover:text-red-700 sm:text-3xl">
          {berita.judul}
        </h2>
        <time dateTime={berita.tanggal_terbit} className="text-sm text-slate-500">
          {formatTanggal(berita.tanggal_terbit)}
        </time>
        <p className="break-words text-slate-600">{ringkasan(berita.deskripsi, 220)}</p>
        <span className="mt-1 text-sm font-semibold text-red-700">Baca selengkapnya →</span>
      </div>
    </Link>
  );
}

function Kartu({ berita }) {
  return (
    <Link
      to={`/berita/${berita.slug}`}
      className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
    >
      <BeritaFoto foto={berita.foto} alt={berita.judul} className="aspect-video w-full" />
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4 sm:p-5">
        <div>
          <Kategori nama={berita.kategori?.nama} />
        </div>
        <h3 className="line-clamp-2 break-words text-lg font-bold leading-snug text-slate-900 group-hover:text-red-700">
          {berita.judul}
        </h3>
        <time dateTime={berita.tanggal_terbit} className="text-xs text-slate-500">
          {formatTanggal(berita.tanggal_terbit)}
        </time>
        <p className="line-clamp-3 break-words text-sm text-slate-600">
          {ringkasan(berita.deskripsi)}
        </p>
      </div>
    </Link>
  );
}

export default function BeritaPublikPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [kategoriAktif, setKategoriAktif] = useState('semua');
  const [tampil, setTampil] = useState(JUMLAH_AWAL);

  const muat = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getBeritaPublik();
      const list = Array.isArray(res) ? res : res?.data;
      setData(urutkanTerbit(list));
    } catch (err) {
      setError(err?.message || 'Gagal memuat berita.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    muat();
  }, [muat]);

  const daftarKategori = useMemo(() => {
    const peta = new Map();
    data.forEach((b) => {
      if (b.kategori?.id != null) peta.set(b.kategori.id, b.kategori.nama);
    });
    return Array.from(peta, ([id, nama]) => ({ id: String(id), nama }));
  }, [data]);

  const terfilter = useMemo(
    () =>
      kategoriAktif === 'semua'
        ? data
        : data.filter((b) => String(b.kategori?.id) === kategoriAktif),
    [data, kategoriAktif]
  );

  const pilihKategori = (id) => {
    setKategoriAktif(id);
    setTampil(JUMLAH_AWAL);
  };

  const [featured, ...sisa] = terfilter;
  const grid = sisa.slice(0, tampil);
  const masihAda = sisa.length > tampil;

  return (
    <ProfileLayout title="Berita" crumbs={[{ label: 'Berita' }]}>
      <section className="mb-8 overflow-hidden rounded-2xl bg-[#243042] text-white shadow-sm">
        <div className="grid gap-6 px-6 py-7 sm:px-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-300">Pusat informasi PSC 119</p>
            <h2 className="mt-2 max-w-xl text-2xl font-bold leading-tight sm:text-3xl">Kabar layanan dan edukasi untuk warga Depok</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">Ikuti informasi resmi, panduan pertolongan pertama, dan kegiatan pelayanan kegawatdaruratan dari tim kami.</p>
          </div>
          <div className="grid grid-cols-3 gap-2 border-t border-white/15 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <div><p className="text-2xl font-bold text-white">{data.length}</p><p className="mt-1 text-[11px] text-slate-300">Artikel terbit</p></div>
            <div><p className="text-2xl font-bold text-white">{daftarKategori.length}</p><p className="mt-1 text-[11px] text-slate-300">Kategori</p></div>
            <div><p className="text-2xl font-bold text-red-300">119</p><p className="mt-1 text-[11px] text-slate-300">Nomor darurat</p></div>
          </div>
        </div>
      </section>

      {loading && <Skeleton />}

      {!loading && error && (
        <div role="alert" className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          <p>{error}</p>
          <button
            type="button"
            onClick={muat}
            className="mt-3 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
          >
            Coba lagi
          </button>
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <div className="rounded-xl border border-slate-200 p-8 text-center">
          <p className="font-medium text-slate-700">Belum ada berita.</p>
          <p className="mt-1 text-sm text-slate-500">Berita yang diterbitkan akan tampil di sini.</p>
        </div>
      )}

      {!loading && !error && data.length > 0 && (
        <>
          {daftarKategori.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter kategori">
              {[{ id: 'semua', nama: 'Semua' }, ...daftarKategori].map((k) => {
                const aktif = kategoriAktif === k.id;
                return (
                  <button
                    key={k.id}
                    type="button"
                    onClick={() => pilihKategori(k.id)}
                    aria-pressed={aktif}
                    className={`rounded-full border px-4 py-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 ${
                      aktif
                        ? 'border-red-700 bg-red-50 font-semibold text-red-700'
                        : 'border-slate-200 text-slate-500 hover:text-red-700'
                    }`}
                  >
                    {k.nama}
                  </button>
                );
              })}
            </div>
          )}

          {featured && (
            <div className="mb-6">
              <Featured berita={featured} />
            </div>
          )}

          {grid.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {grid.map((b) => (
                <Kartu key={b.id} berita={b} />
              ))}
            </div>
          )}

          {masihAda && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setTampil((n) => n + JUMLAH_AWAL)}
                className="rounded-full border border-red-700 px-6 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
              >
                Muat lebih banyak
              </button>
            </div>
          )}
        </>
      )}
    </ProfileLayout>
  );
}
