import { request } from './client';

export const getActivities = (limit = 100) => request(`/api/activity-logs?limit=${limit}`);
