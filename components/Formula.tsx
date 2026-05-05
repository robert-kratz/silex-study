import katex from "katex";

export function Formula({ expr, block = true }: { expr: string; block?: boolean }) {
  const html = katex.renderToString(expr, {
    throwOnError: false,
    displayMode: block,
  });
  const Tag = block ? "div" : "span";
  return <Tag className="leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />;
}
