import type { ReactNode } from "react";

/** Stroke icons (Heroicons outline paths, as used on the Ticketoc site). */
const LINE_ICONS: Record<string, string[]> = {
  "shield-check": [
    "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  ],
  bolt: ["M13 10V3L4 14h7v7l9-11h-7z"],
  "credit-card": ["M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"],
  clock: ["M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"],
  users: [
    "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  ],
  "device-mobile": ["M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"],
  star: [
    "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  ],
  globe: [
    "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9",
  ],
  ticket: [
    "M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z",
  ],
  heart: [
    "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  ],
  mail: ["M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"],
  phone: [
    "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
  ],
  "map-pin": [
    "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
    "M15 11a3 3 0 11-6 0 3 3 0 016 0z",
  ],
  "arrow-down": ["M19 14l-7 7m0 0l-7-7m7 7V3"],
  check: ["M5 13l4 4L19 7"],
};

/** Rounded brand icons (Ticketoc categories and merchant pain points), drawn on their own grids. */
const SHAPE_ICONS: Record<string, { viewBox: string; strokeWidth: number; body: ReactNode }> = {
  events: {
    viewBox: "0 0 32 32",
    strokeWidth: 2.2,
    body: (
      <>
        <path d="M5 10a2 2 0 012-2h18a2 2 0 012 2v3a3 3 0 000 6v3a2 2 0 01-2 2H7a2 2 0 01-2-2v-3a3 3 0 000-6z" strokeLinejoin="round" />
        <path d="M20 9v14" strokeDasharray="2.2 2.6" strokeLinecap="round" />
      </>
    ),
  },
  sports: {
    viewBox: "0 0 32 32",
    strokeWidth: 2.2,
    body: (
      <>
        <circle cx="16" cy="16" r="11" />
        <path d="M5.5 13c4 0 8 1.5 10.5 5s6 5 10.5 5M9 6.5c3 2.5 5 6 5 10.5s-1.5 7.5-3.5 9.5M23 6.5c-1.5 3-1.5 6 0 9" strokeLinecap="round" />
      </>
    ),
  },
  explore: {
    viewBox: "0 0 32 32",
    strokeWidth: 2.2,
    body: (
      <>
        <circle cx="16" cy="16" r="11" />
        <path d="M20.5 11.5l-2.8 6.2-6.2 2.8 2.8-6.2z" strokeLinejoin="round" />
      </>
    ),
  },
  spaces: {
    viewBox: "0 0 32 32",
    strokeWidth: 2.2,
    body: (
      <>
        <path d="M5 27V12l11-7 11 7v15" strokeLinejoin="round" />
        <path d="M12 27v-8h8v8M3 27h26" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  travel: {
    viewBox: "0 0 32 32",
    strokeWidth: 2.2,
    body: (
      <>
        <rect x="6" y="5" width="20" height="18" rx="4" />
        <path d="M6 15h20M10 27l2-4M22 27l-2-4" strokeLinecap="round" />
        <circle cx="11" cy="19" r="1.4" fill="currentColor" stroke="none" />
        <circle cx="21" cy="19" r="1.4" fill="currentColor" stroke="none" />
      </>
    ),
  },
  wellness: {
    viewBox: "0 0 32 32",
    strokeWidth: 2.2,
    body: (
      <>
        <path d="M16 27c-6 0-10-4-10-9 3 0 7 1 10 4 3-3 7-4 10-4 0 5-4 9-10 9z" strokeLinejoin="round" />
        <path d="M16 22c-2.5-2.5-3.5-5.5-3.5-8.5S14 7.5 16 5c2 2.5 3.5 5.5 3.5 8.5S18.5 19.5 16 22z" strokeLinejoin="round" />
      </>
    ),
  },
  stay: {
    viewBox: "0 0 32 32",
    strokeWidth: 2.2,
    body: (
      <>
        <path d="M4 25V9M4 19h24v6M28 19v-3a4 4 0 00-4-4H14v7" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="15" r="2.5" />
      </>
    ),
  },
  eats: {
    viewBox: "0 0 32 32",
    strokeWidth: 2.2,
    body: <path d="M9 4v9a3 3 0 006 0V4M12 13v15M23 28V4c-3 2-4.5 6-4.5 10v3H23" strokeLinecap="round" strokeLinejoin="round" />,
  },
  chat: {
    viewBox: "0 0 24 24",
    strokeWidth: 2,
    body: (
      <>
        <path d="M4 5h16v11H9l-5 4z" strokeLinejoin="round" />
        <path d="M8 9.5h8M8 12.5h5" strokeLinecap="round" />
      </>
    ),
  },
  receipt: {
    viewBox: "0 0 24 24",
    strokeWidth: 2,
    body: (
      <>
        <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" strokeLinejoin="round" />
        <path d="M9 8h6M9 12h6" strokeLinecap="round" />
      </>
    ),
  },
  spreadsheet: {
    viewBox: "0 0 24 24",
    strokeWidth: 2,
    body: (
      <>
        <rect x="3.5" y="4" width="17" height="16" rx="2" />
        <path d="M3.5 9.5h17M3.5 15h17M9.5 4v16" />
      </>
    ),
  },
  "calendar-x": {
    viewBox: "0 0 24 24",
    strokeWidth: 2,
    body: (
      <>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M4 10h16M8 3v4M16 3v4M10 13.5l4 4M14 13.5l-4 4" strokeLinecap="round" />
      </>
    ),
  },
  bell: { viewBox: "0 0 24 24", strokeWidth: 2, body: <path d="M6 16V11a6 6 0 0112 0v5l2 2H4z M10 20a2 2 0 004 0" strokeLinejoin="round" /> },
  peso: { viewBox: "0 0 24 24", strokeWidth: 2, body: <path d="M8 20V4h5a4.5 4.5 0 010 9H8M5 8h14M5 11h14" strokeLinecap="round" strokeLinejoin="round" /> },
};

export const ICON_NAMES = [...Object.keys(LINE_ICONS).filter((n) => !["mail", "phone", "map-pin", "arrow-down"].includes(n)), ...Object.keys(SHAPE_ICONS)];

export function LineIcon({ name, className = "w-8 h-8" }: { name: string; className?: string }) {
  const shape = SHAPE_ICONS[name];
  if (shape) {
    return (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={shape.strokeWidth} viewBox={shape.viewBox} aria-hidden="true">
        {shape.body}
      </svg>
    );
  }
  const paths = LINE_ICONS[name];
  if (!paths) return null;
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      {paths.map((d) => (
        <path key={d} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
      ))}
    </svg>
  );
}

export function isLineIcon(value: unknown): value is string {
  return typeof value === "string" && (value in LINE_ICONS || value in SHAPE_ICONS);
}

/** Renders a named line icon, or the value itself (emoji / short text) when it is not a known name. */
export function SiteIcon({ value, className }: { value: unknown; className?: string }): ReactNode {
  if (typeof value !== "string" || value === "") return null;
  if (isLineIcon(value)) return <LineIcon name={value} className={className} />;
  return <span aria-hidden="true">{value}</span>;
}

const SOCIAL_PATHS: Record<string, string> = {
  facebook:
    "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  instagram:
    "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  x: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z",
  youtube:
    "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  tiktok:
    "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
};

export function SocialIcon({ platform, className = "w-5 h-5" }: { platform: string; className?: string }) {
  const d = SOCIAL_PATHS[platform];
  if (!d) return null;
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
