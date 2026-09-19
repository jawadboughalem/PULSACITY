'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { insertLead, isDatabaseConfigured, searchDemoSites } from '@pulsacity/db';

import { demoUrl } from '@/lib/env';
import { notifyOwnerOfLead } from '@/lib/email';
import { parseFrenchPhone } from '@/lib/phone';
import { rateLimit } from '@/lib/rate-limit';
import { demoTtlDays } from '@/lib/server-env';

/** Shown when the database is unreachable — never a blank screen. */
const UNAVAILABLE =
  'La recherche est momentanément indisponible. Réessayez dans quelques instants ou écrivez-nous.';

const TOO_MANY = 'Trop de tentatives. Patientez une minute avant de réessayer.';

export interface DemoMatch {
  slug: string;
  name: string;
  city: string | null;
}

export type SiteCheckState =
  | { status: 'idle' }
  | { status: 'none'; businessName: string; city: string }
  | { status: 'many'; matches: DemoMatch[]; businessName: string; city: string }
  | { status: 'error'; message: string };

export type SiteRequestState =
  | { status: 'idle' }
  | { status: 'sent'; message: string }
  | { status: 'error'; message: string; fieldErrors?: Record<string, string> };

async function clientIp(): Promise<string> {
  const store = await headers();
  const forwarded = store.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || store.get('x-real-ip') || 'unknown';
}

/** A filled honeypot means a bot: the submission is dropped, quietly. */
function isBot(formData: FormData): boolean {
  return String(formData.get('website') ?? '').trim() !== '';
}

const searchSchema = z.object({
  businessName: z.string().trim().min(2, 'Indiquez le nom de votre entreprise.').max(120),
  city: z.string().trim().max(80).optional().default(''),
});

const requestSchema = z.object({
  businessName: z.string().trim().min(2, 'Indiquez le nom de votre entreprise.').max(120),
  city: z.string().trim().min(1, 'Indiquez votre ville.').max(80),
  phone: z.string().trim().min(1, 'Indiquez un numéro de téléphone.').max(30),
  email: z.union([z.string().trim().email('Adresse électronique invalide.'), z.literal('')]),
  consent: z.literal('on', {
    errorMap: () => ({ message: 'Cochez la case pour que nous puissions vous rappeler.' }),
  }),
});

function fieldErrorsOf(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    result[key] ??= issue.message;
  }
  return result;
}

/**
 * « Votre site est peut-être déjà prêt » — searches the prepared demos.
 *
 * One match redirects straight to the demo, several offer a choice, none opens the
 * request form.
 */
export async function checkSiteAction(
  _previous: SiteCheckState,
  formData: FormData,
): Promise<SiteCheckState> {
  const parsed = searchSchema.safeParse({
    businessName: formData.get('businessName'),
    city: formData.get('city'),
  });
  if (!parsed.success) {
    return { status: 'error', message: fieldErrorsOf(parsed.error).businessName ?? UNAVAILABLE };
  }
  const { businessName, city } = parsed.data;

  if (isBot(formData)) return { status: 'none', businessName, city };

  const limit = rateLimit(`check:${await clientIp()}`, { limit: 20, windowMs: 60_000 });
  if (!limit.ok) return { status: 'error', message: TOO_MANY };

  if (!isDatabaseConfigured()) return { status: 'error', message: UNAVAILABLE };

  let matches: DemoMatch[];
  try {
    const found = await searchDemoSites(businessName, { city, ttlDays: demoTtlDays() });
    matches = found.map((match) => ({ slug: match.slug, name: match.name, city: match.city }));
  } catch (error) {
    console.error('Recherche de démo impossible.', error);
    return { status: 'error', message: UNAVAILABLE };
  }

  // `redirect` throws by design: it must sit outside the try/catch above.
  const only = matches.length === 1 ? matches[0] : undefined;
  if (only) redirect(demoUrl(only.slug));

  if (matches.length > 1) return { status: 'many', matches, businessName, city };
  return { status: 'none', businessName, city };
}

/** No demo matched: record the request so the site can be prepared. */
export async function requestSiteAction(
  _previous: SiteRequestState,
  formData: FormData,
): Promise<SiteRequestState> {
  const success: SiteRequestState = {
    status: 'sent',
    message: 'Votre site va être préparé. Vous recevrez le lien par SMS.',
  };

  if (isBot(formData)) return success;

  const parsed = requestSchema.safeParse({
    businessName: formData.get('businessName'),
    city: formData.get('city'),
    phone: formData.get('phone'),
    email: formData.get('email') ?? '',
    consent: formData.get('consent'),
  });
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Vérifiez les informations saisies.',
      fieldErrors: fieldErrorsOf(parsed.error),
    };
  }

  const phone = parseFrenchPhone(parsed.data.phone);
  if (!phone.ok || !phone.e164) {
    return {
      status: 'error',
      message: 'Vérifiez les informations saisies.',
      fieldErrors: { phone: 'Numéro de téléphone français invalide.' },
    };
  }

  const limit = rateLimit(`request:${await clientIp()}`, { limit: 5, windowMs: 3_600_000 });
  if (!limit.ok) return { status: 'error', message: TOO_MANY };

  if (!isDatabaseConfigured()) return { status: 'error', message: UNAVAILABLE };

  try {
    await insertLead({
      businessName: parsed.data.businessName,
      city: parsed.data.city,
      phoneE164: phone.e164,
      email: parsed.data.email || null,
      source: 'site_check',
    });
  } catch (error) {
    console.error('Enregistrement de la demande impossible.', error);
    return { status: 'error', message: UNAVAILABLE };
  }

  // The lead is saved; a failed notification must not tell the visitor otherwise.
  await notifyOwnerOfLead({
    businessName: parsed.data.businessName,
    city: parsed.data.city,
    phoneE164: phone.e164,
    email: parsed.data.email || null,
  });

  return success;
}
