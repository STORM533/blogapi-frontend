import DOMPurify from "dompurify";

const CONFIG = {
  ALLOWED_TAGS: [
    "p", "br", "strong", "em", "u", "s", "a", "ul", "ol", "li",
    "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "pre", "code",
    "img", "table", "thead", "tbody", "tr", "th", "td", "hr",
    "figure", "figcaption", "div", "span",
  ],
  ALLOWED_ATTR: [
    "href", "src", "alt", "title", "class", "target", "rel", "width", "height",
  ],
};

export function sanitize(html: string): string {
  return DOMPurify.sanitize(html, CONFIG).replace(/&nbsp;/g, " ");
}
