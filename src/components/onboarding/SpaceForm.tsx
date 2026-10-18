"use client";

import { DISCREET_BUTTON_CLASSES, PRIMARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { TextField } from "@/components/ui/TextField";
import type { HeardFrom } from "@/lib/acquisition/heard-from";
import { HEARD_FROM_PARAMETER, type SignupSource, SOURCE_PARAMETERS } from "@/lib/acquisition/signup-source";
import { cn } from "@/lib/cn";
import { MAX_SPACE_NAME_LENGTH } from "@/lib/spaces/new-space-form-schema";
import { MAX_SLUG_LENGTH } from "@/lib/spaces/slugify";
import { AccentColorField } from "./AccentColorField";
import { LogoField } from "./LogoField";
import { useSpaceForm } from "./useSpaceForm";

type SpaceFormProps = {
  defaultReplyToEmail: string;
  collectionAddressPrefix: string;
  /** Where the creator came from, sent with the space to be recorded once (lot 4.12). */
  source: SignupSource;
  heardFrom: HeardFrom | null;
};

export const SpaceForm = ({ defaultReplyToEmail, collectionAddressPrefix, source, heardFrom }: SpaceFormProps) => {
  const form = useSpaceForm(defaultReplyToEmail);
  const isUploadingLogo = form.logoUpload.state.status === "uploading";

  return (
    <form action={form.submitAction} noValidate className="flex flex-col gap-8">
      {SOURCE_PARAMETERS.map((parameter) =>
        source[parameter] === undefined ? null : (
          <input key={parameter} type="hidden" name={parameter} value={source[parameter]} />
        ),
      )}
      {heardFrom === null ? null : <input type="hidden" name={HEARD_FROM_PARAMETER} value={heardFrom} />}
      <TextField
        id="space-name"
        name="name"
        label="Nom de votre activité"
        autoComplete="organization"
        maxLength={MAX_SPACE_NAME_LENGTH}
        required
        value={form.name}
        onChange={(event) => form.handleChangeName(event.target.value)}
        hint="Vos clients le voient sur votre page de collecte et dans vos e-mails."
        error={form.fieldErrors.name}
      />
      <div className="flex flex-col gap-2">
        <TextField
          id="space-slug"
          name="slug"
          label="Adresse de votre page de collecte"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          maxLength={MAX_SLUG_LENGTH}
          required
          value={form.slug}
          onChange={(event) => form.handleChangeSlug(event.target.value)}
          hint={`${collectionAddressPrefix}${form.slug}`}
          error={form.suggestedSlug ? "Cette adresse est déjà prise par un autre espace." : form.fieldErrors.slug}
        />
        {form.suggestedSlug ? (
          <button type="button" onClick={form.handleUseSuggestedSlug} className={cn(DISCREET_BUTTON_CLASSES, "self-start")}>
            {`Prendre ${form.suggestedSlug}`}
          </button>
        ) : null}
      </div>
      <LogoField upload={form.logoUpload} spaceName={form.name} serverError={form.fieldErrors.logoKey} />
      <AccentColorField value={form.accentColor} onChange={form.setAccentColor} />
      <TextField
        id="reply-to-email"
        name="replyToEmail"
        type="email"
        label="E-mail de réponse"
        autoComplete="email"
        inputMode="email"
        required
        value={form.replyToEmail}
        onChange={(event) => form.setReplyToEmail(event.target.value)}
        hint="Quand un client répond à une demande d'avis, sa réponse arrive à cette adresse."
        error={form.fieldErrors.replyToEmail}
      />
      <div className="flex flex-col gap-2">
        <button
          type="submit"
          disabled={form.isPending || isUploadingLogo}
          className={cn(PRIMARY_BUTTON_CLASSES, "w-full desktop:w-auto desktop:self-start")}
        >
          Créer mon espace
        </button>
        {isUploadingLogo ? (
          <p className="text-small text-gray">Le bouton revient dès que le logo est envoyé.</p>
        ) : null}
      </div>
    </form>
  );
};
