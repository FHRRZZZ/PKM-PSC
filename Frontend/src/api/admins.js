import { request } from './client';

// Semua endpoint ini KHUSUS superadmin (403 untuk role admin).
// Item: { id, username, email, role, createdAt, updatedAt }
export const getAdmins = () => request('/api/admins');

// payload: { username, email, password (min 12 karakter), role: 'admin' | 'superadmin' }
export const createAdmin = (payload) => request('/api/admins', { method: 'POST', body: payload });

// payload parsial; kirim hanya field yang diubah. password opsional (min 12 karakter).
// 409: tidak boleh menurunkan diri sendiri / harus tersisa minimal 1 superadmin.
export const updateAdmin = (id, payload) =>
  request(`/api/admins/${id}`, { method: 'PUT', body: payload });

// 409: tidak boleh hapus akun sendiri / superadmin terakhir.
export const deleteAdmin = (id) => request(`/api/admins/${id}`, { method: 'DELETE' });