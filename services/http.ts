const BASE_URL = process.env.EXPO_PUBLIC_API_URL || '';

let token: string | null = null;
export function setToken(t: string | null) { token = t; }
export function getToken() { return token; }

export async function api(path: string, init: RequestInit = {}) {
  const headers: any = { 'Content-Type': 'application/json', ...(init.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.text();
}
