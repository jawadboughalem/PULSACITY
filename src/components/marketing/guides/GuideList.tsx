import Link from "next/link";
import type { Guide } from "@/content/guides";
import { formatGuideMeta } from "./format-guide-meta";
import { guidePath } from "../marketing-paths";

/** The guides one per row, under a rule of Encre, like the rows of m7. Each row opens its guide. */
export const GuideList = ({ guides }: { guides: Guide[] }) => (
  <ul className="border-t border-ink-900">
    {guides.map((guide) => (
      <li key={guide.slug} className="border-b border-hairline-200">
        <Link
          href={guidePath(guide.slug)}
          className="group flex flex-col gap-2 py-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
        >
          <span className="font-serif text-quote font-medium group-hover:underline">{guide.title}</span>
          <span className="max-w-text text-body text-slate-600">{guide.description}</span>
          <span className="text-small text-slate-600">{formatGuideMeta(guide)}</span>
        </Link>
      </li>
    ))}
  </ul>
);
