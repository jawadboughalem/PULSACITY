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

/** Charte v2, ajouts 3.6: the photo is the author's portrait, a round of 72, as in the widget. */
const PORTRAIT_SIZE = 72;

type PhotoPickerProps = {
  upload: ImageUpload;
};

/**
 * Maquettes 3.6, « Photo : ses états »: an empty round with a dashed 2 px Gris border (Erreur after a failure), the
 * portrait cropped in it once chosen; the sending and the failures said under the row.
 */
export const PhotoPicker = ({ upload }: PhotoPickerProps) => {
  const { state, handleSelectFile, handleRemove } = upload;
  const isUploaded = state.status === "uploaded";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <label
          className={cn(
            "flex size-[72px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full text-ink",
            !isUploaded && "border-2 border-dashed",
            state.status === "failed" ? "border-error" : "border-gray",
            "has-focus-visible:outline-2 has-focus-visible:outline-offset-3 has-focus-visible:outline-ink",
          )}
        >
          <input
            type="file"
            accept="image/*"
            aria-label={isUploaded ? "Changer la photo" : "Ajouter une photo, facultatif"}
            aria-describedby={state.status === "failed" ? "photo-hint photo-error" : "photo-hint"}
            className="sr-only"
            onChange={(event) => handleSelectFile(event.target.files?.[0])}
          />
          {isUploaded ? (
            <Image
              src={state.image.previewUrl}
              alt=""
              width={PORTRAIT_SIZE}
              height={PORTRAIT_SIZE}
              unoptimized
              className="size-full object-cover"
            />
          ) : (
            <Icon name="photo" size={24} />
          )}
        </label>
        <div className="flex min-w-[0] flex-col">
          <p className="text-body font-bold">Une photo de vous ?</p>
          <p id="photo-hint" className="text-small text-gray">
            Facultatif. Un visage rend votre témoignage plus parlant.
          </p>
          {isUploaded ? (
            <button type="button" onClick={handleRemove} className={cn(DISCREET_BUTTON_CLASSES, "-ml-[10px] self-start")}>
              Retirer la photo
            </button>
          ) : null}
        </div>
      </div>
      {state.status === "uploading" ? (
        <p role="status" className="text-small text-gray">
          Envoi de la photo…
        </p>
      ) : null}
      {state.status === "failed" ? <FieldError id="photo-error" message={PHOTO_ERROR_MESSAGES[state.error]} /> : null}
    </div>
  );
};
