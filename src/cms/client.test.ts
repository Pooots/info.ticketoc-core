import { describe, expect, it, vi } from 'vitest';
import { CmsError, cmsConfig, fetchPage, fetchPreview, fetchSite, resolveRoute } from './client';

const config = { apiUrl: 'https://cms.example.com', siteKey: 'ticketoc' };

function respond(status: number, body: unknown) {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } }));
}

describe('cmsConfig', () => {
  it('is enabled only when both the API URL and the site key are set', () => {
    expect(cmsConfig({ VITE_CMS_API_URL: 'https://cms.example.com/', VITE_CMS_SITE_KEY: 'ticketoc' })).toEqual(config);
    expect(cmsConfig({ VITE_CMS_API_URL: 'https://cms.example.com', VITE_CMS_SITE_KEY: ' ' })).toBeNull();
    expect(cmsConfig({ VITE_CMS_SITE_KEY: 'ticketoc' })).toBeNull();
  });
});

describe('resolveRoute', () => {
  it('maps paths to pages, previews and not-found routes', () => {
    expect(resolveRoute('/', '')).toEqual({ kind: 'page', slug: null });
    expect(resolveRoute('/about', '')).toEqual({ kind: 'page', slug: 'about' });
    expect(resolveRoute('/about/', '')).toEqual({ kind: 'page', slug: 'about' });
    expect(resolveRoute('/cms-preview', '?token=pvw_abc')).toEqual({ kind: 'preview', token: 'pvw_abc' });
    expect(resolveRoute('/cms-preview', '')).toEqual({ kind: 'not_found' });
    expect(resolveRoute('/About', '')).toEqual({ kind: 'not_found' });
    expect(resolveRoute('/a/b', '')).toEqual({ kind: 'page', slug: 'a/b' });
    expect(resolveRoute('/a//b', '')).toEqual({ kind: 'not_found' });
    expect(resolveRoute('/a/b/c/d/e', '')).toEqual({ kind: 'not_found' });
  });
});

describe('API requests', () => {
  it('requests published content with ETag revalidation and returns the data', async () => {
    const fetchMock = respond(200, { data: { slug: 'about' } });
    await expect(fetchPage(config, 'about')).resolves.toEqual({ slug: 'about' });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://cms.example.com/api/v1/public/sites/ticketoc/pages/about',
      expect.objectContaining({ cache: 'no-cache', headers: { Accept: 'application/json' } }),
    );

    respond(200, { data: { key: 'ticketoc' } });
    await expect(fetchSite(config)).resolves.toEqual({ key: 'ticketoc' });
  });

  it('encodes preview tokens into the path', async () => {
    const fetchMock = respond(200, { data: {} });
    await fetchPreview(config, 'pvw_a/b');
    expect(fetchMock.mock.calls[0][0]).toBe('https://cms.example.com/api/v1/preview/pvw_a%2Fb');
  });

  it('turns API errors into CmsError with status and code', async () => {
    respond(404, { message: 'Page not found.', code: 'not_found' });
    const error = await fetchPage(config, 'missing').catch((e) => e);
    expect(error).toBeInstanceOf(CmsError);
    expect(error).toMatchObject({ status: 404, code: 'not_found', message: 'Page not found.', notFound: true });

    respond(410, { message: 'This preview link has expired.', code: 'preview_expired' });
    await expect(fetchPreview(config, 'pvw_old')).rejects.toMatchObject({ status: 410, code: 'preview_expired' });
  });

  it('reports unreachable services and non-JSON responses', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));
    await expect(fetchSite(config)).rejects.toMatchObject({ status: 0 });

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('<html>Bad gateway</html>', { status: 502 }));
    await expect(fetchSite(config)).rejects.toMatchObject({ status: 502, message: 'Request failed (502).' });
  });
});
