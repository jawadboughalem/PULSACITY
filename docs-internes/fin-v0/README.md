# Finir la V0 : feuille de route

Établie le 5 octobre 2026, revue le 12 octobre : **encaisser dès la V0, en tant que particulier ; créer la micro-entreprise au seuil.**

Le fondateur juge la V0 inachevée sur cinq points :
1. le design : trop basique, trop linéaire, pas assez moderne, trop proche du style des assistants d'IA ;
2. les écrans manquants (réglages, compte, abonnement et factures, aide et contact) et les textes légaux à compléter ;
3. les tarifs : rester sous 10 € ou pas ;
4. les connecteurs : sortir du « tout Systeme.io », décider du catalogue complet par familles, et mieux vendre l'outil sur la page d'accueil ;
5. la commercialisation : stratégie, acquisition, réseaux sociaux, contenus produits avec Claude.

## La stratégie du 12 octobre

- **Les paiements restent dans la V0.** Stripe Billing, la page « Abonnement et factures », les CGV publiées. Le fondateur encaisse en tant que particulier, sans entreprise.
- **La micro-entreprise se crée au seuil** fixé dans `seuil-micro-entreprise.md` : 5 clients payants, 3 mois de suite avec des paiements ou 500 € encaissés, le premier atteint. Ce jour-là, les prompts 6.1 à 6.7 passent avant tout le reste.
- **Les textes légaux sont ceux d'un vendeur particulier.**
  - Les mentions légales donnent votre nom, votre adresse et votre téléphone (à confirmer par 1.1).
  - Les CGV, les CGU (avec leur annexe RGPD) et la politique de confidentialité restent.
  - Vos informations viennent de variables Vercel, jamais du dépôt public.
- **La domiciliation Kandbaz** : à peser avant de la résilier (prompt K). Si vous vendez, une adresse doit être publiée ; sans elle, c'est la vôtre. Une domiciliation suppose en général une entreprise immatriculée : K le vérifie avec leurs conditions.
- **Une seule adresse e-mail**, contact@pulsacity.com, déjà en place (redirection OVH) : contact, aide, données personnelles, facturation.
- **Le catalogue des connecteurs est décidé** (`docs-internes/decisions/connecteurs.md`) : 6 familles et 19 outils affichés. Le connecteur universel doit être en ligne avant la publication du catalogue : c'est le lot 4.1 b.
- **Le skill UI UX Pro Max** (uupm.cc) entre dans la refonte graphique, avec un rôle précis : voir l'arbitrage plus bas.

La V1 (témoignages vidéo, vidéos pour les réseaux sociaux, connecteurs Stripe et Calendly/Cal.com) attend la fin de cette feuille de route. La recette de bout en bout en production devient le lot 4.11, juste avant le lancement.

## Où coller quoi

| Outil | Pour |
| --- | --- |
| **Claude Chat**, dans le projet « PULSACITY — Stratégie » (prompt 0) | Les décisions : cadre légal, tarifs, inspiration, positionnement, commercialisation. Recherche web activée. |
| **Claude in Chrome**, groupe d'onglets « PULSACITY » | Les actions sur un service : Kandbaz, prestataires, Stripe, Make. Vous vous connectez vous-même ; l'agent ne crée aucun compte. |
| **Claude Design**, nouveau projet « PULSACITY v2 » | La direction visuelle, le logo, la charte v2, toutes les maquettes v2, le kit des réseaux sociaux. |
| **Claude Code**, une session cloud par lot | La construction : chaque lot a son prompt, sa PR, sa recette. |
| **Vous** | Vos comptes, et ce qui engage votre identité : Stripe, et plus tard l'immatriculation et la banque. |

Chaque prompt de Claude Chat finit par un « Compte rendu pour Claude Code », sans donnée personnelle ni secret. Ajoutez-le aux fichiers du projet Claude, et gardez-le pour le lot 4.1.

## Toutes les actions, dans l'ordre

Dans une même phase, les actions se mènent en parallèle. Déjà faits : l'adresse contact@ (2.2) et le catalogue des connecteurs (1.2).

### Phase A — Cette semaine

1. **K** La domiciliation Kandbaz : d'abord savoir ce qu'elle permet sans entreprise, puis décider (Claude in Chrome).
2. **0** Le projet Claude « PULSACITY — Stratégie », puis **0 bis** le skill UI UX Pro Max dans Claude (un quart d'heure en tout).
3. **1.1** Encaisser sans entreprise : ce qui est permis, ce qu'il faut déclarer, ce que les textes légaux doivent dire.
4. **1.4**, premier temps : les sites à explorer (uupm.cc compris), le skill lancé sur PULSACITY. Puis votre exploration, grille et captures.
5. **1.5** Le positionnement et la page d'accueil, avec le compte rendu 1.2.

### Phase B — Dès que 1.1 a répondu

6. **1.3** Les tarifs.
7. **1.6** La commercialisation, avec 1.5.
8. **1.4**, second temps, avec vos captures. Puis **3.1** (trois directions, trois logos), votre choix, **3.2** (la charte v2), et le **lot 4.2** (fondations v2, skill installé dans le dépôt).
9. **Lot 4.1** Les décisions de l'étape 1 dans le dépôt.
10. **Lot 4.1 b** Le connecteur universel, ses guides (Zapier, Make, n8n, Podia), puis le catalogue publié.
11. **2.8 a et b** Le compte Stripe, ouvert en particulier et réglé en mode test.

### Phase C — Les écrans manquants et les textes légaux

12. **2.4** Les contrats de traitement des prestataires (Claude in Chrome).
13. **3.3** Les maquettes des écrans à créer. Puis les **lots 4.3, 4.4 et 4.5** : Réglages et Mon compte, Aide et contact, Abonnement et factures (Stripe, en mode test).
14. **2.7** La relecture des textes légaux par Claude Chat, puis **2.6** les informations à donner, puis le **lot 4.9** : les textes d'un vendeur particulier, publiés.
15. **3.4, 3.5, 3.6** Les maquettes de l'espace, du site, de la collecte, des e-mails et du widget.

### Phase D — La v2 partout

16. **Lots 4.6, 4.7 et 4.8**, au fil des maquettes. **3.7** Le contrôle final des maquettes.

### Phase E — Avant le premier vrai paiement

17. Vercel Pro (vous) : l'offre gratuite de Vercel exclut un usage commercial.
18. **2.8 c** Activer le compte Stripe, une fois les lots 4.4 et 4.9 en ligne : Stripe vérifie le site.
19. **Lot 4.5**, dernier point : le passage en mode réel, et votre premier paiement, remboursé.

### Phase F — Lancer

20. **Lot 4.10** Avant le lancement : envoi des demandes toutes les 15 minutes, Sentry, adresse des photos, mesure d'audience, Search Console, données de test effacées.
21. **5.1** Le kit des réseaux sociaux, **5.2** le studio de vidéos, **5.3** la première vague de publications.
22. **Lot 4.11** La recette de bout en bout en production.
23. **5.4** La bêta privée, puis le lancement.
24. **5.5** La publicité payante, quelques semaines après, avec des chiffres.

### Au seuil : la micro-entreprise

Dès que l'un des repères de `seuil-micro-entreprise.md` est atteint, les prompts 6.1 à 6.7 passent avant tout le reste.

## L'arbitrage sur UI UX Pro Max

**Le skill.** Il est en licence MIT. C'est une base de 79 styles nommés, 192 palettes, 74 paires de polices et 119 règles UX, avec un générateur de « design system ». Ses scripts sont en Python standard et ne font aucun appel réseau. La version payante (Premium) ajoute logos et identité de marque.

**Le test.** Lancé le 12 octobre sur PULSACITY, son générateur propose deux directions :
- avec une première description du produit : violet #7C3AED, Inter et Space Grotesk (deux polices qu'il classe « web3, crypto »), et des cartes en grille façon bento. C'est l'allure type des sites générés ;
- avec une seconde : bleu marine et EB Garamond (« legal, traditional »). C'est le style à empattements que vous voulez quitter.

Appliquées telles quelles, ses propositions nous ramènent à ce que vous fuyez. Ses règles UX, elles, sont solides.

**La décision.**
- **Explorer (1.4)** : oui. La galerie d'uupm.cc et le skill, ajouté à Claude Chat, sont une source d'inspiration de plus. Ses propositions se jugent comme n'importe quelle référence : elles ne s'appliquent pas d'office.
- **Dessiner (3.1 à 3.7)** : ses règles UX (`quick-reference.md`, `pro-rules.md`) deviennent une liste de contrôle pour Claude Design. En cas de conflit, la charte v2 et nos interdits l'emportent.
- **Construire (lot 4.2 et suivants)** : il est installé dans le dépôt pour Claude Code, figé sur une version. Il sert aux règles UX, à l'accessibilité et aux conseils pour Next.js. Son générateur, ses palettes, ses polices et ses styles ne servent pas : la charte v2 reste la seule source.
- **La version Premium** : non. Le logo et l'identité sont le travail de Claude Design.

## Le détail de chaque étape

| Fichier | Ce qu'on y trouve |
| --- | --- |
| `prompts-1-decider.md` | Le projet Claude, le skill, puis les prompts 1.1 à 1.6 |
| `prompts-2-legal-sans-entreprise.md` | Kandbaz (K), les prestataires (2.4), la relecture (2.7), les informations légales (2.6), Stripe (2.8) |
| `prompts-3-design-v2.md` | Pourquoi un nouveau projet Claude Design, comment le préparer, les prompts 3.1 à 3.7 |
| `prompts-4-construire.md` | Ce que fait chaque lot, et les prompts des lots 4.1 à 4.11 |
| `prompts-5-commercialiser.md` | Les prompts 5.1 à 5.5 |
| `seuil-micro-entreprise.md` | Le seuil où créer la micro-entreprise, et pourquoi |
| `prompts-6-le-jour-ou-ca-marche.md` | Le jour du seuil : les prompts 6.1 à 6.7 |

Le design v2 se fait dans un **nouveau projet Claude Design**, « PULSACITY v2 ». L'actuel reste intact : il porte la v1, qui guiderait chaque proposition vers ce que vous voulez quitter, et il reste la référence des écrans pas encore migrés.

## Recommandations de Claude Code

- **Le seuil, tenu.** Un abonnement mensuel est récurrent par nature : la régularité arrive vite. Déclarez ce que vous encaissez dès le premier euro (1.1 dit où), et créez la micro-entreprise au premier repère atteint : elle ne coûte rien sans chiffre d'affaires.
- **Liens morts en production.** « Mon compte », « Réglages », « Abonnement et factures », « Aide et contact », « Voir le plan Essentiel » et « Voir les plans » mènent à des pages qui n'existent pas encore (`inventaire-ecrans.md`, partie 9). Pas de promotion du site avant les lots 4.3 à 4.5.
- **TVA.** La réponse « Essentiel vous revient à 8,33 € HT » de `/tarifs` suppose une entreprise qui collecte la TVA. Sans entreprise, aucune TVA n'est facturée : le lot 4.1 retire cette phrase, le lot 6.6 la remet selon le régime.
- **Vos informations personnelles hors du dépôt.** Le dépôt est public et garde tout son historique. Votre nom, votre adresse et votre téléphone apparaîtront sur le site, comme la loi l'impose à un vendeur, mais viendront de variables Vercel saisies par vous (lot 4.9).
- **Les bêta-testeurs** peuvent recevoir Essentiel, offert, par un code promotionnel Stripe à 100 % (lot 4.5) : rien à coder de plus.
- **Les avis en ligne : une obligation et un argument.** Le droit français encadre leur publication (date, vérification, avis négatifs). Notre badge « 4,9/5 » est calculé sur les seuls témoignages validés : 2.7 vérifie le risque. Et des avis issus de vraies ventes sont un argument fort : 1.5 dit à quelles conditions l'utiliser.
- **Le connecteur universel d'abord.** Avec lui, chaque outil « Bientôt » marche déjà par Zapier, Make ou n8n : le catalogue promet moins et tient plus.
- **Se servir de PULSACITY pour PULSACITY.** Recueillir les avis des créateurs de la bêta avec notre propre lien de collecte, et les afficher sur pulsacity.com avec notre widget.
- **Mesurer avant de communiquer.** Une mesure d'audience sans cookie, donc sans bandeau, avant toute campagne.
- **Les réseaux sociaux.** Mon avis, que 1.6 vérifiera : LinkedIn et Instagram, plus YouTube pour des tutoriels qu'on trouve par la recherche (et leurs versions courtes en Shorts), plus les groupes Facebook d'indépendants. TikTok seulement en y reprenant les Reels, sans effort à part, jusqu'à ce que les chiffres disent le contraire.
- **Des centaines de publications d'avance : oui, mais par vagues.** Deux à trois mois de stock au lancement, puis une vague par mois.
- **Le studio de vidéos sert deux fois** : ses modèles sont la base de la fonctionnalité V1 « vidéos pour les réseaux sociaux ».
- **Les adresses « Me prévenir »** ne servent qu'à annoncer la sortie de leur connecteur, comme le promet la page.
- **Salarié ?** Une activité à côté peut toucher à votre obligation de loyauté envers votre employeur : 1.1 vous pose la question.

## Fichiers de ce dossier

| Fichier | Contenu |
| --- | --- |
| `README.md` | Cette feuille de route |
| `brief-pulsacity.md` | Le brief du produit, à joindre au projet Claude et au projet Claude Design |
| `inventaire-ecrans.md` | Tous les écrans et leurs états, leurs maquettes v1, les écrans à créer, les liens morts : la liste de contrôle des maquettes v2 |
| `seuil-micro-entreprise.md` | Le seuil de la micro-entreprise |
| `prompts-1-decider.md` à `prompts-6-le-jour-ou-ca-marche.md` | Les prompts, étape par étape |

Les décisions déjà prises sont dans `docs-internes/decisions/` : le catalogue des connecteurs (`connecteurs.md`).
