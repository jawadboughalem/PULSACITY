"use client";

import { useEffect, useRef } from "react";
import { INLINE_LINK_CLASSES } from "./button-styles";
import { Icon } from "./Icon";

export type ErrorSummaryItem = {
  fieldId: string;
  message: string;
  /** On a phone, the field's name alone, when the message is long (Réglages). */
  shortMessage?: string;
};

type ErrorSummaryProps = {
  title: string;
  /** On a phone, a shorter title. */
  shortTitle?: string;
  items: ErrorSummaryItem[];
};

const Responsive = ({ text, short }: { text: string; short?: string }) =>
  short ? (
    <>
      <span className="desktop:hidden">{short}</span>
      <span className="max-desktop:hidden">{text}</span>
    </>
  ) : (
    text
  );

/**
 * The list of what to fix, at the top of a form: it takes the focus, and each line leads to its field. Charte v2: the
 * error banner (Erreur fond, a 2 px Erreur border, the icon in Erreur, the text in Encre).
 */
export const ErrorSummary = ({ title, shortTitle, items }: ErrorSummaryProps) => {
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    summaryRef.current?.focus();
  }, []);

  const goToField = (event: React.MouseEvent<HTMLAnchorElement>, fieldId: string) => {
    const field = document.getElementById(fieldId);
    if (!field) return;
    event.preventDefault();
    field.scrollIntoView({ block: "center" });
    field.focus({ preventScroll: true });
  };

  return (
    <div
      ref={summaryRef}
      role="alert"
      tabIndex={-1}
      className="flex items-start gap-[14px] rounded-card border-2 border-error bg-error-surface px-5 py-4 text-ink focus:outline-none desktop:px-6 desktop:py-5"
    >
      <Icon name="alert" size={24} className="mt-[1px] shrink-0 text-error" />
      <div className="flex flex-col gap-2">
        <p className="text-body font-bold">
          <Responsive text={title} short={shortTitle} />
        </p>
        <ul className="flex list-disc flex-col gap-1 pl-6 text-small">
          {items.map((item) => (
            <li key={item.fieldId}>
              <a
                href={`#${item.fieldId}`}
                onClick={(event) => goToField(event, item.fieldId)}
                className={INLINE_LINK_CLASSES}
              >
                <Responsive text={item.message} short={item.shortMessage} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
