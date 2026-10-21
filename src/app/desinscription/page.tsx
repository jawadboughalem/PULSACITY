import type { Metadata } from "next";
import { CollectOutcome, WriteToCreatorLink } from "@/components/collect/CollectOutcome";
import { CollectShell } from "@/components/collect/CollectShell";
import { getDb } from "@/db";
import { getAppUrl } from "@/lib/app-url";
import { loadUnsubscribedCustomer } from "@/lib/requests/unsubscribe-customer";
import {
  UNSUBSCRIBE_STATE_PARAMETER,
  UNSUBSCRIBE_TOKEN_PARAMETER,
  readUnsubscribeToken,
} from "@/lib/requests/unsubscribe-token";
import { WELCOME_UNSUBSCRIBED_STATE } from "@/lib/welcome-emails/welcome-unsubscribe";

export const metadata: Metadata = {
  title: "Désinscription · PULSACITY",
  robots: { index: false, follow: false },
};

const readParameter = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? null;

/** Maquettes 3.6, « Désinscription »: a link that failed cannot say whose it was, so the page has no creator. */
const Problem = ({ title, detail }: { title: string; detail: string }) => (
  <CollectShell identity={null} poweredBy={null}>
    <CollectOutcome icon="alert" title={title} lines={[{ text: detail }]} />
  </CollectShell>
);

/** After « Ne plus recevoir ces e-mails »: the link has already unsubscribed, this page says so (maquettes 3.6). */
const UnsubscribePage = async ({ searchParams }: PageProps<"/desinscription">) => {
  const parameters = await searchParams;
  if (readParameter(parameters[UNSUBSCRIBE_STATE_PARAMETER]) === WELCOME_UNSUBSCRIBED_STATE) {
    // « Ne plus recevoir les e-mails d'accueil », a creator's own e-mails: the same page, in PULSACITY's name.
    return (
      <CollectShell identity={null} poweredBy={null}>
        <CollectOutcome
          icon="valid"
          title="Désinscription confirmée"
          lines={[
            { text: "Vous ne recevrez plus les e-⁠mails d'accueil de PULSACITY." },
            {
              text: "Les autres e-⁠mails de votre espace continuent : liens de connexion, nouveaux témoignages, abonnement.",
              isSecondary: true,
            },
          ]}
        />
      </CollectShell>
    );
  }
  if (readParameter(parameters[UNSUBSCRIBE_STATE_PARAMETER]) === "failed") {
    return (
      <Problem
        title="La désinscription n'a pas abouti"
        detail="Rien n'a changé de notre côté. Ouvrez à nouveau le lien de l'e-⁠mail dans quelques minutes."
      />
    );
  }

  const customerId = readUnsubscribeToken(readParameter(parameters[UNSUBSCRIBE_TOKEN_PARAMETER]));
  const customer = customerId ? await loadUnsubscribedCustomer(getDb(), customerId) : null;
  if (!customer?.isUnsubscribed) {
    return (
      <Problem
        title="Ce lien de désinscription ne fonctionne pas"
        detail="Il a peut-être été coupé par votre messagerie. Ouvrez à nouveau le lien en bas de l'e-⁠mail, ou répondez à l'e-⁠mail pour demander la désinscription."
      />
    );
  }

  return (
    <CollectShell
      identity={{ name: customer.spaceName, logoUrl: customer.logoUrl, accentColor: customer.accentColor }}
      poweredBy={{ homeUrl: getAppUrl(), referralCode: customer.referralCode }}
    >
      <CollectOutcome
        icon="valid"
        title="Désinscription confirmée"
        lines={[
          { text: `Vous ne recevrez plus de demande d'avis de ${customer.spaceName}.` },
          { text: "Un lien déjà reçu reste valable : vous pouvez toujours donner votre avis.", isSecondary: true },
        ]}
        action={<WriteToCreatorLink spaceName={customer.spaceName} replyToEmail={customer.replyToEmail} />}
      />
    </CollectShell>
  );
};

export default UnsubscribePage;
