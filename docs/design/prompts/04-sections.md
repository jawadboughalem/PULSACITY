# 04 — Les sections, l'en-tête, le pied de page

> Prérequis : `00-context.md`, `01`, `02`, `03`.
> Livrable : **maquette** (les sept sections, chacune en mobile et en bureau) puis **code**
> dans `apps/corporate/src/components/sections/`.

---

## Ton rôle

Tu dessines les sept types de section que le socle sait rendre. Tu ne décides pas ce qu'ils
disent — le contenu vient de `content/lines/*.json` — tu décides **à quoi ressemble un type**
quel que soit son contenu.

C'est la contrainte intéressante : ta mise en page doit tenir avec deux `items` comme avec
huit, avec un titre de quatre mots comme de quatorze. Si elle n'est belle qu'avec le contenu
d'aujourd'hui, elle est fausse.

## Le défaut principal à corriger

`sections/section-shell.tsx` applique le même traitement à tout : filet en haut,
`py-20 sm:py-28`, `max-w-5xl`, un `h2`, le contenu. Huit sections au même volume sonore.
Rien n'est mis en avant — pas même le prix, qui est l'élément décisif d'une offre à prix
unique. La seule variation existante est `tinted`, un fond corail à 40 %.

**Il faut une partition, pas un empilement.** La charte de `01` a fixé la règle
d'alternance : applique-la. Une page réussie se lit en plissant les yeux : on doit y voir
trois ou quatre zones de densité différente, pas huit bandes identiques.

## Un bug à corriger en même temps

`content/lines/creation-de-sites.json` donne au héros une action secondaire vers
`#realisations`. Cette ancre est posée par `ShowcaseSection` — qui renvoie `null` quand
`content/showcase.json` est vide. Il l'est. **Le bouton ne mène nulle part aujourd'hui.**

Traite les deux moitiés du problème :

1. côté rendu, une section vide ne doit pas faire disparaître silencieusement une cible
   d'ancre (voir le prompt `09` pour l'état vide dessiné) ;
2. côté contrat, propose la protection qui manque — une validation ou un test qui refuse une
   action de contenu pointant vers une ancre qu'aucune section ne pose. Le bug doit devenir
   impossible, pas seulement réparé.

## Section par section

Pour chacune : la composition, le comportement quand le contenu s'allonge, le rendu à 375 px,
et ce que tu refuses de faire.

### `hero`

`title`, `text`, `primary`, `secondary?`. Aujourd'hui : un titre, un paragraphe, deux
boutons, rien à regarder.

C'est la section la plus importante du produit et la plus faible. La promesse — _vous voyez
votre site sur votre téléphone avant de payer_ — est visuelle et n'est jamais montrée.
Compose un héros qui la montre, avec ses deux états : capture réelle disponible, et pas
encore de capture (la charte a tranché ce point, applique sa réponse).

Contraintes : le titre reste un `h1` unique ; l'action principale est atteignable sans
défiler sur un téléphone ; **aucune animation d'entrée au-dessus de la ligne de flottaison**
— une révélation au défilement sur un contenu déjà visible produit un demi-fondu figé, le
dépôt a déjà corrigé ce défaut une fois.

### `features`

`title?`, `items[] { title, text }`. Aujourd'hui : deux colonnes de texte nu.

Donne-leur un rythme — le motif signature, un filet, un décalage. Sans icône décorative par
item : la charte a fixé quand on met une icône. Le titre est facultatif : sans lui les items
prennent le niveau `h2`, la hiérarchie doit rester juste dans les deux cas.

### `showcase`

`title`, et les cartes viennent de `content/showcase.json` : `name`, `sector`, `city`,
`url`, plus des captures WebP produites par `pnpm showcase:shots`. Trois au maximum.

Chaque carte montre une capture **réelle**, jamais une maquette. Dessine le cas à une seule
carte aussi sérieusement que le cas à trois : c'est le cas du premier client. Et dessine
l'état vide, qui est celui d'aujourd'hui.

### `steps`

`title`, `items[] { title, text }`. Quatre étapes qui racontent le parcours.

Aujourd'hui : une liste numérotée avec, à droite, une capture quand il en existe une. La
numérotation doit se lire comme une progression, pas comme une liste à puces. Sur mobile,
la capture passe où ?

### `pricing`

`title`, `headline`, `text`, `action`. C'est **le** moment de la page : un prix unique,
tout compris, sans option. Aujourd'hui, un encadré bordé parmi d'autres.

Donne-lui le poids qui lui revient — c'est là que la règle d'alternance sert. Le `headline`
(« 500 € HT tout compris. ») et le `text` (un paragraphe de 400 caractères qui énumère ce
qui est inclus) ont deux fonctions différentes : la mise en page doit le refléter, sans
découper le paragraphe en liste, puisque le contenu ne fournit pas de liste.

Rappel : le prix n'est **jamais** écrit dans le composant. Il arrive par le contenu.

### `faq`

`title`, `items[] { question, answer }`. Huit questions aujourd'hui, en `<details>` natifs.

Le `<details>` reste : il fonctionne sans JavaScript et se laisse indexer. Soigne l'affordance
— l'icône `Plus` qui pivote est correcte, la zone cliquable et la transition ne le sont pas
encore. Les données structurées `FAQPage` déjà produites doivent rester construites à partir
de la même liste que le rendu.

### `cta`

`title`, `text`, `action`. La fermeture de la page.

Elle ne doit pas être la copie du héros. Décide de ce qui la distingue — surface, densité,
alignement — et tiens-le.

### `coming-lines`

Hors union typée : les lignes annoncées, une phrase chacune, plus le champ « Prévenez-moi ».

Le piège est de leur donner l'air d'une offre. Une ligne `coming` ne promet rien : ni prix,
ni date, ni fonctionnalité. Elle doit se voir **moins** que la ligne live, sans avoir l'air
d'un brouillon.

### `SiteHeader`

Aujourd'hui : logotype, navigation visible seulement à partir de deux lignes live (donc
jamais), action principale reprise du héros, `sticky`, fond translucide.

Questions à trancher : l'action du héros doit-elle apparaître dans l'en-tête **avant** que le
héros ne sorte de l'écran ? Que devient l'en-tête sur un téléphone, où il mange déjà 64 px ?
Le `backdrop-blur` tient-il sur un fond papier chaud ?

### `SiteFooter`

Contact, identité légale, mention de TVA, liens légaux — chaque élément absent si
`content/site.json` le laisse vide. **Aujourd'hui ils sont tous vides** : prénom du
fondateur, e-mail, téléphone. La section « Contact » est un titre seul.

Dessine les deux états : pied complet, et pied dépouillé qui reste digne. C'est le prompt
`09` qui traite les états vides en général, mais celui-ci est visible dès maintenant.

## Contraintes non négociables

- Un composant de section ne connaît **aucun** texte de vente : tout vient de sa propriété
  `section`. La seule chaîne française admise est celle qu'aucun contenu ne peut fournir —
  et il faut alors la justifier.
- Le contrat des sections ne change pas sans raison écrite. Si ta mise en page a besoin
  d'un champ que le contenu ne fournit pas, **dis-le explicitement** et propose l'évolution
  du schéma dans `lib/lines.ts` plus la migration des fichiers de contenu. N'invente pas un
  champ en douce.
- Ordre des titres strictement séquentiel : un seul `h1`, jamais de saut de niveau.
- Chaque `id` d'ancre reste stable : `#inclus`, `#realisations`, `#methode`, `#prix`,
  `#faq`, `#a-venir`, `#contact` sont cités par le contenu et par `sitemap.ts`.
- Aucune valeur en dur. Le test de la règle 10 passe.

## Critères d'acceptation

- [ ] Les sept types sont dessinés, en mobile et en bureau, avec un contenu court et un
      contenu long.
- [ ] La règle d'alternance de la charte est appliquée et visible en plissant les yeux.
- [ ] Le héros montre le produit, dans ses deux états.
- [ ] La section de prix est le point le plus fort de la page.
- [ ] Le bouton « Voir un site livré » mène quelque part, et le contrat empêche la récidive.
- [ ] Les lignes `coming` ne ressemblent pas à des offres.
- [ ] Le pied de page tient avec zéro information de contact.
- [ ] Aucun texte de vente dans un composant.
