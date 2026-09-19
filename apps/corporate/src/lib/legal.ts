/**
 * Legal pages, rendered from `content/legal/*.md`.
 *
 * Substitution rule (CLAUDE.md rule 9): a line whose variable is empty is **removed**,
 * never filled with an invented value. A `{{...}}` marker surviving substitution is a
 * bug, so rendering throws rather than shipping it.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { marked } from 'marked';

import { EXTRA_CHANGE_HT_CENTS, PRICE_HT_CENTS, RENEWAL_HT_CENTS, formatEurHt } from './pricing';
import { contactDetails, legalIdentity, vatMode } from './server-env';
import { VAT_FRANCHISE_NOTICE } from './pricing';

export const LEGAL_SLUGS = ['mentions-legales', 'confidentialite', 'cgv'] as const;
export type LegalSlug = (typeof LEGAL_SLUGS)[number];

export type LegalVariables = Record<string, string | undefined>;

const MARKER = /\{\{\s*([A-Z0-9_]+)\s*\}\}/g;

/** Values inserted into Markdown must not be able to introduce raw HTML. */
function escapeAngleBrackets(value: string): string {
  return value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function isFilled(value: string | undefined): value is string {
  return typeof value === 'string' && value.trim() !== '';
}

/**
 * Replaces `{{VAR}}` markers, dropping every line that references an empty variable.
 */
export function substituteLegalVariables(source: string, variables: LegalVariables): string {
  const kept = source.split('\n').filter((line) => {
    const markers = line.match(MARKER);
    if (!markers) return true;
    return markers.every((marker) => isFilled(variables[marker.replace(/[{}\s]/g, '')]));
  });

  const rendered = kept
    .map((line) =>
      line.replace(MARKER, (_match, key: string) => escapeAngleBrackets(variables[key] ?? '')),
    )
    .join('\n')
    // Collapse the blank runs left behind by removed lines.
    .replace(/\n{3,}/g, '\n\n');

  if (/\{\{/.test(rendered)) {
    throw new Error(
      `Texte non remplacé dans une page légale : ${rendered.match(/\{\{[^\n]*/)?.[0] ?? ''}`,
    );
  }
  return rendered;
}

/** Every variable the legal Markdown may reference. */
export function legalVariables(): LegalVariables {
  const identity = legalIdentity();
  const contact = contactDetails();

  return {
    LEGAL_NAME: identity.name,
    LEGAL_STATUS: identity.status,
    LEGAL_SIRET: identity.siret,
    LEGAL_ADDRESS: identity.address,
    LEGAL_EMAIL: identity.email,
    LEGAL_PUBLISHER: identity.publisher ?? identity.name,
    LEGAL_HOST_ADDRESS: identity.hostAddress,
    CONTACT_EMAIL: contact.email,
    CONTACT_PHONE: contact.phone,
    PRICE_HT: formatEurHt(PRICE_HT_CENTS),
    RENEWAL_HT: formatEurHt(RENEWAL_HT_CENTS),
    EXTRA_CHANGE_HT: formatEurHt(EXTRA_CHANGE_HT_CENTS),
    // Only meaningful under the VAT franchise; the line disappears otherwise.
    VAT_NOTICE: vatMode() === 'franchise' ? VAT_FRANCHISE_NOTICE : undefined,
  };
}

export function legalSourcePath(slug: LegalSlug): string {
  return join(process.cwd(), 'content', 'legal', `${slug}.md`);
}

export function readLegalSource(slug: LegalSlug): string {
  return readFileSync(legalSourcePath(slug), 'utf8');
}

export interface LegalDocument {
  title: string;
  html: string;
}

/** Reads, substitutes and converts one legal document to HTML. */
export function renderLegalDocument(slug: LegalSlug, variables = legalVariables()): LegalDocument {
  const markdown = substituteLegalVariables(readLegalSource(slug), variables);
  const title = /^#\s+(.+)$/m.exec(markdown)?.[1]?.trim() ?? slug;
  return { title, html: marked.parse(markdown, { async: false }) };
}
