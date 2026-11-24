// API CMS Klinik -> /api/klinik
// Response backend: array/objek langsung (bukan { data }), error: { message }.
// TODO: samakan getToken() & penanganan 401 dengan pola di src/api/berita.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const BASE = `${API_URL}/api/klinik`;
const CLINIC_KEY = 'selected_klinik_id';

export const getSelectedKlinikId = () => localStorage.getItem(CLINIC_KEY) || '1';
export const setSelectedKlinikId = (id) => localStorage.setItem(CLINIC_KEY, String(id));

const getToken = () => localStorage.getItem('token');

async function request(path, { method = 'GET', body } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const isForm = body instanceof FormData;
  if (body && !isForm) headers['Content-Type'] = 'application/json';

  const separator = path.includes('?') ? '&' : '?';
  const scopedPath = path === '/daftar' ? path : `${path}${separator}klinik_id=${encodeURIComponent(getSelectedKlinikId())}`;
  const res = await fetch(`${BASE}${scopedPath}`, {
    method,
    headers,
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const fallback =
      res.status === 401
        ? 'Sesi berakhir atau token tidak valid. Silakan login ulang.'
        : res.status === 403
          ? 'Anda tidak memiliki izin untuk aksi ini.'
          : 'Terjadi kesalahan pada server.';
    const err = new Error(data?.message || fallback);
    err.status = res.status;
    throw err;
  }
  return data;
}

// Jika ada file -> multipart (field `foto`), jika tidak -> JSON.
// Catatan: null/undefined tidak dikirim lewat multipart.
export function buildBody(data, file) {
  if (!file) return data;
  const fd = new FormData();
  Object.entries(data).forEach(([k, v]) => {
    if (v !== null && v !== undefined) fd.append(k, String(v));
  });
  fd.append('foto', file);
  return fd;
}

const crud = (resource) => ({
  list: () => request(`/${resource}`),
  create: (body) => request(`/${resource}`, { method: 'POST', body }),
  update: (id, body) => request(`/${resource}/${id}`, { method: 'PUT', body }),
  remove: (id) => request(`/${resource}/${id}`, { method: 'DELETE' }),
});

// Profil (data tunggal)
export const getProfil = () => request('/profil');
export const updateProfil = (body) => request('/profil', { method: 'PUT', body });
export const klinikApi = {
  list: () => request('/daftar'),
  create: (body) => request('/daftar', { method: 'POST', body }),
  update: (id, body) => request(`/daftar/${id}`, { method: 'PUT', body }),
  remove: (id) => request(`/daftar/${id}`, { method: 'DELETE' }),
};

export const jamApi = crud('jam-operasional');
export const dokterApi = crud('dokter');
export const jadwalApi = crud('jadwal-praktik');
export const strukturApi = crud('struktur-organisasi');
export const alurApi = crud('alur-berobat');
export const penjaminanApi = crud('penjaminan');
export const galeriApi = crud('galeri');
