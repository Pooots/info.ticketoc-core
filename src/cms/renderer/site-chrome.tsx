import { useState } from "react";
import type { RenderNavItem, RenderSite } from "../types";
import { cn } from "./utils";
import { LineIcon, SocialIcon } from "./icons";
import { SiteAnchor, SiteImage, link, list, media, obj, str } from "./primitives";

function Logo({ site, className }: { site: RenderSite; className: string }) {
  const brand = obj(site.settings.brand);
  const name = str(obj(site.settings.general).site_name) || site.name;
  return media(brand.logo) ? (
    <SiteImage value={brand.logo} alt={media(brand.logo)?.alt || name} className={className} />
  ) : (
    <span className="text-2xl font-black text-white">{name}</span>
  );
}

const navLinkClass =
  "relative text-gray-700 dark:text-gray-300 hover:text-yellow-400 transition-colors font-medium py-1 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:bg-gradient-to-r after:from-yellow-400 after:to-orange-500 after:w-0 hover:after:w-full after:transition-all after:duration-300";

export function SiteHeader({ site }: { site: RenderSite }) {
  const [open, setOpen] = useState(false);
  const cta = link(obj(site.settings.header).cta);
  const items = site.navigation.header;

  return (
    <header className="fixed top-[var(--site-top-offset,0px)] left-0 right-0 z-50 bg-white/80 dark:bg-black/90 backdrop-blur-md border-b border-gray-200 dark:border-black-border transition-all duration-300 animate-fade-in">
      <nav className="container mx-auto px-6 py-4" aria-label="Main">
        <div className="flex items-center justify-between">
          <SiteAnchor href="/" className="flex items-center gap-2">
            <Logo site={site} className="h-10 w-auto object-contain" />
          </SiteAnchor>

          <div className="flex items-center gap-4 md:gap-8">
            {items.length > 0 && (
              <div className="hidden md:flex items-center gap-8">
                {items.map((item) => (
                  <div key={item.id} className="group relative">
                    <SiteAnchor href={item.href} newTab={item.new_tab} className={navLinkClass}>
                      {item.label}
                    </SiteAnchor>
                    {item.children.length > 0 && (
                      <div className="invisible absolute right-0 top-full z-50 min-w-48 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100">
                        <div className="rounded-xl border border-black-border bg-black-card p-2 shadow-xl">
                          {item.children.map((child) => (
                            <SiteAnchor key={child.id} href={child.href} newTab={child.new_tab} className="block rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-black-elevated hover:text-yellow-400">
                              {child.label}
                            </SiteAnchor>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {cta && (
              <SiteAnchor
                href={cta.url}
                newTab={cta.new_tab}
                className="hidden sm:inline-block px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-yellow-500/30 transform hover:scale-105 btn-glow"
              >
                {cta.label}
              </SiteAnchor>
            )}
            {items.length > 0 && (
              <button className="md:hidden p-2 text-gray-300 hover:text-yellow-400" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label="Toggle menu">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            )}
          </div>
        </div>

        {open && (
          <div className="md:hidden mt-4 border-t border-black-border pt-4 space-y-1">
            {flatten(items).map((item) => (
              <SiteAnchor key={item.id} href={item.href} newTab={item.new_tab} className="block rounded-lg px-3 py-2 text-gray-300 hover:bg-black-elevated hover:text-yellow-400">
                {item.label}
              </SiteAnchor>
            ))}
            {cta && (
              <SiteAnchor href={cta.url} newTab={cta.new_tab} className="mt-2 block rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-2 text-center font-semibold text-white">
                {cta.label}
              </SiteAnchor>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

function flatten(items: RenderNavItem[]): RenderNavItem[] {
  return items.flatMap((item) => [item, ...flatten(item.children)]);
}

export function SiteFooter({ site }: { site: RenderSite }) {
  const footer = obj(site.settings.footer);
  const contact = obj(site.settings.contact);
  const social = list<{ platform?: string; url?: string }>(obj(site.settings.social).links);
  const groups = site.navigation.footer.filter((item) => item.children.length > 0);
  const loose = site.navigation.footer.filter((item) => item.children.length === 0);
  const hasContact = Boolean(str(contact.email) || str(contact.phone) || str(contact.address));
  const columns = 1 + groups.length + (loose.length > 0 ? 1 : 0) + (hasContact ? 1 : 0);

  return (
    <footer className="bg-slate-900 dark:bg-black text-gray-300 py-12 border-t border-slate-800 dark:border-black-border transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-8 mb-8", columns >= 4 ? "lg:grid-cols-4" : columns === 3 ? "lg:grid-cols-3" : "")}>
          <div>
            <div className="mb-4">
              <Logo site={site} className="h-10 w-auto object-contain" />
            </div>
            {str(footer.description) && <p className="text-gray-400 mb-4 leading-relaxed">{str(footer.description)}</p>}
            {social.length > 0 && (
              <div className="flex gap-4">
                {social.map((s, i) => (
                  <SiteAnchor
                    key={i}
                    href={s.url}
                    newTab={s.url !== "#"}
                    ariaLabel={s.platform}
                    className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:border-yellow-500 hover:text-yellow-500 transition-colors"
                  >
                    <SocialIcon platform={str(s.platform)} />
                  </SiteAnchor>
                ))}
              </div>
            )}
          </div>

          {groups.map((group) => (
            <div key={group.id}>
              <h3 className="text-white font-bold mb-4">{group.label}</h3>
              <ul className="space-y-2">
                {group.children.map((child) => (
                  <li key={child.id}>
                    <SiteAnchor href={child.href} newTab={child.new_tab} className="text-gray-400 hover:text-yellow-500 transition-colors">
                      {child.label}
                    </SiteAnchor>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {loose.length > 0 && (
            <div>
              <h3 className="text-white font-bold mb-4">Links</h3>
              <ul className="space-y-2">
                {loose.map((item) => (
                  <li key={item.id}>
                    <SiteAnchor href={item.href} newTab={item.new_tab} className="text-gray-400 hover:text-yellow-500 transition-colors">
                      {item.label}
                    </SiteAnchor>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasContact && (
            <div>
              <h3 className="text-white font-bold mb-4">Contact Us</h3>
              <ul className="space-y-3">
                {str(contact.email) && (
                  <li className="flex items-center gap-3">
                    <LineIcon name="mail" className="w-5 h-5 text-yellow-500 shrink-0" />
                    <SiteAnchor href={`mailto:${str(contact.email)}`} className="text-gray-400 hover:text-yellow-500 transition-colors">
                      {str(contact.email)}
                    </SiteAnchor>
                  </li>
                )}
                {str(contact.phone) && (
                  <li className="flex items-center gap-3">
                    <LineIcon name="phone" className="w-5 h-5 text-yellow-500 shrink-0" />
                    <SiteAnchor href={`tel:${str(contact.phone).replace(/[^\d+]/g, "")}`} className="text-gray-400 hover:text-yellow-500 transition-colors">
                      {str(contact.phone)}
                    </SiteAnchor>
                  </li>
                )}
                {str(contact.address) && (
                  <li className="flex items-center gap-3">
                    <LineIcon name="map-pin" className="w-5 h-5 text-yellow-500 shrink-0" />
                    <span className="text-gray-400 whitespace-pre-line">{str(contact.address)}</span>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {(str(footer.copyright) || str(footer.note)) && (
          <div className="border-t border-slate-800 dark:border-black-border pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {str(footer.copyright) && <p className="text-gray-400 text-sm">{str(footer.copyright)}</p>}
              {str(footer.note) && <p className="text-gray-400 text-sm">{str(footer.note)}</p>}
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}
