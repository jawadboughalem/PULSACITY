'use server';

import { headers } from 'next/headers';
import { z } from 'zod';

import { insertLead, isDatabaseConfigured } from '@pulsacity/db';

import { notifyOwnerOfLead } from '@/lib/email';
import { rateLimit } from '@/lib/rate-limit';

export type NotifyState =
  { status: 'idle' } | { status: 'sent'; message: string } | { status: 'error'; message: string };

const schema = z.object({
  email: z.string().trim().email('Adresse électronique invalide.'),
  lineSlug: z
    .string()
    .trim()
    .regex(/^[a-z0-9][a-z0-9-]{0,60}$/),
});

/** « Prévenez-moi » on a line still in preparation. Promises nothing else. */
export async function notifyMeAction(
  _previous: NotifyState,
  formData: FormData,
): Promise<NotifyState> {
  const sent: NotifyState = { status: 'sent', message: 'C’est noté. Je vous préviens.' };

  if (String(formData.get('website') ?? '').trim() !== '') return sent;

  const parsed = schema.safeParse({
    email: formData.get('email'),
    lineSlug: formData.get('lineSlug'),
  });
  if (!parsed.success) {
    return {
      status: 'error',
      message: parsed.error.issues[0]?.message ?? 'Vérifiez votre saisie.',
    };
  }

  const store = await headers();
  const ip = store.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!rateLimit(`notify:${ip}`, { limit: 5, windowMs: 3_600_000 }).ok) {
    return { status: 'error', message: 'Trop de tentatives. Réessayez plus tard.' };
  }

  if (!isDatabaseConfigured()) {
    return { status: 'error', message: 'Indisponible pour le moment. Réessayez plus tard.' };
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
    return { status: 'error', message: 'Indisponible pour le moment. Réessayez plus tard.' };
  }

  await notifyOwnerOfLead({
    kind: 'notify',
    lineSlug: parsed.data.lineSlug,
    email: parsed.data.email,
  });

  return sent;
}
