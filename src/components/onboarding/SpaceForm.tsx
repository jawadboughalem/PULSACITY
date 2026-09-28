"use client";

import { DISCREET_BUTTON_CLASSES, PRIMARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { TextField } from "@/components/ui/TextField";
import { cn } from "@/lib/cn";
import { MAX_SPACE_NAME_LENGTH } from "@/lib/spaces/new-space-form-schema";
import { MAX_SLUG_LENGTH } from "@/lib/spaces/slugify";
import { AccentColorField } from "./AccentColorField";
import { LogoField } from "./LogoField";
import { useSpaceForm } from "./useSpaceForm";

type SpaceFormProps = {
  defaultReplyToEmail: string;
  collectionAddressPrefix: string;
};

export const SpaceForm = ({ defaultReplyToEmail, collectionAddressPrefix }: SpaceFormProps) => {
  const form = useSpaceForm(defaultReplyToEmail);
  const isUploadingLogo = form.logoUpload.state.status === "uploading";

  return (
    <form action={form.submitAction} noValidate className="flex flex-col gap-6">
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
          <p className="text-small text-slate-600">Le bouton revient dès que le logo est envoyé.</p>
        ) : null}
      </div>
    </form>
  );
};
