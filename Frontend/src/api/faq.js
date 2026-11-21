import { request } from './client';

// Item: { id, pertanyaan, jawaban, urutan, is_active }  (tanpa timestamps)

// Panel admin pakai /admin supaya FAQ nonaktif (is_active=false) ikut tampil.
export const getFaqsAdmin = () => request('/api/faq/admin');
export const getFaqAdminById = (id) => request(`/api/faq/admin/${id}`);

// Publik: hanya is_active=true
export const getFaqsPublik = () => request('/api/faq', { auth: false });

// payload: { pertanyaan, jawaban, urutan?: int>=0, is_active?: boolean }
export const createFaq = (payload) => request('/api/faq', { method: 'POST', body: payload });
export const updateFaq = (id, payload) =>
  request(`/api/faq/${id}`, { method: 'PUT', body: payload });
export const deleteFaq = (id) => request(`/api/faq/${id}`, { method: 'DELETE' });