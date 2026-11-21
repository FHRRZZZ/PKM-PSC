import { request } from './client';

// Item: { id, nama, slug, deskripsi, foto, tarif, tarif_is_active, urutan, is_active }
// tarif bertipe DECIMAL -> kemungkinan datang sebagai STRING ("150000.00") atau null.
// foto = STRING (URL/path, maks 255 karakter).

export const getLayananAdmin = () => request('/api/layanan/admin');
export const getLayananAdminById = (id) => request(`/api/layanan/admin/${id}`);

// Publik: hanya is_active=true
export const getLayananPublik = () => request('/api/layanan', { auth: false });
export const getLayananBySlug = (slug) => request(`/api/layanan/slug/${slug}`, { auth: false });

// payload: { nama, deskripsi, slug?, foto?, tarif?: number|null, tarif_is_active?, urutan?, is_active? }
// tarif kosong -> kirim null (bukan string kosong).
// PERHATIAN update: jika `nama` dikirim, slug dibuat ulang. Kirim `slug` lama juga.
export const createLayanan = (payload) => request('/api/layanan', { method: 'POST', body: payload });
export const updateLayanan = (id, payload) =>
  request(`/api/layanan/${id}`, { method: 'PUT', body: payload });
export const deleteLayanan = (id) => request(`/api/layanan/${id}`, { method: 'DELETE' });