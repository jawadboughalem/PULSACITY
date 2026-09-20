# 07 — Le gabarit du site livré

> Prérequis : `00-context.md`, `01`, `02`, `03`.
> Livrable : **maquette** du site client complet, puis **code** dans `packages/templates/`.
> C'est le prompt le plus important du kit après la charte.

---

## Ton rôle

Tu dessines **le produit**. Pas la page qui le vend : la chose qu'on livre, et qui vaut
500 € HT.

Aujourd'hui c'est `packages/templates/src/render.tsx` : un `article` en `max-w-3xl`, des
sections séparées par un filet, des encadrés `rounded-lg border p-4`, et des notes en
caractère `★`. Il lit les mêmes jetons que la page corporate mais n'a aucun de ses partis
pris.

**Le prospect voit la démo de son propre site avant de payer.** Si cette démo est moins
soignée que la page qui la lui a vendue, il ne paie pas. C'est exactement la situation
actuelle.

## Le contrat de contenu

`packages/templates/src/content.ts`, schéma zod `SiteContent` — tu dessines pour cette forme,
pas pour un cas particulier :

| Champ            | Forme                                             | Présence       |
| ---------------- | ------------------------------------------------- | -------------- |
| `headline`       | une phrase, 160 caractères au plus                | toujours       |
| `intro`          | un texte, 1200 caractères au plus, sauts de ligne | toujours       |
| `services[]`     | `name`, `description?`, `price?` (texte libre)    | souvent vide   |
| `openingHours[]` | `day`, `hours` — texte libre, « Fermé » possible  | souvent vide   |
| `phone`          | forme affichée, ex. « 01 23 45 67 89 »            | souvent absent |
| `address`        | texte                                             | souvent absent |
| `mapsUrl`        | URL                                               | souvent absent |
| `reviews[]`      | `author`, `rating` 1–5, `text`, `date?`           | souvent vide   |
| `faq[]`          | `question`, `answer`                              | souvent vide   |
| `photos[]`       | `url`, `alt` — **jamais rendues aujourd'hui**     | souvent vide   |

Plus, hors contenu : `name` et `city` du site.

Deux choses à noter. Le schéma **refuse** tout `{{...}}` non remplacé — un contenu
incomplet ne s'affiche pas, il échoue. Et `photos` existe dans le contrat sans être rendu :
décide si tu les rends, et comment, sachant qu'elles viennent d'une fiche Google et qu'on
ne maîtrise ni leur cadrage ni leur définition.

## Ce que l'offre promet, et que le gabarit doit tenir

« Un site vitrine de cinq pages : accueil, prestations, tarifs ou devis, avis,
contact-accès. Formulaire de devis et prise de rendez-vous en ligne. »

Le gabarit actuel rend **une seule page défilante**, sans formulaire ni prise de
rendez-vous. C'est un écart entre ce qui est vendu et ce qui est livré, et il t'appartient
de le nommer, pas de le combler en silence :

1. Dessine ce qui existe — la page unique — en beaucoup mieux.
2. Propose la structure à cinq pages : arborescence, navigation, ce que contient chaque
   page, ce que devient le contrat `SiteContent` pour la porter.
3. Dis franchement ce qui manque pour le formulaire de devis et la prise de rendez-vous : où
   partent les données, quelles pages cela ajoute, quels états d'erreur.

Ne modifie pas le contrat `SiteContent` de ta propre initiative : propose l'évolution,
écris ce qu'elle casse, et laisse la décision.

## Ce que le site du client doit être

- **Le sien, pas le nôtre.** Un garage deux-roues et une boulangerie ne peuvent pas rendre
  la même page en corail PULSACITY. Prévois ce qui varie : une couleur d'accent par site,
  au minimum, prise dans les jetons plutôt qu'écrite à la main. Dis lesquels varient et
  lesquels ne varient jamais.
- **Téléphonique avant tout.** Ses visiteurs cherchent un horaire, une adresse, un numéro.
  Appeler doit être l'action la plus facile de la page, toujours atteignable.
- **Honnête.** Pas d'avis inventé, pas de photo décorative sans rapport, pas de « depuis
  1987 » si le contenu ne le dit pas. Et les mots garantie, assurance, assistance,
  couverture sont interdits ici aussi.
- **Rapide et indexable.** C'est sa vitrine : structure sémantique, titres dans l'ordre,
  données structurées `LocalBusiness` pour l'adresse et les horaires, images dimensionnées.
- **Digne avec presque rien.** Le cas fréquent est : une accroche, une intro, un téléphone,
  et rien d'autre. Dessine-le en premier. Un gabarit qui n'est beau qu'avec dix prestations
  et six avis ne sert à personne.

## Points précis à traiter

- Les notes en `★` répétés sont un bricolage typographique : décide comment une note
  s'affiche, et traite le cas où `reviews` est vide, qui est le cas normal.
- Les horaires sont une `dl` en deux colonnes. Le jour courant se distingue-t-il ? « Fermé »
  se lit-il autrement qu'une plage horaire ?
- `intro` accepte des sauts de ligne (`whitespace-pre-line`) : ta mise en page doit tenir
  avec un paragraphe comme avec cinq.
- `price` est du texte libre (« à partir de 45 € ») : il ne peut pas s'aligner comme un
  nombre.
- La bannière de démo se pose par-dessus ce gabarit. Prévois la place, par un jeton partagé.

## Contraintes non négociables

- Les jetons de `packages/design` sont la seule source du look, ici comme ailleurs.
- `renderSite` reste une fonction pure qui rend du HTML serveur, sans JavaScript client tant
  qu'un formulaire n'en impose pas.
- Le contrat `SiteContent` ne bouge pas sans proposition écrite et assumée.
- Aucun contenu inventé, même en maquette : illustre avec une activité plausible **et**
  dis-le clairement, ou prends la fixture de développement, qui est explicitement fictive
  (« Garage Exemple (fixture) ») et n'est jamais servie en production.

## Critères d'acceptation

- [ ] Le site livré est visiblement plus soigné que la page qui le vend.
- [ ] Le cas minimal — accroche, intro, téléphone — est beau.
- [ ] Appeler est atteignable à tout moment sur un téléphone.
- [ ] Chaque tableau du contrat a son état vide traité.
- [ ] La note d'un avis ne repose plus sur un caractère répété.
- [ ] Ce qui varie d'un client à l'autre est nommé et vient des jetons.
- [ ] La structure à cinq pages est proposée, avec ce qu'elle exige du contrat.
- [ ] L'écart entre ce qui est vendu et ce qui est livré est écrit noir sur blanc.
