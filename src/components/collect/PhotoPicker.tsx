import Image from "next/image";
import { DISCREET_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { FieldError } from "@/components/ui/FieldError";
import { Icon } from "@/components/ui/Icon";
import type { ImageUpload } from "@/components/uploads/useImageUpload";
import { cn } from "@/lib/cn";
import type { ImageUploadError } from "@/lib/uploads/upload-image";

const PHOTO_ERROR_MESSAGES: Record<ImageUploadError, string> = {
  "too-large": "Cette photo dépasse 10 Mo. Choisissez une image plus légère.",
  "not-an-image": "Ce fichier n'est pas une photo lisible. Choisissez une image JPEG ou PNG.",
  "upload-failed": "La photo n'a pas pu être envoyée. Vérifiez votre connexion, puis choisissez-la à nouveau.",
  "too-many-uploads": "Beaucoup de photos ont été envoyées en peu de temps. Patientez un peu, puis réessayez.",
};

const POLAROID_WIDTH = 104;
const POLAROID_PHOTO_HEIGHT = 84;

type PhotoPickerProps = {
  upload: ImageUpload;
};

export const PhotoPicker = ({ upload }: PhotoPickerProps) => {
  const { state, handleSelectFile, handleRemove } = upload;
  const isUploaded = state.status === "uploaded";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <label
          className={cn(
            "flex h-[116px] w-[104px] shrink-0 -rotate-3 cursor-pointer rounded-sm border-2 border-ink-900 bg-white p-2 pb-5",
            "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink-900",
          )}
        >
          <input
            type="file"
            accept="image/*"
            aria-label={isUploaded ? "Changer la photo" : "Ajouter une photo, facultatif"}
            aria-describedby="photo-hint"
            className="sr-only"
            onChange={(event) => handleSelectFile(event.target.files?.[0])}
          />
          <span className="flex flex-1 items-center justify-center overflow-hidden bg-paper-100 text-ink-900">
            {isUploaded ? (
              <Image
                src={state.image.previewUrl}
                alt=""
                width={POLAROID_WIDTH}
                height={POLAROID_PHOTO_HEIGHT}
                unoptimized
                className="size-full object-cover"
              />
            ) : (
              <Icon name="photo" size={24} />
            )}
          </span>
        </label>
        <div className="flex flex-col gap-1">
          <p className="text-body font-semibold">Une photo de vous ?</p>
          <p id="photo-hint" className="text-small text-slate-600">
            Facultatif. Un visage rend votre témoignage plus parlant.
          </p>
          {isUploaded ? (
            <button type="button" onClick={handleRemove} className={cn(DISCREET_BUTTON_CLASSES, "self-start")}>
              Retirer la photo
            </button>
          ) : null}
        </div>
      </div>
      {state.status === "uploading" ? (
        <p role="status" className="text-small text-slate-600">
          Envoi de la photo…
        </p>
      ) : null}
      {state.status === "failed" ? <FieldError id="photo-error" message={PHOTO_ERROR_MESSAGES[state.error]} /> : null}
    </div>
  );
};
