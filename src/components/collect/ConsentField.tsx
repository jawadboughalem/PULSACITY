import type { Ref } from "react";
import { FOCUS_RING } from "@/components/ui/button-styles";
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

/** Charte v2, Case à cocher: the consent of the collect page is a row on Nuage, radius-card, padding 16. */
export const ConsentField = ({ consentText, spaceName, isChecked, hasError, checkboxRef, onChange }: ConsentFieldProps) => (
  <div
    className={cn(
      "rounded-card p-4",
      hasError ? "flex flex-col gap-3 border-2 border-error bg-error-surface" : "bg-cloud",
    )}
  >
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
            "peer pz-couleur size-[24px] cursor-pointer appearance-none rounded-check border-2 bg-white enabled:not-aria-invalid:hover:border-ink checked:border-ink checked:bg-ink",
            FOCUS_RING,
            hasError ? "border-error" : "border-gray",
          )}
        />
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="pz-case-coche pointer-events-none absolute inset-[0] hidden size-[24px] fill-none stroke-white peer-checked:block"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6.5 12.5l3.5 3.5 7.5-8" />
        </svg>
      </span>
      <span>{consentText}</span>
    </label>
    {hasError ? (
      <p id={CONSENT_ERROR_ID} role="alert" className="flex items-start gap-[6px] pl-[36px] text-small text-error">
        <Icon name="alert" size={20} className="mt-[1px] shrink-0" />
        <span>
          {`${spaceName} a besoin de votre accord pour publier ce témoignage. Cochez la case, puis renvoyez : votre texte est bien conservé.`}
        </span>
      </p>
    ) : null}
  </div>
);
