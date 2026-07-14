import Link from "next/link";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { withUtm, shouldTagWithUtm, pathToContextSlug } from "@/lib/utm";

type Props = {
  content: string;
  campaign?: string;
};

export function MarkdownBody({ content, campaign }: Props) {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ href, children }) => {
          if (!href) return <span>{children}</span>;
          if (href.startsWith("/")) {
            return <Link href={href}>{children}</Link>;
          }
          let finalHref = href;
          if (campaign && shouldTagWithUtm(href)) {
            try {
              const u = new URL(href);
              finalHref = withUtm(href, {
                campaign,
                content: pathToContextSlug(u.pathname),
              });
            } catch {
              finalHref = href;
            }
          }
          return (
            <a href={finalHref} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          );
        },
      }}
    >
      {content}
    </Markdown>
  );
}
