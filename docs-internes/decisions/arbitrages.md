# Arbitrages du 12 octobre 2026

Les comptes rendus 1.3 (`tarifs.md`), 1.5 (`positionnement.md`) et 1.6 (`commercialisation.md`) se contredisent sur quelques points, et certains heurtent ce qui est déjà construit. Claude Code les a arbitrés ainsi. Ces arbitrages s'appliquent tant que le fondateur ne dit pas autre chose ; ils priment sur les trois comptes rendus là où ils les corrigent.

## 1. Les prix affichés

- **Le conflit.** 1.3 fixe des prix publics à 14,99 € et 24,99 €, avec un prix fondateur à 9,99 € et 19,99 € pour les bêta-testeurs et les 100 premiers abonnés, sans prix barré. 1.5 affiche 9,99 € et 19,99 € sur l'accueil, sous le titre « Gratuit pour commencer, moins de 10 € ensuite ».
- **L'arbitrage.** Tant que le prix fondateur est ouvert, l'accueil et Tarifs affichent le prix fondateur comme le prix payé, avec une ligne : « Prix de lancement, gardé à vie, pour les 100 premiers abonnés. Ensuite, 14,99 € par mois » (24,99 € pour Pro). Ni prix barré, ni compteur. Au centième abonné, les pages passent aux prix publics, et le titre « moins de 10 € ensuite » change.
- **Dans le code.** `plans.ts` tient les deux jeux de prix ; le passage se fait sans nouvelle livraison.

## 2. La TVA

- **Le conflit.** 1.5 écrit « Prix TVA comprise » (en-tête, tarifs, incitations). 1.3 : PULSACITY ne facture pas de TVA.
- **L'arbitrage.** « TVA comprise » disparaît tant qu'aucune TVA n'est collectée. Partout : « Prix finaux : rien ne s'ajoute au paiement », ou « vous payez le prix affiché ».

## 3. La durée offerte aux bêta-testeurs

- **Le conflit.** 1.3 : 3 mois, par un code promotionnel, carte demandée. 1.6 : 6 mois (8 semaines, plus 4 mois).
- **L'arbitrage.** 3 mois, carte demandée (1.3). Le signal de paiement arrive plus tôt, et les cartes enregistrées comptent pour le seuil de la micro-entreprise. On garde de 1.6 la mention « Bêta-testeur · plan Essentiel offert pendant la bêta » et l'absence de condition sur le contenu de l'avis. La « durée à décider » de 1.5 (section 10) vaut 3 mois.

## 4. Les demandes au-delà de 20 par mois

- **Le conflit.** 1.3 les met « en attente », annulées après 30 jours sans retour à Essentiel. En production aujourd'hui (m19, m20), elles sont gardées et partent le 1er du mois suivant : « rien n'est perdu ».
- **L'arbitrage.** On garde le comportement en place. Il est déjà recetté, plus simple, et il tient la promesse « rien n'est jamais supprimé ». L'annulation après 30 jours n'est pas construite.

## 5. La purge des notifications reçues

- **Le conflit.** 1.3 purge le contenu brut des ventes reçues après 90 jours. `CLAUDE.md` : un payload inconnu n'est jamais perdu.
- **L'arbitrage.** La purge à 90 jours ne touche que les notifications déjà traitées. Une notification inconnue est gardée jusqu'à son traitement. Les CGU disent 90 jours.

## 6. Les avis en ligne

- **Le point.** Les huit points de 1.5 (et le point P1 n° 8 de 1.6) changent des comportements construits : corriger le texte affiché, masquer, note du badge.
- **L'arbitrage.** Ils font un lot à part, le 4.13, avant la bêta, pour les points 1 à 7 ; le point 8 attend la relecture d'un juriste (6.7). D'ici là, aucune mention de vérification nulle part : c'est déjà le cas.

## 7. Le Pro

Pro = Essentiel, plus le retrait du badge, à 10 € de plus par mois : gardé tel que décidé. À revoir avec les chiffres de la revue à 60 jours (1.3).

## 8. Remotion et la V1

La licence gratuite de Remotion couvre notre propre communication. Mais la fonctionnalité V1 « vidéos pour les réseaux sociaux », où PULSACITY rend des vidéos pour ses créateurs, est un rendu automatisé pour des clients : licence payante. Son prix entre dans le chiffrage de la V1, ou un autre moteur de rendu la remplace.

## 9. Le prompt 1.1, non lancé

Ses questions passent ailleurs :
- le contenu des textes légaux d'un vendeur particulier, à 2.7 ;
- ce que Stripe demande à un particulier, à l'ouverture du compte (2.8 a).

La déclaration des revenus d'ici la micro-entreprise reste à la charge du fondateur. Le seuil de `seuil-micro-entreprise.md` ne change pas.

## 10. L'avis des bêta-testeurs sur PULSACITY, 21 jours après leur premier widget

Pas de code : les demandes saisies à la main partent tout de suite. La requête « tableau de bord fondateur » (lot 4.12) liste les espaces dont le widget est affiché depuis 21 jours. Le fondateur leur fait « Demander un avis », depuis l'espace PULSACITY, pour l'offre « Bêta PULSACITY ».

## 11. Ce que les décisions ajoutent à la V0

- **Lot 4.12, accueil et acquisition** (1.6, P0 et P1) :
  - source d'inscription et question « Comment avez-vous connu PULSACITY ? » ;
  - e-mails d'accueil J0, J1, J3 et J7 ;
  - requête « tableau de bord fondateur » ;
  - espace PULSACITY et son mur sur pulsacity.com ;
  - parrainage, codes par partenaire, image de partage d'un témoignage ;
  - liens courts /go/… ;
  - mesure d'audience Umami.
- **Lot 4.13, avis en ligne** (1.5, points 1 à 7).
- **Le lot 4.5 grandit** (1.3) : prix fondateur, codes des bêta-testeurs avec rappel 7 jours avant le premier prélèvement, règles de changement de plan, widgets et témoignages affichés au retour au Gratuit.
- **Nouveaux écrans à dessiner** :
  - démo « Écrire un avis de test », page « À propos de ces avis », barre fixe sur téléphone (3.5) ;
  - question de la source à l'inscription, motif de « Masquer », accord du client pour une correction (3.4) ;
  - parrainage, case « J'offre une contrepartie » (3.3) ;
  - e-mails d'accueil, date de l'avis et mois de l'achat dans le widget, image de partage (3.6).
