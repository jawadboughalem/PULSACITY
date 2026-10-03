import type { Metadata } from "next";
import { CollectHeader } from "@/components/collect/CollectHeader";
import { PoweredByPulsacity } from "@/components/collect/PoweredByPulsacity";
import { Icon } from "@/components/ui/Icon";
import { getDb } from "@/db";
import { getAppUrl } from "@/lib/app-url";
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

const PAGE_CLASSES = "min-h-dvh bg-paper-100 px-page-gutter py-5 text-ink-900";
const MAIN_CLASSES = "mx-auto flex min-h-[calc(100dvh-48px)] w-full max-w-text flex-col gap-5";

const Problem = ({ title, detail }: { title: string; detail: string }) => (
  <div className={PAGE_CLASSES}>
    <main className={MAIN_CLASSES}>
      <div className="mt-7 flex flex-col gap-4">
        <span className="flex size-[64px] items-center justify-center rounded-full border-2 border-ink-900 bg-white">
          <Icon name="alert" size={32} />
        </span>
        <h1 className="font-serif text-h2 font-medium">{title}</h1>
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
        <div className="mt-7 flex flex-col gap-4">
          <span className="flex size-[64px] items-center justify-center rounded-full border-2 border-ink-900 bg-white">
            <Icon name="valid" size={32} />
          </span>
          <h1 className="font-serif text-h2 font-medium">Désinscription confirmée</h1>
          <p className="text-body">{`Vous ne recevrez plus de demande d'avis de ${customer.spaceName}.`}</p>
          <p className="text-body text-slate-600">Un lien déjà reçu reste valable : vous pouvez toujours donner votre avis.</p>
        </div>
        <a
          href={`mailto:${customer.replyToEmail}`}
          className="mb-1 flex h-[56px] w-full items-center justify-center gap-2 rounded-lg border-2 border-ink-900 bg-carmine text-body font-semibold text-white shadow-relief hover:bg-carmine-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900 active:translate-y-1 active:shadow-none"
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
