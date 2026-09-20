'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { insertLead, isDatabaseConfigured } from '@pulsacity/db';

import { BRIEF_PAGE_VALUES, briefPageLabel } from '@/lib/brief';
import { notifyOwnerOfLead } from '@/lib/email';
import { parseFrenchPhone } from '@/lib/phone';
import { rateLimit } from '@/lib/rate-limit';

export type BriefState =
  { status: 'idle' } | { status: 'error'; message: string; fieldErrors?: Record<string, string> };

const UNAVAILABLE = "L'envoi est momentanément indisponible. Réessayez dans quelques instants.";

const optional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value ? value : undefined));

const schema = z.object({
  businessName: z.string().trim().min(2, 'Indiquez le nom de votre entreprise.').max(120),
  activity: z.string().trim().min(2, 'Indiquez votre activité.').max(160),
  city: z.string().trim().min(1, 'Indiquez votre ville.').max(80),
  phone: z.string().trim().min(1, 'Indiquez un numéro de téléphone.').max(30),
  email: z.union([z.string().trim().email('Adresse électronique invalide.'), z.literal('')]),
  googleUrl: z.union([z.string().trim().url('Lien invalide.'), z.literal('')]),
  description: optional(3000),
  pages: z.array(z.enum(BRIEF_PAGE_VALUES as [string, ...string[]])).default([]),
  pagesOther: optional(300),
  likedSites: optional(500),
  hasAssets: z.enum(['oui', 'non']).optional(),
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
 * « Demander mon site » — records the brief, then sends the visitor to the
 * confirmation page. The line is a parameter: the same form serves any future line.
 */
export async function submitBriefAction(
  _previous: BriefState,
  formData: FormData,
): Promise<BriefState> {
  const lineSlug = String(formData.get('lineSlug') ?? '');

  // A filled honeypot is a bot: accept silently, store nothing.
  if (String(formData.get('website') ?? '').trim() !== '') {
    redirect(`/commander/merci`);
  }

  const parsed = schema.safeParse({
    businessName: formData.get('businessName'),
    activity: formData.get('activity'),
    city: formData.get('city'),
    phone: formData.get('phone'),
    email: formData.get('email') ?? '',
    googleUrl: formData.get('googleUrl') ?? '',
    description: formData.get('description'),
    pages: formData.getAll('pages').map(String),
    pagesOther: formData.get('pagesOther'),
    likedSites: formData.get('likedSites'),
    hasAssets: formData.get('hasAssets') ?? undefined,
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

  const store = await headers();
  const ip = store.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!rateLimit(`brief:${ip}`, { limit: 5, windowMs: 3_600_000 }).ok) {
    return { status: 'error', message: 'Trop de tentatives. Patientez avant de réessayer.' };
  }

  if (!isDatabaseConfigured()) return { status: 'error', message: UNAVAILABLE };

  const pages = parsed.data.pages.map(briefPageLabel);
  const payload = {
    activity: parsed.data.activity,
    description: parsed.data.description ?? null,
    googleUrl: parsed.data.googleUrl || null,
    pages,
    pagesOther: parsed.data.pagesOther ?? null,
    likedSites: parsed.data.likedSites ?? null,
    hasAssets: parsed.data.hasAssets ?? null,
  };

  let leadId: string | undefined;
  try {
    const inserted = await insertLead({
      kind: 'order_brief',
      lineSlug,
      businessName: parsed.data.businessName,
      city: parsed.data.city,
      phoneE164: phone.e164,
      email: parsed.data.email || null,
      payload,
    });
    leadId = inserted?.id;
  } catch (error) {
    console.error('Enregistrement du brief impossible.', error);
    return { status: 'error', message: UNAVAILABLE };
  }

  // The brief is saved; a failed notification must not tell the visitor otherwise.
  await notifyOwnerOfLead({
    kind: 'order_brief',
    lineSlug,
    businessName: parsed.data.businessName,
    city: parsed.data.city,
    phoneE164: phone.e164,
    email: parsed.data.email || null,
    details: {
      Activité: parsed.data.activity,
      'Fiche Google': parsed.data.googleUrl || undefined,
      'Site souhaité': parsed.data.description,
      Pages: pages.length > 0 ? pages.join(', ') : undefined,
      'Autre page': parsed.data.pagesOther,
      'Sites appréciés': parsed.data.likedSites,
      'Photos ou logo': parsed.data.hasAssets,
    },
  });

  // `redirect` throws by design: it must sit outside the try/catch above.
  redirect(leadId ? `/commander/merci?lead=${leadId}` : '/commander/merci');
}
