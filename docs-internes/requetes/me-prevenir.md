# Requête : le poids de « Me prévenir », et les outils demandés

Pour décider quel connecteur monte d'une vague (`docs-internes/decisions/connecteurs.md`, « Règles ») :
- « Me prévenir » pèse 3 pour un créateur connecté (table `connector_waitlist`), 1 pour un visiteur du site (table `connector_waitlist_emails`) ;
- un outil monte d'une vague à 5 créateurs inscrits et une capture acceptée ;
- un outil non listé demandé 3 fois dans « Dites-nous quel outil » passe en « Bientôt ».

À lancer dans l'éditeur SQL de Supabase, projet de production « PULSACITY », en lecture seule, par un prompt Claude in Chrome. Les deux requêtes ne renvoient que des noms d'outils et des nombres : aucune adresse, aucun espace.

## 1. « Me prévenir », outil par outil

```sql
select connector as outil,
       sum(poids) as poids,
       count(*) filter (where poids = 3) as createurs,
       count(*) filter (where poids = 1) as visiteurs
from (
  select connector, 3 as poids from connector_waitlist where connector <> 'other'
  union all
  select connector, 1 as poids from connector_waitlist_emails
) as demandes
group by connector
order by poids desc, outil;
```

`createurs` dit si le seuil des 5 créateurs inscrits est atteint ; `poids` classe les outils entre eux.

## 2. « Dites-nous quel outil »

```sql
select lower(trim(tool_name)) as outil, count(*) as demandes
from (
  select tool_name from connector_waitlist where connector = 'other' and tool_name is not null
  union all
  select tool_name from tool_suggestions
) as suggestions
group by 1
order by demandes desc, outil;
```

Les noms sont tapés librement : « Teachable » et « teachable.com » comptent à part. Regroupez à la lecture.
