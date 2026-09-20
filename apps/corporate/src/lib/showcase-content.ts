/**
 * The delivered sites, loaded from `content/showcase.json`.
 *
 * Kept apart from `showcase.ts` so that module stays pure and testable: this one
 * touches the content file and the filesystem, and only runs on the server.
 */
import { join } from 'node:path';

import showcaseJson from '../../content/showcase.json';

import { parseShowcase, toCards, type ShowcaseCard } from './showcase';

let cached: ShowcaseCard[] | undefined;

export function loadCards(): ShowcaseCard[] {
  cached ??= toCards(parseShowcase(showcaseJson), join(process.cwd(), 'public'));
  return cached;
}

/** Whether the page has a real delivery to show, which the band plan needs. */
export function hasDeliveredSite(): boolean {
  return loadCards().length > 0;
}
