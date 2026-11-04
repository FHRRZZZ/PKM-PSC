import { request } from './client';

// Item: { id, no_darurat (maks 10), hotline (maks 50), email (maks 50), alamat (maks 300) }
// Semua field wajib & tidak boleh kosong saat create. GET bersifat publik.
export const getKontak = () => request('/api/kontak', { auth: false });
export const getKontakById = (id) => request(`/api/kontak/${id}`, { auth: false });
export const createKontak = (payload) => request('/api/kontak', { method: 'POST', body: payload });
export const updateKontak = (id, payload) =>
  request(`/api/kontak/${id}`, { method: 'PUT', body: payload });
export const deleteKontak = (id) => request(`/api/kontak/${id}`, { method: 'DELETE' });