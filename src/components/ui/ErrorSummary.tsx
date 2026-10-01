"use client";

import { useEffect, useRef } from "react";
import { Icon } from "./Icon";

export type ErrorSummaryItem = {
  fieldId: string;
  message: string;
};

type ErrorSummaryProps = {
  title: string;
  items: ErrorSummaryItem[];
};

/** The list of what to fix, at the top of a form: it takes the focus, and each line leads to its field. */
export const ErrorSummary = ({ title, items }: ErrorSummaryProps) => {
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
      className="flex items-start gap-3 border-2 border-error bg-error-surface p-4 text-error focus:outline-none desktop:p-5"
    >
      <Icon name="alert" size={20} className="mt-[2px] shrink-0" />
      <div className="flex flex-col gap-2">
        <p className="text-body font-semibold">{title}</p>
        <ul className="flex list-disc flex-col gap-1 pl-5 text-small">
          {items.map((item) => (
            <li key={item.fieldId}>
              <a
                href={`#${item.fieldId}`}
                onClick={(event) => goToField(event, item.fieldId)}
                className="underline underline-offset-[3px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
              >
                {item.message}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
