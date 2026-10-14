import type { RenderPage, RenderSite } from './types';

/** Keeps <title> and the SEO / social meta tags in sync with the CMS page being shown. */

function setMeta(attribute: 'name' | 'property', key: string, content: string | null | undefined) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!content) {
    element?.remove();
    return;
  }
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function setLink(rel: string, href: string | null | undefined) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!href) {
    if (rel === 'canonical') element?.remove();
    return;
  }
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }
  element.href = href;
}

const text = (value: unknown) => (typeof value === 'string' && value.trim() ? value : null);

function absolute(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url, window.location.origin).href;
  } catch {
    return null;
  }
}

export function applyPageHead(site: RenderSite, page: RenderPage, options: { preview?: boolean } = {}) {
  const seo = page.seo ?? {};
  const brand = site.settings.brand ?? {};
  const siteName = text(site.settings.general?.site_name) ?? site.name;

  document.title = options.preview ? `Preview: ${seo.title ?? page.name}` : (seo.title ?? page.name);
  setMeta('name', 'description', seo.description);
  setMeta('name', 'robots', options.preview ? 'noindex,nofollow' : (seo.robots ?? 'index,follow'));
  setMeta('property', 'og:title', seo.og_title ?? seo.title);
  setMeta('property', 'og:description', seo.og_description ?? seo.description);
  setMeta('property', 'og:image', absolute(seo.og_image?.url));
  setMeta('property', 'og:site_name', siteName);
  setMeta('property', 'og:url', options.preview ? null : window.location.origin + page.path);
  setLink('canonical', options.preview ? null : (seo.canonical_url ?? window.location.origin + page.path));

  const favicon = brand.favicon as { url?: string } | undefined;
  if (favicon?.url) setLink('icon', favicon.url);
}

export function applyStatusHead(title: string) {
  document.title = title;
  setMeta('name', 'robots', 'noindex,nofollow');
  setLink('canonical', null);
}
