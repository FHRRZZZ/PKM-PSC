import { request } from './client';

export const getHeroSlides = () => request('/api/hero', { auth: false });
export const getHeroSlidesAdmin = () => request('/api/hero/admin');
export const createHeroSlide = (body) => request('/api/hero', { method: 'POST', body });
export const updateHeroSlide = (id, body) => request(`/api/hero/${id}`, { method: 'PUT', body });
export const deleteHeroSlide = (id) => request(`/api/hero/${id}`, { method: 'DELETE' });
