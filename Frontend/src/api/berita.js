import { request } from './client';

// Berita: { id, kategori_id, judul, slug, deskripsi, foto, status: 'draft'|'terbit',
//           tanggal_terbit, createdAt, updatedAt, kategori: { id, nama, slug, ... } }
// foto = STRING (URL/path, maks 255 karakter). Tidak ada endpoint upload file.

// Panel admin pakai /admin supaya draft ikut tampil.
export const getBeritaAdmin = () => request('/api/berita/admin');
export const getBeritaAdminById = (id) => request(`/api/berita/admin/${id}`);
export const getBeritaAdminBySlug = (slug) => request(`/api/berita/admin/slug/${slug}`);

// Publik: hanya status 'terbit'
export const getBeritaPublik = () => request('/api/berita', { auth: false });

// payload: { judul, kategori_id, deskripsi, foto?, status?, tanggal_terbit?, slug? }
// PERHATIAN update: jika `judul` dikirim, slug dibuat ulang dari judul.
// Kirim juga `slug` yang lama agar URL publik tidak berubah.
export const createBerita = (payload) => request('/api/berita', { method: 'POST', body: payload });
export const updateBerita = (id, payload) =>
  request(`/api/berita/${id}`, { method: 'PUT', body: payload });
export const deleteBerita = (id) => request(`/api/berita/${id}`, { method: 'DELETE' });

// ---- Kategori: { id, nama, slug, createdAt, updatedAt } ----
export const getKategoriBerita = () => request('/api/berita/kategori', { auth: false });
export const getKategoriBeritaById = (id) =>
  request(`/api/berita/kategori/${id}`, { auth: false }); // menyertakan berita terbit
export const createKategoriBerita = (payload) =>
  request('/api/berita/kategori', { method: 'POST', body: payload }); // { nama, slug? }
export const updateKategoriBerita = (id, payload) =>
  request(`/api/berita/kategori/${id}`, { method: 'PUT', body: payload });
// 409 jika kategori masih dipakai berita
export const deleteKategoriBerita = (id) =>
  request(`/api/berita/kategori/${id}`, { method: 'DELETE' });