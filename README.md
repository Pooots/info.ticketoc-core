# Ticketoc Frontend

A modern, responsive ticketing platform built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- 🎨 Dark/Light mode toggle
- ✨ Smooth animations and transitions
- 📱 Fully responsive design
- 🚀 Fast development with Vite
- 🎯 TypeScript for type safety

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Navigate to the core directory:
```bash
cd core
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Content management (CMS)

The page content — sections, texts, images, header navigation, footer, contact details and SEO tags — is
managed in the CMS (`../cms-web-admin`) and loaded at runtime from the CMS public API (`../cms-web-ws`).
Editors publish in the CMS; visitors see the change on their next page load.

1. Copy the environment file and adjust it if the CMS API runs elsewhere:
   ```bash
   cp .env.example .env.local
   ```
   | Variable | Example | Meaning |
   | --- | --- | --- |
   | `VITE_CMS_API_URL` | `http://localhost:8000` | Origin of the CMS API |
   | `VITE_CMS_SITE_KEY` | `ticketoc-info` | Site key shown on the website's overview in the CMS admin |
   | `VITE_CMS_TENANT_DOMAIN` | `ticketoc.localhost` | Optional. Subdomains of this domain show the customer website registered for them; must match `CMS_HOSTING_TICKETOC_URL` in the API |

   These values are compiled into the browser bundle. They are public identifiers, not secrets — never
   put credentials in `VITE_` variables. If either value is empty, the original hard-coded landing page
   (`src/components/*`) is shown instead.
2. Start the CMS API (`php artisan serve --port=8000` in `cms-web-ws`) and run `npm run dev`.

| URL | Shows |
| --- | --- |
| `/` | The published home page |
| `/<slug>` | Any other published page (unknown slugs show a "Page not found" page) |
| `/cms-preview?token=…` | A draft preview opened from the CMS editor ("Open on website") |

In the CMS admin, the website's front-end preview URL must be `<site origin>/cms-preview`.

**Hosting:** this is a single-page app. Configure the web server or CDN to serve `index.html` for every
path that is not a file, so `/<slug>` and `/cms-preview` work on direct visits. `VITE_CMS_*` must be set
when running `npm run build`. `deploy/build.sh` and `deploy/release.sh` build and release this site (with
rollback), and `.github/workflows/deploy.yml` runs them after approval; server, DNS and certificate setup
are in the [website deployment kit](../deploy/README.md). These files are copies from `../deploy/site-kit`.

**Renderer:** `src/cms/renderer/` is a copy of the CMS admin's website renderer
(`cms-web-admin/src/renderer`), so the CMS editor canvas, CMS previews and this site look identical.
When a section component changes, update both copies.

### Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

### Checks

```bash
npm run typecheck   # TypeScript
npm test            # Vitest unit/component tests (CMS client, routing, rendering, preview states)
```

## Project Structure

```
core/
├── src/
│   ├── cms/             # CMS integration: API client, page routing, SEO tags, renderer
│   ├── components/      # Original hard-coded landing page (used when no CMS is configured)
│   ├── contexts/        # React contexts (Theme)
│   ├── App.tsx          # Main app component (CMS site, or the original page without a CMS)
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── tsconfig.json        # TypeScript configuration
```

## Technologies

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **PostCSS** - CSS processing
