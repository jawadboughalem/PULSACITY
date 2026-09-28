import type { Ref } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

const CONSENT_ERROR_ID = "consent-error";

type ConsentFieldProps = {
  consentText: string;
  spaceName: string;
  isChecked: boolean;
  hasError: boolean;
  checkboxRef: Ref<HTMLInputElement>;
  onChange: (isChecked: boolean) => void;
};

export const ConsentField = ({ consentText, spaceName, isChecked, hasError, checkboxRef, onChange }: ConsentFieldProps) => (
  <div className={cn(hasError && "flex flex-col gap-3 rounded-lg border-2 border-error bg-error-surface p-4")}>
    <label className="flex min-h-[44px] cursor-pointer items-start gap-3 text-body">
      <span className="relative size-[24px] shrink-0">
        <input
          ref={checkboxRef}
          type="checkbox"
          checked={isChecked}
          onChange={(event) => onChange(event.target.checked)}
          aria-invalid={hasError ? true : undefined}
          aria-describedby={hasError ? CONSENT_ERROR_ID : undefined}
          className={cn(
            "peer size-[24px] cursor-pointer appearance-none rounded-sm border-2 bg-white checked:border-ink-900 checked:bg-ink-900",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900",
            hasError ? "border-error" : "border-gray-400",
          )}
        />
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="pointer-events-none absolute inset-[0] hidden size-[24px] fill-none stroke-white peer-checked:block"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6.5 12.5l3.5 3.5 7.5-8" />
        </svg>
      </span>
      <span>{consentText}</span>
    </label>
    {hasError ? (
      <p id={CONSENT_ERROR_ID} role="alert" className="flex items-start gap-2 pl-6 text-small text-error">
        <Icon name="alert" size={20} />
        <span>
          {`${spaceName} a besoin de votre accord pour publier ce témoignage. Cochez la case, puis renvoyez : votre texte est bien conservé.`}
        </span>
      </p>
    ) : null}
  </div>
);
