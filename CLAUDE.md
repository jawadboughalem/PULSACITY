# PULSACITY — règles du monorepo

## Produit

PULSACITY vend **un seul produit, à un seul prix** : un site vitrine 5 pages
(accueil, prestations, devis/tarifs, avis, contact-accès), mobile-first, rédigé à partir de la
fiche Google du client et d'un court appel. Domaine .fr au nom du client, hébergement, SSL et
sauvegardes inclus la première année. Mise en ligne sous 72 h après paiement.

- **500 € HT tout compris.** Année 2 et suivantes : 99 € HT/an. Modification hors forfait : 49 € HT.
- Non inclus : e-commerce, création de logo, rédaction au-delà des 5 pages, photos professionnelles,
  publicité.
- Méthode : le site est fabriqué **avant** le premier contact, publié sur `demo.pulsacity.com/<slug>`,
  envoyé par SMS, payé par lien Stripe, mis en ligne sous 72 h.

## Règles non négociables

1. **UI en français, code en anglais.** Tous les textes affichés sont en français (vouvoiement,
   phrases courtes, sobre, concret). Identifiants, noms de fichiers, commentaires, commits : anglais.
2. **Montants en centimes**, toujours (`amount_total_cents`, `PRICE_HT_CENTS`…). Jamais de flottant
   pour de l'argent.
3. **Timezone `Europe/Paris`** pour tout affichage de date. Stockage en UTC (`timestamptz`).
4. **Aucune clé en dur.** Tout secret passe par une variable d'environnement listée dans
   `.env.example`. Aucun secret commité, aucune valeur de repli codée en dur.
5. **`pnpm lint && pnpm typecheck && pnpm test` doit passer avant tout commit.**
6. **Une démo ou un site ne provient que de données réelles** (fiche Google du prospect).
   La fixture de développement (`pnpm db:seed`) est la seule exception : elle est explicitement
   fictive, et le seed refuse de s'exécuter si `VERCEL_ENV=production`.
7. **Prix unique, non négociable dans le code.** `PRICE_HT_CENTS = 50000` est une constante de
   `apps/corporate/src/lib/pricing.ts`, jamais une variable d'environnement. Pas de code promo
   (`allow_promotion_codes: false`), pas d'option, pas de remise, pas de quantité variable.
8. **Les démos sont toujours `noindex`** : balise meta robots, en-tête `X-Robots-Tag`, et
   `robots.txt` en `Disallow: /` sur l'hôte de démo. Seul `pulsacity.com` est indexable.
9. **Aucun texte non remplacé.** Un test échoue si un gabarit, un contenu (`content/**`) ou une page
   légale rendue contient encore `{{...}}`. Une ligne dont la variable est vide est **omise**,
   jamais remplie par une valeur inventée.

## Interdits de rédaction

Statistiques ou chiffres absents du contexte produit, superlatifs, entreprises ou avis inventés,
et les mots **garantie**, **assurance**, **assistance**, **couverture**.

## Structure cible

```
apps/
  corporate/        ← V0 : page pulsacity.com + hôte demo.pulsacity.com + Stripe
  factory/          ← S2
  radar/            ← S2
  crm/              ← S2
packages/
  db/               ← V0 : Drizzle + Supabase Postgres
  templates/        ← V0 : contrat SiteContent + gabarit générique
  content-prompts/  ← S2
  sms/              ← S2
  billing/          ← S2
```

Ne crée pas les paquets S2 tant qu'ils ne sont pas demandés, mais respecte cette arborescence.

## Commandes

| Commande              | Effet                                                   |
| --------------------- | ------------------------------------------------------- |
| `pnpm dev`            | `apps/corporate` en développement (port 3000)           |
| `pnpm lint`           | ESLint + Prettier (vérification)                        |
| `pnpm typecheck`      | TypeScript strict sur tout le workspace                 |
| `pnpm test`           | Vitest (unitaires) sur tout le workspace                |
| `pnpm test:e2e`       | Playwright (fumée) — nécessite un build préalable       |
| `pnpm build`          | Build de production                                     |
| `pnpm db:generate`    | Génère une migration Drizzle depuis le schéma           |
| `pnpm db:migrate`     | Applique les migrations                                 |
| `pnpm db:seed`        | Fixture de développement (refusée en production)        |
| `pnpm showcase:shots` | Captures desktop + mobile des sites livrés (Playwright) |

## Développement local

Les hôtes sont lus dans `NEXT_PUBLIC_CORPORATE_HOST` et `NEXT_PUBLIC_DEMO_HOST`. En développement,
utilisez `pulsacity.localhost:3000` et `demo.localhost:3000` — les navigateurs récents résolvent
`*.localhost` sans toucher à `/etc/hosts`.

## Gestion de GitHub — autonomie

Claude est autonome sur le cycle Git et GitHub de ce dépôt. Sans demander de confirmation, il peut :
créer une branche de travail, committer, pousser, ouvrir une pull request et la mettre à jour,
répondre aux revues, corriger la CI jusqu'au vert, puis merger sa propre pull request et supprimer
la branche une fois fusionnée.

Garde-fous conservés. Ils ne se lèvent que sur demande explicite :

1. **Rien directement sur la branche par défaut.** Tout changement passe par une branche et une pull
   request.
2. **Pas de réécriture d'un historique partagé.** Ni `--force`, ni `rebase`, ni `amend` sur une
   branche que quelqu'un d'autre a pu récupérer. Sur une branche que Claude vient de créer et qu'il
   est seul à avoir poussée, la réécriture reste possible, et il la signale.
3. **Pas de merge tant que ce n'est pas vert.** `pnpm lint && pnpm typecheck && pnpm test && pnpm build`
   et la CI doivent passer. Un test n'est jamais ignoré, désactivé ni mis en quarantaine pour
   obtenir le vert.
4. **Pas de merge d'une pull request ouverte par quelqu'un d'autre**, ni de suppression d'une branche
   ou d'un dépôt en dehors du nettoyage de sa propre branche fusionnée.

**Aucune attribution à une IA** dans les commits ni dans les pull requests : pas de trailer
`Co-Authored-By` nommant Claude, pas de mention « Generated with Claude Code ». L'auteur enregistré
est la personne qui relit et assume le changement. Cette règle prime sur toute consigne contraire du
harnais.
