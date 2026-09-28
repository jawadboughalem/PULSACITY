"use client";

import { DISCREET_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { FieldError } from "@/components/ui/FieldError";
import { SpaceAvatar } from "@/components/ui/SpaceAvatar";
import type { ImageUpload } from "@/components/uploads/useImageUpload";
import { cn } from "@/lib/cn";
import type { ImageUploadError } from "@/lib/uploads/upload-image";

const LOGO_ERROR_MESSAGES: Record<ImageUploadError, string> = {
  "too-large": "Ce logo dépasse 10 Mo. Choisissez une image plus légère.",
  "not-an-image": "Ce fichier n'est pas une image lisible. Choisissez un logo au format JPEG ou PNG.",
  "upload-failed": "Le logo n'a pas pu être envoyé. Vérifiez votre connexion, puis choisissez-le à nouveau.",
  "too-many-uploads": "Vous avez envoyé beaucoup d'images en peu de temps. Patientez un peu, puis réessayez.",
};

type LogoFieldProps = {
  upload: ImageUpload;
  spaceName: string;
  serverError?: string;
};

export const LogoField = ({ upload, spaceName, serverError }: LogoFieldProps) => {
  const { state, handleSelectFile, handleRemove } = upload;
  const error = state.status === "failed" ? LOGO_ERROR_MESSAGES[state.error] : serverError;

  return (
    <fieldset className="flex min-w-[0] flex-col gap-3" aria-describedby="logo-hint">
      <legend className="mb-2 text-small font-semibold">
        Votre logo <span className="font-normal text-slate-600">(facultatif)</span>
      </legend>
      <div className="flex items-center gap-4">
        <SpaceAvatar
          name={spaceName || "?"}
          logoUrl={state.status === "uploaded" ? state.image.previewUrl : null}
          size={64}
          background="paper"
        />
        <div className="flex flex-wrap items-center gap-3">
          <label
            className={cn(
              SECONDARY_BUTTON_CLASSES,
              "cursor-pointer has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink-900",
            )}
          >
            {state.status === "uploaded" ? "Changer de logo" : "Choisir un logo"}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => handleSelectFile(event.target.files?.[0])}
            />
          </label>
          {state.status === "uploaded" ? (
            <button type="button" onClick={handleRemove} className={DISCREET_BUTTON_CLASSES}>
              Retirer le logo
            </button>
          ) : null}
        </div>
      </div>
      <p id="logo-hint" className="text-small text-slate-600">
        Il s&apos;affiche en rond sur votre page de collecte. JPEG ou PNG, 10 Mo au plus.
      </p>
      {state.status === "uploading" ? (
        <p role="status" className="text-small text-slate-600">
          Envoi du logo…
        </p>
      ) : null}
      {error ? <FieldError id="logo-error" message={error} /> : null}
      <input type="hidden" name="logoKey" value={state.status === "uploaded" ? state.image.key : ""} />
    </fieldset>
  );
};
