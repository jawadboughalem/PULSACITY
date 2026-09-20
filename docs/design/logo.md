# La marque PULSACITY

Quatre blocs inégaux, et l'un d'eux — plus grand, corail, débordant vers le haut — est
celui qui bat.

## L'idée

Le nom porte deux mots : **pulse** et **city**. Le dessin porte les deux dans une seule
forme. Des blocs, comme un plan vu d'en haut ; l'un d'eux vit.

Ce n'est pas une grille. Une grille régulière est une fenêtre, et une fenêtre ne dit rien :
retirez le nom d'une grille 2×2 de carrés arrondis, plus personne ne reconnaît
l'entreprise. **L'irrégularité est ce qui fait la marque**, et c'est elle qu'il ne faut
jamais régulariser.

Le bloc corail sort du cadre par le haut, de deux unités. Ce dépassement est le battement.
Il n'est pas une erreur d'alignement : un test échoue si quelqu'un le rentre dans la marge.

## Ce que le dessin permet ensuite

La création de sites est la première ligne, pas le projet. Le projet est une suite d'outils
pour ceux qui ne peuvent pas s'offrir ceux des grands groupes — et une marque faite de
blocs se prête exactement à cela : **une ligne, un bloc.**

Chaque produit à venir peut recevoir son propre bloc, dans la même géométrie, sans que la
marque mère change de forme. Le corail reste celui de PULSACITY ; une ligne se distingue
par la place de son bloc, jamais par une couleur nouvelle. C'est une piste ouverte, pas une
règle : elle se décidera quand la deuxième ligne existera vraiment.

## Les fichiers

Tous produits par `pnpm brand:assets`. **Aucun ne se modifie à la main** — un test compare
ce qui est commité à ce que le script écrirait.

| Fichier                                      | Usage                                 |
| -------------------------------------------- | ------------------------------------- |
| `packages/design/src/logo/mark.svg`          | La marque, fond transparent           |
| `packages/design/src/logo/mark-compact.svg`  | Le dessin en dessous de 24 px         |
| `packages/design/src/logo/mark-ink.svg`      | Monochrome encre                      |
| `packages/design/src/logo/mark-reversed.svg` | Monochrome clair, pour un fond sombre |
| `packages/design/src/logo/app-icon-512.png`  | Icône carrée, fond papier             |
| `apps/corporate/src/app/icon.svg`            | Favicon — le dessin compact           |
| `apps/corporate/src/app/apple-icon.png`      | Écran d'accueil iOS, 180 px           |

Dans l'application, la marque est un composant : `LogoMark` pour le symbole seul, `Logo`
pour le verrouillage. Ils lisent la géométrie dans `packages/design` et les couleurs dans
les jetons. Aucune valeur n'est écrite dans un composant.

## Les règles d'emploi

**Deux dessins, un seuil.** Au-dessus de 24 px, la marque standard, quatre blocs. En
dessous, le dessin compact, trois blocs plus lourds — les gouttières du dessin standard se
referment à cette taille et l'ensemble tourne en bouillie. Le composant bascule avec
`compact`.

**Taille minimale : 16 px** pour le dessin compact, **24 px** pour le standard. En
impression : 6 mm de côté.

**Zone de respect :** la hauteur d'un bloc corail sur les quatre côtés. Rien n'entre dedans,
pas même un filet.

**Le logotype perd son point à côté de la marque.** Le point corail de « PULSACITY. » est la
ponctuation de la marque quand elle signe seule. À côté du symbole, il ferait deux corails
côte à côte : un bégaiement. Le composant `Logo` s'en charge.

**Sur fond encré**, les blocs sombres deviennent papier et le corail ne change pas :
`<LogoMark reversed />`.

## Ce qu'on ne fait pas

- Aligner les blocs sur une grille régulière — c'est exactement ce qui a été corrigé.
- Rentrer le bloc corail dans la marge. Le dépassement est le battement.
- Changer la couleur du bloc qui bat, ou en colorer un second.
- Ajouter un contour, une ombre portée, un dégradé.
- Étirer la marque : elle est carrée, son `viewBox` fait 64 × 64.
- Recomposer le verrouillage à la main. Il y a un composant.
- Poser la marque sur une photographie sans aplat derrière elle.

## Avant de déposer

Ce dessin n'a fait l'objet d'aucune recherche d'antériorité. Une recherche web n'en est pas
une. Avant un dépôt, il faut une **recherche de similarité figurative** à l'INPI, en classes
35, 38 et 42 — celles qui couvrent la vente en ligne, les télécommunications et les services
informatiques.
