import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { readNodeText, slugifyHeading } from "@/lib/content/text-headings";

const LINK_CLASSES =
  "font-medium text-carmine underline underline-offset-[3px] hover:text-carmine-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900";

/** A link of the site goes through next/link; another site's opens as a plain link. */
const ProseLink = ({ href = "", children }: ComponentPropsWithoutRef<"a">) =>
  href.startsWith("/") || href.startsWith("#") ? (
    <Link href={href} className={LINK_CLASSES}>
      {children}
    </Link>
  ) : (
    <a href={href} className={LINK_CLASSES} rel="noopener">
      {children}
    </a>
  );

const TITLE_CLASSES = "mt-6 scroll-mt-5 font-serif text-quote font-medium desktop:text-h2";

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

/** What the company still has to provide, highlighted in Attention while a draft (m23): <ToComplete>SIREN</ToComplete>. */
const ToComplete = ({ children }: { children: ReactNode }) => (
  <mark className="box-decoration-clone bg-attention-surface px-1 font-semibold text-attention">
    [À COMPLÉTER : {children}]
  </mark>
);

/**
 * The long texts of the site (guides, legal texts): the charter's sizes, 68 characters a line at most. Their column
 * spaces the blocks (ProseColumn); a title takes more room above it.
 */
const components = {
  h2: ProseTitle,
  h3: ({ children }) => <h3 className="mt-3 font-serif text-quote font-medium">{children}</h3>,
  p: ({ children }) => <p className="max-w-text text-body">{children}</p>,
  ul: ({ children }) => <ul className="flex max-w-text list-disc flex-col gap-2 pl-5 text-body">{children}</ul>,
  ol: ({ children }) => <ol className="flex max-w-text list-decimal flex-col gap-2 pl-5 text-body">{children}</ol>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  a: ProseLink,
  AnchoredHeading,
  ToComplete,
  blockquote: ({ children }) => (
    <blockquote className="max-w-quote border-l-2 border-ink-900 pl-5 font-serif text-quote">{children}</blockquote>
  ),
} satisfies MDXComponents;

export const useMDXComponents = (): MDXComponents => components;
