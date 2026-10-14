import type { PreviewPayload, RenderPage, RenderSite } from './types';

/**
 * Read-only client for the CMS public API. Only published content (or a draft behind a short-lived
 * preview token) is available; no credentials are used or needed.
 */

export interface CmsConfig {
  apiUrl: string;
  siteKey: string;
}

export function cmsConfig(env: { VITE_CMS_API_URL?: string; VITE_CMS_SITE_KEY?: string } = import.meta.env): CmsConfig | null {
  const apiUrl = (env.VITE_CMS_API_URL ?? '').trim().replace(/\/+$/, '');
  const siteKey = (env.VITE_CMS_SITE_KEY ?? '').trim();
  return apiUrl && siteKey ? { apiUrl, siteKey } : null;
}

export class CmsError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string | null = null,
  ) {
    super(message);
    this.name = 'CmsError';
  }

  get notFound() {
    return this.status === 404;
  }
}

export async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  let response: Response;
  try {
    // "no-cache" revalidates with the API's ETag on every load: published changes show up immediately
    // while unchanged content is answered with a cheap 304.
    response = await fetch(url, { headers: { Accept: 'application/json' }, cache: 'no-cache', signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new CmsError('The content service could not be reached.', 0);
  }

  let body: { data?: T; message?: string; code?: string } | null = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok || !body || body.data === undefined) {
    throw new CmsError(body?.message ?? `Request failed (${response.status}).`, response.status, body?.code ?? null);
  }
  return body.data;
}

export function fetchSite(config: CmsConfig, signal?: AbortSignal) {
  return getJson<RenderSite>(`${config.apiUrl}/api/v1/public/sites/${encodeURIComponent(config.siteKey)}`, signal);
}

export function fetchPage(config: CmsConfig, slug: string, signal?: AbortSignal) {
  const path = slug.split('/').map(encodeURIComponent).join('/');
  return getJson<RenderPage>(`${config.apiUrl}/api/v1/public/sites/${encodeURIComponent(config.siteKey)}/pages/${path}`, signal);
}

export function fetchPreview(config: CmsConfig, token: string, signal?: AbortSignal) {
  return getJson<PreviewPayload>(`${config.apiUrl}/api/v1/preview/${encodeURIComponent(token)}`, signal);
}

export const PREVIEW_PATH = '/cms-preview';

export type Route = { kind: 'page'; slug: string | null } | { kind: 'preview'; token: string } | { kind: 'not_found' };

/** Same rule as the CMS: lowercase words joined by single dashes, up to four levels ("products/01"). */
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*){0,3}$/;

/** Maps a browser location to CMS content. `slug: null` is the home page. */
export function resolveRoute(pathname: string, search: string): Route {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === PREVIEW_PATH) {
    const token = new URLSearchParams(search).get('token') ?? '';
    return token ? { kind: 'preview', token } : { kind: 'not_found' };
  }
  if (path === '/' || path === '/index.html') return { kind: 'page', slug: null };
  const slug = path.slice(1);
  return SLUG.test(slug) ? { kind: 'page', slug } : { kind: 'not_found' };
}
