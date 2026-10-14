"use client";

import Link from "next/link";
import { useCallback, useId } from "react";
import { Checkbox } from "@/components/ui/Checkbox";
import { ErrorSummary, type ErrorSummaryItem } from "@/components/ui/ErrorSummary";
import { FieldError } from "@/components/ui/FieldError";
import { FloatingMessage, useFloatingMessage } from "@/components/ui/FloatingMessage";
import { INLINE_LINK_CLASSES, PRIMARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { FIELD_HINT_CLASSES, FIELD_LABEL_CLASSES, TEXTAREA_CLASSES } from "@/components/ui/field-styles";
import { Spinner } from "@/components/ui/Spinner";
import { Switch } from "@/components/ui/Switch";
import { TextField } from "@/components/ui/TextField";
import { cn } from "@/lib/cn";
import { MAX_SPACE_NAME_LENGTH } from "@/lib/spaces/new-space-form-schema";
import { MAX_POSTAL_ADDRESS_LENGTH, type SpaceSettingsField } from "@/lib/spaces/space-settings-schema";
import { CollectionAddressField } from "./CollectionAddressField";
import { CollectionPagePreview } from "./CollectionPagePreview";
import { RequestEmailPreview } from "./RequestEmailPreview";
import { SettingsLogoField } from "./SettingsLogoField";
import { SettingsAccentColorField } from "./SettingsAccentColorField";
import { SettingsSection } from "./SettingsSection";
import { type SpaceSettingsValues, useSpaceSettingsForm } from "./useSpaceSettingsForm";

/** The fields, their name in the summary, and where each line of it leads. */
const SUMMARY_FIELDS: { field: SpaceSettingsField; label: string; target: string }[] = [
  { field: "name", label: "Nom de votre activité", target: "name" },
  { field: "logoKey", label: "Logo", target: "logo" },
  { field: "accentColor", label: "Couleur d'accent", target: "accentColor" },
  { field: "slug", label: "Adresse de votre page de collecte", target: "slug" },
  { field: "replyToEmail", label: "E-mail de réponse", target: "replyToEmail" },
  { field: "senderPostalAddress", label: "Adresse postale de l'expéditeur", target: "senderPostalAddress" },
];

/** « Indiquez le nom de votre activité. » becomes « indiquez le nom de votre activité. » after the field's name. */
const lowerFirst = (message: string) => message.charAt(0).toLowerCase() + message.slice(1);

/** « Cette adresse est déjà prise par un autre espace. » reads « déjà prise. » in the summary, as 3.3 shows it. */
const SHORT_SUMMARY_MESSAGES: Record<string, string> = {
  "Cette adresse est déjà prise par un autre espace.": "déjà prise.",
  "Cette adresse e-mail est incomplète. Écrivez-la en entier, par exemple julie@exemple.fr.": "adresse incomplète.",
};

const describeSummary = (count: number) => (count === 1 ? "1 point à corriger" : `${count} points à corriger`);

type SpaceSettingsFormProps = {
  initial: SpaceSettingsValues;
  /** « pulsacity.com/t/ » */
  collectionAddressPrefix: string;
  /** The space's first offer, for the preview: « Exemple d'offre ». */
  previewProductName: string;
  offersHref: string;
};

/** Réglages (3.3): the space, its e-mails to customers, its notifications, the counterpart; one button saves all. */
export const SpaceSettingsForm = ({ initial, collectionAddressPrefix, previewProductName, offersHref }: SpaceSettingsFormProps) => {
  const { message, show } = useFloatingMessage();
  const showSaved = useCallback(() => show("Modifications enregistrées."), [show]);
  const form = useSpaceSettingsForm(initial, showSaved);
  const { values, setters, fieldErrors } = form;
  const notificationLabelId = useId();
  const notificationDescriptionId = useId();
  const isUploadingLogo = form.logo.upload.state.status === "uploading";
  /** While the name is being typed over, the previews keep the saved one. */
  const shownName = values.name.trim() || initial.name;

  const summaryItems = SUMMARY_FIELDS.flatMap(({ field, label, target }): ErrorSummaryItem[] => {
    const message = fieldErrors[field];
    if (!message) return [];
    return [
      {
        fieldId: target,
        message: `${label} : ${SHORT_SUMMARY_MESSAGES[message] ?? lowerFirst(message)}`,
        shortMessage: label,
      },
    ];
  });

  return (
    <form
      action={form.submitAction}
      noValidate
      className={cn(
        "flex max-w-[712px] flex-col gap-6",
        "@min-[1064px]:grid @min-[1064px]:max-w-none @min-[1064px]:grid-cols-[minmax(0,712px)_320px] @min-[1064px]:items-start @min-[1064px]:gap-x-8",
      )}
    >
      {summaryItems.length > 0 ? (
        <div className="@min-[1064px]:col-start-1">
          <ErrorSummary
            key={form.submissionCount}
            title={`${describeSummary(summaryItems.length)} avant d'enregistrer`}
            shortTitle={describeSummary(summaryItems.length)}
            items={summaryItems}
          />
        </div>
      ) : null}
      <SettingsSection id="settings-space" title="Votre espace" className="@min-[1064px]:col-start-1">
        <div className="flex flex-col gap-8">
          <TextField
            id="name"
            name="name"
            label="Nom de votre activité"
            autoComplete="organization"
            maxLength={MAX_SPACE_NAME_LENGTH}
            required
            value={values.name}
            onChange={(event) => setters.setName(event.target.value)}
            hint="Vos clients le voient sur votre page de collecte et dans vos e-mails : c'est aussi le nom de l'expéditeur."
            error={fieldErrors.name}
          />
          <SettingsLogoField logo={form.logo} spaceName={shownName} serverError={fieldErrors.logoKey} />
          <SettingsAccentColorField value={values.accentColor} onChange={setters.setAccentColor} error={fieldErrors.accentColor} />
          <CollectionAddressField
            prefix={collectionAddressPrefix}
            value={values.slug}
            onChange={setters.setSlug}
            error={fieldErrors.slug}
            suggestedSlug={form.suggestedSlug}
          />
        </div>
      </SettingsSection>
      <CollectionPagePreview
        spaceName={shownName}
        logoUrl={form.logo.shownUrl}
        accentColor={values.accentColor}
        productName={previewProductName}
        className="@min-[1064px]:sticky @min-[1064px]:top-10 @min-[1064px]:col-start-2 @min-[1064px]:row-span-5 @min-[1064px]:row-start-1"
      />
      <SettingsSection id="settings-emails" title="E-mails à vos clients" className="@min-[1064px]:col-start-1">
        <div className="flex flex-col gap-8">
          <TextField
            id="replyToEmail"
            name="replyToEmail"
            type="email"
            label="E-mail de réponse"
            autoComplete="email"
            inputMode="email"
            required
            value={values.replyToEmail}
            onChange={(event) => setters.setReplyToEmail(event.target.value)}
            hint="Quand un client répond à une demande d'avis, sa réponse arrive à cette adresse."
            error={fieldErrors.replyToEmail}
          />
          <div className="flex flex-col gap-2">
            <label htmlFor="senderPostalAddress" className={FIELD_LABEL_CLASSES}>
              Adresse postale de l&apos;expéditeur
            </label>
            <textarea
              id="senderPostalAddress"
              name="senderPostalAddress"
              rows={3}
              autoComplete="street-address"
              maxLength={MAX_POSTAL_ADDRESS_LENGTH}
              value={values.senderPostalAddress}
              onChange={(event) => setters.setSenderPostalAddress(event.target.value)}
              aria-invalid={fieldErrors.senderPostalAddress ? true : undefined}
              aria-describedby={cn("postal-address-hint", fieldErrors.senderPostalAddress && "postal-address-error")}
              className={TEXTAREA_CLASSES}
            />
            {fieldErrors.senderPostalAddress ? (
              <FieldError id="postal-address-error" message={fieldErrors.senderPostalAddress} />
            ) : null}
            <p id="postal-address-hint" className={FIELD_HINT_CLASSES}>
              La loi la demande dans les e-mails de demande d&apos;avis. Elle s&apos;affiche en petit, en bas de chaque e-mail.
            </p>
          </div>
          <RequestEmailPreview
            readInput={() => ({
              spaceName: values.name,
              logoKey: form.logo.uploadedKey,
              removeLogo: form.logo.isRemoved,
              senderPostalAddress: values.senderPostalAddress,
            })}
          />
          <p className="text-small text-gray">
            Le délai d&apos;envoi se règle pour chaque offre, dans{" "}
            <Link href={offersHref} className={INLINE_LINK_CLASSES}>
              Offres
            </Link>
            .
          </p>
        </div>
      </SettingsSection>
      <SettingsSection id="settings-notifications" title="Vos notifications" className="@min-[1064px]:col-start-1">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-[0] flex-col gap-1">
            <p id={notificationLabelId} className="text-body font-bold">
              Recevoir l&apos;e-mail « Nouveau témoignage »
            </p>
            <p id={notificationDescriptionId} className="text-small text-gray">
              Un e-mail à chaque témoignage reçu, pour le valider sans attendre.
            </p>
          </div>
          <Switch
            id="newTestimonialEmailEnabled"
            isOn={values.isNewTestimonialEmailEnabled}
            labelId={notificationLabelId}
            descriptionId={notificationDescriptionId}
            onChange={setters.setIsNewTestimonialEmailEnabled}
          />
          <input type="hidden" name="newTestimonialEmailEnabled" value={String(values.isNewTestimonialEmailEnabled)} />
        </div>
      </SettingsSection>
      <SettingsSection id="settings-incentive" title="Contrepartie" className="@min-[1064px]:col-start-1">
        <div className="flex flex-col gap-4">
          <label className="flex min-h-[44px] cursor-pointer items-start gap-3">
            <Checkbox
              checked={values.offersIncentive}
              onChange={(event) => setters.setOffersIncentive(event.target.checked)}
              aria-describedby="incentive-hint"
            />
            <span className="flex flex-col gap-1">
              <span className="text-body font-bold">J&apos;offre une contrepartie à mes clients</span>
              <span id="incentive-hint" className="text-small text-gray">
                Une remise, un cadeau, un accès offert en échange d&apos;un avis. Si vous cochez cette case, vos widgets et
                la page « À propos de ces avis » l&apos;indiquent, comme la loi le demande.
              </span>
            </span>
          </label>
          <input type="hidden" name="offersIncentive" value={String(values.offersIncentive)} />
          {values.offersIncentive ? (
            <p className="rounded-field bg-cloud p-4 text-small">
              <strong>Mention affichée sous vos widgets :</strong> « Certains clients ont reçu une contrepartie pour leur
              avis. »
            </p>
          ) : null}
        </div>
      </SettingsSection>
      <div className="flex flex-col gap-2 @min-[1064px]:col-start-1">
        <button
          type="submit"
          disabled={form.isPending || isUploadingLogo}
          aria-busy={form.isPending || undefined}
          className={cn(PRIMARY_BUTTON_CLASSES, "w-full desktop:w-auto desktop:self-start")}
        >
          {form.isPending ? (
            <>
              <Spinner size={20} />
              Envoi…
            </>
          ) : (
            "Enregistrer les modifications"
          )}
        </button>
        {isUploadingLogo ? <p className="text-small text-gray">Le bouton revient dès que le logo est envoyé.</p> : null}
      </div>
      <FloatingMessage message={message} />
    </form>
  );
};
