export const API_BASE = import.meta.env.VITE_API_URL || '/api/v1'

export const apiFetch = (path: string, init?: RequestInit): Promise<Response> =>
  fetch(`${API_BASE}${path}`, { ...init, credentials: 'include' })