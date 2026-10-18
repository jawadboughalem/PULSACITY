# Requête : le tableau de bord du fondateur

Les indicateurs de `decisions/commercialisation.md` (« Indicateurs ») et l'arbitrage n° 10, lus dans la base. La mesure d'audience (visites par source) est dans Umami ; tout le reste est ici.

À lancer chaque lundi, et le 1er du mois avec `seuil-micro-entreprise.md`, dans l'éditeur SQL de Supabase, projet de production « PULSACITY », en lecture seule, par un prompt Claude in Chrome. Chaque requête se lance seule (une à la fois).

Les requêtes 1 à 6 ne renvoient que des nombres, des dates et des sources : aucune adresse, aucun nom. Seule la requête 7 montre des adresses e-mail, parce que le fondateur en a besoin pour « Demander un avis » ; son résultat reste dans Supabase et n'entre ni dans un compte rendu, ni dans le dépôt. Aucune requête ne contient de donnée personnelle.

Les espaces de test (« Recette demo space », comptes du fondateur) faussent les chiffres tant qu'ils sont en production : le lot 4.10 les efface avant le lancement. L'espace PULSACITY lui-même est exclu en remplaçant `00000000-0000-0000-0000-000000000000` par son identifiant (`PULSACITY_SPACE_ID`, le même que dans Vercel).

## 1. Inscriptions par source

Une inscription est un espace créé. La source vient de l'adresse d'arrivée (UTM, lien court `/go/…`, badge « Propulsé par », lien de parrainage) ; à défaut, de la réponse à « Comment avez-vous connu PULSACITY ? » ; à défaut, « directe ou inconnue ».

```sql
with sources as (
  select s.created_at,
         case
           when a.referral_code is not null and a.utm_source = 'badge' then 'badge Propulsé par (' || coalesce(a.utm_medium, '?') || ')'
           when a.referral_code is not null then 'parrainage'
           when a.utm_source is not null then a.utm_source || coalesce(' / ' || a.utm_campaign, '')
           when a.heard_from is not null then 'réponse : ' || a.heard_from
           else 'directe ou inconnue'
         end as source
  from spaces s
  left join space_acquisitions a on a.space_id = s.id
  where s.id <> '00000000-0000-0000-0000-000000000000'
)
select source,
       count(*) filter (where created_at >= now() - interval '7 days') as sept_jours,
       count(*) filter (where created_at >= now() - interval '30 days') as trente_jours,
       count(*) as depuis_le_debut
from sources
group by source
order by depuis_le_debut desc;
```

Les réponses à la question, à part (elles disent aussi d'où viennent ceux qui sont arrivés par un lien suivi) :

```sql
select coalesce(heard_from, 'sans réponse') as reponse, count(*) as espaces
from spaces s
left join space_acquisitions a on a.space_id = s.id
where s.id <> '00000000-0000-0000-0000-000000000000'
group by 1
order by 2 desc;
```

Les codes des partenaires (coupons Stripe nommés `partenaire-…`) et les liens courts de chaque partenaire :

```sql
select coupon_id, count(*) as abonnements, count(*) filter (where status in ('active', 'past_due')) as en_cours
from subscriptions
where coupon_id like 'partenaire-%'
group by coupon_id
order by abonnements desc;

select utm_campaign as lien_court, count(*) as espaces
from space_acquisitions
where utm_source = 'lien-court'
group by utm_campaign
order by espaces desc;
```

## 2. Activation : outil connecté ou CSV importé sous 7 jours

Par semaine d'inscription, les espaces qui ont reçu une première vente vérifiée d'un connecteur, ou importé un fichier CSV, dans les 7 jours qui suivent leur création. Les semaines de moins de 7 jours ne sont pas encore closes.

```sql
with activation as (
  select s.id,
         date_trunc('week', s.created_at at time zone 'Europe/Paris')::date as semaine,
         exists (
           select 1 from webhook_events e
           join connections c on c.id = e.connection_id
           where c.space_id = s.id and e.error is null and e.received_at <= s.created_at + interval '7 days'
         ) or exists (
           select 1 from testimonials t
           where t.space_id = s.id and t.source = 'csv' and t.created_at <= s.created_at + interval '7 days'
         ) as active
  from spaces s
  where s.id <> '00000000-0000-0000-0000-000000000000'
)
select semaine, count(*) as inscriptions, count(*) filter (where active) as activees,
       round(100.0 * count(*) filter (where active) / count(*)) as taux_pourcent
from activation
group by semaine
order by semaine desc;
```

## 3. Indicateur principal : espaces dont le widget a été chargé dans les 7 derniers jours

Un widget « chargé » est un widget affiché sur une page autre que pulsacity.com (`widgets.last_loaded_at`, noté au plus une fois par heure, depuis le lot 4.12).

```sql
select count(distinct space_id) as espaces_avec_widget_charge
from widgets
where last_loaded_at >= now() - interval '7 days'
  and space_id <> '00000000-0000-0000-0000-000000000000';
```

## 4. Témoignages validés par espace actif

Un espace actif est un espace dont le widget a été chargé dans les 7 derniers jours (3).

```sql
with actifs as (
  select distinct space_id from widgets
  where last_loaded_at >= now() - interval '7 days'
    and space_id <> '00000000-0000-0000-0000-000000000000'
)
select count(*) as espaces_actifs,
       coalesce(sum(valides), 0) as temoignages_valides,
       round(avg(valides), 1) as moyenne_par_espace,
       percentile_cont(0.5) within group (order by valides) as mediane
from (
  select a.space_id, count(t.id) filter (where t.status = 'approved') as valides
  from actifs a
  left join testimonials t on t.space_id = a.space_id
  group by a.space_id
) par_espace;
```

## 5. Abonnés, revenu, résiliations, parrainage

```sql
select plan, period, price_list, count(*) as abonnes,
       round(sum(case when period = 'yearly' then amount_cents / 12.0 else amount_cents end) / 100.0, 2) as revenu_mensuel_euros
from subscriptions
where status in ('active', 'past_due')
  and (beta_until is null or beta_until <= now())
group by plan, period, price_list
order by abonnes desc;

select count(*) filter (where cancel_at is not null and status in ('active', 'past_due')) as resiliations_programmees,
       count(*) filter (where ended_at >= now() - interval '30 days') as arretes_sur_30_jours
from subscriptions;

select count(*) as filleuls,
       count(*) filter (where rewarded_at is not null) as mois_offerts,
       count(*) filter (where reward = 'credit') as en_credit,
       count(*) filter (where reward = 'free-month') as au_plan_gratuit
from referrals;
```

Le revenu mensuel compte un abonnement annuel pour le douzième de son prix ; les bêta-testeurs dans leurs mois offerts n'y sont pas.

## 6. Repères du seuil

Les quatre requêtes de `docs-internes/requetes/seuil-micro-entreprise.md`, le même jour.

## 7. Bêta-testeurs : widget affiché depuis 21 jours (arbitrage n° 10)

Les espaces dont le premier widget est affiché depuis 21 jours au moins, et qui n'ont pas encore reçu de demande d'avis de l'espace PULSACITY. Pour chacun, le fondateur fait « Demander un avis » depuis l'espace PULSACITY, offre « Bêta PULSACITY ». Cette requête montre l'adresse de connexion du créateur : son résultat ne se copie nulle part.

```sql
select s.name as espace, u.email as adresse, min(w.first_loaded_at)::date as premier_widget_affiche
from spaces s
join "user" u on u.id = s.user_id
join widgets w on w.space_id = s.id
where w.first_loaded_at <= now() - interval '21 days'
  and s.id <> '00000000-0000-0000-0000-000000000000'
  and not exists (
    select 1 from customers c
    join purchases p on p.customer_id = c.id
    join review_requests r on r.purchase_id = p.id
    where c.space_id = '00000000-0000-0000-0000-000000000000' and c.email = u.email
  )
group by s.name, u.email
order by premier_widget_affiche;
```

Le compte rendu à Claude Code ne donne que le nombre de lignes.
