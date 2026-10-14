"use client";

import { LOGO_ERROR_MESSAGES } from "@/components/onboarding/LogoField";
import { DISCREET_BUTTON_CLASSES, SECONDARY_COMPACT_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { FieldError } from "@/components/ui/FieldError";
import { FIELD_HINT_CLASSES, FIELD_LABEL_CLASSES } from "@/components/ui/field-styles";
import { Icon } from "@/components/ui/Icon";
import { SpaceAvatar } from "@/components/ui/SpaceAvatar";
import { cn } from "@/lib/cn";
import type { SpaceSettingsFormState } from "./useSpaceSettingsForm";

type SettingsLogoFieldProps = {
  logo: SpaceSettingsFormState["logo"];
  spaceName: string;
  serverError?: string;
};

/** Réglages, Logo: the round as it shows, « Changer de logo » (or « Choisir un logo »), « Retirer ». */
export const SettingsLogoField = ({ logo, spaceName, serverError }: SettingsLogoFieldProps) => {
  const { state } = logo.upload;
  const error = state.status === "failed" ? LOGO_ERROR_MESSAGES[state.error] : serverError;
  const hasLogo = logo.shownUrl !== null;

  return (
    <fieldset
      id="logo"
      tabIndex={-1}
      className="flex min-w-[0] flex-col gap-3 focus:outline-none"
      aria-describedby={cn("logo-hint", error && "logo-error")}
    >
      <legend className={cn(FIELD_LABEL_CLASSES, "mb-2")}>Logo</legend>
      <div className="flex flex-wrap items-center gap-4">
        <SpaceAvatar name={spaceName || "?"} logoUrl={logo.shownUrl} size={64} background="sky" />
        <div className="flex flex-wrap items-center gap-3">
          <label
            className={cn(
              SECONDARY_COMPACT_BUTTON_CLASSES,
              "cursor-pointer has-focus-visible:outline-2 has-focus-visible:outline-offset-3 has-focus-visible:outline-ink",
            )}
          >
            <Icon name="upload" size={20} />
            {hasLogo ? "Changer de logo" : "Choisir un logo"}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => {
                void logo.handleSelect(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
          </label>
          {hasLogo ? (
            <button type="button" onClick={logo.handleRemove} className={DISCREET_BUTTON_CLASSES}>
              Retirer
            </button>
          ) : null}
        </div>
      </div>
      {state.status === "uploading" ? (
        <p role="status" className={FIELD_HINT_CLASSES}>
          Envoi du logo…
        </p>
      ) : null}
      {error ? <FieldError id="logo-error" message={error} /> : null}
      <p id="logo-hint" className={FIELD_HINT_CLASSES}>
        JPEG ou PNG, 10 Mo au plus. Il s&apos;affiche en rond, en haut de votre page de collecte et de vos e-mails.
      </p>
      <input type="hidden" name="logoKey" value={logo.uploadedKey} />
      <input type="hidden" name="removeLogo" value={String(logo.isRemoved)} />
    </fieldset>
  );
};
