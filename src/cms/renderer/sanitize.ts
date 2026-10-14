/**
 * Client-side allowlist sanitizer for rich text. Content is already sanitized by the API when it is
 * saved; this is defense in depth for the editor canvas, which renders unsaved local edits.
 */
const ALLOWED_TAGS = new Set(["P", "BR", "STRONG", "B", "EM", "I", "U", "S", "A", "UL", "OL", "LI", "H2", "H3", "H4", "BLOCKQUOTE", "CODE", "HR"]);
const SAFE_URL = /^(https?:|mailto:|tel:|\/(?!\/)|#)/i;

export function sanitizeHtml(html: string): string {
  if (typeof window === "undefined" || !html) return "";
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, "text/html");

  const clean = (node: Element) => {
    for (const child of Array.from(node.children)) {
      // Foreign (SVG/MathML) elements report lowercase tag names.
      const tag = child.tagName.toUpperCase();
      if (!ALLOWED_TAGS.has(tag) || child.namespaceURI !== "http://www.w3.org/1999/xhtml") {
        if (["SCRIPT", "STYLE", "IFRAME", "OBJECT", "EMBED", "TEMPLATE", "SVG", "MATH", "NOSCRIPT"].includes(tag)) {
          child.remove();
        } else {
          clean(child);
          child.replaceWith(...Array.from(child.childNodes));
        }
        continue;
      }
      for (const attr of Array.from(child.attributes)) {
        const keep = tag === "A" && (attr.name === "href" || attr.name === "target" || attr.name === "rel");
        if (!keep) child.removeAttribute(attr.name);
      }
      if (tag === "A") {
        const href = child.getAttribute("href") ?? "";
        if (!SAFE_URL.test(href.trim())) child.removeAttribute("href");
        if (child.getAttribute("target") === "_blank") child.setAttribute("rel", "noopener noreferrer");
        else child.removeAttribute("target");
      }
      clean(child);
    }
  };

  clean(doc.body);
  return doc.body.innerHTML;
}
