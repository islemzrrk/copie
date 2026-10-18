import { API_URL } from '../config';

const TOKEN_KEY = 'quiz_token';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = tokenStore.get();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Le serveur ne répond pas. Vérifiez que l’API est lancée sur le port 3000.', 0);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.message || 'Une erreur est survenue.', res.status);
  return data;
}

export const api = {
  reference: () => request('/reference'),
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  me: () => request('/users/me'),
  updateMe: (payload) => request('/users/me', { method: 'PUT', body: payload }),
  adminUsers: (statut) => request(`/admin/users?statut=${statut}`),
  adminSetStatut: (id, payload) => request(`/admin/users/${id}/statut`, { method: 'PATCH', body: payload }),
};
