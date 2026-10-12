# Étape 4 : construire, un lot par session Claude Code

## Pour chaque lot

Chaque prompt se colle dans une nouvelle session Claude Code dans le cloud (claude.ai/code, dépôt PULSACITY), avec les fichiers qu'il nomme : ZIP de Claude Design, comptes rendus de Claude Chat. Une ligne entre crochets est à remplacer par ce qu'elle dit.

À chaque lot, en plus de sa tâche, Claude Code :
1. lit CLAUDE.md, docs-internes/etat.md, docs-internes/fin-v0/README.md et ce fichier ;
2. développe sur sa branche, et vérifie dans son conteneur : Postgres local, espace de démonstration, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, chaque écran à 360 px et à 1440 px dans Chromium, à côté de sa maquette ;
3. ouvre la PR et la suit jusqu'au vert (CI, GitGuardian) ;
4. livre dans la conversation, en prompts numérotés, d'abord vos actions sur les services, puis la recette sur l'aperçu, avec une copie dans `docs-internes/recette/` ;
5. après votre validation de la recette, fusionne la PR, vous donne le prompt de vérification en production, puis met à jour `etat.md` ;
6. ne touche jamais un service externe avec ses propres accès, ne met dans le dépôt ni secret ni donnée personnelle, et, pour une refonte, ne change pas la logique.

| N° | Lot | Après |
| --- | --- | --- |
| 4.1 | Les décisions de l'étape 1 dans le dépôt | 1.1 à 1.6 |
| 4.1 b | Le connecteur universel, puis le catalogue publié | 4.1 |
| 4.2 | Les fondations v2, et le skill UI UX Pro Max dans le dépôt | 3.2 |
| 4.3 | Réglages et Mon compte | 3.3 |
| 4.4 | Aide et contact | 3.3 |
| 4.5 | Abonnement et factures : encaisser | 3.3, 1.3, 2.8 a et b |
| 4.6 | L'espace en v2 | 3.4 |
| 4.7 | Le site public en v2 | 3.5, 4.1 |
| 4.8 | Page de collecte, e-mails et widget en v2 | 3.6, 2.7 |
| 4.9 | Les textes légaux d'un vendeur particulier | 1.1, 2.4, 2.6, 2.7 |
| 4.10 | Avant le lancement | 1.6, et le plus de lots possible |
| 4.11 | La recette de bout en bout en production | Tout le reste |

Le passage à la micro-entreprise n'est pas dans cette étape : c'est le lot 6.6, au seuil (`seuil-micro-entreprise.md`).

---

## 4.1 Les décisions de l'étape 1 dans le dépôt

```
Lot 4.1 — Les décisions de l'étape 1 dans le dépôt.

Lis d'abord CLAUDE.md, docs-internes/etat.md, docs-internes/fin-v0/README.md et docs-internes/fin-v0/prompts-4-construire.md (« Pour chaque lot »). Le catalogue des connecteurs est déjà dans docs-internes/decisions/connecteurs.md.

Voici les comptes rendus de Claude Chat :
[Compte rendu 1.1 (encaisser sans entreprise)]
[Compte rendu 1.3]
[Compte rendu 1.5]
[Compte rendu 1.6]

À faire :
1. Range les décisions dans docs-internes/decisions/, un fichier par sujet, sans aucune donnée personnelle : encaisser sans entreprise (1.1, et le seuil de docs-internes/fin-v0/seuil-micro-entreprise.md s'il change), tarifs (1.3, en mettant aussi à jour decision_tarifs.md), positionnement et textes de la page d'accueil (1.5), commercialisation (1.6). Avant d'écrire, signale-moi tout ce qui contredit une règle de CLAUDE.md.
2. CLAUDE.md suit la stratégie : vente en tant que particulier, micro-entreprise au seuil ; la ligne des connecteurs prévus, selon connecteurs.md.
3. Si 1.3 change des prix ou des limites : src/config/plans.ts, ses tests, et les textes qui citent un prix. Aucune limite n'est codée ailleurs.
4. La question « Les prix incluent-ils la TVA ? » de /tarifs, selon 1.1 : sans entreprise, aucune TVA n'est facturée.
5. Le contenu du catalogue (src/content/integrations/, src/lib/connectors/upcoming-connectors.ts), prêt mais pas encore publié : il sort avec le connecteur universel, au lot 4.1 b.
6. Les textes généraux qui supposent Systeme.io sans parler de son connecteur : liste-les dans la PR avec ta proposition neutre, puis applique ce que je valide.
7. etat.md : ce que le produit doit offrir selon 1.6, par priorité, dans « À faire ».
```

---

## 4.1 b Le connecteur universel, puis le catalogue publié

Avant ce lot, des captures : le lot vous donne d'abord les prompts Claude in Chrome pour envoyer de vraies ventes de test depuis Make (plan gratuit), n8n et Zapier vers l'adresse de capture de l'aperçu.

```
Lot 4.1 b — Le connecteur universel, puis le catalogue publié.

Lis d'abord CLAUDE.md, docs-internes/etat.md, docs-internes/fin-v0/README.md, docs-internes/fin-v0/prompts-4-construire.md (« Pour chaque lot ») et docs-internes/decisions/connecteurs.md (parties « Règles » et « Connecteur universel »).

À faire :
1. Le connecteur universel, sur le contrat Connector de src/lib/connectors/types.ts : une adresse propre à l'espace, comme Systeme.io ; JSON et formulaire ; réponse rapide ; rien de créé deux fois pour la même référence ; les champs email (obligatoire), prenom, nom, offre, date, montant, devise, reference ; une offre inconnue passe en « offres à associer ». Selon la règle n° 1 de CLAUDE.md : d'abord l'adresse qui enregistre le brut, puis mes envois de test depuis Make, n8n et Zapier, capturés dans docs-internes/connectors/universel.md et transformés en fixtures, puis seulement la normalisation.
2. Le dédoublonnage entre connecteurs : un même client (même e-mail) reçu par deux connecteurs dans les 48 heures ne crée qu'une demande ; on garde la vente dont l'offre est associée. Avec ses tests, et un point de recette.
3. Sa page dans l'espace (sur le modèle de la page Systeme.io, m5), et ses guides : Zapier, Make (voie gratuite), n8n, Podia. Tant que les maquettes v2 n'existent pas, ils reprennent les maquettes v1 des connecteurs et des guides (m5, m21, m22) ; dis-moi s'il manque un écran.
4. L'app Make privée, partagée par lien : ce que je dois faire chez Make, en prompts Claude in Chrome.
5. Le catalogue publié : les 19 outils de connecteurs.md, chaque fiche « Bientôt » avec « En attendant : avec Zapier ou Make », dans les listes actuelles (m21-01, m5-01). Le regroupement en familles viendra avec les maquettes v2 (lots 4.6 et 4.7). Le poids de « Me prévenir » (3 pour un créateur connecté, 1 pour un visiteur) se lit par une requête documentée.

Checklist : tests de normalisation à partir des captures réelles, du doublon de référence et du dédoublonnage entre connecteurs ; aucun lien mort ; espaces insécables gardés par leur test.
```

---

## 4.2 Les fondations v2, et le skill UI UX Pro Max

```
Lot 4.2 — Les fondations v2, et le skill UI UX Pro Max.

Lis d'abord CLAUDE.md, docs-internes/etat.md, docs-internes/fin-v0/README.md et docs-internes/fin-v0/prompts-4-construire.md (« Pour chaque lot »). Je te joins le ZIP du prompt 3.2 de Claude Design : charte-v2.md, le logo et sa spécification, les planches de la charte et des coques.

À faire :
1. Range le ZIP dans docs-internes/design-v2/ : charte.md, maquettes/ avec son INDEX.md, identite/ pour le logo et sa spécification. Les fichiers v1 restent où ils sont.
2. CLAUDE.md, partie « Design system » : la v2 devient la source. Un écran pas encore migré garde sa mise en page v1, avec les jetons v2. Les règles ne changent pas : aucune valeur inventée, aucun écran sans maquette, interdits permanents.
3. Les jetons v2 partout, d'un coup : couleurs, polices (next/font), tailles, espacements, rayons, ombres. Les mises en page suivent écran par écran, dans les lots 4.6 à 4.8.
4. Les composants de base, avec tous leurs états : boutons, champs, listes déroulantes, cases, badges, bandeaux, fenêtres de dialogue et leur voile (la question ouverte des 12 % et 48 % se règle ici), menus, onglets.
5. Le logo, le favicon, les icônes d'application, le symbole des e-mails, « Propulsé par », les polices des images de partage (assets/og-fonts/).
6. Les coques : en-tête, menu et pied de page du site ; navigation, onglets, menu du compte et page « Plus » de l'espace.
7. Le skill UI UX Pro Max (github.com/nextlevelbuilder/ui-ux-pro-max-skill, licence MIT), dans .claude/skills/ui-ux-pro-max/, figé sur sa dernière version publiée, avec sa licence. Lis-le en entier avant de l'ajouter (aucun appel réseau, aucune installation). Puis, dans CLAUDE.md, la règle de son usage : il sert aux règles UX et d'accessibilité (recherches --domain ux, --stack nextjs, --stack shadcn) et à sa liste de contrôle avant livraison ; jamais son générateur (--design-system, --persist), ni ses palettes, ses polices ou ses styles. La charte v2 reste la seule source des couleurs, des polices et des espacements.

Checklist :
- la liste de contrôle de pro-rules.md passée sur les composants et les coques ;
- chaque adresse du site et de l'espace s'affiche sans casse à 360 px et à 1440 px (balayage de captures joint à la PR) ;
- contrastes de la charte v2 respectés ; Lighthouse ≥ 90 en performance et 100 en accessibilité sur l'accueil, les tarifs et l'accueil de l'espace ;
- le widget et les e-mails ne changent pas dans ce lot (lot 4.8).
```

---

## 4.3 Réglages et Mon compte

```
Lot 4.3 — Réglages et Mon compte.

Lis d'abord CLAUDE.md, docs-internes/etat.md, docs-internes/fin-v0/README.md et docs-internes/fin-v0/prompts-4-construire.md (« Pour chaque lot »). Je te joins le ZIP du prompt 3.3 (écrans à créer).

À faire, selon les maquettes v2 et docs-internes/fin-v0/inventaire-ecrans.md (8.1 et 8.2) :
1. Réglages (/app/reglages) : nom, logo, couleur d'accent et son alerte de contraste, adresse publique (selon la décision de la maquette), adresse de réponse, adresse postale de l'expéditeur, notifications.
2. Mon compte, à l'adresse que donne la maquette : adresse de connexion changée par un lien de confirmation envoyé à la nouvelle adresse ; prénom ; appareils connectés, et déconnexion des autres ; export des données, sans nouvelle dépendance si c'est possible ; suppression de l'espace (confirmation, suppression en cascade, délai des CGU).
3. Les liens « Réglages » et « Mon compte » de la navigation, du menu du compte et de « Plus ».
4. Les colonnes et tables nouvelles restent facultatives et compatibles avec le code en ligne. CLAUDE.md (structure, modèle de données) à jour.
5. L'arrêt de l'abonnement Stripe à la suppression viendra au lot 4.5 : prépare le point d'accroche, testé.

Checklist :
- chaque action vérifie la session et l'appartenance de l'espace ;
- tests Vitest des actions, de l'export (complet, et rien d'un autre espace) et de la suppression (rien ne reste, rien d'un autre espace n'est touché) ;
- écrans à 360 px et à 1440 px à côté de leurs maquettes.
```

---

## 4.4 Aide et contact

```
Lot 4.4 — Aide et contact.

Lis d'abord CLAUDE.md, docs-internes/etat.md, docs-internes/fin-v0/README.md et docs-internes/fin-v0/prompts-4-construire.md (« Pour chaque lot »). Je te joins le ZIP du prompt 3.3. Une seule adresse sert à tout : contact@pulsacity.com, une redirection OVH vers ma boîte.

À faire, selon les maquettes v2 et docs-internes/fin-v0/inventaire-ecrans.md (8.4) :
1. /aide, page publique dans la coque du site : questions fréquentes par thème (contenu dans src/content/), liens vers les guides.
2. « Écrivez-nous » : adresse (déjà remplie si l'on est connecté), sujet, message ; champ piège et limite par adresse IP, comme les autres formulaires publics ; envoi par Resend à contact@pulsacity.com, réponse vers l'expéditeur ; rien n'est gardé en base, et la politique de confidentialité le dit.
3. Les liens : « Aide et contact » du menu du compte et de « Plus » ; « Contact » du pied de page, vers /aide#contact ; « Écrivez-nous » de m21 et de m22 ; la ligne « Bloquée à une étape ? Écrivez-nous » du guide sur téléphone ; le plan du site.

Checklist : tests du formulaire (refus, limite, envoi) ; en recette, un vrai message envoyé depuis l'aperçu arrive dans ma boîte ; aucun lien mort.
```

---

## 4.5 Abonnement et factures : encaisser

```
Lot 4.5 — Abonnement et factures : encaisser.

Lis d'abord CLAUDE.md, docs-internes/etat.md, docs-internes/fin-v0/README.md et docs-internes/fin-v0/prompts-4-construire.md (« Pour chaque lot »). Je te joins le ZIP du prompt 3.3 et les comptes rendus 1.1 (Stripe et TVA pour un particulier) et 1.3 (prix, règle du plan inférieur, offre aux bêta-testeurs). J'encaisse en tant que particulier ; le compte Stripe est ouvert et réglé en mode test (prompts 2.8 a et b).

À faire, en mode test d'abord, selon les maquettes v2 et docs-internes/fin-v0/inventaire-ecrans.md (8.3) :
1. Mes actions sur Stripe, en prompts Claude in Chrome, avec les valeurs exactes : produits et prix (mêmes montants que plans.ts, sans TVA facturée), portail client, relances des paiements échoués, un code promotionnel pour les bêta-testeurs, webhook vers l'aperçu (protégé par Vercel Authentication : prévois le contournement que Vercel propose pour l'automatisation), variables d'environnement (je copie et colle les secrets moi-même).
2. Le paiement par Stripe Checkout, depuis /app/facturation et depuis /tarifs (inscription d'abord pour qui n'a pas d'espace), avec le retour sur chaque état de la maquette.
3. /api/stripe/webhook : signature vérifiée, idempotence par stripe_events, plan de l'espace mis à jour. Les vrais événements du mode test sont d'abord capturés, puis transformés en fixtures, comme pour un connecteur.
4. /app/facturation : chaque état de la maquette, le portail Stripe, le bandeau de paiement échoué dans tout l'espace, la règle du plan inférieur. Rien n'est jamais supprimé.
5. La suppression de l'espace (lot 4.3) arrête l'abonnement.
6. Le suivi du seuil (docs-internes/fin-v0/seuil-micro-entreprise.md) : une requête documentée qui donne les trois repères (clients payants, mois de suite avec des paiements, total encaissé).
7. Le passage en mode réel, en prompts, à lancer seulement quand les lots 4.4 et 4.9 sont en ligne, que Vercel est en Pro et que le compte Stripe est activé (2.8 c) : produits et prix réels, webhook de production, variables de production, puis un vrai paiement de ma part, remboursé ensuite.

Checklist :
- tests des événements : création, renouvellement, échec, résiliation, changement de plan, code promotionnel, doublon ;
- plans.ts reste la seule source des limites ; le lien entre prix Stripe et plan est testé ;
- recette avec les cartes de test de Stripe : réussite, 3D Secure, refus.
```

---

## 4.6 L'espace en v2

```
Lot 4.6 — L'espace en v2.

Lis d'abord CLAUDE.md, docs-internes/etat.md, docs-internes/fin-v0/README.md et docs-internes/fin-v0/prompts-4-construire.md (« Pour chaque lot »). Je te joins le ZIP du prompt 3.4.

À faire : chaque écran de l'espace et du démarrage (docs-internes/fin-v0/inventaire-ecrans.md, parties 2, 3 et 7) selon sa maquette v2, avec tous ses états. La logique, les textes et les tests ne changent pas. En deux ou trois PR si c'est plus sûr : accueil, témoignages, ajout et import ; offres, widgets et éditeur ; connecteurs, demandes, connexion et démarrage.

Checklist :
- chaque écran à 360 px et à 1440 px à côté de sa maquette v2, captures jointes à la PR ;
- un test ne change que pour un texte ou un sélecteur, et chaque changement est justifié ;
- Lighthouse ≥ 90 en performance et 100 en accessibilité sur l'accueil de l'espace.
```

---

## 4.7 Le site public en v2

```
Lot 4.7 — Le site public en v2.

Lis d'abord CLAUDE.md, docs-internes/etat.md, docs-internes/fin-v0/README.md et docs-internes/fin-v0/prompts-4-construire.md (« Pour chaque lot »). Je te joins le ZIP du prompt 3.5. Les décisions de 1.2 et de 1.5 sont dans docs-internes/decisions/ (lot 4.1).

À faire, selon les maquettes v2 :
1. La page d'accueil v2, avec les textes de 1.5.
2. Tarifs ; Intégrations et le catalogue par familles ; les pages des intégrations ; Guides ; les pages légales ; les pages d'erreur ; le menu.
3. Le modèle v2 des images de partage.
Systeme.io devient un outil parmi d'autres. Le référencement reste : titres, descriptions, plan du site, données structurées.

Checklist :
- Lighthouse ≥ 90 en performance et 100 en accessibilité sur chaque page, /integrations/systeme-io compris (point 8 de « À faire ») ;
- aucun lien mort ; espaces insécables gardés par leur test ; aucun interdit.
```

---

## 4.8 Page de collecte, e-mails et widget en v2

```
Lot 4.8 — Page de collecte, e-mails et widget en v2.

Lis d'abord CLAUDE.md, docs-internes/etat.md, docs-internes/fin-v0/README.md et docs-internes/fin-v0/prompts-4-construire.md (« Pour chaque lot »). Je te joins le ZIP du prompt 3.6, et le compte rendu 2.7 (avis en ligne).

À faire, selon les maquettes v2 :
1. La page de collecte et la désinscription.
2. Les e-mails : demande, relance, version texte, « Votre lien », « Nouveau témoignage », « Code du widget ».
3. Le widget : mur, carrousel, badge ; clair, sombre, automatique ; chargements.
4. Ce que 2.7 demande pour les avis en ligne, s'il faut une mention dans le widget ou sur la page de collecte : propose-le-moi d'abord, avec sa maquette.

Checklist :
- w.js reste un seul fichier de moins de 30 Ko compressé, sans dépendance, dans son Shadow DOM, avec la police de la page hôte ;
- tests de rendu du widget (jsdom) et des e-mails ;
- recette sur une vraie page Systeme.io, et dans Gmail, Outlook et Apple Mail.
```

---

## 4.9 Les textes légaux d'un vendeur particulier

```
Lot 4.9 — Les textes légaux d'un vendeur particulier.

Lis d'abord CLAUDE.md, docs-internes/etat.md, docs-internes/fin-v0/README.md et docs-internes/fin-v0/prompts-4-construire.md (« Pour chaque lot »). Je te joins le compte rendu 1.1, les textes réécrits du compte rendu 2.7 et les informations du prompt 2.6, sans mes informations personnelles.

À faire :
1. Mes informations personnelles (nom, adresse, téléphone, selon 1.1) viennent de variables d'environnement que je saisis moi-même dans Vercel, jamais du dépôt. Donne-moi le prompt Claude in Chrome pour les saisir, ajoute-les à la liste des variables de CLAUDE.md, et prévois l'affichage quand elles manquent (aperçus).
2. Les mentions légales, les CGV, les CGU avec leur annexe, et la politique de confidentialité, selon 2.7. Plus aucun « [À COMPLÉTER] ». Une seule adresse partout : contact@pulsacity.com.
3. Quand je confirme que je valide les textes : le prompt pour passer LEGAL_VALIDATED à true en production, puis la vérification (bandeau retiré, pages indexables, plan du site).

Checklist : liens internes et ancres vérifiés ; aucune donnée personnelle dans le dépôt ; espaces insécables gardés par leur test.
```

---

## 4.10 Avant le lancement

```
Lot 4.10 — Avant le lancement.

Lis d'abord CLAUDE.md, docs-internes/etat.md (« À faire »), docs-internes/fin-v0/README.md et docs-internes/fin-v0/prompts-4-construire.md (« Pour chaque lot »). Je te joins le compte rendu 1.6 (outil de mesure d'audience).

À faire, chaque point avec ses prompts pour mes actions :
1. Vercel est en Pro (je m'y abonne avant le premier paiement) : l'envoi des demandes toutes les 15 minutes par Vercel Cron, et le retrait du workflow GitHub « Send review requests ».
2. Sentry, sur son offre gratuite, en région européenne : je crée le projet et colle SENTRY_DSN dans Vercel ; tu branches le suivi des erreurs.
3. Les photos servies depuis une adresse à nous plutôt que r2.dev, par une solution qui ne touche pas au DNS de la messagerie (MX, SPF).
4. La mesure d'audience sans cookie retenue en 1.6 (gratuite si possible), et la politique de confidentialité à jour.
5. Google Search Console : vérification par un enregistrement TXT chez OVH, sans toucher MX ni SPF ; envoi du plan du site ; suivi de l'Organization.
6. L'effacement des données de test de la production, par une requête que je relis avant de la lancer.
7. Les offres gratuites de Supabase et de Resend face aux volumes prévus en 1.3 ; une surveillance gratuite de la disponibilité du site.
8. Les autres points ouverts de « À faire » (essais au doigt, captures de Systeme.io, « Vente annulée », dépôt public ou privé) : leur liste, avec ce que j'ai à faire pour chacun.
```

---

## 4.11 La recette de bout en bout en production

```
Lot 4.11 — La recette de bout en bout en production.

Lis d'abord CLAUDE.md, docs-internes/etat.md, docs-internes/fin-v0/README.md et docs-internes/fin-v0/prompts-4-construire.md (« Pour chaque lot »). Tout le reste est en ligne.

Prépare la recette complète sur pulsacity.com, en prompts Claude in Chrome dans l'ordre, avec mes comptes de test (je les crée moi-même) :
1. Inscription, espace, offres.
2. Connexion de Systeme.io, vente de test, demande partie au délai de 0 jour, avis laissé sur téléphone, validation, widget sur une vraie page Systeme.io.
3. Passage à Essentiel avec ma carte, reçu, portail, passage à l'annuel, résiliation programmée, puis remboursement ; un code promotionnel de bêta-testeur.
4. Réglages, Mon compte, export, puis suppression d'un second espace de test.
5. Aide et contact, pages légales validées, mesure d'audience, une erreur de test dans Sentry, envoi toutes les 15 minutes, la requête du seuil.
6. Les mêmes parcours sur mon téléphone, pour ce qui se teste au doigt.

Puis le compte rendu final : ce qui bloque le lancement, et ce qui peut attendre.
```
