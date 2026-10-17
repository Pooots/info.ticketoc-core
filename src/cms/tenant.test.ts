import { afterEach, describe, expect, it, vi } from 'vitest';
import { resolveSite, selectSite } from './tenant';

const api = 'https://cms.example.com';

afterEach(() => vi.restoreAllMocks());

describe('selectSite', () => {
  const env = { VITE_CMS_API_URL: `${api}/`, VITE_CMS_SITE_KEY: 'main', VITE_CMS_TENANT_DOMAIN: '.sites.example.com' };

  it('looks up subdomains of the tenant domain', () => {
    expect(selectSite('Acme.Sites.Example.com', env)).toEqual({ kind: 'lookup', apiUrl: api, hostname: 'acme.sites.example.com' });
  });

  it('looks up custom domains and other hostnames when a tenant domain is set', () => {
    expect(selectSite('sites.example.com', env)).toEqual({ kind: 'lookup', apiUrl: api, hostname: 'sites.example.com' });
    expect(selectSite('www.customer.com', env)).toEqual({ kind: 'lookup', apiUrl: api, hostname: 'www.customer.com' });
    expect(selectSite('evil-sites.example.com', env)).toEqual({ kind: 'lookup', apiUrl: api, hostname: 'evil-sites.example.com' });
  });

  it('looks up every hostname on a shared deployment without a site key', () => {
    expect(selectSite('www.customer.com', { ...env, VITE_CMS_SITE_KEY: '' })).toEqual({ kind: 'lookup', apiUrl: api, hostname: 'www.customer.com' });
  });

  it('keeps the single-site setup when no tenant domain is set', () => {
    expect(selectSite('acme.sites.example.com', { VITE_CMS_API_URL: api, VITE_CMS_SITE_KEY: 'main' })).toEqual({ kind: 'fixed', config: { apiUrl: api, siteKey: 'main' } });
    expect(selectSite('localhost', { VITE_CMS_API_URL: api })).toBeNull();
    expect(selectSite('localhost', { VITE_CMS_SITE_KEY: 'main' })).toBeNull();
  });
});

describe('resolveSite', () => {
  it('asks the CMS for the site key of the hostname', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify({ data: { site_key: 'acme', hostname: 'acme.sites.example.com' } }), { status: 200 }));
    await expect(resolveSite(api, 'acme.sites.example.com')).resolves.toEqual({ apiUrl: api, siteKey: 'acme' });
    expect(fetchMock.mock.calls[0][0]).toBe(`${api}/api/v1/public/resolve?domain=acme.sites.example.com`);
  });

  it('reports unknown hostnames as not found', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ message: 'Unknown domain.' }), { status: 404 }));
    await expect(resolveSite(api, 'nope.sites.example.com')).rejects.toMatchObject({ notFound: true });
  });
});
