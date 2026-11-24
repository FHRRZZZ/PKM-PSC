import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import ProfileLayout from '../../components/public/ProfileLayout';
import { getProfil, jamApi, strukturApi, galeriApi } from '../../api/klinik';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const SECTIONS = [
  { slug: 'profil', label: 'Profil Klinik' },
  { slug: 'struktur-organisasi', label: 'Struktur Organisasi' },
  { slug: 'galeri-fasilitas', label: 'Galeri Fasilitas' },
];
const MENU = SECTIONS.map((s) => ({ label: s.label, to: `/tentang/${s.slug}` }));

const byUrutan = (a, b) => (a.urutan ?? 0) - (b.urutan ?? 0);
const hhmm = (t) => (t ? String(t).slice(0, 5) : '');
const waLink = (v) => {
  const d = String(v || '').replace(/\D/g, '');
  return d ? `https://wa.me/${d.startsWith('0') ? `62${d.slice(1)}` : d}` : null;
};

/* ---------- shared ---------- */

function Foto({ src, alt, className = '', fallback = 'KLINIK' }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-red-900 to-red-600 ${className}`}
        role="img"
        aria-label={alt}
      >
        <span className="px-2 text-center text-xs font-bold tracking-wider text-white/90">{fallback}</span>
      </div>
    );
  }
  return (
    <img
      src={`${API_URL}${src}`}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`bg-slate-100 object-cover ${className}`}
    />
  );
}

const Notice = ({ tone = 'info', children }) => {
  const t =
    tone === 'error'
      ? 'border-red-100 bg-red-50 text-red-700'
      : 'border-blue-100 bg-blue-50 text-blue-700';
  return <div className={`rounded-xl border p-4 text-sm ${t}`}>{children}</div>;
};

const Empty = ({ children }) => (
  <div className="rounded-xl border border-slate-200 p-8 text-center font-medium text-slate-700">{children}</div>
);

function useLoad(loader) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError('');
    loader()
      .then((d) => alive && setData(d))
      .catch((e) => alive && setError(e.message || 'Gagal memuat data.'))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [loader]);

  return { data, loading, error };
}

const Gate = ({ loading, error, children }) =>
  loading ? <Notice>Memuat...</Notice> : error ? <Notice tone="error">{error}</Notice> : children;

/* ---------- Profil ---------- */

const Row = ({ label, children }) =>
  children ? (
    <div className="flex flex-col gap-0.5 py-2 sm:flex-row sm:gap-4">
      <dt className="w-40 shrink-0 text-sm font-semibold text-slate-500">{label}</dt>
      <dd className="min-w-0 break-words text-sm text-slate-800">{children}</dd>
    </div>
  ) : null;

const linkCls = 'font-medium text-red-700 hover:text-red-900 hover:underline';

const loadProfil = () => Promise.all([getProfil(), jamApi.list()]);

function Profil() {
  const { data, loading, error } = useLoad(loadProfil);
  const [p, jamRaw] = data || [];
  const jam = useMemo(() => (Array.isArray(jamRaw) ? jamRaw : []), [jamRaw]);
  const wa = waLink(p?.whatsapp);

  return (
    <Gate loading={loading} error={error}>
      {!p ? (
        <Empty>Profil klinik belum tersedia.</Empty>
      ) : (
        <article className="space-y-8">
          <header>
            <h2 className="break-words text-2xl font-bold text-slate-900 sm:text-3xl">{p.nama}</h2>
            <Foto src={p.foto} alt={p.nama} fallback="FOTO KLINIK" className="mt-6 aspect-video w-full rounded-xl" />
          </header>

          {p.deskripsi && (
            <p className="whitespace-pre-line break-words text-base leading-relaxed text-slate-700">{p.deskripsi}</p>
          )}

          {p.melayani && (
            <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Kami Melayani</h3>
              <p className="mt-1 whitespace-pre-line break-words text-slate-800">{p.melayani}</p>
            </section>
          )}

          <section>
            <h3 className="text-lg font-bold text-slate-900">Akreditasi &amp; Perizinan</h3>
            <dl className="mt-2 divide-y divide-slate-100 rounded-xl border border-slate-200 px-4">
              <Row label="Akreditasi">
                {p.akreditasi}
                {p.akreditasi_tahun ? ` (${p.akreditasi_tahun})` : ''}
              </Row>
              <Row label="Nomor Izin">{p.izin_operasional_nomor}</Row>
              <Row label="Penerbit Izin">{p.izin_operasional_penerbit}</Row>
              <Row label="Dokumen Izin">
                {p.izin_operasional_file && (
                  <a
                    href={`${API_URL}${p.izin_operasional_file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkCls}
                  >
                    Lihat dokumen
                  </a>
                )}
              </Row>
            </dl>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900">Jam Operasional</h3>
            {jam.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">Belum ada jam operasional.</p>
            ) : (
              <ul className="mt-2 divide-y divide-slate-100 rounded-xl border border-slate-200 px-4">
                {jam.map((j) => (
                  <li key={j.id} className="flex items-baseline justify-between gap-4 py-2 text-sm">
                    <span className="font-semibold text-slate-800">{j.hari}</span>
                    <span className="text-right text-slate-700">
                      {j.is_tutup ? (
                        <span className="font-semibold text-red-700">Tutup</span>
                      ) : (
                        `${hhmm(j.jam_buka)} – ${hhmm(j.jam_tutup)}`
                      )}
                      {j.keterangan && <span className="block text-xs text-slate-500">{j.keterangan}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900">Kontak &amp; Lokasi</h3>
            <dl className="mt-2 divide-y divide-slate-100 rounded-xl border border-slate-200 px-4">
              <Row label="Alamat">{p.alamat}</Row>
              <Row label="Telepon">
                {p.telepon && (
                  <a href={`tel:${p.telepon.replace(/[^\d+]/g, '')}`} className={linkCls}>
                    {p.telepon}
                  </a>
                )}
              </Row>
              <Row label="WhatsApp">
                {wa && (
                  <a href={wa} target="_blank" rel="noopener noreferrer" className={linkCls}>
                    {p.whatsapp}
                  </a>
                )}
              </Row>
              <Row label="Email">
                {p.email && (
                  <a href={`mailto:${p.email}`} className={linkCls}>
                    {p.email}
                  </a>
                )}
              </Row>
            </dl>
            {/* {p.maps_embed && (
              <iframe
                title={`Peta lokasi ${p.nama}`}
                src={p.maps_embed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="mt-4 aspect-video w-full rounded-xl border border-slate-200"
              />
            )} */}
          </section>
        </article>
      )}
    </Gate>
  );
}

/* ---------- Struktur Organisasi ---------- */

function buildTree(rows) {
  const active = rows.filter((r) => r.is_active !== false).sort(byUrutan);
  const map = new Map(active.map((r) => [r.id, { ...r, children: [] }]));
  const roots = [];
  map.forEach((n) => {
    const parent = n.parent_id != null ? map.get(n.parent_id) : null;
    if (parent && parent !== n) parent.children.push(n);
    else roots.push(n);
  });
  return roots;
}

function OrgNode({ node }) {
  return (
    <li className="flex flex-col items-center">
      <div className="w-40 rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm sm:w-44">
        <Foto
          src={node.foto}
          alt={node.nama}
          fallback={node.nama?.slice(0, 1)?.toUpperCase()}
          className="mx-auto h-20 w-20 rounded-full"
        />
        <p className="mt-2 break-words text-sm font-bold text-slate-900">{node.nama}</p>
        <p className="break-words text-xs text-red-700">{node.jabatan}</p>
      </div>
      {node.children.length > 0 && (
        <>
          <span className="h-5 w-px bg-slate-300" aria-hidden="true" />
          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-6 border-t border-slate-300 pt-5">
            {node.children.map((c) => (
              <OrgNode key={c.id} node={c} />
            ))}
          </ul>
        </>
      )}
    </li>
  );
}

function Struktur() {
  const { data, loading, error } = useLoad(strukturApi.list);
  const roots = useMemo(() => buildTree(Array.isArray(data) ? data : []), [data]);

  return (
    <Gate loading={loading} error={error}>
      <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Struktur Organisasi</h2>
      {roots.length === 0 ? (
        <div className="mt-6">
          <Empty>Struktur organisasi belum tersedia.</Empty>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto pb-2">
          <ul className="flex min-w-max flex-wrap justify-center gap-x-4 gap-y-6 sm:min-w-0">
            {roots.map((r) => (
              <OrgNode key={r.id} node={r} />
            ))}
          </ul>
        </div>
      )}
    </Gate>
  );
}

/* ---------- Galeri ---------- */

function Lightbox({ items, index, onClose, onMove }) {
  const item = items[index];

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') onMove(-1);
      else if (e.key === 'ArrowRight') onMove(1);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, onMove]);

  const nav =
    'absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-2xl text-white hover:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.judul}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
      onClick={onClose}
    >
      <button type="button" onClick={onClose} aria-label="Tutup" className={`${nav} right-4 top-8`}>
        ×
      </button>
      {items.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Sebelumnya"
            onClick={(e) => {
              e.stopPropagation();
              onMove(-1);
            }}
            className={`${nav} left-3`}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Berikutnya"
            onClick={(e) => {
              e.stopPropagation();
              onMove(1);
            }}
            className={`${nav} right-3`}
          >
            ›
          </button>
        </>
      )}
      <figure className="max-h-full w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <img
          src={`${API_URL}${item.foto}`}
          alt={item.judul}
          className="mx-auto max-h-[75vh] w-auto max-w-full rounded-lg object-contain"
        />
        <figcaption className="mt-3 text-center text-white">
          <p className="font-semibold">{item.judul}</p>
          {item.deskripsi && <p className="mt-1 text-sm text-white/80">{item.deskripsi}</p>}
          <p className="mt-1 text-xs text-white/60">
            {index + 1} / {items.length}
          </p>
        </figcaption>
      </figure>
    </div>
  );
}

function Galeri() {
  const { data, loading, error } = useLoad(galeriApi.list);
  const items = useMemo(
    () => (Array.isArray(data) ? data.filter((g) => g.is_active !== false).sort(byUrutan) : []),
    [data]
  );
  const [open, setOpen] = useState(null);

  const close = useCallback(() => setOpen(null), []);
  const move = useCallback(
    (d) => setOpen((i) => (i === null ? i : (i + d + items.length) % items.length)),
    [items.length]
  );

  return (
    <Gate loading={loading} error={error}>
      <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Galeri Fasilitas</h2>
      {items.length === 0 ? (
        <div className="mt-6">
          <Empty>Belum ada foto fasilitas.</Empty>
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map((g, i) => (
            <li key={g.id}>
              <button
                type="button"
                onClick={() => setOpen(i)}
                className="group block w-full overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
              >
                <Foto
                  src={g.foto}
                  alt={g.judul}
                  className="aspect-video w-full transition duration-300 group-hover:scale-[1.03]"
                />
                <span className="block p-3">
                  <span className="block break-words text-sm font-bold text-slate-900">{g.judul}</span>
                  {g.deskripsi && (
                    <span className="mt-0.5 line-clamp-2 block break-words text-xs text-slate-600">
                      {g.deskripsi}
                    </span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {open !== null && items[open] && <Lightbox items={items} index={open} onClose={close} onMove={move} />}
    </Gate>
  );
}

/* ---------- Page ---------- */

const VIEWS = { profil: Profil, 'struktur-organisasi': Struktur, 'galeri-fasilitas': Galeri };

export default function TentangDetail() {
  const { slug } = useParams();

  if (!slug) return <Navigate to={`/tentang/${SECTIONS[0].slug}`} replace />;

  const index = SECTIONS.findIndex((s) => s.slug === slug);
  if (index < 0) return <Navigate to={`/tentang/${SECTIONS[0].slug}`} replace />;

  const View = VIEWS[slug];
  const prev = index > 0 ? MENU[index - 1] : null;
  const next = index < MENU.length - 1 ? MENU[index + 1] : null;

  return (
    <ProfileLayout
      title={SECTIONS[index].label}
      crumbs={[{ label: 'Tentang', to: '/tentang' }, { label: SECTIONS[index].label }]}
      menu={MENU}
      prev={prev}
      next={next}
    >
      <View />
    </ProfileLayout>
  );
}