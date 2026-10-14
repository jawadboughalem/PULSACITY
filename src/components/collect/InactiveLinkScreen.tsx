import { Icon } from "@/components/ui/Icon";
import { CollectHeader } from "./CollectHeader";
import { PoweredByPulsacity } from "./PoweredByPulsacity";

type InactiveLinkScreenProps = {
  spaceName: string;
  logoUrl: string | null;
  replyToEmail: string;
  homeUrl: string;
  referralCode: string;
};

export const InactiveLinkScreen = ({ spaceName, logoUrl, replyToEmail, homeUrl, referralCode }: InactiveLinkScreenProps) => (
  <>
    <CollectHeader spaceName={spaceName} logoUrl={logoUrl} />
    <div className="mt-10 flex flex-col gap-4">
      <span className="flex size-[64px] items-center justify-center rounded-full border-2 border-ink bg-white">
        <Icon name="clock" size={32} />
      </span>
      <h1 className="font-display text-h2 font-semibold">Ce lien n&apos;est plus actif</h1>
      <p className="text-body">Il a peut-être déjà servi, ou il a expiré.</p>
      <p className="text-body">{`Si vous avez déjà envoyé votre témoignage, ${spaceName} l'a bien reçu. Merci.`}</p>
    </div>
    <a
      href={`mailto:${replyToEmail}`}
      className="flex min-h-[44px] items-center gap-2 self-start text-body font-bold text-ink hover:text-ink-800 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ink"
    >
      <Icon name="email" size={20} />
      {`Écrire à ${spaceName}`}
    </a>
    <PoweredByPulsacity homeUrl={homeUrl} referralCode={referralCode} className="mt-auto" />
  </>
);
