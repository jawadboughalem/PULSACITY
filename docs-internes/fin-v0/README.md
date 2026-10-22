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
  - Les mentions légales donnent votre nom, et ni votre adresse ni votre téléphone (décision du 21 octobre, lot 4.9).
  - Les CGV, les CGU (avec leur annexe RGPD) et la politique de confidentialité restent.
  - Vos informations viennent de variables Vercel, jamais du dépôt public.
- **La domiciliation Kandbaz** : à peser avant de la résilier (prompt K). Si vous vendez, une adresse doit être publiée ; sans elle, c'est la vôtre. Une domiciliation suppose en général une entreprise immatriculée : K le vérifie avec leurs conditions.
- **Une seule adresse e-mail**, contact@pulsacity.com, déjà en place (redirection OVH) : contact, aide, données personnelles, facturation.
- **Le catalogue des connecteurs, les tarifs, le positionnement et la commercialisation sont décidés** (`docs-internes/decisions/`). Le connecteur universel sort avant le catalogue (lot 4.1 b) ; deux lots s'ajoutent, 4.12 (accueil et acquisition) et 4.13 (avis en ligne).
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

## Où on en est (12 octobre)

- **Faits** : 1.2 (connecteurs), 1.3 (tarifs), 1.5 (positionnement), 1.6 (commercialisation), l'adresse contact@ (2.2), la demande de résiliation à Kandbaz (réponse attendue).
- **Rangés dans le dépôt** : `docs-internes/decisions/` (`connecteurs.md`, `tarifs.md`, `positionnement.md`, `commercialisation.md`), avec les arbitrages de Claude Code là où ils se contredisent (`arbitrages.md`).
- **Non lancé** : 1.1. Ses questions passent à 2.7 et 2.8 a (arbitrage n° 9).

## Toutes les actions, dans l'ordre

Dans une même phase, les actions se mènent en parallèle. Chaque lot de Claude Code se lance dans une nouvelle session, avec son prompt court (`prompts-4-construire.md`).

### Phase A — Votre goût (une à deux heures)

1. **0 bis** Le skill UI UX Pro Max dans Claude, puis **1.4** la direction visuelle, en deux temps, si ce n'est pas déjà fait.

### Phase B — Dessiner, et construire ce qui n'attend pas de maquette

2. **Claude Design** : **3.1** (trois directions, trois logos), votre choix, **3.2** (la charte v2), **3.3** (les écrans à créer), puis **3.4**, **3.5**, **3.6** et **3.7**.
3. **En même temps, Claude Code** : le **lot 4.1** (les décisions appliquées), puis le **lot 4.1 b** (le connecteur universel et le catalogue).
4. **En même temps, le légal** : **2.4** (les prestataires, Claude in Chrome), puis **2.7** (les textes réécrits, Claude Chat).

### Phase C — Construire, à chaque ZIP de Claude Design

5. Le ZIP de 3.2 : le **lot 4.2** (fondations v2, skill installé).
6. Le ZIP de 3.3 :
   - **2.8 a et b** (le compte Stripe, en particulier, en mode test) ;
   - puis les **lots 4.3** (Réglages et Mon compte), **4.4** (Aide et contact) et **4.5** (Abonnement et factures, en mode test).
7. Les ZIP de 3.4 à 3.6 : les **lots 4.12** (accueil et acquisition), **4.13** (avis en ligne), **4.6** (l'espace en v2), **4.7** (le site en v2) et **4.8** (collecte, e-mails, widget).
8. **2.6**, puis le **lot 4.9** : les textes légaux, publiés.

### Phase D — Avant le premier vrai paiement

9. Vercel Pro (vous) ; **2.8 c** (activer Stripe, une fois 4.4 et 4.9 en ligne) ; le passage du **lot 4.5** en mode réel ; Resend Pro (lot 4.12).

### Phase E — La bêta (semaine S1 du plan à 90 jours)

10. Le **lot 4.10** (Sentry, photos, Search Console, données de test effacées).
11. L'espace PULSACITY, créé par vous (lot 4.12).
12. **5.1** (le kit des réseaux sociaux), **5.2** (le studio de vidéos), **5.3** (la première vague de publications).
13. Le **lot 4.11** (la recette de bout en bout), puis **5.4** : la bêta s'ouvre.

La bêta peut s'ouvrir dès que les lots 4.1 b, 4.3, 4.4, 4.5 (en réel), 4.9, 4.12 (sa partie « avant la bêta ») et 4.13 sont en ligne. Les lots 4.6 à 4.8 peuvent finir pendant la bêta. Le lancement public attend tout.

### Phase F — Le lancement (semaine S6), puis la suite

14. Le lancement, selon `decisions/commercialisation.md`.
15. **Au seuil** de `seuil-micro-entreprise.md`, ou un mois avant la fin de la gratuité des bêta-testeurs si 5 cartes sont enregistrées : les prompts **6.1 à 6.7**, avant tout le reste.
16. **5.5** La publicité payante, après la micro-entreprise et 20 abonnés.

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
- **TVA.** Aucune TVA n'est facturée : « TVA comprise » disparaît au profit de « Prix finaux » (arbitrage n° 2, lot 4.1). Le lot 6.6 reviendra dessus selon le régime.
- **Vos informations personnelles hors du dépôt.** Le dépôt est public et garde tout son historique. Votre nom apparaît dans les textes légaux, par une variable Vercel saisie par vous ; votre adresse et votre téléphone n'apparaissent nulle part (décision du 21 octobre, lot 4.9).
- **Les bêta-testeurs** : Essentiel offert 3 mois par un code Stripe, carte demandée, puis le prix fondateur (arbitrage n° 3, lot 4.5).
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

Les décisions déjà prises sont dans `docs-internes/decisions/` : connecteurs, tarifs, positionnement, commercialisation, et les arbitrages entre elles.
