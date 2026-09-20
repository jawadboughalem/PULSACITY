# 09 — États vides, attentes, erreurs

> Prérequis : `00-context.md`, `01`, `02`, `03`.
> Livrable : **maquette** de chaque état, puis **code**.

---

## Ton rôle

Tu dessines ce que le produit montre quand il n'a rien à montrer. Sur PULSACITY ce n'est pas
un cas marginal : **c'est l'état du jour.**

## L'état réel du contenu, aujourd'hui

```json
// content/showcase.json
[]

// content/site.json
{ "founderFirstName": "", "contact": { "email": "", "phone": "" } }
```

Conséquences en cascade, toutes visibles en production :

| Ce qui disparaît                                     | Parce que                                      |
| ---------------------------------------------------- | ---------------------------------------------- |
| La section « Un site livré » entière                 | `ShowcaseSection` renvoie `null` si zéro carte |
| La capture de téléphone dans « Comment ça se passe » | `firstMobileShot` ne trouve rien               |
| La cible de l'ancre `#realisations`                  | la section n'existe pas dans le DOM            |
| « Prénom, derrière PULSACITY »                       | `founderFirstName` est vide                    |
| L'e-mail et le téléphone du pied de page             | `contact` est vide                             |
| Le recours de `/commande-indisponible`               | il n'affiche l'e-mail que s'il existe          |

La section « Contact » du pied de page est donc **un titre seul**. Et le second bouton du
héros ne mène nulle part.

La règle 9 est saine : une ligne dont la variable est vide est omise, jamais remplie par une
valeur inventée. Mais omettre n'est pas concevoir. Personne n'a dessiné le résultat.

## Ce qu'il faut dessiner

### Les états vides de contenu

Pour chacun, deux réponses possibles et une seule à choisir, avec la raison : **disparaître
proprement**, ou **se montrer autrement**.

1. **Aucun site livré.** Le cas le plus lourd : la preuve manque alors que la promesse est
   visuelle. Faire disparaître la section laisse un trou dans le récit — hero, puis « ce qui
   est inclus », puis directement la méthode. Propose une composition qui dit franchement
   qu'aucun site n'est encore publié, sans s'excuser et sans meubler. Et traite l'ancre
   `#realisations`, qui doit rester atteignable ou l'action du héros doit disparaître avec
   la section.
2. **Une seule référence**, puis deux. La grille est en trois colonnes : une carte seule ne
   doit pas avoir l'air d'un reste.
3. **Pas de capture pour une référence existante.** `showcase.json` a une entrée mais
   `pnpm showcase:shots` n'a pas tourné : le composant tombe sur l'image bureau, puis sur
   rien. Trois cas à dessiner, pas un.
4. **Pas de prénom de fondateur.** « Quelqu'un, derrière PULSACITY » est le cœur du
   positionnement, et la phrase disparaît entièrement.
5. **Aucun moyen de contact.** Que montre le pied de page ? Et `/commande-indisponible`, dont
   c'est le seul recours ?
6. **Aucune ligne annoncée.** `ComingLinesSection` renvoie `null` : la page se termine sur
   le `cta`. Est-ce voulu ?

### Les états d'attente

- Le bouton d'envoi du brief pendant l'action serveur. « Envoi… » existe ; il lui manque une
  forme.
- La navigation vers Stripe, qui sort du domaine et peut prendre une seconde ou deux.
- Les images de capture pendant leur chargement — elles sont grandes et arrivent après le
  texte. Dis comment on réserve leur place pour que la page ne saute pas.

### Les états d'erreur

- Erreur par champ, erreur globale du formulaire (les deux existent, sans forme arrêtée).
- `/commande-indisponible` — le paiement n'a pas pu s'ouvrir. « Rien n'a été débité » doit
  être la première chose lue.
- `DemoUnavailable` — démo inconnue, expirée ou déjà vendue. Le visiteur vient d'un SMS et
  ne comprend pas ce qui se passe : la sortie doit être évidente.
- `not-found.tsx` — page inconnue, et hôte inconnu, qui atterrissent au même endroit alors
  que ce sont deux situations différentes.

Ces trois dernières pages répètent aujourd'hui le même bloc centré à trois hauteurs
différentes (`min-h-[70vh]`, `min-h-[60vh]`, sans minimum). Après le prompt `03`, elles
passent toutes par `CenteredMessage`.

## Les règles d'écriture de ces états

Un état vide ou une erreur, c'est surtout du texte. Il obéit aux mêmes règles que le reste —
français, vouvoiement, première personne, phrases courtes — plus quatre principes :

1. **Dire ce qui s'est passé**, pas « une erreur est survenue ».
2. **Dire ce qui n'a pas eu lieu** quand c'est rassurant : « Rien n'a été débité. »
3. **Donner une sortie**, toujours : un lien, une action, un recours.
4. **Ne jamais s'excuser deux fois**, ni promettre un délai qu'on ne tient pas.

Et jamais les mots garantie, assurance, assistance, couverture.

## Contraintes non négociables

- Règle 9 : rien d'inventé pour combler. Un état vide ne fabrique ni chiffre, ni référence,
  ni capture.
- Règle 6 : pas d'image de remplacement qui ressemble à un site client.
- Chaque état d'erreur est annoncé au lecteur d'écran (`role="alert"` ou `role="status"`
  selon l'urgence).
- Aucun décalage de mise en page quand un état se remplit.

## Critères d'acceptation

- [ ] Les six états vides de contenu sont dessinés et tranchés.
- [ ] La page d'aujourd'hui, avec le contenu d'aujourd'hui, n'a aucun trou.
- [ ] L'ancre `#realisations` mène quelque part, ou l'action qui la vise disparaît avec sa
      cible.
- [ ] Les trois pages d'état partagent une seule composition et une seule hauteur.
- [ ] Chaque message dit ce qui s'est passé et offre une sortie.
- [ ] Les états d'attente ne font sauter aucune mise en page.
- [ ] Rien n'est inventé pour remplir.
