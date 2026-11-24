import { useEffect, useState } from 'react';

export const URUTAN_HARI = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
const HARI_JS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export const aktif = (v) => v !== false && v !== 0 && v !== '0';

export const toArray = (res) => (Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : []);

// "senin", "Jum'at" -> "Senin", "Jumat"
export function normalHari(h) {
  const s = String(h || '').trim().toLowerCase().replace("'", '');
  return URUTAN_HARI.find((x) => x.toLowerCase() === s) || String(h || '').trim();
}

export const urutHari = (h) => {
  const i = URUTAN_HARI.indexOf(normalHari(h));
  return i < 0 ? 99 : i;
};

export const namaHariIni = (now = new Date()) => HARI_JS[now.getDay()];

// "08:00:00" -> "08.00"
export function formatJam(t) {
  const m = /^(\d{1,2}):(\d{2})/.exec(String(t || ''));
  return m ? `${m[1].padStart(2, '0')}.${m[2]}` : '';
}

const menit = (t) => {
  const m = /^(\d{1,2}):(\d{2})/.exec(String(t || ''));
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
};

// Status buka/tutup hari ini dari baris jam operasional.
// Mengembalikan null bila tidak ada data untuk hari ini.
export function statusBuka(rows, now = new Date()) {
  const hari = namaHariIni(now);
  const hariIni = rows.filter((r) => normalHari(r.hari) === hari);
  if (hariIni.length === 0) return null;

  const sekarang = now.getHours() * 60 + now.getMinutes();
  let bukaLagi = null;

  for (const r of hariIni) {
    if (r.is_tutup) continue;
    const b = menit(r.jam_buka);
    const t = menit(r.jam_tutup);
    if (b === null || t === null) continue;

    const dalam = t <= b ? sekarang >= b || sekarang < t : sekarang >= b && sekarang < t;
    if (dalam) return { buka: true, sampai: formatJam(r.jam_tutup) };
    if (b > sekarang && (bukaLagi === null || b < bukaLagi.menit)) {
      bukaLagi = { menit: b, jam: formatJam(r.jam_buka) };
    }
  }
  return { buka: false, bukaLagi: bukaLagi?.jam || null };
}

// Menyegarkan waktu tiap menit agar badge dan sorotan hari tetap akurat
export function useNow(intervalMs = 60000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}