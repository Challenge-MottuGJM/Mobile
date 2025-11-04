type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

const RAW_BASE_URL = process.env.EXPO_PUBLIC_API_URL || '';
const BASE_URL = RAW_BASE_URL.replace(/\/+$/, '');

let token: string | null = null;
export function setToken(t: string | null) { token = t; }
export function getToken() { return token; }

type Query = Record<string, string | number | boolean | undefined>;

function withQuery(path: string, query?: Query) {
  if (!query) return path;
  const q = Object.entries(query)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
  return q ? `${path}?${q}` : path;
}

export class HttpError extends Error {
  status: number;
  body?: any;
  constructor(status: number, message: string, body?: any) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

export async function api<T = any>(
  path: string,
  init: RequestInit & { method?: HttpMethod; query?: Query; timeoutMs?: number } = {}
): Promise<T> {
  const { query, timeoutMs = 15000, ...rest } = init;
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(rest.headers as Record<string, string> | undefined),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const url = `${BASE_URL}${withQuery(path.startsWith('/') ? path : `/${path}`, query)}`;

  try {
    const res = await fetch(url, { ...rest, headers, signal: controller.signal });
    clearTimeout(t);

    // 204 No Content
    if (res.status === 204) return undefined as unknown as T;

    const ct = res.headers.get('content-type') || '';
    const body = ct.includes('application/json') ? await res.json() : await res.text();

    if (!res.ok) {
      const message = typeof body === 'string' ? body : body?.message || res.statusText;
      throw new HttpError(res.status, message, body);
    }

    return body as T;
  } catch (err: any) {
    clearTimeout(t);
    if (err.name === 'AbortError') {
      throw new HttpError(408, 'Request timeout');
    }
    if (err instanceof HttpError) throw err;
    throw new HttpError(500, err?.message || 'Network error');
  }
}
