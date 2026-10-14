/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Origin of the CMS API (cms-web-ws), e.g. https://cms-api.example.com. Public, not a secret. */
  readonly VITE_CMS_API_URL?: string;
  /** Site key of this website in the CMS (shown on the website overview in the CMS admin). */
  readonly VITE_CMS_SITE_KEY?: string;
  /** Optional platform domain, e.g. sites.example.com: its subdomains show the customer website registered for them. */
  readonly VITE_CMS_TENANT_DOMAIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
