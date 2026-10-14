import { Component, type ReactNode } from "react";
import type { PageSettings, RenderSite, Section } from "../types";
import { RenderProvider, sectionStyle, type RenderOptions } from "./primitives";
import { SECTION_COMPONENTS } from "./sections";
import { SiteFooter, SiteHeader } from "./site-chrome";

interface Props {
  site: RenderSite;
  sections: Section[];
  settings?: PageSettings;
  options: RenderOptions;
  /** Pushes the fixed header below a banner (preview mode). */
  topOffset?: number;
  /** Replaces the sections, e.g. for a "page not found" message inside the site chrome. */
  children?: ReactNode;
}

export function SiteRenderer({ site, sections, settings, options, topOffset = 0, children }: Props) {
  return (
    <RenderProvider value={options}>
      <div className="site-root dark min-h-screen bg-black text-white" style={{ ["--site-top-offset" as string]: `${topOffset}px` }}>
        {settings?.show_header !== false && <SiteHeader site={site} />}
        <main>
          {children ??
            sections
              .filter((section) => section.visible !== false && section.type in SECTION_COMPONENTS)
              .map((section) => (
                <div key={section.id} data-section-type={section.type}>
                  <SectionBoundary>
                    <SectionView section={section} />
                  </SectionBoundary>
                </div>
              ))}
        </main>
        {settings?.show_footer !== false && <SiteFooter site={site} />}
      </div>
    </RenderProvider>
  );
}

function SectionView({ section }: { section: Section }) {
  const Renderer = SECTION_COMPONENTS[section.type];
  const props = section.props && typeof section.props === "object" ? section.props : {};
  const style = section.style && typeof section.style === "object" ? section.style : {};
  return <Renderer props={props} s={sectionStyle(style)} />;
}

/** One malformed section must not take the whole page down; it is skipped instead. */
class SectionBoundary extends Component<{ children: ReactNode }, { error: boolean }> {
  state = { error: false };

  static getDerivedStateFromError() {
    return { error: true };
  }

  componentDidCatch(error: unknown) {
    console.error("A CMS section could not be rendered", error);
  }

  render() {
    return this.state.error ? null : this.props.children;
  }
}
