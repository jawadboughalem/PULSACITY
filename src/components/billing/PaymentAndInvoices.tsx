import { openBillingPortalAction } from "@/app/app/(espace)/facturation/billing-actions";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type PaymentAndInvoicesProps = {
  /** A subscription paid or being paid: card, invoices and cancellation on Stripe's page. */
  isSubscribed: boolean;
  /** Back on the free plan after a subscription: the past invoices stay on Stripe's page. */
  hasPastInvoices: boolean;
};

/** Maquettes 8.3, « Paiement et factures »: Stripe's customer portal only, no list of invoices in the page. */
export const PaymentAndInvoices = ({ isSubscribed, hasPastInvoices }: PaymentAndInvoicesProps) => (
  <SettingsSection id="payment-and-invoices" title="Paiement et factures">
    {isSubscribed || hasPastInvoices ? (
      <>
        <p className="text-body">
          {isSubscribed
            ? "Carte, adresse de facturation, factures en PDF et résiliation : tout se gère sur la page de paiement sécurisée de Stripe, puis vous revenez ici."
            : "Vos factures passées restent sur la page de paiement sécurisée de Stripe."}
        </p>
        <form action={openBillingPortalAction.bind(null, "home")}>
          <button type="submit" className={cn(SECONDARY_BUTTON_CLASSES, "max-desktop:w-full")}>
            <Icon name="external" size={20} />
            Gérer mon paiement et mes factures
          </button>
        </form>
      </>
    ) : (
      <p className="text-body text-gray">
        Aucun paiement pour l&apos;instant. Vos factures apparaîtront ici dès votre premier paiement.
      </p>
    )}
  </SettingsSection>
);
