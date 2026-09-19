export { closeDb, getDb, isDatabaseConfigured, type Database } from './client';
export type { DemoSiteMatch } from './queries';
export {
  DEFAULT_DEMO_TTL_DAYS,
  SITE_SEARCH_LIMIT,
  SITE_SEARCH_THRESHOLD,
  findDomain,
  findLiveDemoBySlug,
  insertLead,
  insertOrder,
  markSiteSold,
  recordStripeEvent,
  releaseStripeEvent,
  searchDemoSites,
} from './queries';
export * from './schema';
