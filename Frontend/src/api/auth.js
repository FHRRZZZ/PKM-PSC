import { request } from './client';

// -> { token, user: { id, username, email, role } }
export const login = (email, password) =>
  request('/api/auth/login', { method: 'POST', body: { email, password }, auth: false });

// -> { id, username, email, role }
export const getMe = () => request('/api/auth/me');