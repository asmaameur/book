const BASE = import.meta.env.VITE_API_URL || '/api';

export async function api(path, { method = 'GET', body } = {}) {
  const userId = localStorage.getItem('userId');
  const res = await fetch(BASE + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(userId && { 'X-User-Id': userId }),
    },
    body: body && JSON.stringify(body),
  });
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || 'Une erreur est survenue.');
  return data;
}

export const STATUS_LABELS = { to_read: 'À lire', reading: 'En cours', read: 'Lu' };
