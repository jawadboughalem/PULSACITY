# 01 — Charte graphique

> Prérequis : coller `00-context.md` juste avant ce prompt.
> Livrable : **maquette** (planche de charte HTML) **et** un document `docs/design/brand.md`.
> À lancer en premier. Tout le reste du kit en découle.

---

## Ton rôle

Tu es directeur artistique. Tu ne proposes pas trois pistes : tu en choisis une et tu
défends chaque décision par une raison tirée du produit, pas du goût.

PULSACITY a aujourd'hui une hygiène typographique correcte et **aucune direction
artistique** : un empilement de sections identiques, séparées par des filets, sur fond
papier chaud avec un accent corail. C'est propre et c'est muet. Ta mission est de lui
donner un caractère — beau, moderne, et crédible pour un artisan de 50 ans qui regarde la
page sur son téléphone.

## Les cinq décisions à trancher

Pour chacune, je donne mon hypothèse. **Reprends-la ou contredis-la, mais tranche, et dis
pourquoi.** Une charte qui laisse une question ouverte ne sert à rien.

### 1. Quelle marque ?

_Hypothèse : l'atelier._ Pas un éditeur de logiciel, pas une agence : un artisan qui
fabrique des sites pour d'autres artisans. Éditorial, chaud, tactile, direct. Une page qui
tient de la lettre soignée plutôt que de la page d'atterrissage SaaS. Le client achète une
personne, pas une plateforme — et il le voit avant de lire.

Ce que cela exclut : dégradés violets, verre dépoli, nuages de cartes flottantes, captures
d'interface en perspective, illustrations abstraites de type _undraw_, « étoiles IA ».

### 2. Une seconde famille typographique ?

_Hypothèse : oui._ Manrope seule ne porte aucun caractère et ressemble à tout le monde.
Un serif éditorial à contraste doux pour le `display` et les titres de section, Manrope pour
le texte courant et l'interface. Deux familles, pas trois.

Candidats libres, chargeables par `next/font/google` : **Fraunces** (variable, axe _soft_,
chaude), **Instrument Serif** (économe, très typée), **Newsreader** (neutre, lisible petit).
Choisis-en une, montre-la en situation, et dis ce que tu écartes.

Contrainte : le rendu doit rester net à 16 px sur un écran de téléphone d'entrée de gamme.
Un serif à fort contraste de graisse s'y effondre.

### 3. Comment montrer le produit sans rien inventer ?

La règle 6 interdit toute capture fabriquée, et `content/showcase.json` est **vide**
aujourd'hui. Le produit est donc invisible alors que c'est l'argument principal.

_Hypothèse :_ dessiner deux états de la même zone. L'état **plein** montre une capture
réelle dans un cadre de téléphone. L'état **vide** est une composition typographique
assumée, qui dit franchement qu'aucun site n'est encore publié, et qui ne ressemble pas à
un trou dans la page. Les deux doivent être beaux ; le second sera celui du jour J.

### 4. Quel motif signature ?

_Hypothèse : le point._ Le logotype porte déjà un point corail qui bat lentement
(`.wordmark-dot`). C'est le seul élément distinctif existant. Fais-en un système : puce de
liste, numéro d'étape, ponctuation de fin de section, marqueur du titre. Un seul ornement,
décliné partout, coûte zéro et se reconnaît.

Si tu proposes autre chose, il faut que ce soit aussi simple à décliner et aussi peu cher à
produire.

### 5. Mode sombre ?

_Hypothèse : non en V1_, ni sur `pulsacity.com`, ni sur les sites livrés. Le fond papier
chaud **est** l'identité ; un thème sombre la dilue et double la relecture. Mais les jetons
doivent rester sémantiques (`surface`, `ink`, `line`) pour que l'ajouter plus tard ne
touche aucun composant.

Tranche explicitement, parce que le prompt `02` figera la structure des jetons.

## Ce que la charte doit contenir

Des valeurs, pas des adjectifs. « Chaleureux et professionnel » n'est pas une charte.

1. **L'idée de marque** en une phrase, puis trois principes de composition qui s'appliquent.
2. **La palette.** Chaque couleur en `oklch()`, avec son rôle, ses usages autorisés et son
   interdit. Conserve les valeurs existantes si tu les juges bonnes — dis-le alors
   explicitement. Ajoute ce qui manque : surfaces inversées (le quasi-noir utilisé en
   aplat), surface creusée, jeton de succès, corail lisible sur fond sombre.
   **Chaque paire texte/fond est donnée avec son rapport de contraste mesuré.** Minimum
   4.5:1 pour le texte courant, 3:1 pour le texte large et les bordures signifiantes.
3. **La typographie.** Les deux familles, les graisses réellement chargées (chaque graisse
   coûte des kilo-octets), et une échelle complète : `display`, `title`, `lead`, `body`,
   `body-sm`, `caption`, `eyebrow`. Pour chaque niveau : taille mobile, taille bureau,
   interligne, approche, graisse, et **où on s'en sert**.
4. **Le rythme.** Grille de 8 px, largeurs de conteneur nommées, respiration verticale des
   sections, et la règle d'alternance qui empêche l'empilement plat : quelles sections sur
   fond papier, laquelle sur fond encré, où passe un filet, où passe un vrai changement de
   surface.
5. **Le logotype.** Le mot-symbole et son point : construction, approche, tailles minimales,
   zone de respect, variantes sur fond clair et sur fond encré. Plus l'icône carrée, qui
   doit sortir de la même construction — celle d'aujourd'hui est un carré **bleu**, hors
   charte, à remplacer.
6. **Le motif signature**, avec au moins quatre déclinaisons dessinées.
7. **L'iconographie.** `lucide-react` est déjà installé : fixe l'épaisseur de trait, la
   taille, la couleur et surtout **quand on n'en met pas**. Une icône décorative à côté de
   chaque titre est un réflexe d'agence, pas une décision.
8. **L'image.** Ce qu'on photographie, ce qu'on cadre, ce qu'on ne montre jamais. Les seules
   images du site sont des captures de sites réellement livrés : dis comment on les cadre,
   à quelle échelle, avec quel cadre autour.
9. **Le mouvement.** Deux ou trois règles, pas davantage, avec durées et courbes chiffrées.
10. **Do / Don't** : six paires, chacune illustrée, tirées de ce que le dépôt fait
    aujourd'hui.

## Contraintes non négociables

- Les dix règles du contexte s'appliquent, la 10 en particulier : **tout ce que tu décides
  doit pouvoir s'exprimer en jetons.** Si une décision ne peut pas devenir un jeton, elle
  n'entrera jamais dans le code — reformule-la jusqu'à ce qu'elle le puisse.
- Deux familles typographiques maximum, libres de droits, disponibles sur Google Fonts.
- Un seul accent chromatique. Le corail. Pas de couleur secondaire décorative.
- Aucun texte d'exemple inventé : la charte s'illustre avec le contenu réel de
  `content/lines/creation-de-sites.json`.
- Tout ce qui est affiché est en français ; tout nom de jeton, de fichier ou de variante est
  en anglais.

## Les deux livrables

**A. La planche** — un fichier HTML autonome, `brand-charter.html`, qui montre : la palette
avec les contrastes mesurés, l'échelle typographique en situation, le logotype et ses
variantes, l'icône, le motif décliné, les six paires do/don't, et **un bloc de démonstration
grandeur nature** : le héros réel de `creation-de-sites.json` composé selon la charte, vu à
375 px et à 1280 px.

**B. Le document** — `docs/design/brand.md`, la même chose en texte, décision par décision,
avec la raison de chacune. C'est lui qu'on relira dans six mois pour savoir pourquoi.

## Critères d'acceptation

- [ ] Les cinq décisions sont tranchées, chacune avec sa raison.
- [ ] Chaque couleur a une valeur `oklch()`, un rôle et un interdit.
- [ ] Chaque paire texte/fond utilisée porte son rapport de contraste mesuré ; aucune sous
      4.5:1 pour du texte courant.
- [ ] L'échelle typographique est complète, chiffrée, mobile et bureau.
- [ ] Le logotype et l'icône sortent de la même construction, et l'icône n'est plus bleue.
- [ ] La règle d'alternance des sections est écrite et démontrée.
- [ ] La planche affiche le contenu réel du dépôt, aucun texte inventé.
- [ ] Rien dans la planche n'est en dur : tout passe par une variable nommée comme un jeton.
- [ ] Un développeur qui lit `brand.md` peut écrire `tokens.css` sans te reposer une question.

## Interdits

Dégradés multicolores. Verre dépoli. Ombres portées lourdes. Illustrations 3D. Émojis dans
l'interface. Icônes décoratives sans fonction. Texte gris clair sur fond clair. Plus de deux
familles typographiques. Une couleur secondaire « pour dynamiser ». Et les mots garantie,
assurance, assistance, couverture.
