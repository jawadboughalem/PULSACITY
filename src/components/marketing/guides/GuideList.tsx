import Link from "next/link";
import { FOCUS_RING } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import type { Guide } from "@/content/guides";
import { cn } from "@/lib/cn";
import { guidePath } from "../marketing-paths";
import { formatGuideMeta } from "./format-guide-meta";

type GuideListProps = {
  guides: Guide[];
  /** White bands on a Nuage section, Nuage ones on a white section (charte v2, ajouts 3.5, Ligne de guide). */
  surface: "white" | "cloud";
};

/**
 * Charte v2, ajouts 3.5, Ligne de guide: a band per guide, radius 20, its title in Bricolage 22/28, its summary 17/26,
 * « Mis à jour le … · N minutes de lecture » 14/20 Gris, a chevron of 20. Each opens its guide.
 */
export const GuideList = ({ guides, surface }: GuideListProps) => (
  <ul className="flex flex-col gap-3">
    {guides.map((guide) => (
      <li key={guide.slug}>
        <Link
          href={guidePath(guide.slug)}
          className={cn(
            "group flex items-center gap-4 rounded-card p-5 desktop:gap-6 desktop:px-7 desktop:py-6",
            surface === "white" ? "bg-white" : "bg-cloud",
            FOCUS_RING,
          )}
        >
          <span className="flex min-w-[0] flex-1 flex-col gap-1">
            <span className="pz-couleur font-display text-[22px] leading-[28px] decoration-2 underline-offset-4 group-hover:text-ink-800 group-hover:underline">
              {guide.title}
            </span>
            <span className="text-body">{guide.summary}</span>
            <span className="mt-1 text-badge text-gray">{formatGuideMeta(guide)}</span>
          </span>
          <Icon name="chevronRight" size={20} className="shrink-0" />
        </Link>
      </li>
    ))}
  </ul>
);
