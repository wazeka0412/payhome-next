// Simple HTML sanitizer — strips dangerous tags/attributes
const ALLOWED_TAGS = new Set(['p','h1','h2','h3','h4','h5','h6','ul','ol','li','blockquote','a','strong','em','u','br','hr','span','div','img','table','thead','tbody','tr','th','td']);
const ALLOWED_ATTRS = new Set(['href','src','alt','class','target','rel']);

export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') return html;
  const doc = new DOMParser().parseFromString(html, 'text/html');
  function clean(node: Node): void {
    const children = Array.from(node.childNodes);
    for (const child of children) {
      if (child.nodeType === 1) {
        const el = child as HTMLElement;
        const tag = el.tagName.toLowerCase();
        if (!ALLOWED_TAGS.has(tag)) {
          // Replace with text content for script/style, keep children for others
          if (tag === 'script' || tag === 'style' || tag === 'iframe' || tag === 'object' || tag === 'embed') {
            el.remove();
          } else {
            el.replaceWith(...Array.from(el.childNodes));
          }
          continue;
        }
        // Remove disallowed attributes
        for (const attr of Array.from(el.attributes)) {
          if (!ALLOWED_ATTRS.has(attr.name) || attr.value.startsWith('javascript:')) {
            el.removeAttribute(attr.name);
          }
        }
        // Force safe link targets
        if (tag === 'a') {
          el.setAttribute('rel', 'noopener noreferrer');
        }
        clean(el);
      }
    }
  }
  clean(doc.body);
  return doc.body.innerHTML;
}
