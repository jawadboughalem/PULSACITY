import { CollectOutcome, WriteToCreatorLink } from "./CollectOutcome";

type InactiveLinkScreenProps = {
  spaceName: string;
  replyToEmail: string;
};

/** Maquettes 3.6, « Lien plus actif »: the texts of the code, « Écrire à … » as a link. */
export const InactiveLinkScreen = ({ spaceName, replyToEmail }: InactiveLinkScreenProps) => (
  <CollectOutcome
    icon="clock"
    title="Ce lien n'est plus actif"
    lines={[
      { text: "Il a peut-être déjà servi, ou il a expiré." },
      { text: `Si vous avez déjà envoyé votre témoignage, ${spaceName} l'a bien reçu. Merci.` },
    ]}
    action={<WriteToCreatorLink spaceName={spaceName} replyToEmail={replyToEmail} />}
  />
);
