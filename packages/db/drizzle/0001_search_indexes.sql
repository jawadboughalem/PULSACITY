-- Accent- and case-insensitive fuzzy search over business names, used by
-- « Votre site est peut-être déjà prêt ».
--
-- On Supabase the extensions live in the `extensions` schema; on a vanilla Postgres
-- they land in `public`. Listing both keeps this migration portable — a schema that
-- does not exist is simply ignored in a search_path.
SET LOCAL search_path = public, extensions;
--> statement-breakpoint
CREATE EXTENSION IF NOT EXISTS pg_trgm;
--> statement-breakpoint
CREATE EXTENSION IF NOT EXISTS unaccent;
--> statement-breakpoint
-- `unaccent()` is only STABLE, so it cannot be indexed directly. Pinning the
-- dictionary and the search_path makes this wrapper genuinely immutable.
CREATE OR REPLACE FUNCTION public.pulsacity_unaccent(text)
RETURNS text
LANGUAGE sql
IMMUTABLE
STRICT
PARALLEL SAFE
SET search_path = public, extensions, pg_catalog
AS $function$
  SELECT unaccent('unaccent'::regdictionary, $1)
$function$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sites_name_trgm_idx"
  ON "sites" USING gin (public.pulsacity_unaccent(lower("name")) gin_trgm_ops);
