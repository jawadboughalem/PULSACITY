import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { INLINE_LINK_CLASSES } from "@/components/ui/button-styles";
import { readNodeText, slugifyHeading } from "@/lib/content/text-headings";

/** A link of the site goes through next/link; another site's opens as a plain link. */
const ProseLink = ({ href = "", children }: ComponentPropsWithoutRef<"a">) =>
  href.startsWith("/") || href.startsWith("#") ? (
    <Link href={href} className={INLINE_LINK_CLASSES}>
      {children}
    </Link>
  ) : (
    <a href={href} className={INLINE_LINK_CLASSES} rel="noopener">
      {children}
    </a>
  );

const TITLE_CLASSES = "mt-6 scroll-mt-6 font-display text-h2 first:mt-[0]";

/** A title of the text, anchored for the table of contents (m22, m23): « #qui-traite-vos-donnees ». */
const ProseTitle = ({ children }: { children?: ReactNode }) => (
  <h2 id={slugifyHeading(readNodeText(children))} className={TITLE_CLASSES}>
    {children}
  </h2>
);

type AnchoredHeadingProps = { id: string; children: ReactNode };

/** A title that other pages link to, such as « #cookies »: written <AnchoredHeading id="cookies"> in the text. */
const AnchoredHeading = ({ id, children }: AnchoredHeadingProps) => (
  <h2 id={id} className={TITLE_CLASSES}>
    {children}
  </h2>
);

/**
 * What the company still has to provide, while a draft (charte v2, ajouts 3.5, Brouillon et champs à compléter):
 * highlighted in Attente fond, Attente 700, radius 4, line by line. Written <ToComplete>SIREN</ToComplete>.
 */
const ToComplete = ({ children }: { children: ReactNode }) => (
  <mark className="rounded-[4px] box-decoration-clone bg-waiting-surface px-1 font-bold text-waiting">
    [À COMPLÉTER : {children}]
  </mark>
);

/** Charte v2, ajouts 3.5, Lecture: the text in 17/27, 68 characters a line at most. */
const TEXT_CLASSES = "text-[17px] leading-[27px]";

/**
 * The long texts of the site (guides, legal texts), on the white plate of ReadingLayout. Their column spaces the blocks
 * (ProseColumn); a title takes more room above it.
 */
const components = {
  h2: ProseTitle,
  h3: ({ children }) => <h3 className="mt-3 font-display text-h3">{children}</h3>,
  p: ({ children }) => <p className={`max-w-text ${TEXT_CLASSES}`}>{children}</p>,
  ul: ({ children }) => <ul className={`flex max-w-text list-disc flex-col gap-2 pl-6 ${TEXT_CLASSES}`}>{children}</ul>,
  ol: ({ children }) => <ol className={`flex max-w-text list-decimal flex-col gap-2 pl-6 ${TEXT_CLASSES}`}>{children}</ol>,
  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
  a: ProseLink,
  AnchoredHeading,
  ToComplete,
  blockquote: ({ children }) => (
    <blockquote className="max-w-quote border-l-2 border-ink pl-6 text-quote">{children}</blockquote>
  ),
} satisfies MDXComponents;

export const useMDXComponents = (): MDXComponents => components;
