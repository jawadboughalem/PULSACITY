import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { Guide } from "@/content/guides";
import { guidePath } from "../marketing-paths";
import { formatGuideMeta } from "./format-guide-meta";

/** m22: the guides one per row, under a rule of Encre, a chevron on the right. Each row opens its guide. */
export const GuideList = ({ guides }: { guides: Guide[] }) => (
  <ul className="border-t border-ink">
    {guides.map((guide) => (
      <li key={guide.slug} className="border-b border-hairline-200">
        <Link
          href={guidePath(guide.slug)}
          className="group flex items-center gap-4 py-6 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ink desktop:gap-6 desktop:py-8"
        >
          <span className="flex min-w-[0] flex-1 flex-col gap-2">
            <span className="font-display text-quote group-hover:underline">{guide.title}</span>
            <span className="text-small text-gray desktop:text-body">{guide.summary}</span>
            <span className="text-small text-gray">{formatGuideMeta(guide)}</span>
          </span>
          <Icon name="chevronRight" size={20} className="shrink-0" />
        </Link>
      </li>
    ))}
  </ul>
);
