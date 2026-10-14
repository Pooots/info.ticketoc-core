import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CmsSite from './CmsSite';
import type { RenderPage, RenderSite } from './types';

const config = { apiUrl: 'https://cms.example.com', siteKey: 'ticketoc' };
const API = 'https://cms.example.com/api/v1';

const site: RenderSite = {
  key: 'ticketoc',
  name: 'Ticketoc',
  base_url: 'https://ticketoc.example',
  primary_domain: 'ticketoc.example',
  content_revision: 3,
  home_page_slug: 'home',
  settings: {
    general: { site_name: 'Ticketoc' },
    header: { cta: { label: 'Get Tickets', url: 'https://ticketoc.com/', new_tab: true } },
    footer: { copyright: '© Ticketoc' },
  },
  navigation: {
    header: [
      { id: 'n1', label: 'Events', href: '#events', new_tab: false, children: [] },
      { id: 'n2', label: 'About', href: '/about', new_tab: false, children: [] },
    ],
    footer: [],
  },
};

function page(overrides: Partial<RenderPage> = {}): RenderPage {
  return {
    id: 'p1',
    slug: 'home',
    path: '/',
    name: 'Home',
    type: 'landing',
    is_home: true,
    version: 2,
    status: 'published',
    published_at: '2026-10-10T00:00:00Z',
    schema_version: 1,
    seo: { title: 'Ticketoc - Home', description: 'All your tickets', robots: 'index,follow' },
    settings: { show_header: true, show_footer: true },
    sections: [
      { id: 's1', type: 'hero', props: { heading: 'Welcome to Ticketoc', media_type: 'none', description: 'From the CMS' }, style: {} },
      { id: 's2', type: 'cta', visible: false, props: { heading: 'Hidden section' }, style: {} },
      { id: 's3', type: 'unknown_widget', props: { heading: 'Unknown' }, style: {} },
    ],
    ...overrides,
  };
}

type Routes = Record<string, { status: number; body: unknown } | (() => Promise<Response>)>;

function mockApi(routes: Routes) {
  return vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
    const url = String(input);
    const route = routes[url.replace(API, '')];
    if (!route) return new Response(JSON.stringify({ message: 'Not found.', code: 'not_found' }), { status: 404 });
    if (typeof route === 'function') return route();
    return new Response(JSON.stringify(route.body), { status: route.status });
  });
}

const visit = (path: string) => window.history.replaceState(null, '', path);

beforeEach(() => {
  document.head.innerHTML = '';
  document.title = '';
  Element.prototype.scrollIntoView = vi.fn();
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
});

describe('CmsSite', () => {
  it('renders the published home page with the site header and SEO tags', async () => {
    visit('/');
    mockApi({
      '/public/sites/ticketoc': { status: 200, body: { data: site } },
      '/public/sites/ticketoc/pages/home': { status: 200, body: { data: page() } },
    });

    render(<CmsSite config={config} />);

    expect(await screen.findByText('Welcome to Ticketoc')).toBeInTheDocument();
    expect(screen.getByText('From the CMS')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Events' })).toHaveAttribute('href', '#events');
    expect(screen.getByRole('link', { name: 'Get Tickets' })).toHaveAttribute('target', '_blank');
    expect(screen.getByText('© Ticketoc')).toBeInTheDocument();
    expect(screen.queryByText('Hidden section')).not.toBeInTheDocument();
    expect(screen.queryByText('Unknown')).not.toBeInTheDocument();

    await waitFor(() => expect(document.title).toBe('Ticketoc - Home'));
    expect(document.head.querySelector('meta[name="description"]')).toHaveAttribute('content', 'All your tickets');
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'index,follow');
    expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute('href', `${window.location.origin}/`);
  });

  it('navigates between CMS pages without a full reload', async () => {
    visit('/');
    mockApi({
      '/public/sites/ticketoc': { status: 200, body: { data: site } },
      '/public/sites/ticketoc/pages/home': { status: 200, body: { data: page() } },
      '/public/sites/ticketoc/pages/about': {
        status: 200,
        body: { data: page({ slug: 'about', path: '/about', name: 'About', is_home: false, seo: { title: 'About us' }, sections: [{ id: 'a1', type: 'rich_text', props: { heading: 'About Ticketoc', body: '<p>Our story</p>' }, style: {} }] }) },
      },
    });

    render(<CmsSite config={config} />);
    fireEvent.click(await screen.findByRole('link', { name: 'About' }));

    expect(await screen.findByText('About Ticketoc')).toBeInTheDocument();
    expect(screen.getByText('Our story')).toBeInTheDocument();
    expect(window.location.pathname).toBe('/about');
    await waitFor(() => expect(document.title).toBe('About us'));

    act(() => {
      window.history.back();
    });
    expect(await screen.findByText('Welcome to Ticketoc')).toBeInTheDocument();
  });

  it('shows a not-found page inside the site chrome for unknown slugs', async () => {
    visit('/missing-page');
    mockApi({ '/public/sites/ticketoc': { status: 200, body: { data: site } } });

    render(<CmsSite config={config} />);

    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Events' })).toBeInTheDocument();
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow');
  });

  it('renders drafts behind a preview token with a banner and noindex', async () => {
    visit('/cms-preview?token=pvw_valid');
    mockApi({
      '/preview/pvw_valid': {
        status: 200,
        body: { data: { site, page: page({ status: 'draft', sections: [{ id: 's1', type: 'hero', props: { heading: 'Draft heading', media_type: 'none' }, style: {} }] }), preview: { label: 'Home · draft v3', expires_at: '2026-10-10T12:00:00Z' } } },
      },
    });

    render(<CmsSite config={config} />);

    expect(await screen.findByText('Draft heading')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Preview');
    expect(screen.getByRole('status')).toHaveTextContent('Home · draft v3');
    await waitFor(() => expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow'));
    expect(document.title).toBe('Preview: Ticketoc - Home');
    expect(document.head.querySelector('link[rel="canonical"]')).toBeNull();
  });

  it('explains expired preview links', async () => {
    visit('/cms-preview?token=pvw_old');
    mockApi({ '/preview/pvw_old': { status: 410, body: { message: 'This preview link has expired.', code: 'preview_expired' } } });

    render(<CmsSite config={config} />);

    expect(await screen.findByRole('heading', { name: 'This preview link has expired' })).toBeInTheDocument();
  });

  it('offers a retry when the CMS cannot be reached', async () => {
    visit('/');
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    let available = false;
    mockApi({
      '/public/sites/ticketoc': async () => (available ? new Response(JSON.stringify({ data: site })) : Promise.reject(new TypeError('Failed to fetch'))),
      '/public/sites/ticketoc/pages/home': { status: 200, body: { data: page() } },
    });

    render(<CmsSite config={config} />);
    const retry = await screen.findByRole('button', { name: 'Try again' });

    available = true;
    fireEvent.click(retry);
    expect(await screen.findByText('Welcome to Ticketoc')).toBeInTheDocument();
  });
});
