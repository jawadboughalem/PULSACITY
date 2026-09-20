-- The « votre site est peut-être déjà prêt » search is gone, so the trigram
-- infrastructure it needed goes with it.
DROP INDEX IF EXISTS "sites_name_trgm_idx";
--> statement-breakpoint
DROP FUNCTION IF EXISTS public.pulsacity_unaccent(text);
--> statement-breakpoint
-- Extensions are shared with the rest of the database and may need rights this role
-- does not have. Dropping them is a cleanup, never a reason to fail the migration.
DO $drop_trgm$
BEGIN
  DROP EXTENSION IF EXISTS pg_trgm;
EXCEPTION
  WHEN OTHERS THEN RAISE NOTICE 'pg_trgm conservée : %', SQLERRM;
END
$drop_trgm$;
--> statement-breakpoint
DO $drop_unaccent$
BEGIN
  DROP EXTENSION IF EXISTS unaccent;
EXCEPTION
  WHEN OTHERS THEN RAISE NOTICE 'unaccent conservée : %', SQLERRM;
END
$drop_unaccent$;
