import { request } from './client';
export const getGaleriPSC = () => request('/api/galeri-psc', { auth: false });
export const getGaleriPSCAdmin = () => request('/api/galeri-psc');
export const createGaleriPSC = (body) => request('/api/galeri-psc', { method: 'POST', body });
export const updateGaleriPSC = (id, body) => request(`/api/galeri-psc/${id}`, { method: 'PUT', body });
export const deleteGaleriPSC = (id) => request(`/api/galeri-psc/${id}`, { method: 'DELETE' });
