export { closeDb, getDb, isDatabaseConfigured, type Database } from './client';
export {
  DEFAULT_DEMO_TTL_DAYS,
  findDomain,
  findLiveDemoBySlug,
  insertLead,
  insertOrder,
  markLeadConverted,
  markSiteSold,
  recordStripeEvent,
  releaseStripeEvent,
} from './queries';
export * from './schema';
