# Kit de design PULSACITY

Ce dossier contient **de quoi refaire le design du produit de bout en bout** : un état des
lieux, puis une suite de prompts prêts à coller dans Claude.

Rien ici n'est du code. Le code que ces prompts produisent va dans `packages/design`,
`apps/corporate` et `packages/templates`, et reste soumis aux règles de `CLAUDE.md`.

## Ce qu'il y a dedans

| Fichier                                  | Rôle                                                              |
| ---------------------------------------- | ----------------------------------------------------------------- |
| [`audit.md`](./audit.md)                 | Ce qui ne va pas aujourd'hui, avec les fichiers et les lignes     |
| `prompts/00-context.md`                  | Le bloc de contexte à coller **avant chaque** prompt              |
| `prompts/01-brand-charter.md`            | Charte graphique : idée de marque, couleur, typo, logo, motif     |
| `prompts/02-design-tokens.md`            | La charte traduite en `packages/design` — la seule source du look |
| `prompts/03-primitives.md`               | Les composants de base : bouton, champ, carte, cadre, badge…      |
| `prompts/04-sections.md`                 | Les sept types de section, plus l'en-tête et le pied de page      |
| `prompts/05-homepage-v1.md`              | La première version complète de `pulsacity.com`                   |
| `prompts/06-order-funnel.md`             | Le parcours de commande : formulaire, paiement, merci, échecs     |
| `prompts/07-client-site-template.md`     | Le gabarit du site livré au client — le produit lui-même          |
| `prompts/08-brand-assets.md`             | Favicon, image de partage, art direction des captures             |
| `prompts/09-states-and-empty.md`         | États vides, chargement, erreurs, 404, démo indisponible          |
| `prompts/10-motion-and-accessibility.md` | Mouvement, contraste, clavier, préférences système                |
| `prompts/11-review-gate.md`              | Le prompt de relecture qui refuse un livrable non conforme        |

## Comment s'en servir

**Un fichier = un prompt.** On colle `prompts/00-context.md` en premier, puis le prompt
voulu, dans la même conversation ou dans la même requête. Le contexte ne se devine pas :
sans lui, Claude réinvente la marque à chaque fois.

Deux façons de travailler, et les prompts prévoient les deux :

- **Dans Claude (artefact HTML)** pour voir et juger vite. Le livrable est une maquette
  autonome qui n'utilise que les noms de jetons du dépôt. On regarde, on tranche, on itère
  sans toucher au code.
- **Dans Claude Code (code réel)** pour poser le résultat dans le monorepo, une fois la
  maquette validée.

L'ordre compte. `01` décide, `02` fige la décision en jetons, `03` à `10` s'appuient dessus.
Lancer `05` avant `02`, c'est obtenir une belle page dont rien n'est réutilisable.

Après chaque livrable, on passe `11-review-gate.md`. Il est écrit pour être sévère.

## La règle qui gouverne tout le kit

`CLAUDE.md` règle 10 : **le design ne se change qu'en changeant les jetons de
`packages/design`.** Aucune couleur, aucune taille de police, aucun rayon, aucune durée en
dur dans un composant.

Chaque prompt le répète, parce que c'est la règle que les modèles — et les humains —
enfreignent en premier, et parce que c'est elle qui décide si le prochain changement de
look coûte une heure ou trois semaines.

## Ce que ces prompts ne feront jamais faire

Les interdits de `CLAUDE.md` sont recopiés dans chaque prompt, et le prompt de relecture les
vérifie un par un :

- pas de chiffre, de statistique ou d'avis inventé — une démo, un site ou une référence ne
  vient que de données réelles ;
- pas de superlatif, pas d'entreprise inventée ;
- jamais les mots **garantie**, **assurance**, **assistance**, **couverture** ;
- jamais un prix, un nom d'offre ou un argument de vente écrit dans un composant : cela vit
  dans `apps/corporate/content/`.
