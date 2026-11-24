import { useEffect, useId, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import ProfileLayout from '../../components/public/ProfileLayout';
import { alurApi } from '../../api/klinik';
import { getFaqsPublik } from '../../api/faq';

// Daftar panduan statis (slug -> judul). Tambah entri di sini bila ada panduan baru.
const SECTIONS = [
  { slug: 'alur-berobat', label: 'Alur Berobat' },
  { slug: 'faq', label: 'FAQ' },
];

// Hanya item aktif, urut berdasarkan `urutan` lalu `id`.
const prepare = (data) =>
  (Array.isArray(data) ? data : [])
    .filter((i) => i.is_active !== false)
    .sort((a, b) => (a.urutan ?? 0) - (b.urutan ?? 0) || a.id - b.id);

function AlurStepper({ items }) {
  return (
    <ol className="mt-6">
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <li key={item.id} className="relative flex gap-4 pb-8 last:pb-0">
            {!last && (
              <span
                aria-hidden="true"
                className="absolute left-5 top-10 -ml-px h-[calc(100%-2.5rem)] w-0.5 bg-red-100"
              />
            )}
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-700 text-sm font-bold text-white shadow-sm ring-4 ring-white">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
              <h3 className="break-words text-base font-semibold text-slate-900 sm:text-lg">
                {item.judul}
              </h3>
              <p className="mt-2 whitespace-pre-line break-words text-sm leading-relaxed text-slate-700 sm:text-base">
                {item.deskripsi}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function FaqItem({ item, open, onToggle }) {
  const uid = useId();
  const panelId = `${uid}-panel`;
  const btnId = `${uid}-btn`;

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <h3>
        <button
          id={btnId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-4 rounded-xl p-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 sm:p-5"
        >
          <span className="break-words text-base font-semibold text-slate-900">
            {item.pertanyaan}
          </span>
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`h-5 w-5 shrink-0 text-red-700 transition-transform duration-200 ${
              open ? 'rotate-180' : ''
            }`}
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={btnId}
        className={`grid transition-all duration-200 ease-out motion-reduce:transition-none ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="whitespace-pre-line break-words border-t border-slate-100 px-4 pb-4 pt-3 text-sm leading-relaxed text-slate-700 sm:px-5 sm:pb-5 sm:text-base">
            {item.jawaban}
          </p>
        </div>
      </div>
    </div>
  );
}

function FaqAccordion({ items }) {
  const [openId, setOpenId] = useState(null);
  return (
    <div className="mt-6 space-y-3">
      {items.map((item) => (
        <FaqItem
          key={item.id}
          item={item}
          open={openId === item.id}
          onToggle={() => setOpenId(openId === item.id ? null : item.id)}
        />
      ))}
    </div>
  );
}

export default function PanduanDetail() {
  const { slug } = useParams();
  const section = SECTIONS.find((s) => s.slug === slug) || null;
  const index = section ? SECTIONS.indexOf(section) : -1;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Muat data hanya untuk bagian yang sedang dibuka.
  useEffect(() => {
    if (!section) return undefined;
    let cancelled = false;
    setLoading(true);
    setError('');
    setItems([]);

    const load = section.slug === 'faq' ? getFaqsPublik() : alurApi.list();
    load
      .then((data) => !cancelled && setItems(prepare(data)))
      .catch((err) => !cancelled && setError(err.message || 'Gagal memuat panduan.'))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [section?.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const menu = useMemo(
    () => SECTIONS.map((s) => ({ label: s.label, to: `/panduan/${s.slug}` })),
    []
  );

  if (!slug) return <Navigate to={`/panduan/${SECTIONS[0].slug}`} replace />;

  const prev = index > 0 ? menu[index - 1] : null;
  const next = index >= 0 && index < menu.length - 1 ? menu[index + 1] : null;

  return (
    <ProfileLayout
      title={section?.label || 'Panduan'}
      crumbs={[{ label: 'Panduan', to: '/panduan' }, ...(section ? [{ label: section.label }] : [])]}
      menu={menu}
      prev={prev}
      next={next}
    >
      {!section ? (
        <div className="rounded-xl border border-slate-200 p-8 text-center">
          <p className="font-medium text-slate-700">Panduan tidak ditemukan.</p>
          <Link
            to={`/panduan/${SECTIONS[0].slug}`}
            className="mt-3 inline-block text-sm font-semibold text-red-700 hover:text-red-900"
          >
            Lihat panduan lainnya
          </Link>
        </div>
      ) : loading ? (
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
          Memuat panduan...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <article>
          <h2 className="break-words text-2xl font-bold text-slate-900 sm:text-3xl">
            {section.label}
          </h2>

          {items.length === 0 ? (
            <div className="mt-6 rounded-xl border border-slate-200 p-8 text-center text-slate-600">
              {section.slug === 'faq' ? 'Belum ada FAQ.' : 'Belum ada alur berobat.'}
            </div>
          ) : section.slug === 'faq' ? (
            <FaqAccordion items={items} />
          ) : (
            <AlurStepper items={items} />
          )}
        </article>
      )}
    </ProfileLayout>
  );
}