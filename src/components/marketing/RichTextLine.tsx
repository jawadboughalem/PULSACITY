import { Fragment } from "react";
import type { RichText } from "@/content/integrations";

/** A sentence of the content files, in bold where it names what the creator clicks on. */
export const RichTextLine = ({ parts }: { parts: RichText }) =>
  parts.map((part, index) =>
    typeof part === "string" ? (
      <Fragment key={index}>{part}</Fragment>
    ) : (
      <strong key={index} className="font-semibold">
        {part.strong}
      </strong>
    ),
  );
