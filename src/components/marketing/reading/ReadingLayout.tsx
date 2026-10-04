import type { ReactNode } from "react";
import { MarketingSection } from "@/components/marketing/MarketingSection";
import { ProseColumn } from "@/components/marketing/ProseColumn";
import type { TextHeading } from "@/lib/content/text-headings";
import { FoldedTableOfContents, TableOfContents } from "./TableOfContents";

type ReadingLayoutProps = {
  labelledBy: string;
  /** Above the text and its contents, such as « Guides › Coller le widget dans Systeme.io ». */
  breadcrumb?: ReactNode;
  /** The title, its date, and what comes before the text: the lead of a guide, the banner of a draft. */
  header: ReactNode;
  /** « Dans ce guide », « Sur cette page » */
  contentsTitle: string;
  headings: TextHeading[];
  children: ReactNode;
};

/**
 * m22 and m23: a long text on a column of 68 characters, its titles listed on the right on a computer, folded under the
 * introduction on a phone.
 */
export const ReadingLayout = ({ labelledBy, breadcrumb, header, contentsTitle, headings, children }: ReadingLayoutProps) => (
  <MarketingSection labelledBy={labelledBy} className={breadcrumb ? "desktop:pt-7" : "desktop:pt-8"}>
    {breadcrumb ? <div className="mb-4 desktop:mb-5">{breadcrumb}</div> : null}
    <div className="grid desktop:grid-cols-[680px_minmax(0,1fr)] desktop:gap-x-9">
      <article className="flex min-w-[0] flex-col gap-6 desktop:gap-7">
        <header className="flex flex-col gap-4">{header}</header>
        {headings.length > 1 ? (
          <div className="desktop:hidden">
            <FoldedTableOfContents title={contentsTitle} headings={headings} />
          </div>
        ) : null}
        <ProseColumn>{children}</ProseColumn>
      </article>
      {headings.length > 1 ? (
        <aside className="hidden desktop:block">
          <TableOfContents title={contentsTitle} headings={headings} />
        </aside>
      ) : null}
    </div>
  </MarketingSection>
);
