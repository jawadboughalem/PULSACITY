'use server';

import { headers } from 'next/headers';
import { z } from 'zod';

import { insertLead, isDatabaseConfigured } from '@pulsacity/db';

import { notifyOwnerOfLead } from '@/lib/email';
import { rateLimit } from '@/lib/rate-limit';

export type NotifyState =
  | { status: 'idle' }
  | { status: 'sent'; message: string }
  /** `email` and `attempt` exist for the same reason as in the brief form: React
   *  clears an uncontrolled form once its action resolves, so the address has to
   *  come back and the form has to remount to take it. */
  | { status: 'error'; message: string; email: string; attempt: number };

const schema = z.object({
  email: z.string().trim().email('Adresse électronique invalide.'),
  lineSlug: z
    .string()
    .trim()
    .regex(/^[a-z0-9][a-z0-9-]{0,60}$/),
});

/** « Prévenez-moi » on a line still in preparation. Promises nothing else. */
export async function notifyMeAction(
  previous: NotifyState,
  formData: FormData,
): Promise<NotifyState> {
  const sent: NotifyState = { status: 'sent', message: 'C’est noté. Je vous préviens.' };
  const email = String(formData.get('email') ?? '');
  const attempt = (previous.status === 'error' ? previous.attempt : 0) + 1;
  const fail = (message: string): NotifyState => ({ status: 'error', message, email, attempt });

  if (String(formData.get('website') ?? '').trim() !== '') return sent;

  const parsed = schema.safeParse({
    email: formData.get('email'),
    lineSlug: formData.get('lineSlug'),
  });
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? 'Vérifiez votre saisie.');
  }

  const store = await headers();
  const ip = store.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!rateLimit(`notify:${ip}`, { limit: 5, windowMs: 3_600_000 }).ok) {
    return fail('Trop de tentatives. Réessayez plus tard.');
  }

  if (!isDatabaseConfigured()) {
    return fail('Indisponible pour le moment. Réessayez plus tard.');
  }

  try {
    await insertLead({
      kind: 'notify',
      lineSlug: parsed.data.lineSlug,
      email: parsed.data.email,
      payload: {},
    });
  } catch (error) {
    console.error('Enregistrement de la demande d’information impossible.', error);
    return fail('Indisponible pour le moment. Réessayez plus tard.');
  }

  await notifyOwnerOfLead({
    kind: 'notify',
    lineSlug: parsed.data.lineSlug,
    email: parsed.data.email,
  });

  return sent;
}
