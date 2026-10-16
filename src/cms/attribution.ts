import type { CmsConfig } from './client';

const VISITOR_KEY = 'ticketoc_attr_visitor';
const ATTR_KEY = 'ticketoc_attr_context';
const VISITOR_COOKIE_DAYS = 90;

/** Via hop stamped when leaving this CMS site toward ticketoc.com. */
export const SITE_ATTR_HOP = 'info_ticketoc';
export const SITE_PAGE_PREFIX = 'info';

export type AttributionContext = {
  source: string;
  via: string[];
};

const SOURCE_RE = /^[a-z0-9][a-z0-9_-]{0,63}$/i;
const UUID_RE = /^[0-9a-f-]{36}$/i;

function normalizeToken(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim().toLowerCase();
  return SOURCE_RE.test(trimmed) ? trimmed : null;
}

/** Shared across *.ticketoc.com so business → ticketoc.com keeps the same visitor. */
function cookieDomain(): string | undefined {
  const host = window.location.hostname.toLowerCase();
  if (host === 'ticketoc.com' || host.endsWith('.ticketoc.com')) return '.ticketoc.com';
  return undefined;
}

function readVisitorCookie(): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${VISITOR_KEY}=([^;]*)`));
  const value = match?.[1] ? decodeURIComponent(match[1]) : '';
  return UUID_RE.test(value) ? value.toLowerCase() : null;
}

function writeVisitorCookie(id: string): void {
  if (!UUID_RE.test(id)) return;
  const maxAge = VISITOR_COOKIE_DAYS * 24 * 60 * 60;
  const domain = cookieDomain();
  const parts = [
    `${VISITOR_KEY}=${encodeURIComponent(id.toLowerCase())}`,
    'Path=/',
    `Max-Age=${maxAge}`,
    'SameSite=Lax',
  ];
  if (domain) parts.push(`Domain=${domain}`);
  if (window.location.protocol === 'https:') parts.push('Secure');
  document.cookie = parts.join('; ');
}

function readStoredContext(): AttributionContext | null {
  try {
    const raw = localStorage.getItem(ATTR_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { source?: unknown; via?: unknown };
    const source = typeof parsed.source === 'string' ? normalizeToken(parsed.source) : null;
    if (!source) return null;
    const via = Array.isArray(parsed.via)
      ? parsed.via.map((v) => (typeof v === 'string' ? normalizeToken(v) : null)).filter((v): v is string => Boolean(v))
      : [];
    return { source, via };
  } catch {
    return null;
  }
}

function writeStoredContext(ctx: AttributionContext): void {
  try {
    localStorage.setItem(ATTR_KEY, JSON.stringify(ctx));
  } catch {
    // ignore quota / private mode
  }
}

/** Read `source` / `via` from the URL and persist for later outbound link rewriting. */
export function captureAttributionFromLocation(search = window.location.search): AttributionContext | null {
  const params = new URLSearchParams(search);
  const source = normalizeToken(params.get('source'));
  if (!source) return readStoredContext();

  const viaParams = params.getAll('via').flatMap((v) => v.split(/[|,]/));
  const via = viaParams.map(normalizeToken).filter((v): v is string => Boolean(v));
  const ctx = { source, via: [...new Set(via)] };
  writeStoredContext(ctx);
  return ctx;
}

export function getAttributionContext(): AttributionContext | null {
  return readStoredContext() ?? captureAttributionFromLocation();
}

export function getOrCreateVisitorId(): string {
  const fromCookie = readVisitorCookie();
  if (fromCookie) {
    try {
      localStorage.setItem(VISITOR_KEY, fromCookie);
    } catch {
      // ignore
    }
    return fromCookie;
  }

  try {
    const existing = localStorage.getItem(VISITOR_KEY);
    if (existing && UUID_RE.test(existing)) {
      const id = existing.toLowerCase();
      writeVisitorCookie(id);
      return id;
    }
    const id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
    writeVisitorCookie(id);
    return id;
  } catch {
    const id = crypto.randomUUID();
    writeVisitorCookie(id);
    return id;
  }
}

function rememberVisitorId(id: string): void {
  if (!UUID_RE.test(id)) return;
  const normalized = id.toLowerCase();
  try {
    localStorage.setItem(VISITOR_KEY, normalized);
  } catch {
    // ignore
  }
  writeVisitorCookie(normalized);
}

function isTicketocHost(host: string): boolean {
  const h = host.toLowerCase();
  return h === 'ticketoc.com' || h.endsWith('.ticketoc.com') || h === 'localhost' || h === '127.0.0.1';
}

/** Append `source` and add this site as a `via` hop on outbound Ticketoc URLs. */
export function appendAttributionToUrl(
  href: string,
  ctx: AttributionContext | null = getAttributionContext(),
  hop: string = SITE_ATTR_HOP,
): string {
  if (!ctx?.source) return href;
  try {
    const url = new URL(href, window.location.origin);
    if (!/^https?:$/.test(url.protocol)) return href;
    if (!isTicketocHost(url.hostname)) return href;

    url.searchParams.set('source', ctx.source);
    const nextVia = [...ctx.via.filter((v) => v !== hop), hop];
    url.searchParams.delete('via');
    for (const next of nextVia) url.searchParams.append('via', next);
    return url.toString();
  } catch {
    return href;
  }
}

/** True when the href will leave this origin for a Ticketoc destination with attribution applied. */
export function isAttributedOutboundHref(href: string): boolean {
  if (!getAttributionContext()?.source) return false;
  try {
    const url = new URL(href, window.location.origin);
    return isTicketocHost(url.hostname) && url.origin !== window.location.origin;
  } catch {
    return false;
  }
}

type TrackInput = {
  config: CmsConfig;
  eventType: 'land' | 'click';
  pageKey: string;
  pageUrl?: string;
  ctaKey?: string;
  signal?: AbortSignal;
};

export async function trackAttribution({
  config,
  eventType,
  pageKey,
  pageUrl,
  ctaKey,
  signal,
}: TrackInput): Promise<void> {
  const ctx = getAttributionContext();
  if (!ctx?.source) return;

  const visitorId = getOrCreateVisitorId();
  const body = {
    visitor_id: visitorId,
    event_type: eventType,
    source: ctx.source,
    via: ctx.via,
    page_key: pageKey,
    page_url: pageUrl ?? window.location.href.slice(0, 512),
    ...(ctaKey ? { cta_key: ctaKey } : {}),
    meta: { referrer: document.referrer || null },
  };

  try {
    const response = await fetch(
      `${config.apiUrl}/api/v1/public/sites/${encodeURIComponent(config.siteKey)}/attribution/track`,
      {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal,
        keepalive: true,
      },
    );
    if (!response.ok) return;
    const json = (await response.json()) as { data?: { visitor_id?: string } };
    if (json.data?.visitor_id) rememberVisitorId(json.data.visitor_id);
  } catch {
    // Attribution must never break the page.
  }
}

export function pageKeyForSlug(slug: string | null | undefined, isHome: boolean, prefix = SITE_PAGE_PREFIX): string {
  if (isHome) return `${prefix}.home`;
  return `${prefix}.${slug || 'page'}`;
}
