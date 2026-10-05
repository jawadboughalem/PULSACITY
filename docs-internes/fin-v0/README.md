# Finir la V0 : feuille de route

Établie le 5 octobre 2026, après la mise en ligne du lot 7. Le fondateur juge la V0 inachevée sur cinq points :

1. le design : trop basique, trop linéaire, pas assez moderne, trop proche du style des assistants d'IA ;
2. les écrans manquants (réglages, compte, abonnement et factures, aide et contact) et les textes légaux à compléter, avec tout ce qu'il faut créer pour cela (entreprise, adresses e-mail, banque, Stripe) ;
3. les tarifs : rester sous 10 € ou pas, selon la rentabilité ;
4. les connecteurs : sortir du « tout Systeme.io », décider dès maintenant du catalogue complet par familles, et mieux vendre l'outil sur la page d'accueil ;
5. la commercialisation : stratégie, acquisition, distribution, réseaux sociaux et production de contenus avec Claude.

La V1 (témoignages vidéo, vidéos pour les réseaux sociaux, connecteurs Stripe et Calendly/Cal.com) attend la fin de cette feuille de route. La recette de bout en bout en production est déplacée juste avant le lancement (lot 4.11) : les paiements et la v2 vont changer les parcours.

Comptez de 8 à 12 semaines, selon votre temps disponible. Deux délais ne dépendent pas de vous : le SIREN et la relecture juridique.

## Où coller quoi

| Outil | Pour |
| --- | --- |
| **Claude Chat**, dans le projet « PULSACITY — Stratégie » (prompt 0) | Les décisions et les stratégies : entreprise, connecteurs, tarifs, inspiration, positionnement, commercialisation. Recherche web activée. |
| **Claude in Chrome**, groupe d'onglets « PULSACITY » | Les actions sur un service : OVH, Stripe, Vercel. Vous vous connectez vous-même ; l'agent ne crée aucun compte. |
| **Claude Design**, nouveau projet « PULSACITY v2 » | La direction visuelle, le logo, la charte v2, toutes les maquettes v2, le kit des réseaux sociaux. |
| **Claude Code**, une session cloud par lot | La construction : chaque lot a son prompt, sa PR, sa recette. |
| **Vous** | Ce qui engage votre identité : immatriculation, banque, compte Stripe, abonnements payants, signature des contrats. |

Chaque prompt de Claude Chat finit par un « Compte rendu pour Claude Code », sans donnée personnelle ni secret. Ajoutez-le aux fichiers du projet Claude, et gardez-le pour le lot 4.1.

## Toutes les actions, dans l'ordre

Dans une même phase, les actions se mènent en parallèle.

### Phase A — Cette semaine

1. **0** Créer le projet Claude « PULSACITY — Stratégie » (10 minutes).
2. **1.1** Statut juridique et création de l'entreprise. En premier : tout le reste du légal en dépend.
3. **2.2** Les quatre adresses e-mail professionnelles chez OVH (Claude in Chrome, un quart d'heure, gratuit).
4. **1.2** Le catalogue des connecteurs.
5. **1.4**, premier temps : la liste des sites à explorer. Puis votre exploration, grille et captures.
6. **1.5** Le positionnement et la page d'accueil.

### Phase B — Dès que 1.1 a tranché

7. **2.1** L'immatriculation. Puis l'attente du SIREN.
8. **1.3** Les tarifs, avec le statut et la TVA de 1.1.
9. **1.6** La commercialisation, avec 1.5.
10. **1.4**, second temps, avec vos captures. Puis **3.1** (trois directions, trois logos), votre choix, **3.2** (la charte v2), et le **lot 4.2** (fondations v2).
11. **2.8 a et b** Ouvrir le compte Stripe et le régler en mode test : possible avant le SIREN.
12. **Lot 4.1** Les décisions de l'étape 1 dans le dépôt.

### Phase C — Pendant l'attente du SIREN

13. **2.3** Le compte bancaire.
14. **2.4** Les contrats de traitement des prestataires.
15. **3.3** Les maquettes des écrans à créer. Puis les **lots 4.3, 4.4 et 4.5** : Réglages et Mon compte, Aide et contact, abonnement en mode test.
16. **3.4, 3.5, 3.6** Les maquettes de l'espace, du site, de la collecte, des e-mails et du widget.

### Phase D — Avec le SIREN

17. **2.5** Le régime de TVA confirmé par écrit.
18. **2.6** Les informations des textes légaux, puis **2.7** la relecture juridique, puis **lot 4.9** (textes légaux complets).
19. **Lots 4.6, 4.7, 4.8** La v2 de l'espace, du site, de la collecte, des e-mails et du widget, au fil des maquettes. **3.7** Le contrôle final des maquettes.

### Phase E — Avant le premier paiement réel

20. Vercel Pro (lot 4.10, point 1) : l'offre gratuite de Vercel exclut un usage commercial.
21. **2.8 c** Activer le compte Stripe, une fois les lots 4.4 et 4.9 en ligne : Stripe vérifie le site.
22. **Lot 4.5**, dernier point : le passage en mode réel, et votre premier paiement, remboursé.

### Phase F — Lancer

23. **Lot 4.10** Le reste d'avant le lancement : Sentry, adresse des photos, mesure d'audience, Search Console, données de test effacées.
24. **5.1** Le kit des réseaux sociaux, **5.2** le studio de vidéos, **5.3** la première vague de publications.
25. **Lot 4.11** La recette de bout en bout en production.
26. **5.4** La bêta privée, puis le lancement.
27. **5.5** La publicité payante, quelques semaines après, avec des chiffres.

Puis la V1.

## Le détail de chaque étape

| Étape | Fichier | Ce qu'on y trouve |
| --- | --- | --- |
| 0 et 1 — Décider | `prompts-1-decider.md` | Le projet Claude, puis les prompts 1.1 à 1.6 |
| 2 — Créer l'entreprise et compléter le légal | `prompts-2-entreprise-et-legal.md` | Les prompts 2.1 à 2.8, et le modèle des informations légales (2.6) |
| 3 — Design v2 | `prompts-3-design-v2.md` | Pourquoi un nouveau projet Claude Design, comment le préparer, les prompts 3.1 à 3.7 |
| 4 — Construire | `prompts-4-construire.md` | Ce que fait chaque lot, et les prompts des lots 4.1 à 4.11 |
| 5 — Commercialiser | `prompts-5-commercialiser.md` | Les prompts 5.1 à 5.5 |

Le design v2 se fait dans un **nouveau projet Claude Design**, « PULSACITY v2 ». L'actuel reste intact : il porte la v1, qui guiderait chaque proposition vers ce que vous voulez quitter, et il reste la référence des écrans pas encore migrés. Les écrans à créer (3.3) passent avant les écrans existants : ils débloquent l'encaissement.

## Recommandations de Claude Code

- **Liens morts en production.** « Mon compte », « Réglages », « Abonnement et factures », « Aide et contact », chaque « Voir le plan Essentiel » et « Voir les plans » mènent à des pages qui n'existent pas encore (liste dans `inventaire-ecrans.md`, partie 9). Pas de promotion du site avant les lots 4.3 à 4.5.
- **Le chemin vers le premier paiement** passe par : 1.1, 2.1 (SIREN), 3.1 à 3.3, lots 4.2 à 4.5, 2.6, 2.7, lot 4.9, Vercel Pro, 2.8 c. Tout le reste peut venir après.
- **TVA.** La réponse « Essentiel vous revient à 8,33 € HT » de `/tarifs` n'est vraie que si l'entreprise collecte la TVA. En franchise en base, elle sera fausse : le lot 4.1 la corrige selon 1.1, et la confirme après 2.5. Pour une réponse officielle et gratuite, votre service des impôts des entreprises répond par écrit (2.5).
- **Facturation électronique.** Les factures entre entreprises françaises deviennent électroniques en 2026 et 2027. Nos clients sont des professionnels : 1.1 vérifie le calendrier et ce que cela impose aux factures de Stripe.
- **Vos informations personnelles hors du dépôt.** Le dépôt est public et garde tout son historique. Votre nom, votre adresse et votre téléphone apparaîtront sur le site, comme la loi l'impose, mais viendront de variables Vercel saisies par vous (lot 4.9), jamais du dépôt.
- **Les avis en ligne : une obligation et un argument.** Le droit français encadre la publication d'avis (date, vérification, avis négatifs). Notre badge « 4,9/5 » est calculé sur les seuls témoignages validés par le créateur : 2.7 vérifie le risque. Et des avis issus de vraies ventes sont un argument fort : 1.5 dit à quelles conditions l'utiliser.
- **Un connecteur universel.** Une adresse PULSACITY qui accepte des ventes dans un format simple, utilisable depuis Zapier, Make ou n8n, couvrirait d'un coup des centaines d'outils. 1.2 l'évalue : c'est peut-être le meilleur premier connecteur de la V1.
- **Se servir de PULSACITY pour PULSACITY.** Recueillir les avis des créateurs de la bêta avec notre propre lien de collecte, et les afficher sur pulsacity.com avec notre widget. C'est la meilleure preuve, et elle est vraie.
- **Mesurer avant de communiquer.** Une mesure d'audience sans cookie, donc sans bandeau, avant toute campagne : sans elle, impossible de savoir quel réseau amène des inscriptions.
- **Les réseaux sociaux.** Mon avis, que 1.6 vérifiera : LinkedIn et Instagram, plus YouTube pour des tutoriels qu'on trouve par la recherche (et leurs versions courtes en Shorts), plus les groupes Facebook où se retrouvent les indépendants. TikTok seulement en y reprenant les Reels d'Instagram, sans effort à part, jusqu'à ce que les chiffres disent le contraire.
- **Des centaines de publications d'avance : oui, mais par vagues.** Un stock de deux à trois mois au lancement, puis une vague par mois, ajustée sur les chiffres de la précédente.
- **Le studio de vidéos sert deux fois.** Les modèles de motion design faits pour notre communication (5.2) sont la base de la fonctionnalité V1 « vidéos pour les réseaux sociaux ».
- **Les adresses « Me prévenir »** ne servent qu'à annoncer la sortie de leur connecteur, comme le promet la page : jamais au lancement ni à une campagne.
- **Salarié ?** Si vous l'êtes, vérifiez votre contrat (exclusivité, non-concurrence) avant l'immatriculation : 1.1 en tient compte.

## Fichiers de ce dossier

| Fichier | Contenu |
| --- | --- |
| `README.md` | Cette feuille de route |
| `brief-pulsacity.md` | Le brief du produit, à joindre au projet Claude et au projet Claude Design |
| `inventaire-ecrans.md` | Tous les écrans et leurs états, leurs maquettes v1, les écrans à créer, les liens morts : la liste de contrôle des maquettes v2 |
| `prompts-1-decider.md` | Prompt 0 et prompts 1.1 à 1.6 |
| `prompts-2-entreprise-et-legal.md` | Prompts 2.1 à 2.8 |
| `prompts-3-design-v2.md` | Prompts 3.1 à 3.7 |
| `prompts-4-construire.md` | Prompts des lots 4.1 à 4.11 |
| `prompts-5-commercialiser.md` | Prompts 5.1 à 5.5 |
