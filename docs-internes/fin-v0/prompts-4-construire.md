# Étape 4 : construire, un lot par session Claude Code

## Pour chaque lot

Chaque lot se lance dans une **nouvelle session Claude Code dans le cloud** (claude.ai/code, dépôt PULSACITY), avec son prompt court, plus les fichiers qu'il nomme (ZIP de Claude Design). Les décisions sont dans le dépôt, `docs-internes/decisions/` : rien d'autre à coller.

À chaque lot, en plus de sa tâche, Claude Code :
1. lit CLAUDE.md, docs-internes/etat.md, docs-internes/fin-v0/README.md, ce fichier (« Pour chaque lot » et la section du lot), et docs-internes/decisions/ ;
2. signale avant de coder tout ce qui contredit une règle de CLAUDE.md ou une maquette ;
3. développe sur sa branche, et vérifie dans son conteneur : Postgres local, espace de démonstration, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, chaque écran à 360 px et à 1440 px dans Chromium, à côté de sa maquette ;
4. ouvre la PR et la suit jusqu'au vert (CI, GitGuardian) ;
5. livre dans la conversation, en prompts numérotés, d'abord vos actions sur les services, puis la recette sur l'aperçu, avec une copie dans `docs-internes/recette/` ;
6. après votre validation de la recette, fusionne la PR, vous donne le prompt de vérification en production, puis met à jour `etat.md` ;
7. ne touche jamais un service externe avec ses propres accès, ne met dans le dépôt ni secret ni donnée personnelle, et, pour une refonte, ne change pas la logique.

Le prompt court de chaque lot :

```
Lot [N°] — [titre].
Lis d'abord CLAUDE.md, docs-internes/etat.md, docs-internes/fin-v0/README.md, docs-internes/fin-v0/prompts-4-construire.md (« Pour chaque lot » et « Lot [N°] ») et docs-internes/decisions/. Puis fais le lot.
[Je te joins : le ZIP de Claude Design nommé dans la section du lot.]
```

| N° | Lot | Après | ZIP à joindre |
| --- | --- | --- | --- |
| 4.1 | Les décisions appliquées | Maintenant | — |
| 4.1 b | Le connecteur universel, puis le catalogue publié | 4.1 | — |
| 4.2 | Les fondations v2, et le skill UI UX Pro Max | 3.2 | 3.2 |
| 4.3 | Réglages et Mon compte | 3.3, 4.2 | 3.3 |
| 4.4 | Aide et contact | 3.3, 4.2 | 3.3 |
| 4.5 | Abonnement et factures : encaisser | 3.3, 4.2, 2.8 a et b | 3.3 |
| 4.12 | Accueil et acquisition | 3.4, 3.6 | 3.4, 3.6 |
| 4.13 | Les avis en ligne | 3.4, 3.5, 3.6 | 3.4, 3.5, 3.6 |
| 4.6 | L'espace en v2 | 3.4 | 3.4 |
| 4.7 | Le site public en v2 | 3.5, 4.1 b | 3.5 |
| 4.8 | Page de collecte, e-mails et widget en v2 | 3.6 | 3.6 |
| 4.9 | Les textes légaux d'un vendeur particulier | 2.4, 2.6, 2.7 | — |
| 4.10 | Avant le lancement | Le plus de lots possible | — |
| 4.11 | La recette de bout en bout en production | Tout le reste | — |

Le passage à la micro-entreprise n'est pas dans cette étape : c'est le lot 6.6, au seuil (`seuil-micro-entreprise.md`).

---

## Lot 4.1 — Les décisions appliquées

Sources : `decisions/tarifs.md`, `positionnement.md`, `commercialisation.md`, `connecteurs.md`, `arbitrages.md`, et `fin-v0/seuil-micro-entreprise.md`.

1. **CLAUDE.md** :
   - la stratégie : vente en tant que particulier, micro-entreprise au seuil ;
   - la ligne des connecteurs prévus, selon `connecteurs.md` ;
   - le tableau des plans, avec les prix publics et les prix fondateur ;
   - les nouvelles décisions dans « Modèle de données » quand un lot les construit.
2. **`src/config/plans.ts`** : prix publics (1499, 14900, 2499, 24900) et prix fondateur (999, 9900, 1999, 19900), avec leurs tests. Les pages affichent le prix fondateur et la ligne de l'arbitrage n° 1, tant que le prix fondateur est ouvert. Aucune limite n'est codée ailleurs.
3. **Tarifs et accueil, dans la mise en page actuelle** :
   - « Prix finaux : rien ne s'ajoute au paiement » sous le titre de Tarifs ;
   - la nouvelle réponse à « Les prix incluent-ils la TVA ? » ;
   - « TVA comprise » retiré partout (arbitrage n° 2).
4. **Le contenu du catalogue** (`src/content/integrations/`, `src/lib/connectors/upcoming-connectors.ts`), prêt mais pas publié : il sort avec le connecteur universel, au lot 4.1 b.
5. **Les textes généraux qui supposent Systeme.io** sans parler de son connecteur : liste-les dans la PR avec ta proposition neutre, puis applique ce que je valide.
6. **`etat.md`** : les lots 4.12 et 4.13 dans « À faire ».

---

## Lot 4.1 b — Le connecteur universel, puis le catalogue publié

Sources : `decisions/connecteurs.md` (parties « Règles » et « Connecteur universel »). Avant de coder la normalisation, le lot vous donne les prompts Claude in Chrome pour envoyer de vraies ventes de test depuis Make (plan gratuit), n8n et Zapier vers l'adresse de l'aperçu.

1. **Le connecteur universel**, sur le contrat Connector de `src/lib/connectors/types.ts` :
   - une adresse propre à l'espace, comme Systeme.io ; JSON et formulaire ; réponse rapide ;
   - rien de créé deux fois pour la même référence ;
   - les champs email (obligatoire), prenom, nom, offre, date, montant, devise, reference ;
   - une offre inconnue passe en « offres à associer ».
   Selon la règle n° 1 de CLAUDE.md : d'abord l'adresse qui enregistre le brut, puis les envois de test capturés dans `docs-internes/connectors/universel.md` et transformés en fixtures, puis seulement la normalisation.
2. **Le dédoublonnage entre connecteurs** : un même client (même e-mail) reçu par deux connecteurs dans les 48 heures ne crée qu'une demande ; on garde la vente dont l'offre est associée. Avec ses tests, et un point de recette.
3. **Sa page dans l'espace**, sur le modèle de la page Systeme.io (m5), et **ses guides** : Zapier, Make (voie gratuite), n8n, Podia. Tant que les maquettes v2 n'existent pas, ils reprennent les maquettes v1 des connecteurs et des guides (m5, m21, m22) ; dis-moi s'il manque un écran.
4. **L'app Make privée**, partagée par lien : ce que je dois faire chez Make, en prompts Claude in Chrome.
5. **Le catalogue publié** :
   - les 19 outils de `connecteurs.md`, chaque fiche « Bientôt » avec « En attendant : avec Zapier ou Make », dans les listes actuelles (m21-01, m5-01) ;
   - le regroupement en familles viendra avec les maquettes v2 (lots 4.6 et 4.7) ;
   - le poids de « Me prévenir » (3 pour un créateur connecté, 1 pour un visiteur) se lit par une requête documentée.

Checklist : tests de normalisation à partir des captures réelles, du doublon de référence et du dédoublonnage ; aucun lien mort ; espaces insécables gardés par leur test.

---

## Lot 4.2 — Les fondations v2, et le skill UI UX Pro Max

ZIP à joindre : celui du prompt 3.2 (charte-v2.md, logo et sa spécification, planches de la charte et des coques).

1. **Le ZIP** se range dans `docs-internes/design-v2/` : charte.md, maquettes/ avec son INDEX.md, identite/ pour le logo et sa spécification. Les fichiers v1 restent où ils sont.
2. **CLAUDE.md**, partie « Design system » :
   - la v2 devient la source ;
   - un écran pas encore migré garde sa mise en page v1, avec les jetons v2 ;
   - les règles ne changent pas : aucune valeur inventée, aucun écran sans maquette, interdits permanents.
3. **Les jetons v2 partout, d'un coup** : couleurs, polices (next/font), tailles, espacements, rayons, ombres. Les mises en page suivent écran par écran.
4. **Les composants de base**, avec tous leurs états : boutons, champs, listes déroulantes, cases, badges, bandeaux, fenêtres de dialogue et leur voile (la question ouverte des 12 % et 48 % se règle ici), menus, onglets.
5. **L'identité** : le logo, le favicon, les icônes d'application, le symbole des e-mails, « Propulsé par », les polices des images de partage (`assets/og-fonts/`).
6. **Les coques** : en-tête, menu et pied de page du site ; navigation, onglets, menu du compte et « Plus » de l'espace.
7. **Le skill UI UX Pro Max** (github.com/nextlevelbuilder/ui-ux-pro-max-skill, licence MIT) :
   - il va dans `.claude/skills/ui-ux-pro-max/`, figé sur sa dernière version publiée, avec sa licence ;
   - lis-le en entier avant de l'ajouter (aucun appel réseau, aucune installation) ;
   - dans CLAUDE.md, la règle de son usage : règles UX et d'accessibilité (`--domain ux`, `--stack nextjs`, `--stack shadcn`) et liste de contrôle avant livraison. Jamais son générateur (`--design-system`, `--persist`), ni ses palettes, ses polices ou ses styles.

Checklist :
- chaque adresse du site et de l'espace s'affiche sans casse à 360 px et à 1440 px (balayage de captures joint à la PR) ;
- la liste de contrôle de `pro-rules.md` passée sur les composants et les coques ;
- Lighthouse ≥ 90 en performance et 100 en accessibilité sur l'accueil, les tarifs et l'accueil de l'espace ;
- le widget et les e-mails ne changent pas dans ce lot.

---

## Lot 4.3 — Réglages et Mon compte

ZIP à joindre : celui du prompt 3.3. Selon les maquettes v2 et `fin-v0/inventaire-ecrans.md` (8.1, 8.2).

1. **Réglages** (`/app/reglages`) :
   - nom, logo, couleur d'accent et son alerte de contraste ;
   - adresse publique (selon la maquette) ;
   - adresse de réponse, adresse postale de l'expéditeur ;
   - notifications ;
   - la case « J'offre une contrepartie à mes clients » (avis en ligne, point 7 de `positionnement.md`).
2. **Mon compte**, à l'adresse que donne la maquette :
   - l'adresse de connexion, changée par un lien de confirmation envoyé à la nouvelle adresse ;
   - le prénom ;
   - les appareils connectés, et la déconnexion des autres ;
   - l'export des données, sans nouvelle dépendance si c'est possible ;
   - la suppression de l'espace (confirmation, suppression en cascade, délai des CGU).
3. **Les liens** « Réglages » et « Mon compte » de la navigation, du menu du compte et de « Plus ».
4. **Le modèle de données** : colonnes et tables nouvelles, facultatives, compatibles avec le code en ligne ; CLAUDE.md à jour.
5. **L'arrêt de l'abonnement** à la suppression viendra au lot 4.5 : prépare le point d'accroche, testé.

Checklist : chaque action vérifie la session et l'appartenance de l'espace ; tests de l'export (complet, et rien d'un autre espace) et de la suppression (rien ne reste, rien d'un autre espace n'est touché).

---

## Lot 4.4 — Aide et contact

ZIP à joindre : celui du prompt 3.3. Une seule adresse sert à tout : contact@pulsacity.com, redirection OVH vers la boîte du fondateur.

1. **`/aide`**, page publique dans la coque du site : questions fréquentes par thème (contenu dans `src/content/`), liens vers les guides.
2. **« Écrivez-nous »** :
   - champs : adresse (déjà remplie si l'on est connecté), sujet, message ;
   - champ piège et limite par adresse IP, comme les autres formulaires publics ;
   - envoi par Resend à contact@pulsacity.com, réponse vers l'expéditeur ;
   - rien n'est gardé en base, et la politique de confidentialité le dit.
3. **Les liens** :
   - « Aide et contact » du menu du compte et de « Plus » ;
   - « Contact » du pied de page, vers /aide#contact ;
   - « Écrivez-nous » de m21 et de m22, et la section 10 de l'accueil v2 ;
   - « Bloquée à une étape ? Écrivez-nous » du guide sur téléphone ;
   - le plan du site.

Checklist : tests du formulaire (refus, limite, envoi) ; en recette, un vrai message envoyé depuis l'aperçu arrive dans la boîte du fondateur.

---

## Lot 4.5 — Abonnement et factures : encaisser

ZIP à joindre : celui du prompt 3.3. Le fondateur encaisse en tant que particulier ; le compte Stripe est ouvert et réglé en mode test (2.8 a et b). Sources : `decisions/tarifs.md` et `arbitrages.md` (1 à 4).

1. **Les actions du fondateur sur Stripe**, en prompts Claude in Chrome avec les valeurs exactes :
   - les prix publics et les prix fondateur, mensuels et annuels, en euros, `tax_behavior: "inclusive"`, Stripe Tax désactivé ;
   - le portail client ; les relances des paiements échoués ;
   - le code des bêta-testeurs (100 % pendant 3 mois, carte demandée) ;
   - le webhook vers l'aperçu (protégé par Vercel Authentication : le contournement que Vercel propose pour l'automatisation) ;
   - les variables d'environnement : le fondateur copie et colle les secrets lui-même.
2. **Le paiement par Stripe Checkout**, depuis /app/facturation et depuis /tarifs (inscription d'abord pour qui n'a pas d'espace), avec le retour sur chaque état de la maquette.
3. **Le prix fondateur** : les 100 premiers abonnés payants et les bêta-testeurs le reçoivent, et l'espace le garde tant que l'abonnement ne s'interrompt pas. Au centième, les pages passent aux prix publics (arbitrage n° 1).
4. **`/api/stripe/webhook`** : signature vérifiée, idempotence par stripe_events, plan de l'espace mis à jour. Les vrais événements du mode test sont d'abord capturés, puis transformés en fixtures, comme pour un connecteur.
5. **`/app/facturation`** : chaque état de la maquette, le portail Stripe, le bandeau de paiement échoué dans tout l'espace.
6. **Les règles de changement de plan** de `tarifs.md` :
   - au retour au Gratuit, un widget reste actif et les autres ne s'affichent plus, sans saut de mise en page ;
   - au-delà de 15 témoignages validés, le widget en montre 15 ;
   - le badge revient à la fin de la période Pro ;
   - les demandes au-delà de 20 par mois gardent le comportement en place (arbitrage n° 4) ;
   - rien n'est jamais supprimé.
7. **L'e-mail de rappel**, 7 jours avant le premier prélèvement d'un bêta-testeur.
8. **La suppression de l'espace** (lot 4.3) arrête l'abonnement.
9. **Le suivi du seuil** (`fin-v0/seuil-micro-entreprise.md`) : une requête documentée qui donne les trois repères (clients payants, mois de suite avec des paiements, total encaissé), et le nombre de cartes de bêta-testeurs enregistrées.
10. **Le passage en mode réel**, en prompts, seulement quand les lots 4.4 et 4.9 sont en ligne, que Vercel est en Pro et que le compte Stripe est activé (2.8 c) :
    - produits et prix réels, webhook de production, variables de production ;
    - puis un vrai paiement du fondateur, remboursé ensuite.

Checklist :
- tests des événements : création, renouvellement, échec, résiliation, changement de plan, code promotionnel, prix fondateur, doublon ;
- plans.ts reste la seule source des limites et des prix ; le lien entre prix Stripe et plan est testé ;
- recette avec les cartes de test de Stripe : réussite, 3D Secure, refus.

---

## Lot 4.12 — Accueil et acquisition

ZIP à joindre : ceux des prompts 3.4 (question de la source à l'inscription) et 3.6 (e-mails d'accueil, image de partage). Source : `decisions/commercialisation.md` (« Produit, par priorité », « Outil de mesure »).

**Avant la bêta :**
1. **La source d'inscription** : UTM, liens courts `/go/…`, code de parrainage, et la question « Comment avez-vous connu PULSACITY ? ». La source passe dans l'adresse, survit au lien de connexion par e-mail, et s'enregistre côté serveur à la création de l'espace. Rien n'est stocké sur l'appareil.
2. **Les e-mails d'accueil** J0, J1, J3 et J7, chacun arrêté quand son étape est faite (offre créée, outil connecté, widget affiché). Envoyés par la tâche planifiée existante, idempotents, avec désinscription.
3. **La requête « tableau de bord fondateur »**, à lancer dans Supabase par prompt :
   - inscriptions par source ;
   - activation : outil connecté ou CSV importé sous 7 jours ;
   - espaces dont le widget a été chargé dans les 7 derniers jours ;
   - témoignages validés par espace actif ;
   - abonnés et revenu ;
   - repères du seuil ;
   - espaces dont le widget est affiché depuis 21 jours, pour l'avis des bêta-testeurs (arbitrage n° 10).
4. **L'espace PULSACITY et son mur sur pulsacity.com** :
   - le fondateur crée l'espace lui-même ;
   - le lot affiche son widget sur l'accueil et son badge sur Tarifs, seulement quand il a assez de vrais avis, avec la mention « Bêta-testeur · plan Essentiel offert pendant la bêta » ;
   - aucun avis inventé.
5. **La mesure d'audience Umami Cloud**, sans cookie : le fondateur crée le compte ; le lot ajoute le script, les événements utiles et la ligne de la politique de confidentialité.

**Avant le lancement :**

6. **Le parrainage** : un mois d'Essentiel offert au parrain par filleul payant, par un crédit ou un coupon Stripe, sans argent versé.
7. **Les codes promotionnels par partenaire**, suivis.
8. **L'image de partage d'un témoignage validé** (`next/og`).
9. **Resend Pro** avant le lancement : prompt pour le fondateur.

Checklist : tests de la source (jusqu'à la création de l'espace), des e-mails d'accueil (arrêt à l'étape faite, jamais deux fois) et du parrainage ; aucune donnée personnelle dans les requêtes enregistrées.

---

## Lot 4.13 — Les avis en ligne

ZIP à joindre : ceux des prompts 3.4, 3.5 et 3.6. Source : `decisions/positionnement.md` (« Avis de vrais clients : position », points 1 à 7) et `arbitrages.md` (n° 6).

1. **La provenance de chaque témoignage** : vente reçue, demande manuelle, ajout, import ou lien public. Seule la vente reçue pourra porter une mention de vérification.
2. **La date de l'avis et le mois de l'achat** sur chaque témoignage du widget.
3. **Le lien « À propos de ces avis »** sur tous les plans, Pro compris, distinct du badge. Il mène à une page publique (maquette 3.5) : contrôle, contrepartie, modification, ordre d'affichage, motifs de refus.
4. **« Corriger le texte affiché »** : la correction part à l'accord du client par e-mail, et l'original est gardé. Sans accord, seul le masquage d'un nom ou d'une coordonnée reste permis.
5. **La note du badge** se calcule sur tous les avis reçus, sauf ceux refusés pour un motif déclaré. Le mur et le carrousel annoncent leur sélection.
6. **« Masquer » demande un motif**, transmis au client. La forme sera confirmée par un juriste (6.7).
7. **La contrepartie** : affichée si la case de Réglages est cochée (lot 4.3), et pour les bêta-testeurs.

Checklist :
- tests de chaque règle : provenance, note du badge, correction avec et sans accord, motif transmis ;
- w.js reste sous 30 Ko compressé ;
- aucune mention « avis vérifiés », ni de vérification, avant que le point 1 soit en ligne.

---

## Lot 4.6 — L'espace en v2

ZIP à joindre : celui du prompt 3.4.

1. Chaque écran de l'espace et du démarrage (`fin-v0/inventaire-ecrans.md`, parties 2, 3 et 7) selon sa maquette v2, avec tous ses états.
2. La logique, les textes et les tests ne changent pas.
3. En deux ou trois PR si c'est plus sûr :
   - accueil, témoignages, ajout et import ;
   - offres, widgets et éditeur ;
   - connecteurs (en familles), demandes, connexion et démarrage.

Checklist : chaque écran à 360 px et à 1440 px à côté de sa maquette v2 (captures jointes) ; un test ne change que pour un texte ou un sélecteur, et chaque changement est justifié ; Lighthouse ≥ 90 et accessibilité 100 sur l'accueil de l'espace.

---

## Lot 4.7 — Le site public en v2

ZIP à joindre : celui du prompt 3.5. Sources : `decisions/positionnement.md` (textes, référencement), `connecteurs.md`, `tarifs.md` et `arbitrages.md` (1, 2). Le connecteur universel est en ligne (4.1 b).

1. **La page d'accueil v2**, avec les textes de `positionnement.md`, corrigés par les arbitrages 1 et 2 :
   - la démo « Écrire un avis de test », sans envoi au serveur ;
   - la barre fixe sur téléphone ;
   - le grand titre « Vous vendez. PULSACITY demande l'avis. »
2. **Les autres pages** :
   - Tarifs, avec le prix fondateur ;
   - Intégrations, et le catalogue en six familles ;
   - les pages des intégrations, Guides, les pages légales, les pages d'erreur, le menu ;
   - la page « À propos de ces avis », si le lot 4.13 ne l'a pas déjà faite.
3. **Le modèle v2 des images de partage.**
4. **Le référencement** : titres et descriptions de `positionnement.md`, plan du site, données structurées.

Checklist : Lighthouse ≥ 90 en performance et 100 en accessibilité sur chaque page, /integrations/systeme-io compris ; aucun lien mort ; espaces insécables gardés par leur test ; aucun interdit ; « Exemple, avis fictifs » sous chaque exemple.

---

## Lot 4.8 — Page de collecte, e-mails et widget en v2

ZIP à joindre : celui du prompt 3.6.

1. **La page de collecte** et la désinscription.
2. **Les e-mails** :
   - demande, relance, version texte ;
   - « Votre lien », « Nouveau témoignage », « Code du widget » ;
   - les e-mails d'accueil, s'ils ne sont pas déjà en v2.
3. **Le widget** : mur, carrousel, badge ; clair, sombre, automatique ; chargements ; date de l'avis et lien « À propos de ces avis » (lot 4.13).

Checklist : w.js reste un seul fichier de moins de 30 Ko compressé, sans dépendance, dans son Shadow DOM, avec la police de la page hôte ; tests de rendu du widget (jsdom) et des e-mails ; recette sur une vraie page Systeme.io, et dans Gmail, Outlook et Apple Mail.

---

## Lot 4.9 — Les textes légaux d'un vendeur particulier

À joindre au message : les textes réécrits du compte rendu 2.7, les informations du prompt 2.6, sans vos informations personnelles, et le tableau du compte rendu 2.4.

1. **Vos informations personnelles** (nom, adresse, téléphone) :
   - elles viennent de variables d'environnement que vous saisissez vous-même dans Vercel, jamais du dépôt ;
   - le lot vous donne le prompt Claude in Chrome pour les saisir, les ajoute à la liste des variables de CLAUDE.md, et prévoit l'affichage quand elles manquent (aperçus).
2. **Les quatre textes, selon 2.7** : mentions légales, CGV, CGU avec leur annexe, politique de confidentialité.
   - Plus aucun « [À COMPLÉTER] ».
   - Une seule adresse partout : contact@pulsacity.com.
   - Les CGV disent la règle des hausses de prix de `tarifs.md`, et la mesure d'audience est citée.
3. **La mise en ligne**, quand vous confirmez que vous validez les textes : le prompt pour passer LEGAL_VALIDATED à true en production, puis la vérification (bandeau retiré, pages indexables, plan du site).

Checklist : liens internes et ancres vérifiés ; aucune donnée personnelle dans le dépôt.

---

## Lot 4.10 — Avant le lancement

Chaque point avec ses prompts pour vos actions :
1. **L'envoi des demandes toutes les 15 minutes** : Vercel est en Pro (vous vous y abonnez avant le premier paiement), l'envoi passe par Vercel Cron, et le workflow GitHub « Send review requests » est retiré.
2. **Sentry, en région européenne** : vous créez le projet et collez SENTRY_DSN dans Vercel ; le lot branche le suivi des erreurs.
3. **Les photos servies depuis une adresse à nous** plutôt que r2.dev, par une solution qui ne touche pas au DNS de la messagerie (MX, SPF).
4. **Google Search Console** :
   - vérification par un enregistrement TXT chez OVH, sans toucher MX ni SPF ;
   - envoi du plan du site ;
   - suivi de l'Organization.
5. **L'effacement des données de test** de la production, par une requête que vous relisez avant de la lancer.
6. **La purge des notifications traitées** de plus de 90 jours (arbitrage n° 5).
7. **Les offres de Supabase et de Resend** face aux volumes de `tarifs.md`, et une surveillance gratuite de la disponibilité du site.
8. **Les autres points ouverts de « À faire »** (essais au doigt, captures de Systeme.io, « Vente annulée », dépôt public ou privé) : leur liste, avec ce que vous avez à faire pour chacun.

---

## Lot 4.11 — La recette de bout en bout en production

La recette complète sur pulsacity.com, en prompts Claude in Chrome dans l'ordre, avec vos comptes de test (vous les créez vous-même) :
1. Inscription par un lien suivi (source enregistrée), espace, offres, e-mails d'accueil.
2. Connexion de Systeme.io puis du connecteur universel (depuis Make), vente de test, demande partie au délai de 0 jour, avis laissé sur téléphone, validation, widget sur une vraie page Systeme.io, avec la date et « À propos de ces avis ».
3. Passage à Essentiel avec votre carte, au prix fondateur, reçu, portail, passage à l'annuel, résiliation programmée, puis remboursement ; un code de bêta-testeur.
4. Réglages, Mon compte, export, puis suppression d'un second espace de test.
5. Aide et contact, pages légales validées, mesure d'audience, une erreur de test dans Sentry, envoi toutes les 15 minutes, requête du tableau de bord fondateur.
6. Les mêmes parcours sur votre téléphone, pour ce qui se teste au doigt.

Puis le compte rendu final : ce qui bloque le lancement, et ce qui peut attendre.
