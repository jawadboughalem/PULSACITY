# 08 — Icône, image de partage, captures

> Prérequis : `00-context.md`, `01`, `02`.
> Livrable : **code** — `app/icon.svg` et sa famille, `app/opengraph-image.tsx`, et l'art
> direction de `scripts/showcase-shots.ts`.

---

## Ton rôle

Tu produis les signes de marque qui vivent hors de la page : l'onglet du navigateur, l'écran
d'accueil d'un téléphone, l'aperçu d'un lien partagé sur WhatsApp. Ce sont souvent les
premières et les seules images que voit un prospect.

Deux d'entre elles sont aujourd'hui fausses.

## 1. L'icône est d'une autre marque

`apps/corporate/src/app/icon.svg` :

```svg
<rect width="64" height="64" rx="12" fill="#2a4a9c" />
<path d="M22 46V18h12.2c…" fill="#ffffff" />
```

Un carré **bleu** avec un « P ». La palette du produit est neutre chaude et corail ; ce bleu
n'apparaît nulle part ailleurs. C'est le premier signe de marque que voit un visiteur, dans
son onglet, et il contredit tout le reste.

À produire, à partir du logotype de la charte :

- **`icon.svg`** — l'icône carrée, lisible à 16 px. Un logotype réduit n'est pas une icône :
  à 16 px, « PULSACITY » en capitales espacées est une bouillie grise. Construis l'icône
  depuis le **motif signature**, pas depuis le mot.
- **`apple-icon.png`** — 180 × 180, sans transparence, sans coins arrondis (iOS les
  applique), avec sa marge propre.
- La version monochrome, pour les contextes qui aplatissent la couleur.

Contraintes : le fichier reste minuscule et statique ; les couleurs viennent des jetons,
recopiées en commentaire avec leur nom (`--color-accent`, `--color-ink`) puisqu'un SVG ne lit
pas les variables du site ; et le `viewBox` doit tenir de 16 à 512 px sans retouche.

Vérifie le résultat à 16 px sur fond clair **et** sur fond sombre : les navigateurs
n'appliquent pas tous le même fond d'onglet.

## 2. L'image de partage écrit le prix en dur

`apps/corporate/src/app/opengraph-image.tsx` lit bien la marque et le titre du héros dans le
contenu, puis affiche :

```tsx
<div style={{ … }}>500 € HT tout compris.</div>
```

Et recopie trois couleurs en hexadécimal : `INK`, `ACCENT`, `GROUND`.

Trois règles enfreintes d'un coup — le prix vit dans `content/lines/<slug>.json` (règle 7),
la page ne connaît aucune offre (le socle), et les couleurs doivent venir des jetons
(règle 10). Le jour où le prix change, l'aperçu partagé continuera d'afficher l'ancien.

À produire :

- une image de partage **entièrement dérivée du contenu** : marque, titre du héros, et le
  prix lu dans l'offre de la ligne et formaté par `formatEurHt`. Si la ligne n'a pas
  d'offre, l'élément disparaît — il n'est jamais remplacé par une valeur inventée ;
- les couleurs importées d'un module TypeScript de `packages/design` (`next/og` ne lit pas
  les variables CSS), de sorte que le CSS et l'image aient une seule source ;
- une composition qui tient en vignette : l'aperçu WhatsApp fait quelques centaines de
  pixels de large, la moitié du texte y devient illisible ;
- **une image par ligne live** : `/<slug>` a sa page, elle mérite son aperçu ;
- les polices. `next/og` n'a pas accès aux polices de `next/font` : il faut les charger
  explicitement, sinon l'image sort dans une police système qui n'est pas celle de la
  marque. Fais-le, ou assume par écrit de rester en police système.

## 3. Les captures de sites livrés

`pnpm showcase:shots` (`apps/corporate/scripts/showcase-shots.ts`) ouvre chaque URL de
`content/showcase.json` dans Chromium et écrit deux WebP dans `public/showcase/` :
bureau 1280 × 800, mobile 390 × 844 en densité 2, qualité 82.

C'est un outil de production d'images, donc une affaire de direction artistique :

- **Que cadre-t-on ?** Le haut de la page, ou une hauteur fixe qui coupe proprement ? Une
  capture entière d'une page longue produit un timbre-poste illisible.
- **Quand déclenche-t-on ?** `networkidle` ne veut pas dire que les polices et les images
  sont posées. Un site capturé à mi-chargement est pire que pas de capture.
- **Que fait-on des bannières ?** Bandeau de cookies, chat, notification : un site client
  peut en afficher. Une capture avec un bandeau de cookies en travers est inutilisable.
- **Quel rapport d'image** attend le composant de la charte — cadre de téléphone, cadre de
  navigateur, image nue ? Les dimensions du script doivent correspondre à ce que dessine
  `04`, sinon l'image est redimensionnée et se salit.
- **Les captures sont-elles versionnées ?** `public/showcase/` ne contient qu'un `.gitkeep`
  aujourd'hui : dis si les WebP entrent dans le dépôt ou se régénèrent au déploiement, et
  ce qui se passe quand elles manquent au moment du build.

Contrainte absolue : **une capture ne montre qu'un site réellement livré.** Pas de maquette,
pas de site de démonstration présenté comme une référence, pas de capture retouchée.

## Contraintes non négociables

- Aucun prix, aucun nom d'offre, aucun argument de vente écrit dans un composant ou un
  script : tout vient de `content/`.
- Une seule source pour les couleurs, partagée par le CSS et les images.
- Poids : l'image de partage se génère au build, l'icône reste sous quelques kilo-octets.
- Le score Lighthouse ne baisse pas.

## Critères d'acceptation

- [ ] L'icône vient de la charte, n'est plus bleue, et se lit à 16 px sur fond clair et
      sur fond sombre.
- [ ] `apple-icon` existe et est correctement dimensionnée.
- [ ] L'image de partage ne contient plus aucun prix codé en dur.
- [ ] Ses couleurs viennent du même module que les jetons CSS.
- [ ] Chaque ligne live a son aperçu.
- [ ] La police de l'image de partage est celle de la marque, ou l'écart est assumé par écrit.
- [ ] Le cadrage des captures est décidé, écrit, et correspond à ce que les composants
      attendent.
- [ ] Le script se comporte proprement quand `showcase.json` est vide — c'est le cas
      d'aujourd'hui.
