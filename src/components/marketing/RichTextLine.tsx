import Link from "next/link";
import { Fragment } from "react";
import { INLINE_LINK_CLASSES } from "@/components/marketing/marketing-styles";
import type { RichText } from "@/content/integrations";

/** A sentence of the content files, in bold where it names what the creator clicks on, with its links. */
export const RichTextLine = ({ parts }: { parts: RichText }) =>
  parts.map((part, index) => {
    if (typeof part === "string") return <Fragment key={index}>{part}</Fragment>;
    if ("link" in part) {
      return (
        <Link key={index} href={part.href} className={INLINE_LINK_CLASSES}>
          {part.link}
        </Link>
      );
    }
    return (
      <strong key={index} className="font-semibold">
        {part.strong}
      </strong>
    );
  });
