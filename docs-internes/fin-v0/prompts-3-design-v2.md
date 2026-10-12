# Étape 3 : le design v2, dans un nouveau projet Claude Design

## Pourquoi un nouveau projet

- **Le projet actuel porte la v1.** Sa charte, ses composants et ses pages guideraient chaque nouvelle proposition vers ce que vous voulez quitter.
- **Il reste la référence de ce qui est en ligne.** Tant que les lots 4.6 à 4.8 n'ont pas tout migré, Claude Code s'appuie sur les maquettes v1 pour les écrans pas encore refaits. Ne le modifiez plus.
- **Le nouveau projet part de vos choix** : le brief, l'inventaire des écrans et le compte rendu de 1.4.

## Préparer le projet

1. Dans Claude Design, créez le projet « PULSACITY v2 ».
2. Ajoutez-y ces fichiers :
   - `docs-internes/fin-v0/brief-pulsacity.md` et `docs-internes/fin-v0/inventaire-ecrans.md` ;
   - les décisions de `docs-internes/decisions/` : `connecteurs.md` (catalogue), `tarifs.md` (prix), `positionnement.md` (textes de l'accueil, avis en ligne), `commercialisation.md` (bêta, acquisition) et `arbitrages.md` (qui les corrige là où elles se contredisent) ;
   - `docs-internes/charte.md`, la charte v1, comme « ce qu'on quitte » ;
   - le logo actuel : `docs-internes/identite-v2/assets/svg/pulsacity-logo.svg`, `pulsacity-symbole.svg` et `pulsacity-symbole-petit.svg` ;
   - vos 10 à 15 captures du prompt 1.4 ;
   - les deux fichiers de règles du skill UI UX Pro Max, `quick-reference.md` et `pro-rules.md`, envoyés par Claude Code avec le skill (prompt 0 bis).
3. Pour 3.4 à 3.6, il faudra aussi les maquettes v1 de chaque famille d'écrans. Le plus simple : téléchargez tout le dépôt en ZIP (https://github.com/jawadboughalem/PULSACITY/archive/refs/heads/main.zip), et prenez-les dans `docs-internes/maquettes/`.

## Le rôle du skill UI UX Pro Max

Ses règles UX (`quick-reference.md`, `pro-rules.md`) sont une liste de contrôle : accessibilité, cibles tactiles, textes qui ne débordent pas, formulaires, mouvement. Ses propositions de styles, de palettes et de polices, rapportées par le compte rendu 1.4, sont des pistes parmi d'autres. Aucune ne s'applique telle quelle. En cas de conflit, la charte v2 et nos interdits l'emportent.

## L'ordre

| N° | Quoi | Débloque |
| --- | --- | --- |
| 3.1 | Trois directions et trois pistes de logo ; vous choisissez | 3.2 |
| 3.2 | La charte v2, le logo final, les coques du site et de l'espace | Lot 4.2 |
| 3.3 | Les écrans à créer : Réglages, Mon compte, Abonnement et factures, Aide et contact, catalogue des connecteurs | Lots 4.3 à 4.5, donc l'encaissement |
| 3.4 | L'espace du créateur | Lot 4.6 |
| 3.5 | Le site public, dont la nouvelle page d'accueil | Lot 4.7 |
| 3.6 | Page de collecte, e-mails, widget | Lot 4.8 |
| 3.7 | Contrôle de complétude dans les deux sens, export final | — |

Chaque prompt finit par un export en ZIP. Envoyez chaque ZIP à Claude Code au début du lot qu'il débloque.

Dans un prompt, une ligne entre crochets est à remplacer par ce qu'elle dit, ou à supprimer.

---

## 3.1 Trois directions pour PULSACITY v2

Où : Claude Design, projet « PULSACITY v2 ». Après 1.4.

```
Prompt 3.1 — Trois directions pour PULSACITY v2.

Fichiers du projet : brief-pulsacity.md (le produit et ses contraintes), charte.md (la v1, que l'on quitte), les SVG du logo actuel, mes captures d'inspiration, et les règles UX du skill UI UX Pro Max (quick-reference.md, pro-rules.md).

[Compte rendu 1.4 : mes choix, les références retenues, les styles d'uupm.cc retenus et écartés, trois directions décrites en mots, la piste du logo.]

Les propositions du skill UI UX Pro Max rapportées par le compte rendu sont des pistes parmi d'autres : ne les applique pas telles quelles. Ses propositions brutes pour PULSACITY (violet, Inter et Space Grotesk, cartes en grille façon bento ; ou bleu marine et Garamond) sont justement ce que je veux éviter.

Ce que je veux : une v2 sobre et accessible, mais pas fade ; moderne, mais pas à la mode d'une seule saison ; et qui ne ressemble pas au style des assistants d'IA (titres à empattements sur fond crème, filets fins, une seule couleur d'accent, grands blancs). Seul le visuel change : les écrans, leurs contenus, leurs états et leurs textes restent ceux d'aujourd'hui.

Sur une page « Directions », trois directions nettement différentes, inspirées des trois du compte rendu. Pour chacune :
1. Une planche d'ambiance :
   - palette, avec les rapports de contraste WCAG des couples texte et fond (AA au moins : 4,5:1 pour le texte, 3:1 pour les grands titres et les éléments d'interface) ;
   - polices gratuites pour un usage commercial sur le web, avec leur source ;
   - formes : coins, bordures, ombres, profondeur ;
   - images : captures du produit, illustrations ou photos ;
   - principes de mouvement.
2. Les mêmes quatre écrans, avec leurs vrais textes :
   - le haut de la page d'accueil, à 1440 px et à 360 px ;
   - l'accueil de l'espace du créateur (tableau de bord), à 1440 px ;
   - la page où le client laisse son avis, à 360 px ;
   - le widget « mur » sur la page de vente d'un créateur, à 1440 px.
3. Ce que la direction garde de notre empreinte, et ce qu'elle change.

Sur une page « Logo », trois pistes d'évolution du logo. Elles gardent l'idée : une fusée portée par une étoile qui remplace la flamme, parce que les avis font décoller l'activité. Mais elles lui donnent plus de caractère. Montre chaque piste à 16 px, à 32 px et en grand, sur fond clair et sur fond sombre, en une seule couleur, et avec le mot PULSACITY.

Interdits, dans toutes les directions :
- étiquettes en majuscules espacées au-dessus des titres ;
- un mot du titre en couleur ou en italique ;
- flèches « → » dans les boutons ;
- grilles de cartes identiques avec la même ombre ;
- dégradés décoratifs ;
- animations d'apparition sur chaque section ;
- numérotation 01/02/03 hors d'une vraie séquence.

Termine par une planche qui compare les trois directions côte à côte. Dis laquelle tu recommandes pour des indépendants francophones, et pourquoi.
```

---

## 3.2 La charte v2, le logo final et les coques

Où : Claude Design, projet « PULSACITY v2 ». Après votre choix sur 3.1.

```
Prompt 3.2 — La charte v2.

J'ai choisi : [la direction retenue, et ce que vous voulez y changer ou prendre aux autres]. Pour le logo : [la piste retenue, et vos remarques].

1. Le logo final, symbole et logotype, avec toutes les déclinaisons de la v1 :
   - logo horizontal, clair et sombre ;
   - version pour moins de 32 px de haut ;
   - symbole seul : normal, petit, une couleur ;
   - favicon dessiné au pixel à 16 px ;
   - icônes d'application : 180, 192 et 512 px, et une version à marge de sécurité pour Android ;
   - symbole des e-mails : 48 px, affiché à 24 px ;
   - mention « Propulsé par PULSACITY ».
   Puis une planche des règles : zone de protection, tailles minimales, interdits.

2. La charte v2, sur une page « Charte v2 », avec chaque valeur exacte :
   - couleurs : nom, hexadécimal, usage, contrastes vérifiés de chaque couple permis, couples interdits ;
   - typographie : familles, sources, graisses, rôles ; échelle des tailles avec interlignes, sur ordinateur et sur téléphone ;
   - espacements, rayons, ombres, bordures ;
   - composants, avec tous leurs états (repos, survol, appui, focus visible, désactivé, chargement, erreur) : boutons (principal, secondaire, discret, danger), champs, listes déroulantes, cases et interrupteurs, badges de statut, bandeaux (succès, attente, erreur, information), fenêtres de dialogue et leur voile, menus, onglets et pastilles de filtre, listes et tableaux, états vides, messages après une action, squelettes de chargement ;
   - icônes : style et grille ;
   - captures du produit et illustrations : règles ;
   - mouvement : durées, courbes, ce qui s'anime et ce qui ne s'anime pas, réduction du mouvement ;
   - le widget : il prend la police de la page qui l'accueille, et la couleur d'accent choisie par le créateur ; thèmes clair et sombre ;
   - les e-mails : polices système seulement, 600 px de large ;
   - le ton de voix : inchangé.

3. Les coques, à 1440 px et à 360 px :
   - le site : en-tête, menu du téléphone ouvert, pied de page ;
   - l'espace : navigation de l'ordinateur, quatre onglets du téléphone, menu du compte, page « Plus ».

4. La charte en texte, sur le modèle exact de charte.md (mêmes titres, mêmes tableaux), dans un fichier « charte-v2.md ». C'est Claude Code qui la lira : chaque valeur dont il aura besoin doit y être.

5. La spécification du logo, sur le modèle de la v1 : les fichiers, l'usage de chacun, les règles.

Rappels : contrastes AA au moins ; cibles tactiles de 44 px au moins ; champs en 16 px au moins ; rien ne déborde à 360 px. Chaque composant respecte les règles de quick-reference.md et de pro-rules.md ; en cas de conflit, la charte v2 et nos interdits l'emportent. Les interdits de 3.1 restent.

Exporte : les planches en PNG à l'échelle 2x, une planche par fichier, nommées « v2-<famille>-<écran>-<desktop ou mobile>-<numéro>-<état>.png » (familles : charte, logo, site, espace, collecte, email, widget) ; les fichiers du logo en SVG et en PNG ; charte-v2.md ; la spécification du logo ; un INDEX.md sur le modèle de l'index v1. Le tout dans un ZIP.
```

---

## 3.3 Les écrans à créer

Où : Claude Design, projet « PULSACITY v2 ». Après 3.2. Ces écrans passent avant les écrans existants : ils remplacent les liens morts de l'espace et permettent d'encaisser.

```
Prompt 3.3 — Les écrans à créer.

Fichiers du projet : inventaire-ecrans.md (partie 8), et les décisions tarifs.md, connecteurs.md, positionnement.md, commercialisation.md, corrigées par arbitrages.md.

Avec la charte v2, dans la coque de l'espace (ou celle du site pour « Aide et contact » et les pages publiques), dessine chaque écran avec chacun de ses états, à 1440 px et à 360 px :
1. Réglages (8.1), avec la case « J'offre une contrepartie à mes clients » (positionnement.md, avis en ligne, point 7).
2. Mon compte (8.2), avec l'export des données, et la suppression de l'espace : fenêtre de confirmation, puis page « Votre espace est supprimé ».
3. Abonnement et factures (8.3), avec les prix de tarifs.md et le prix fondateur (arbitrages.md, n° 1), et chacun de ces états :
   - Gratuit avec sa consommation, Essentiel mensuel au prix fondateur, Pro annuel ;
   - bêta-testeur : Essentiel offert 3 mois, date du premier prélèvement ;
   - retour du paiement réussi ; paiement en cours de confirmation ; paiement abandonné ;
   - paiement échoué, et son bandeau dans le reste de l'espace ;
   - résiliation programmée ; passage à un plan inférieur programmé ; retour au Gratuit, avec le widget gardé et les autres en pause.
4. Aide et contact (8.4), avec le formulaire « Écrivez-nous » et ses états.
5. Le catalogue des connecteurs (8.5, et connecteurs.md) :
   - la page publique « Intégrations » et la page Connecteurs de l'espace, en six familles, avec les états disponible, bientôt, inscrit, et « Dites-nous quel outil » ;
   - la page publique d'un outil « Bientôt », avec « En attendant : avec Zapier ou Make » ;
   - le connecteur universel : sa page publique, sa page de connexion dans l'espace (adresse propre à l'espace, comme Systeme.io), et ses guides Zapier, Make, n8n et Podia ;
   - la liste « Compatible avec votre site ».
6. Le parrainage (commercialisation.md, P1 n° 6) : le lien de l'espace, les filleuls, le mois offert par filleul payant.

Textes : français, vouvoiement, phrases courtes, casse de phrase. Une erreur dit ce qui s'est passé et quoi faire ; un état vide, une phrase et l'action suivante. Aucun mot technique (ni « webhook », ni « API », ni « token »). Pas de « TVA comprise » : « Prix finaux ». Les interdits de 3.1 restent.

Exporte comme en 3.2 (PNG 2x, mêmes noms, INDEX.md des planches de ce prompt), dans un ZIP.
```

---

## 3.4 L'espace du créateur en v2

Où : Claude Design, projet « PULSACITY v2 ». Ajoutez au projet les maquettes v1 m4, m5, m6, m9 à m12 et m15 à m20.

```
Prompt 3.4 — L'espace du créateur en v2.

Fichiers du projet : inventaire-ecrans.md (parties 2, 3 et 7), les maquettes v1 de ces écrans, et les décisions positionnement.md et commercialisation.md, corrigées par arbitrages.md. Les maquettes v1 donnent les contenus, les états et les textes ; la charte v2 donne l'apparence.

1. Redessine en v2 chaque écran des parties 2 et 3, avec chacun des états listés, à 1440 px et à 360 px. Ne change ni les contenus, ni les états, ni les textes, ni l'ordre des actions. Si la v2 demande de déplacer un élément pour qu'il se lise mieux, fais-le, et note-le sur la planche.
2. Les connecteurs de l'espace en six familles, comme en 3.3.
3. Dessine aussi ce qui n'a pas de maquette aujourd'hui (partie 7) : l'historique d'un connecteur, la fenêtre de suppression définitive d'un témoignage, la fenêtre « Corriger l'adresse », le résultat vide d'un filtre, les messages après une action (enregistré, copié, envoyé).
4. Ce que les décisions ajoutent :
   - à l'inscription, la question « Comment avez-vous connu PULSACITY ? » (commercialisation.md), facultative ;
   - sur la fiche d'un témoignage, sa provenance (vente reçue, demande manuelle, ajout, import, lien public) et sa date d'achat (positionnement.md, points 1 et 2) ;
   - « Masquer » avec son motif, transmis au client (point 6) ;
   - « Corriger le texte affiché » : la correction envoyée à l'accord du client, l'attente, l'accord, le refus ; sans accord, seul le masquage d'un nom ou d'une coordonnée (point 4).

Mêmes règles de textes et mêmes interdits qu'en 3.1. Exporte comme en 3.2, dans un ZIP.
```

---

## 3.5 Le site public en v2

Où : Claude Design, projet « PULSACITY v2 ». Ajoutez au projet les maquettes v1 m7, m8, m14 et m21 à m24.

```
Prompt 3.5 — Le site public en v2.

Fichiers du projet : inventaire-ecrans.md (partie 1), les maquettes v1 de ces écrans, et les décisions positionnement.md, tarifs.md et connecteurs.md, corrigées par arbitrages.md.

1. La page d'accueil v2, avec les douze sections et les textes de positionnement.md, dans leur ordre, corrigés par arbitrages.md :
   - prix affichés : le prix fondateur, avec la ligne « Prix de lancement, gardé à vie, pour les 100 premiers abonnés. Ensuite, 14,99 € par mois » (n° 1) ;
   - « Prix finaux » au lieu de « TVA comprise » (n° 2) ;
   - la démo en quatre temps (vente, e-mail, avis, mur) et l'exemple de widget réel, redessinés, avec « Exemple, avis fictifs » ;
   - la démo à manipuler « Écrire un avis de test » : le visiteur écrit un avis et le voit arriver sur le mur, rien n'est enregistré ;
   - le catalogue des connecteurs par familles : Systeme.io y est un outil parmi d'autres ;
   - la barre fixe sur téléphone : quand elle apparaît, quand elle disparaît, sans rien masquer.
2. Tarifs, avec le prix fondateur et les prix publics, « Prix finaux : rien ne s'ajoute au paiement », et ses questions.
3. La page « À propos de ces avis » (positionnement.md, point 3) : contrôle, contrepartie, modification, ordre d'affichage, motifs de refus.
4. Intégrations (avec le catalogue de 3.3), une intégration disponible, une intégration « Bientôt », Guides, un guide, chacune des quatre pages légales avec son sommaire, page introuvable, erreur, menu du téléphone.
5. Le modèle des images de partage (1200 × 630 px) : page d'accueil, une page d'intégration, un guide.

Chaque écran à 1440 px et à 360 px, avec chacun des états de l'inventaire. Mêmes règles de textes et mêmes interdits qu'en 3.1. Exporte comme en 3.2, dans un ZIP.
```

---

## 3.6 La page de collecte, les e-mails et le widget en v2

Où : Claude Design, projet « PULSACITY v2 ». Ajoutez au projet les maquettes v1 m1, m2, m3, m10 et m13.

```
Prompt 3.6 — La page de collecte, les e-mails et le widget en v2.

Fichiers du projet : inventaire-ecrans.md (parties 4 à 6), les maquettes v1 de ces écrans, et les décisions positionnement.md, tarifs.md et commercialisation.md, corrigées par arbitrages.md.

1. La page de collecte et la désinscription, à 360 px et à 1440 px, avec chacun de leurs états. Elles portent l'identité du créateur (son logo, sa couleur d'accent) ; PULSACITY y reste discret. Le bouton « Envoyer mon avis » reste le seul bouton plein en couleur d'accent. La mention de la contrepartie, si le créateur l'a cochée.
2. Les e-mails, à 600 px et sur téléphone, en polices système :
   - aux clients du créateur, à son nom, avec son logo et sa couleur : demande, relance, version texte de la demande, demande d'accord pour une correction, motif d'un avis masqué ;
   - au créateur : « Votre lien », « Nouveau témoignage » (standard et plan Gratuit plein), « Code du widget », les quatre e-mails d'accueil J0, J1, J3 et J7 (commercialisation.md), le rappel 7 jours avant le premier prélèvement d'un bêta-testeur (tarifs.md).
3. Le widget : mur, carrousel et badge, en thèmes clair, sombre et automatique, avec leurs états de chargement.
   - Sur chaque témoignage : la date de l'avis et le mois de l'achat (positionnement.md, point 2).
   - Le lien « À propos de ces avis », sur tous les plans, distinct de « Propulsé par PULSACITY » (point 3).
   - La mention « Bêta-testeur · plan Essentiel offert pendant la bêta », pour le mur de PULSACITY.
   - Montre-les sur deux pages de vente différentes : l'une claire, avec une police à empattements ; l'autre sombre, avec une police sans empattements. Le widget prend la police de la page qui l'accueille, n'a pas d'autre identité que celle du créateur, et ne casse jamais la mise en page. « Propulsé par PULSACITY » est discret mais lisible.
4. L'image de partage d'un témoignage validé (1080 × 1350 et 1200 × 630 px), aux couleurs du créateur.

Mêmes règles de textes et mêmes interdits qu'en 3.1. Exporte comme en 3.2, dans un ZIP.
```

---

## 3.7 Vérifier que rien ne manque, puis exporter

Où : Claude Design, projet « PULSACITY v2 ». Après 3.6.

```
Prompt 3.7 — Vérifier que rien ne manque, puis exporter.

1. Reprends inventaire-ecrans.md ligne par ligne. Pour chaque écran et chaque état, coche sa planche v2 à 1440 px et à 360 px. Fais la liste de ce qui manque, puis dessine-le.
2. Dans l'autre sens : fais la liste des planches v2 qui montrent un écran, un état ou un élément absent de l'inventaire et des écrans à créer. Pour chacun, dis s'il s'agit d'un ajout voulu, à me faire valider, ou d'une erreur, à retirer.
3. Vérifie chaque planche : aucune couleur, police, taille ou espacement hors de la charte v2 ; contrastes AA ; cibles de 44 px ; aucun débordement à 360 px ; aucun des interdits. Puis passe la liste de contrôle avant livraison de pro-rules.md, et note chaque point corrigé.
4. Exporte tout, comme en 3.2 : PNG 2x, une planche ou un état par fichier, aux noms « v2-<famille>-<écran>-<desktop ou mobile>-<numéro>-<état>.png » ; INDEX.md complet ; charte-v2.md à jour ; logo et sa spécification. Le tout dans un seul ZIP.

Donne-moi la liste des manques trouvés, et ce que tu as fait pour chacun.
```

Envoyez ce ZIP final à Claude Code : il remplace dans le dépôt les exports partiels de 3.2 à 3.6.
