import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import ProfileLayout from '../../components/public/ProfileLayout';
import { dokterApi, jadwalApi, jamApi } from '../../api/klinik';
import { fotoUrl } from '../berita/BeritaUtils';
import {
  URUTAN_HARI,
  aktif,
  formatJam,
  namaHariIni,
  normalHari,
  statusBuka,
  toArray,
  urutHari,
  useNow,
} from './klinikUtils';

const SECTIONS = [
  { slug: 'jam-operasional', label: 'Jam Operasional' },
  { slug: 'dokter', label: 'Dokter' },
  { slug: 'jadwal-praktik', label: 'Jadwal Praktik' },
];

const MENU = SECTIONS.map((s) => ({ label: s.label, to: `/klinik/${s.slug}` }));

const AMBIL = {
  'jam-operasional': async () => ({ jam: toArray(await jamApi.list()) }),
  dokter: async () => {
    const [d, j] = await Promise.all([dokterApi.list(), jadwalApi.list()]);
    return { dokter: toArray(d), jadwal: toArray(j) };
  },
  'jadwal-praktik': async () => {
    const [d, j] = await Promise.all([dokterApi.list(), jadwalApi.list()]);
    return { dokter: toArray(d), jadwal: toArray(j) };
  },
};

function BadgeHariIni() {
  return (
    <span className="rounded-full bg-red-700 px-2 py-0.5 text-[11px] font-semibold text-white">
      Hari ini
    </span>
  );
}

function FotoDokter({ src, nama }) {
  const [gagal, setGagal] = useState(false);
  const url = fotoUrl(src);
  useEffect(() => setGagal(false), [url]);

  if (!url || gagal) {
    const inisial = String(nama || '?')
      .replace(/^(dr\.?|drg\.?)\s*/i, '')
      .split(/\s+/)
      .slice(0, 2)
      .map((k) => k[0])
      .join('')
      .toUpperCase();
    return (
      <div
        role="img"
        aria-label={nama}
        className="flex aspect-[4/3] w-full items-center justify-center bg-gradient-to-br from-red-900 to-red-600"
      >
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-2xl font-bold text-red-700 shadow-lg">
          {inisial}
        </span>
      </div>
    );
  }
  return (
    <img
      src={url}
      alt={nama}
      loading="lazy"
      onError={() => setGagal(true)}
      className="aspect-[4/3] w-full bg-slate-100 object-cover object-top"
    />
  );
}

function JamOperasional({ rows, now }) {
  const hari = namaHariIni(now);
  const status = statusBuka(rows, now);
  const urut = [...rows].sort((a, b) => urutHari(a.hari) - urutHari(b.hari));

  if (urut.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 p-8 text-center">
        <p className="font-medium text-slate-700">Jam operasional belum tersedia.</p>
      </div>
    );
  }

  return (
    <div>
      {status && (
        <p
          className={`mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
            status.buka ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
          }`}
          role="status"
        >
          <span
            className={`h-2 w-2 rounded-full ${status.buka ? 'bg-emerald-500' : 'bg-slate-400'}`}
            aria-hidden="true"
          />
          {status.buka
            ? `Buka sekarang · sampai ${status.sampai}`
            : status.bukaLagi
              ? `Tutup · buka pukul ${status.bukaLagi}`
              : 'Tutup sekarang'}
        </p>
      )}

      <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200">
        {urut.map((r) => {
          const hariIni = normalHari(r.hari) === hari;
          const jam =
            r.is_tutup || !r.jam_buka || !r.jam_tutup
              ? null
              : `${formatJam(r.jam_buka)} – ${formatJam(r.jam_tutup)}`;
          return (
            <li
              key={r.id}
              className={`flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3 sm:px-5 ${
                hariIni ? 'bg-red-50' : 'bg-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`font-semibold ${hariIni ? 'text-red-700' : 'text-slate-900'}`}>
                  {normalHari(r.hari)}
                </span>
                {hariIni && <BadgeHariIni />}
              </div>
              <div className="text-right">
                {jam ? (
                  <span className="font-medium text-slate-700">{jam}</span>
                ) : (
                  <span className="font-medium text-slate-400">Tutup</span>
                )}
                {r.keterangan && <p className="text-xs text-slate-500">{r.keterangan}</p>}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function DaftarDokter({ dokter, jadwal }) {
  const list = dokter.filter((d) => aktif(d.is_active));

  const jadwalPerDokter = useMemo(() => {
    const peta = new Map();
    jadwal
      .filter((j) => aktif(j.is_active))
      .sort((a, b) => urutHari(a.hari) - urutHari(b.hari) || String(a.jam_mulai).localeCompare(String(b.jam_mulai)))
      .forEach((j) => {
        const arr = peta.get(j.dokter_id) || [];
        arr.push(j);
        peta.set(j.dokter_id, arr);
      });
    return peta;
  }, [jadwal]);

  if (list.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 p-8 text-center">
        <p className="font-medium text-slate-700">Belum ada data dokter.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {list.map((d) => {
        const jadwalDokter = jadwalPerDokter.get(d.id) || [];
        return (
          <article
            key={d.id}
            className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white"
          >
            <FotoDokter src={d.foto} nama={d.nama} />
            <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
              <div className="min-w-0">
                <h3 className="break-words text-lg font-bold leading-snug text-slate-900">{d.nama}</h3>
                {d.spesialisasi && (
                  <p className="mt-0.5 break-words text-sm font-medium text-red-700">{d.spesialisasi}</p>
                )}
              </div>

              <div className="border-t border-slate-100 pt-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Jadwal praktik</p>
                {jadwalDokter.length === 0 ? (
                  <p className="mt-1 text-sm text-slate-400">Belum ada jadwal.</p>
                ) : (
                  <ul className="mt-1.5 space-y-1 text-sm">
                    {jadwalDokter.map((j) => (
                      <li key={j.id} className="flex justify-between gap-3">
                        <span className="text-slate-700">{normalHari(j.hari)}</span>
                        <span className="text-right font-medium text-slate-900">
                          {formatJam(j.jam_mulai)} – {formatJam(j.jam_selesai)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function JadwalPraktik({ dokter, jadwal, now }) {
  const hari = namaHariIni(now);

  const peta = useMemo(() => new Map(dokter.map((d) => [d.id, d])), [dokter]);

  const perHari = useMemo(() => {
    const hasil = Object.fromEntries(URUTAN_HARI.map((h) => [h, []]));
    jadwal
      .filter((j) => aktif(j.is_active))
      .forEach((j) => {
        const d = peta.get(j.dokter_id) || j.dokter;
        if (d && !aktif(d.is_active)) return;
        const h = normalHari(j.hari);
        if (!hasil[h]) return;
        hasil[h].push({ ...j, namaDokter: d?.nama || 'Dokter', spesialisasi: d?.spesialisasi });
      });
    Object.values(hasil).forEach((arr) =>
      arr.sort((a, b) => String(a.jam_mulai).localeCompare(String(b.jam_mulai)))
    );
    return hasil;
  }, [jadwal, peta]);

  const adaJadwal = URUTAN_HARI.some((h) => perHari[h].length > 0);

  if (!adaJadwal) {
    return (
      <div className="rounded-xl border border-slate-200 p-8 text-center">
        <p className="font-medium text-slate-700">Jadwal praktik belum tersedia.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {URUTAN_HARI.map((h) => {
        const items = perHari[h];
        const hariIni = h === hari;
        return (
          <section
            key={h}
            className={`overflow-hidden rounded-xl border ${hariIni ? 'border-red-200' : 'border-slate-200'}`}
          >
            <header
              className={`flex items-center gap-2 px-4 py-2.5 sm:px-5 ${hariIni ? 'bg-red-50' : 'bg-slate-50'}`}
            >
              <h3 className={`font-semibold ${hariIni ? 'text-red-700' : 'text-slate-900'}`}>{h}</h3>
              {hariIni && <BadgeHariIni />}
            </header>

            {items.length === 0 ? (
              <p className="px-4 py-3 text-sm text-slate-400 sm:px-5">Tidak ada jadwal praktik.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {items.map((j) => (
                  <li
                    key={j.id}
                    className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3 sm:px-5"
                  >
                    <div className="min-w-0">
                      <p className="break-words font-medium text-slate-900">{j.namaDokter}</p>
                      {j.spesialisasi && <p className="break-words text-sm text-slate-500">{j.spesialisasi}</p>}
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-700">
                        {formatJam(j.jam_mulai)} – {formatJam(j.jam_selesai)}
                      </p>
                      {j.ruang && <p className="text-xs text-slate-500">{j.ruang}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}

export default function KlinikDetail() {
  const { slug } = useParams();
  const now = useNow();
  const index = SECTIONS.findIndex((s) => s.slug === slug);
  const section = index >= 0 ? SECTIONS[index] : null;

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!section) return undefined;
    let batal = false;
    setLoading(true);
    setError('');
    setData({});
    AMBIL[section.slug]()
      .then((hasil) => !batal && setData(hasil))
      .catch((err) => !batal && setError(err.message || 'Gagal memuat data klinik.'))
      .finally(() => !batal && setLoading(false));
    return () => {
      batal = true;
    };
  }, [section]);

  if (!slug) return <Navigate to={`/klinik/${SECTIONS[0].slug}`} replace />;

  const prev = index > 0 ? MENU[index - 1] : null;
  const next = index >= 0 && index < MENU.length - 1 ? MENU[index + 1] : null;

  return (
    <ProfileLayout
      title={section?.label || 'Klinik'}
      crumbs={[{ label: 'Klinik', to: `/klinik/${SECTIONS[0].slug}` }, ...(section ? [{ label: section.label }] : [])]}
      menu={MENU}
      prev={prev}
      next={next}
    >
      {!section ? (
        <div className="rounded-xl border border-slate-200 p-8 text-center">
          <p className="font-medium text-slate-700">Halaman tidak ditemukan.</p>
          <Link
            to={`/klinik/${SECTIONS[0].slug}`}
            className="mt-3 inline-block text-sm font-semibold text-red-700 hover:text-red-900"
          >
            Lihat informasi klinik
          </Link>
        </div>
      ) : loading ? (
        <div
          className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700"
          aria-busy="true"
          aria-live="polite"
        >
          Memuat {section.label.toLowerCase()}...
        </div>
      ) : error ? (
        <div role="alert" className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <article>
          <h2 className="mb-6 break-words text-2xl font-bold text-slate-900 sm:text-3xl">{section.label}</h2>
          {section.slug === 'jam-operasional' && <JamOperasional rows={data.jam || []} now={now} />}
          {section.slug === 'dokter' && <DaftarDokter dokter={data.dokter || []} jadwal={data.jadwal || []} />}
          {section.slug === 'jadwal-praktik' && (
            <JadwalPraktik dokter={data.dokter || []} jadwal={data.jadwal || []} now={now} />
          )}
        </article>
      )}
    </ProfileLayout>
  );
}