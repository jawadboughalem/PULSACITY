# Étape 5 : commercialiser

| N° | Quoi | Où | Quand |
| --- | --- | --- | --- |
| 5.1 | Le kit des réseaux sociaux | Claude Design, projet « PULSACITY v2 » | Après 3.2 et 1.6 |
| 5.2 | Le studio : vidéos en motion design et visuels en série | Claude Code, dépôt privé à part | Après 5.1 |
| 5.3 | La production en série, une vague par mois | Claude Chat, un projet par réseau, puis le studio | Après 5.2 ; la première vague avant la bêta |
| 5.4 | La bêta privée, puis le lancement | Claude Chat, projet « PULSACITY — Stratégie » | Quand le lot 4.11 donne le feu vert |
| 5.5 | La publicité payante | Claude Chat, projet « PULSACITY — Stratégie » | Quelques semaines après le lancement, avec des chiffres |

Deux règles pour toute la communication :
- les adresses laissées sur « Me prévenir » servent seulement à annoncer la sortie de leur connecteur, jamais au lancement ni à une campagne ;
- aucun faux client, aucun avis inventé, aucun chiffre sans source. Les avis des bêta-testeurs ne sont publiés qu'avec leur accord, recueilli par notre propre page de collecte.

---

## 5.1 Le kit des réseaux sociaux

Où : Claude Design, projet « PULSACITY v2 », nouvelle page « Réseaux sociaux ». Remplacez la ligne entre crochets par le compte rendu de 1.6.

```
Prompt 5.1 — Le kit des réseaux sociaux.

[Compte rendu 1.6 : réseaux retenus, formats, piliers de contenu.]

Avec la charte v2, crée une page « Réseaux sociaux » :

1. Les profils, pour chaque réseau retenu : photo de profil (le symbole), bannières (profil et page entreprise LinkedIn, YouTube, Facebook), aux dimensions d'octobre 2026, avec les zones visibles sur téléphone et sur ordinateur.

2. Les modèles de publication, chacun avec un exemple rempli de vrais textes :
   - carrousel LinkedIn et Instagram (1080 × 1350 px) : couverture, page de contenu, page avec une capture du produit, dernière page avec l'appel à l'action ;
   - publication simple (1080 × 1350 et 1080 × 1080 px) : citation, chiffre sourcé, astuce ;
   - couverture de Reel, de Short et de story (1080 × 1920 px), avec les zones masquées par l'interface de chaque réseau ;
   - miniature YouTube (1280 × 720 px).

3. Trois vidéos en motion design, en scénarios image par image : durées, textes à l'écran, mouvements, sons. Format 9:16, sous-titres incrustés, compréhensibles sans le son.
   - « Une vente devient un témoignage » (15 s) : la vente, l'e-mail, l'avis, le mur sur la page de vente ;
   - « L'astuce » (30 s) : un conseil, sa démonstration dans le produit, l'appel à l'action ;
   - « Avant, après » (20 s) : une page de vente sans avis, puis la même avec le mur.

4. Les règles : marges, taille minimale du texte sur téléphone, cadrage des captures du produit, et les interdits (ceux de la charte, plus : aucun faux client, aucun chiffre sans source).

Exporte chaque modèle en PNG, et décris chaque scénario dans un fichier « storyboards.md » : Claude Code les animera. Le tout dans un ZIP.
```

---

## 5.2 Le studio de PULSACITY

Avant ce prompt :
1. Créez sur GitHub un dépôt **privé** et vide, `pulsacity-studio` : les campagnes ne doivent pas être publiques avant leur sortie.
2. Donnez à Claude Code l'accès à ce dépôt (claude.ai/code, réglages de l'environnement ou accès GitHub), puis ouvrez une nouvelle session cloud sur lui.
3. Joignez le ZIP de 5.1 et celui de la charte v2 (3.2).

```
Prompt 5.2 — Le studio de PULSACITY : vidéos en motion design et visuels en série.

Dépôt : pulsacity-studio, privé et vide. Je te joins le kit des réseaux sociaux (modèles PNG, storyboards.md) et la charte v2 (charte-v2.md, logo).

Construis un studio qui produit nos vidéos et nos visuels à partir de données :
1. Remotion pour les vidéos, en React et TypeScript. Vérifie d'abord sa licence pour une personne seule (gratuite ou non, à quelles conditions) et dis-le-moi avant de continuer.
2. Les trois vidéos de storyboards.md, en modèles paramétrables : textes, captures, couleurs de la charte v2, durée. En 9:16, et en 1:1 ou 16:9 si c'est utile. Sous-titres incrustés.
3. Les modèles d'images du kit, rendus en PNG en série.
4. Une entrée de données simple : un fichier CSV, une ligne par publication (modèle, textes, image, format), tel que Claude Chat le produit en 5.3.
5. Le rendu : sur mon Mac (commandes à copier, aperçu dans Remotion Studio), et par un workflow GitHub Actions lancé à la main, qui rend une vague entière et la donne en archive ZIP à télécharger. Rien de lourd dans le dépôt.
6. Musique et sons : seulement des fichiers dont la licence permet un usage commercial sur les réseaux sociaux, rangés avec leur licence.
7. Un README en français : ajouter une vague, rendre, télécharger.

Aucun secret dans le dépôt. Montre-moi une première vidéo de chaque modèle et une planche d'images avant de tout finir.
```

Ce studio sert deux fois : ses modèles sont la base de la fonctionnalité V1 « vidéos pour les réseaux sociaux », où le témoignage d'un client devient une vidéo pour le créateur.

---

## 5.3 La production en série

### Un projet Claude par réseau

Où : claude.ai, un projet par réseau retenu en 1.6 : « PULSACITY — LinkedIn », « PULSACITY — Instagram », « PULSACITY — YouTube »… Fichiers de chaque projet : brief-pulsacity.md, les comptes rendus 1.5 et 1.6, le README du studio (les colonnes du CSV), et le bilan de la vague précédente.

Instructions du projet (remplacez RÉSEAU) :

```
Tu écris les publications RÉSEAU de PULSACITY, au nom de son fondateur.

Appuie-toi sur les fichiers du projet : le brief, le positionnement (1.5), la stratégie (1.6 : piliers, rythme, ton de ce réseau), les colonnes du CSV du studio, et le bilan de la vague précédente.

Règles :
- français, phrases courtes, le ton retenu en 1.6 pour ce réseau ;
- aucun faux client, aucun avis inventé, aucun chiffre sans sa source ;
- les outils (Systeme.io, Stripe…) sont cités pour dire une compatibilité, jamais un partenariat ;
- la mention « publicité » ou « partenariat » quand une publication est payée ou contient un lien d'affiliation ;
- dans les visuels, aucun des interdits de la charte : étiquettes en majuscules espacées, mot du titre en couleur ou en italique, flèches « → » dans les boutons, dégradés décoratifs.
```

### Le prompt d'une vague

Une conversation par vague, dans le projet du réseau.

```
Prompt 5.3 — Vague N.

Prépare la vague N : [30] publications pour ce réseau, du [date] au [date], au rythme retenu en 1.6, réparties sur nos piliers.

[Bilan de la vague précédente : les 5 meilleures et les 5 moins bonnes publications, avec leurs chiffres. Pour la première vague, supprimez cette ligne.]

Donne :
1. Le calendrier : date, heure conseillée, pilier, format.
2. Pour chaque publication : l'accroche, le texte complet, l'appel à l'action, les mots-clés ou hashtags, le texte alternatif des images, et le modèle du studio avec ses données.
3. Le même contenu en CSV, avec les colonnes du README du studio.
4. Ce que tu changes par rapport à la vague précédente, et pourquoi.
```

Ensuite : le CSV va au studio (5.2), qui rend la vague ; vous programmez les publications avec les outils gratuits des réseaux (Meta Business Suite pour Instagram et Facebook, la programmation de LinkedIn, YouTube Studio).

Combien d'avance : deux à trois mois de publications au lancement, puis une vague par mois, ajustée sur les chiffres de la précédente.

---

## 5.4 La bêta privée, puis le lancement

Où : Claude Chat, projet « PULSACITY — Stratégie », nouvelle conversation.

```
Prompt 5.4 — La bêta privée, puis le lancement.

Contexte : comptes rendus 1.5 et 1.6. La V0 est complète : paiements, réglages, aide et contact, v2, textes légaux validés.

1. La bêta : le message d'invitation (LinkedIn, Instagram, groupes, e-mail), les endroits où le publier, l'offre aux bêta-testeurs (décidée en 1.3 ou en 1.6), le déroulé pour chacun (installation accompagnée, points d'étape), le questionnaire de retour, et la demande de témoignage sur PULSACITY, faite avec notre propre lien de collecte.
2. Une grille pour trier leurs retours avant le lancement : bloquant, gênant, idée.
3. La semaine de lancement, jour par jour : publications de chaque réseau, messages aux bêta-testeurs, partenaires, communautés, annuaires.
4. Les règles : les adresses laissées sur « Me prévenir » ne servent qu'à annoncer la sortie de leur connecteur, jamais au lancement ; les avis des bêta-testeurs ne sont publiés qu'avec leur accord.

Termine par le « Compte rendu pour Claude Code » : ce que le produit doit avoir avant le lancement (par exemple le mur d'avis de PULSACITY sur pulsacity.com, avec notre propre widget), et la date visée.
```

---

## 5.5 La publicité payante

Où : Claude Chat, projet « PULSACITY — Stratégie », nouvelle conversation, quelques semaines après le lancement.

```
Prompt 5.5 — La publicité payante.

Contexte : comptes rendus 1.6 et 5.4. Les chiffres de nos premières semaines, par source : [visites, inscriptions, premiers widgets affichés, passages au payant].

1. Faut-il commencer maintenant ? Sur quel réseau, avec quel budget de test (par jour, sur quelle durée), quelle cible, quelles créations (modèles du studio) ?
2. La mesure : liens suivis (paramètres UTM), ce que notre mesure d'audience sans cookie permet, et ce qu'un pixel publicitaire (Meta, LinkedIn, TikTok) imposerait : bandeau de consentement conforme à la CNIL, politique de confidentialité mise à jour.
3. Les seuils pour arrêter, continuer ou augmenter.

Termine par le « Compte rendu pour Claude Code » : ce que le produit doit ajouter (bandeau de consentement, pixel, pages d'atterrissage). Chaque écran nouveau passe d'abord par Claude Design.
```
