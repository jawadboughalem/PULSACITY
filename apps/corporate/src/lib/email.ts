/**
 * Transactional e-mail through Resend's REST API.
 *
 * Failures are logged and swallowed: a Stripe webhook must not be retried forever
 * because an e-mail provider is down — the order is already recorded.
 */
import { emailSender, ownerEmail, resendApiKey } from './server-env';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}

export async function sendEmail(message: EmailMessage): Promise<boolean> {
  const apiKey = resendApiKey();
  const from = emailSender();

  if (!apiKey || !from) {
    console.warn('E-mail non envoyé : RESEND_API_KEY ou EMAIL_FROM manquante.', {
      subject: message.subject,
    });
    return false;
  }

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [message.to],
        subject: message.subject,
        text: message.text,
        ...(message.replyTo ? { reply_to: message.replyTo } : {}),
      }),
    });

    if (!response.ok) {
      console.error('Resend a refusé le message.', {
        status: response.status,
        subject: message.subject,
      });
      return false;
    }
    return true;
  } catch (error) {
    console.error('Envoi Resend impossible.', error);
    return false;
  }
}

/** « Vente : {entreprise} — {téléphone} » */
export async function notifyOwnerOfSale(sale: {
  businessName?: string | null;
  city?: string | null;
  phone?: string | null;
  email?: string | null;
  amountCents: number;
  vatMode: string;
  offerSlug: string;
  demoSlug?: string | null;
}): Promise<boolean> {
  const owner = ownerEmail();
  if (!owner) {
    console.warn('Vente non notifiée : OWNER_EMAIL manquante.');
    return false;
  }

  const business = sale.businessName?.trim() || 'entreprise non renseignée';
  const phone = sale.phone?.trim() || 'téléphone non renseigné';

  const lines = [
    `Entreprise : ${business}`,
    sale.city?.trim() ? `Ville : ${sale.city.trim()}` : null,
    `Téléphone : ${phone}`,
    sale.email?.trim() ? `E-mail : ${sale.email.trim()}` : null,
    `Montant encaissé : ${(sale.amountCents / 100).toFixed(2)} €`,
    `Ligne : ${sale.offerSlug}`,
    `Régime de TVA : ${sale.vatMode}`,
    sale.demoSlug ? `Démo : ${sale.demoSlug}` : null,
    '',
    'Prochaine étape : appeler le client pour les 10 minutes de corrections.',
  ].filter((line): line is string => line !== null);

  return sendEmail({
    to: owner,
    subject: `Vente : ${business} — ${phone}`,
    text: lines.join('\n'),
    ...(sale.email?.trim() ? { replyTo: sale.email.trim() } : {}),
  });
}

/** Sober confirmation to the buyer. */
export async function sendBuyerConfirmation(buyer: {
  email: string;
  businessName?: string | null;
}): Promise<boolean> {
  const business = buyer.businessName?.trim();

  const text = [
    'Bonjour,',
    '',
    `Nous avons bien reçu votre paiement${business ? ` pour ${business}` : ''}.`,
    '',
    'Prochaine étape : nous vous appelons pour 10 minutes de corrections sur votre site.',
    'Votre site est mis en ligne sous 72 h après cet appel et la réception de vos éléments.',
    '',
    'Votre facture vous est envoyée séparément par Stripe.',
    '',
    'PULSACITY',
  ].join('\n');

  return sendEmail({
    to: buyer.email,
    subject: 'Votre paiement est bien reçu',
    text,
  });
}

/** Any inbound request, whatever the line and whatever the form. */
export async function notifyOwnerOfLead(lead: {
  kind: 'order_brief' | 'notify' | 'contact';
  lineSlug?: string | null;
  businessName?: string | null;
  city?: string | null;
  phoneE164?: string | null;
  email?: string | null;
  /** The form's own answers, rendered one per line. */
  details?: Record<string, string | undefined>;
}): Promise<boolean> {
  const owner = ownerEmail();
  if (!owner) {
    console.warn('Demande non notifiée : OWNER_EMAIL manquante.');
    return false;
  }

  const subject =
    lead.kind === 'order_brief'
      ? `Demande de site : ${lead.businessName?.trim() || 'entreprise non renseignée'} — ${lead.phoneE164 ?? ''}`
      : `Inscription « prévenez-moi » : ${lead.lineSlug ?? ''}`;

  const lines = [
    lead.lineSlug ? `Ligne : ${lead.lineSlug}` : null,
    lead.businessName?.trim() ? `Entreprise : ${lead.businessName.trim()}` : null,
    lead.city?.trim() ? `Ville : ${lead.city.trim()}` : null,
    lead.phoneE164 ? `Téléphone : ${lead.phoneE164}` : null,
    lead.email?.trim() ? `E-mail : ${lead.email.trim()}` : null,
    ...Object.entries(lead.details ?? {})
      .filter(([, value]) => value?.trim())
      .map(([label, value]) => `${label} : ${value}`),
  ].filter((line): line is string => line !== null);

  return sendEmail({
    to: owner,
    subject,
    text: lines.join('\n'),
    ...(lead.email?.trim() ? { replyTo: lead.email.trim() } : {}),
  });
}
