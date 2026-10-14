import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { CmsError, fetchPage, fetchPreview, fetchSite, resolveRoute, type CmsConfig } from './client';
import { applyPageHead, applyStatusHead } from './head';
import { SiteRenderer } from './renderer/site-renderer';
import type { PreviewPayload, RenderPage, RenderSite } from './types';

type State =
  | { status: 'loading' }
  | { status: 'ready'; site: RenderSite; page: RenderPage; preview: PreviewPayload['preview'] | null }
  | { status: 'not_found'; site: RenderSite | null }
  | { status: 'preview_error'; expired: boolean }
  | { status: 'error' };

const PREVIEW_BANNER_HEIGHT = 40;

function currentLocation() {
  return { pathname: window.location.pathname, search: window.location.search, hash: window.location.hash };
}

/** Renders the website from the CMS: published pages by URL, or a draft behind a preview token. */
export default function CmsSite({ config }: { config: CmsConfig }) {
  const [location, setLocation] = useState(currentLocation);
  const [state, setState] = useState<State>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const onPopState = () => setLocation(currentLocation());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((path: string) => {
    const target = new URL(path, window.location.origin);
    const samePage = target.pathname === window.location.pathname && target.search === window.location.search;
    window.history.pushState(null, '', target.pathname + target.search + target.hash);
    if (samePage) {
      if (target.hash) document.getElementById(decodeURIComponent(target.hash.slice(1)))?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    window.scrollTo(0, 0);
    setLocation(currentLocation());
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const route = resolveRoute(location.pathname, location.search);

    const load = async (): Promise<State> => {
      if (route.kind === 'preview') {
        try {
          const payload = await fetchPreview(config, route.token, controller.signal);
          return { status: 'ready', site: payload.site, page: payload.page, preview: payload.preview };
        } catch (error) {
          if (error instanceof CmsError && (error.status === 404 || error.status === 410)) {
            return { status: 'preview_error', expired: error.status === 410 };
          }
          throw error;
        }
      }

      const sitePromise = fetchSite(config, controller.signal);
      if (route.kind === 'not_found') return { status: 'not_found', site: await sitePromise };

      const pagePromise = route.slug ? fetchPage(config, route.slug, controller.signal) : null;
      pagePromise?.catch(() => undefined);
      const site = await sitePromise;
      const slug = route.slug ?? site.home_page_slug;
      if (!slug) return { status: 'not_found', site };

      try {
        const page = await (pagePromise ?? fetchPage(config, slug, controller.signal));
        return { status: 'ready', site, page, preview: null };
      } catch (error) {
        if (error instanceof CmsError && error.notFound) return { status: 'not_found', site };
        throw error;
      }
    };

    // While the next page loads, the current one stays on screen.
    setState((previous) => (previous.status === 'ready' ? previous : { status: 'loading' }));
    load()
      .then((next) => {
        if (controller.signal.aborted) return;
        setState(next);
        // The home page lives at "/", not "/<home slug>".
        if (next.status === 'ready' && !next.preview && next.page.is_home && location.pathname !== '/') {
          window.history.replaceState(null, '', '/' + window.location.hash);
        }
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.error('Could not load content from the CMS', error);
        setState({ status: 'error' });
      });

    return () => controller.abort();
  }, [config, location.pathname, location.search, attempt]);

  // Keep the document head in sync and honour "#anchor" links once the content exists.
  useEffect(() => {
    if (state.status === 'ready') {
      applyPageHead(state.site, state.page, { preview: Boolean(state.preview) });
      if (window.location.hash) {
        const id = decodeURIComponent(window.location.hash.slice(1));
        requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
      }
    } else if (state.status === 'not_found') {
      applyStatusHead('Page not found');
    } else if (state.status === 'preview_error') {
      applyStatusHead(state.expired ? 'Preview expired' : 'Preview unavailable');
    }
  }, [state]);

  if (state.status === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center" role="status" aria-live="polite">
        <span className="h-8 w-8 rounded-full border-2 border-yellow-400/30 border-t-yellow-400 animate-spin" />
        <span className="sr-only">Loading…</span>
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <StatusScreen title="We couldn't load this page" message="Please check your connection and try again.">
        <button
          type="button"
          onClick={() => setAttempt((n) => n + 1)}
          className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-lg btn-glow"
        >
          Try again
        </button>
      </StatusScreen>
    );
  }

  if (state.status === 'preview_error') {
    return (
      <StatusScreen
        title={state.expired ? 'This preview link has expired' : 'This preview link is not valid'}
        message="Open a new preview from the CMS editor."
      />
    );
  }

  if (state.status === 'not_found') {
    const notFound = (
      <section className="min-h-[70vh] flex items-center justify-center px-6 pt-24 text-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-yellow-400">404</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-black text-white">Page not found</h1>
          <p className="mt-4 text-zinc-400">The page you are looking for does not exist or is no longer available.</p>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            className="mt-8 inline-block px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-lg btn-glow"
          >
            Back to home
          </a>
        </div>
      </section>
    );
    if (!state.site) return <StatusScreen title="Page not found" message="The page you are looking for does not exist." />;
    return (
      <SiteRenderer site={state.site} sections={[]} options={{ baseUrl: null, navigate }}>
        {notFound}
      </SiteRenderer>
    );
  }

  const { site, page, preview } = state;
  return (
    <>
      {preview && <PreviewBanner label={preview.label} expiresAt={preview.expires_at} />}
      <SiteRenderer
        site={site}
        sections={page.sections}
        settings={page.settings}
        options={{ baseUrl: null, navigate: preview ? undefined : navigate }}
        topOffset={preview ? PREVIEW_BANNER_HEIGHT : 0}
      />
    </>
  );
}

function PreviewBanner({ label, expiresAt }: { label: string; expiresAt: string }) {
  const time = new Date(expiresAt);
  return (
    <div
      className="fixed inset-x-0 top-0 z-[60] flex items-center justify-center gap-2 bg-yellow-400 px-4 text-sm font-semibold text-black"
      style={{ height: PREVIEW_BANNER_HEIGHT }}
      role="status"
    >
      <span className="uppercase tracking-wider">Preview</span>
      <span className="font-normal truncate">
        {label}
        {Number.isNaN(time.getTime()) ? '' : ` · link valid until ${time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
      </span>
    </div>
  );
}

function StatusScreen({ title, message, children }: { title: string; message: string; children?: ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 text-center">
      <div>
        <h1 className="text-3xl md:text-4xl font-black">{title}</h1>
        <p className="mt-3 text-zinc-400">{message}</p>
        {children && <div className="mt-8">{children}</div>}
      </div>
    </div>
  );
}
