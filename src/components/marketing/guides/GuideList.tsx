import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { Guide } from "@/content/guides";
import { guidePath } from "../marketing-paths";
import { formatGuideMeta } from "./format-guide-meta";

/** m22: the guides one per row, under a rule of Encre, a chevron on the right. Each row opens its guide. */
export const GuideList = ({ guides }: { guides: Guide[] }) => (
  <ul className="border-t border-ink-900">
    {guides.map((guide) => (
      <li key={guide.slug} className="border-b border-hairline-200">
        <Link
          href={guidePath(guide.slug)}
          className="group flex items-center gap-4 py-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900 desktop:gap-5 desktop:py-6"
        >
          <span className="flex min-w-[0] flex-1 flex-col gap-2">
            <span className="font-serif text-quote group-hover:underline">{guide.title}</span>
            <span className="text-small text-slate-600 desktop:text-body">{guide.summary}</span>
            <span className="text-small text-slate-600">{formatGuideMeta(guide)}</span>
          </span>
          <Icon name="chevronRight" size={20} className="shrink-0" />
        </Link>
      </li>
    ))}
  </ul>
);
