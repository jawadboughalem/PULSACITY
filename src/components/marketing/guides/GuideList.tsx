import Link from "next/link";
import { FOCUS_RING } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import type { Guide } from "@/content/guides";
import { cn } from "@/lib/cn";
import { guidePath } from "../marketing-paths";
import { formatGuideMeta } from "./format-guide-meta";

/** m22: the guides one per card on Nuage (charte v2: no rule between them), a chevron on the right. Each opens its guide. */
export const GuideList = ({ guides }: { guides: Guide[] }) => (
  <ul className="flex flex-col gap-3">
    {guides.map((guide) => (
      <li key={guide.slug}>
        <Link
          href={guidePath(guide.slug)}
          className={cn(
            "pz-couleur flex items-center gap-4 rounded-card bg-cloud p-5 hover:bg-sky desktop:gap-6 desktop:p-6",
            FOCUS_RING,
          )}
        >
          <span className="flex min-w-[0] flex-1 flex-col gap-2">
            <span className="font-display text-h3">{guide.title}</span>
            <span className="text-small text-gray desktop:text-body">{guide.summary}</span>
            <span className="text-small text-gray">{formatGuideMeta(guide)}</span>
          </span>
          <Icon name="chevronRight" size={20} className="shrink-0" />
        </Link>
      </li>
    ))}
  </ul>
);
