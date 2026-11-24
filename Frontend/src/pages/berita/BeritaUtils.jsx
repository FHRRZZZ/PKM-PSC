import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function fotoUrl(foto) {
  if (!foto) return null;
  if (/^https?:\/\//i.test(foto)) return foto;
  return `${API_URL}${foto.startsWith('/') ? '' : '/'}${foto}`;
}

export function formatTanggal(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function ringkasan(teks, maks = 140) {
  const bersih = (teks || '').replace(/\s+/g, ' ').trim();
  if (bersih.length <= maks) return bersih;
  return `${bersih.slice(0, maks).replace(/\s+\S*$/, '')}…`;
}

// Hanya berita terbit, terbaru lebih dulu
export function urutkanTerbit(list) {
  return (Array.isArray(list) ? list : [])
    .filter((b) => b && b.status === 'terbit')
    .sort(
      (a, b) =>
        new Date(b.tanggal_terbit || b.createdAt || 0) -
        new Date(a.tanggal_terbit || a.createdAt || 0)
    );
}

// Foto dengan fallback gradasi merah (selaras dengan halaman layanan).
// className mengatur ukuran/rasio (mis. "aspect-video w-full rounded-xl").
export function BeritaFoto({ foto, alt, className = '' }) {
  const [gagal, setGagal] = useState(false);
  const src = fotoUrl(foto);

  useEffect(() => setGagal(false), [src]);

  if (!src || gagal) {
    return (
      <div
        role="img"
        aria-label={alt || 'Foto berita tidak tersedia'}
        className={`flex items-center justify-center bg-gradient-to-br from-red-900 to-red-600 text-white/80 ${className}`}
      >
        <svg
          className="h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
          />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || ''}
      loading="lazy"
      onError={() => setGagal(true)}
      className={`bg-slate-100 object-cover ${className}`}
    />
  );
}