# Requête : les repères du seuil de la micro-entreprise

Le seuil est dans `docs-internes/fin-v0/seuil-micro-entreprise.md` : 5 clients payants en même temps, 3 mois de suite avec au moins un paiement, ou 500 € encaissés, le premier atteint. Ce jour-là, les prompts 6.1 à 6.7 passent avant tout le reste. `decisions/tarifs.md` ajoute un repère : si 5 cartes de bêta-testeurs ou plus sont enregistrées, lancer 6.1 un mois avant la fin de leur gratuité.

Les chiffres viennent des événements Stripe reçus depuis le lot 4.5 :
- `subscriptions` : chaque abonnement, tel que Stripe l'a décrit en dernier ;
- `billing_payments` : chaque facture payée avec de l'argent (les mois offerts aux bêta-testeurs n'y sont pas).

À lancer le 1er de chaque mois dans l'éditeur SQL de Supabase, projet de production « PULSACITY », en lecture seule, par un prompt Claude in Chrome. Les requêtes ne renvoient que des nombres et des dates : aucune adresse, aucun nom d'espace. Stripe donne les mêmes repères : Billing › « Abonnements » (actifs) et « Paiements ».

## 1. Clients payants en ce moment

```sql
select count(*) as clients_payants
from subscriptions
where status in ('active', 'past_due')
  and (beta_until is null or beta_until <= now());
```

Un abonnement dont le paiement est relancé (`past_due`) compte encore ; un bêta-testeur dans ses mois offerts ne compte pas encore.

## 2. Mois de suite avec au moins un paiement

```sql
with mois as (
  select distinct (extract(year from paid_at at time zone 'Europe/Paris') * 12
                   + extract(month from paid_at at time zone 'Europe/Paris'))::int as rang
  from billing_payments
  where amount_cents > 0
), suites as (
  select rang, rang - row_number() over (order by rang) as suite
  from mois
)
select to_char(make_date((min(rang) - 1) / 12, (min(rang) - 1) % 12 + 1, 1), 'YYYY-MM') as premier_mois,
       to_char(make_date((max(rang) - 1) / 12, (max(rang) - 1) % 12 + 1, 1), 'YYYY-MM') as dernier_mois,
       count(*) as mois_de_suite
from suites
group by suite
order by dernier_mois desc;
```

Une ligne par suite de mois, la plus récente en haut. Le repère est atteint dès qu'une ligne montre 3.

## 3. Total encaissé depuis le premier paiement

```sql
select round(sum(amount_cents) / 100.0, 2) as total_euros,
       count(*) as paiements,
       min(paid_at) as premier_paiement
from billing_payments
where amount_cents > 0 and currency = 'eur';
```

Un remboursement n'est pas déduit : retirez-le à la lecture (Stripe › Paiements › « Remboursés »), comme le vrai paiement de vérification du passage en mode réel, remboursé ensuite.

## 4. Cartes de bêta-testeurs enregistrées

```sql
select count(*) as cartes_beta,
       min(beta_until) as premiere_fin_de_gratuite
from subscriptions
where beta_tester
  and status in ('active', 'trialing', 'past_due')
  and card_last4 is not null
  and cancel_at is null;
```

À 5 cartes ou plus : lancer 6.1 un mois avant `premiere_fin_de_gratuite`.
