import { request } from './client';

// Item: { id, nama, slug, deskripsi, foto, tarif, tarif_is_active, urutan, is_active }
// tarif bertipe DECIMAL -> kemungkinan datang sebagai STRING ("150000.00") atau null.
// foto = STRING (URL/path, maks 255 karakter).

export const getLayananAdmin = (jenis = 'ambulans') => request(`/api/layanan/admin?jenis=${jenis}`);
export const getLayananAdminById = (id, jenis) => request(`/api/layanan/admin/${id}${jenis ? `?jenis=${jenis}` : ''}`);

// Publik: hanya is_active=true
export const getLayananPublik = (jenis = 'ambulans') => request(`/api/layanan?jenis=${jenis}`, { auth: false });
export const getLayananBySlug = (slug, jenis) => request(`/api/layanan/slug/${slug}${jenis ? `?jenis=${jenis}` : ''}`, { auth: false });

// payload: { nama, deskripsi, slug?, foto?, tarif?: number|null, tarif_is_active?, urutan?, is_active? }
// tarif kosong -> kirim null (bukan string kosong).
// PERHATIAN update: jika `nama` dikirim, slug dibuat ulang. Kirim `slug` lama juga.
export const createLayanan = (payload) => request('/api/layanan', { method: 'POST', body: payload });
export const updateLayanan = (id, payload) =>
  request(`/api/layanan/${id}`, { method: 'PUT', body: payload });
export const deleteLayanan = (id) => request(`/api/layanan/${id}`, { method: 'DELETE' });
