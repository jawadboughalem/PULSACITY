import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  LEGAL_SLUGS,
  legalVariables,
  readLegalSource,
  renderLegalDocument,
  substituteLegalVariables,
} from './legal';

const filled = {
  LEGAL_NAME: 'Jean Dupont',
  LEGAL_STATUS: 'Entrepreneur individuel',
  LEGAL_SIRET: '000 000 000 00000',
  LEGAL_ADDRESS: '1 rue de Paris, 75001 Paris',
  LEGAL_EMAIL: 'contact@example.com',
  LEGAL_PUBLISHER: 'Jean Dupont',
  LEGAL_HOST_ADDRESS: '340 S Lemon Ave, Walnut',
  CONTACT_EMAIL: 'contact@example.com',
  CONTACT_PHONE: '01 23 45 67 89',
  PRICE_HT: '500 € HT',
  RENEWAL_HT: '99 € HT',
  EXTRA_CHANGE_HT: '49 € HT',
  VAT_NOTICE: 'TVA non applicable, art. 293 B du CGI',
};

const empty = Object.fromEntries(Object.keys(filled).map((key) => [key, undefined]));

describe('substituteLegalVariables', () => {
  it('replaces a filled variable', () => {
    expect(substituteLegalVariables('Éditeur : {{LEGAL_NAME}}', filled)).toBe(
      'Éditeur : Jean Dupont',
    );
  });

  it('omits the whole line when the variable is empty — it never fills it', () => {
    const source = ['- {{LEGAL_NAME}}', '- SIRET : {{LEGAL_SIRET}}', '- Fin'].join('\n');
    const rendered = substituteLegalVariables(source, { ...filled, LEGAL_SIRET: '   ' });
    expect(rendered).toBe(['- Jean Dupont', '- Fin'].join('\n'));
    expect(rendered).not.toContain('SIRET');
  });

  it('keeps lines that hold no variable at all', () => {
    expect(substituteLegalVariables('Texte simple.', empty)).toBe('Texte simple.');
  });

  it('throws on a marker it cannot resolve rather than shipping it', () => {
    expect(() => substituteLegalVariables('Prix : {{ prix-invalide }}', filled)).toThrowError(
      /Texte non remplacé/,
    );
  });

  it('neutralises angle brackets coming from a variable', () => {
    const rendered = substituteLegalVariables('{{LEGAL_NAME}}', {
      LEGAL_NAME: '<script>alert(1)</script>',
    });
    expect(rendered).not.toContain('<script>');
  });
});

// CLAUDE.md rule 9 — the test that must fail if a legal page ships an unreplaced marker.
describe.each(LEGAL_SLUGS)('page légale /%s', (slug) => {
  it('renders without a single {{...}} marker when every variable is filled', () => {
    const { html, title } = renderLegalDocument(slug, filled);
    expect(html).not.toMatch(/\{\{/);
    expect(title.length).toBeGreaterThan(0);
  });

  it('renders without a single {{...}} marker when every variable is empty', () => {
    const { html } = renderLegalDocument(slug, empty);
    expect(html).not.toMatch(/\{\{/);
  });

  it('only references variables the application actually provides', () => {
    const known = new Set(Object.keys(legalVariables()));
    const used = readLegalSource(slug).match(/\{\{\s*([A-Z0-9_]+)\s*\}\}/g) ?? [];
    for (const marker of used) {
      expect(known).toContain(marker.replace(/[{}\s]/g, ''));
    }
  });
});

describe('mention de TVA selon le régime', () => {
  const original = process.env.VAT_MODE;
  beforeEach(() => {
    delete process.env.VAT_MODE;
  });
  afterEach(() => {
    if (original === undefined) delete process.env.VAT_MODE;
    else process.env.VAT_MODE = original;
  });

  it('prints the art. 293 B notice under the franchise', () => {
    process.env.VAT_MODE = 'franchise';
    expect(legalVariables().VAT_NOTICE).toBe('TVA non applicable, art. 293 B du CGI');
    expect(renderLegalDocument('cgv', legalVariables()).html).toContain('293 B');
  });

  it('drops the notice — and its line — when VAT is charged', () => {
    process.env.VAT_MODE = 'standard';
    expect(legalVariables().VAT_NOTICE).toBeUndefined();
    expect(renderLegalDocument('cgv', legalVariables()).html).not.toContain('293 B');
  });
});
