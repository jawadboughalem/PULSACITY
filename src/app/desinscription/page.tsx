import type { Metadata } from "next";
import { CollectHeader } from "@/components/collect/CollectHeader";
import { PoweredByPulsacity } from "@/components/collect/PoweredByPulsacity";
import { FOCUS_RING } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { getDb } from "@/db";
import { getAppUrl } from "@/lib/app-url";
import { cn } from "@/lib/cn";
import { loadUnsubscribedCustomer } from "@/lib/requests/unsubscribe-customer";
import {
  UNSUBSCRIBE_STATE_PARAMETER,
  UNSUBSCRIBE_TOKEN_PARAMETER,
  readUnsubscribeToken,
} from "@/lib/requests/unsubscribe-token";

export const metadata: Metadata = {
  title: "Désinscription · PULSACITY",
  robots: { index: false, follow: false },
};

const readParameter = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? null;

const PAGE_CLASSES = "min-h-dvh bg-white px-page-gutter py-6 text-ink";
const MAIN_CLASSES = "mx-auto flex min-h-[calc(100dvh-48px)] w-full max-w-text flex-col gap-6";

const Problem = ({ title, detail }: { title: string; detail: string }) => (
  <div className={PAGE_CLASSES}>
    <main className={MAIN_CLASSES}>
      <div className="mt-10 flex flex-col gap-4">
        <span className="flex size-[64px] items-center justify-center rounded-full border-2 border-ink bg-white">
          <Icon name="alert" size={32} />
        </span>
        <h1 className="font-display text-h2">{title}</h1>
        <p className="text-body">{detail}</p>
      </div>
    </main>
  </div>
);

/** After « Ne plus recevoir ces e-mails »: the link has already unsubscribed, this page says so (m1, « Désinscription confirmée »). */
const UnsubscribePage = async ({ searchParams }: PageProps<"/desinscription">) => {
  const parameters = await searchParams;
  if (readParameter(parameters[UNSUBSCRIBE_STATE_PARAMETER]) === "failed") {
    return (
      <Problem
        title="La désinscription n'a pas abouti"
        detail="Rien n'a changé de notre côté. Ouvrez à nouveau le lien de l'e-mail dans quelques minutes."
      />
    );
  }

  const customerId = readUnsubscribeToken(readParameter(parameters[UNSUBSCRIBE_TOKEN_PARAMETER]));
  const customer = customerId ? await loadUnsubscribedCustomer(getDb(), customerId) : null;
  if (!customer?.isUnsubscribed) {
    return (
      <Problem
        title="Ce lien de désinscription ne fonctionne pas"
        detail="Il a peut-être été coupé par votre messagerie. Ouvrez à nouveau le lien en bas de l'e-mail, ou répondez à l'e-mail pour demander la désinscription."
      />
    );
  }

  return (
    <div className={PAGE_CLASSES}>
      <main className={MAIN_CLASSES}>
        <CollectHeader spaceName={customer.spaceName} logoUrl={customer.logoUrl} />
        <div className="mt-10 flex flex-col gap-4">
          <span className="flex size-[64px] items-center justify-center rounded-full border-2 border-ink bg-white">
            <Icon name="valid" size={32} />
          </span>
          <h1 className="font-display text-h2">Désinscription confirmée</h1>
          <p className="text-body">{`Vous ne recevrez plus de demande d'avis de ${customer.spaceName}.`}</p>
          <p className="text-body text-gray">Un lien déjà reçu reste valable : vous pouvez toujours donner votre avis.</p>
        </div>
        <a
          href={`mailto:${customer.replyToEmail}`}
          className={cn(
            "pz-couleur pz-appui mb-1 flex h-[60px] w-full items-center justify-center gap-2 rounded-full bg-sun text-[18px] font-bold text-ink hover:bg-sun-hover active:bg-sun-pressed",
            FOCUS_RING,
          )}
        >
          <Icon name="email" size={20} />
          {`Écrire à ${customer.spaceName}`}
        </a>
        <PoweredByPulsacity homeUrl={getAppUrl()} referralCode={customer.referralCode} />
      </main>
    </div>
  );
};

export default UnsubscribePage;
