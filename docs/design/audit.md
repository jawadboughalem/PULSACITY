# État des lieux du design — septembre 2026

Lu dans le dépôt, pas de mémoire : `packages/design/src/tokens.css`,
`apps/corporate/src/app/globals.css`, les seize composants de
`apps/corporate/src/components/`, `packages/templates/src/render.tsx` et les fichiers de
`apps/corporate/content/`.

Le socle technique est sain : jetons centralisés, sections typées, contenu hors du code,
contraste mesuré, `prefers-reduced-motion` respecté. **Le problème n'est pas l'hygiène,
c'est l'absence de direction artistique** — et quatre défauts concrets qui se voient à
l'écran.

## Les quatre défauts qui se voient

### 1. Le bouton « Voir un site livré » ne mène nulle part

`content/lines/creation-de-sites.json:19` pointe sur `#realisations`. Cette ancre est posée
par `components/sections/showcase.tsx:20` — mais la ligne 18 sort avant :

```tsx
const cards = toCards(parseShowcase(showcaseJson), join(process.cwd(), 'public'));
if (cards.length === 0) return null;
```

`content/showcase.json` vaut `[]`. L'ancre n'existe donc pas dans le DOM, et le second
bouton du héros — celui qui porte toute la promesse — ne fait rien du tout.

C'est un bug, pas un choix. Rien ne relie une action de contenu à l'existence de sa cible :
ni le schéma zod de `lib/lines.ts`, ni un test.

### 2. La page vend un site et n'en montre aucun

`components/sections/hero.tsx` : un `h1`, un paragraphe, deux boutons. Au-dessus de la ligne
de flottaison, il n'y a rien à regarder. Or l'argument central — « vous voyez votre site sur
votre téléphone avant de payer » — est un argument **visuel**. Il est écrit, jamais montré.

`PhoneFrame` existe et attend une capture réelle. `showcase.json` est vide, donc les trois
endroits qui pourraient montrer le produit (`showcase`, `steps`, le héros) n'en montrent
aucun. La règle 6 est respectée — aucune image inventée — mais rien n'a été conçu pour
l'état « pas encore de capture », qui est justement l'état actuel.

### 3. Le favicon est d'une autre marque

`app/icon.svg` : un carré bleu `#2a4a9c` avec un « P » blanc. La palette du produit est
neutre chaude et corail. Ce bleu n'apparaît nulle part ailleurs — ni dans les jetons, ni
dans l'image de partage, ni dans le logotype. C'est le premier signe de marque que voit un
visiteur, dans son onglet, et il contredit tout le reste.

### 4. L'image de partage écrit le prix en dur

`app/opengraph-image.tsx` lit bien la marque et le titre du héros depuis le contenu, puis :

```tsx
<div style={{ … }}>500 € HT tout compris.</div>
```

Trois manquements d'un coup : le prix vit dans `content/lines/<slug>.json` (règle 7), la page
ne connaît aucune offre (le socle), et les couleurs `INK`, `ACCENT`, `GROUND` y sont
recopiées en hexadécimal au lieu de venir des jetons (règle 10). Le jour où le prix change,
l'aperçu partagé sur WhatsApp continuera d'afficher l'ancien.

## Ce qui manque en tant que système

### La page est un empilement, pas une composition

`SectionShell` applique le même traitement à tout : filet en haut, `py-20 sm:py-28`,
`max-w-5xl`, un `h2`, le contenu. Huit sections au même volume sonore. Rien n'est mis en
avant — pas même le prix, qui est l'élément décisif d'une offre à prix unique. La seule
variation disponible est `tinted`, un fond corail à 40 % d'opacité, utilisé deux fois.

Résultat : une page honnête et bien réglée, qui ressemble à un document. Pas à une marque.

### Les jetons sont trop maigres pour ce qu'on leur demande

`tokens.css` déclare 13 couleurs, 3 tailles de texte, 2 rayons, 1 ombre. Manquent : les
largeurs de conteneur, le rythme vertical des sections, la hauteur de l'en-tête, l'échelle
de rayons complète, les durées et les courbes de mouvement, les surfaces inversées, les
tailles de texte courant.

Conséquence directe, la règle 10 est déjà entamée :

| Valeur en dur                            | Où                                                                     |
| ---------------------------------------- | ---------------------------------------------------------------------- |
| `rounded-[1.75rem]`, `rounded-[1.25rem]` | `components/phone-frame.tsx:9,15`                                      |
| `tracking-[0.2em]`                       | `components/wordmark.tsx:6`                                            |
| `text-[0.975rem]`                        | `app/globals.css:80`                                                   |
| `min-h-[70vh]`, `min-h-[60vh]`           | `not-found.tsx`, `demo-unavailable.tsx`, `commande-indisponible.tsx`   |
| `2.4s`, `duration-200`                   | `globals.css`, `sections/faq.tsx`                                      |
| `size-8` / `size-7`                      | `sections/steps.tsx` et `merci/page.tsx` — le même objet, deux tailles |
| `max-w-5xl` / `3xl` / `2xl` / `lg`       | choisis page par page, sans règle                                      |

Aucune de ces valeurs n'est grave isolément. Ensemble, elles signifient qu'un changement de
look ne se fera pas dans un fichier.

### Le site vendu est plus pauvre que la page qui le vend

`packages/templates/src/render.tsx` est le produit livré au client. C'est un `article` en
`max-w-3xl`, des `Section` séparées par un filet, des encadrés `rounded-lg border p-4`, et
des étoiles en caractère `★`. Il partage les jetons de la page corporate, mais aucun de ses
partis pris.

Un prospect qui voit la démo de son propre site voit moins soigné que la page qui la lui a
vendue. C'est le pire endroit où faire cette économie.

### Les états vides font disparaître la page

`ShowcaseSection` renvoie `null`, `ComingLinesSection` renvoie `null`, le pied de page
n'affiche ni prénom, ni e-mail, ni téléphone tant que `content/site.json` les laisse vides —
et il les laisse vides aujourd'hui. La section « Contact » est donc un titre seul.

Trois pages — `not-found.tsx`, `demo-unavailable.tsx`, `commande-indisponible.tsx` — répètent
le même bloc centré à trois hauteurs différentes, sans primitive commune.

Le contenu est volontairement rare au lancement. Les états vides ne sont pas un cas
particulier : c'est l'état du jour, et il n'a pas été dessiné.

## Ce qu'il faut décider avant de dessiner

Ces questions n'ont pas de réponse dans le dépôt. Le prompt `01-brand-charter.md` les pose
et propose une réponse argumentée pour chacune.

1. **Quelle marque ?** Un studio-artisan ou un éditeur de logiciel ? Tout découle de là.
2. **Une seconde famille typographique ?** Manrope seule ne porte aucun caractère.
3. **Comment montrer le produit** tant qu'aucune capture réelle n'existe, sans rien inventer ?
4. **Quel motif signature ?** Le point corail du logotype est le seul candidat présent.
5. **Mode sombre ou non**, sur la page comme sur les sites livrés ?
