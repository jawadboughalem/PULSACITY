# Étape 2 : créer l'entreprise et compléter le légal

Dans cet ordre :

| N° | Quoi | Qui | Quand |
| --- | --- | --- | --- |
| 2.1 | Immatriculer l'entreprise | Vous, guidé par Claude Chat | Après 1.1 |
| 2.2 | Adresses e-mail professionnelles | Claude in Chrome, chez OVH | Quand vous voulez, même avant 2.1 : rien ne dépend du SIREN |
| 2.3 | Compte bancaire | Vous, aidé par Claude Chat | Pendant l'attente du SIREN |
| 2.4 | Contrats de traitement des prestataires | Claude in Chrome | Pendant l'attente du SIREN |
| 2.5 | Régime de TVA confirmé par écrit | Claude Chat prépare, vous envoyez | Dès que vous avez le SIREN |
| 2.6 | Les informations des textes légaux | Vous, vers Claude Code | Après le SIREN, 2.2, 2.4 et 2.5 |
| 2.7 | Relecture juridique | Claude Chat, puis un juriste | Après 2.6 |
| 2.8 | Compte Stripe : ouverture, réglages, activation | Vous, puis Claude in Chrome | Ouverture et réglages dès 2.1 ; activation après les lots 4.4 et 4.9 |

Les prompts Claude Chat se lancent dans le projet « PULSACITY — Stratégie » (étape 0). Les prompts Claude in Chrome, dans le groupe d'onglets « PULSACITY », après vous être connecté vous-même au service.

---

## 2.1 Immatriculer l'entreprise

Où : Claude Chat, projet « PULSACITY — Stratégie », nouvelle conversation. Le compte rendu 1.1 doit être dans les fichiers du projet.

La démarche se fait sur le guichet unique, formalites.entreprises.gouv.fr. Elle est gratuite pour une micro-entreprise : ne passez par aucun site intermédiaire payant.

```
Prompt 2.1 — Immatriculer mon entreprise, pas à pas.

Contexte : le compte rendu 1.1 (fichiers du projet) fixe le statut, l'activité et le régime de TVA. Je fais moi-même chaque saisie sur le guichet unique, formalites.entreprises.gouv.fr. Toi, tu me guides.

1. Avant de commencer : la liste de ce que je dois avoir sous la main (pièce d'identité, justificatif de domicile ou contrat de domiciliation, attestation de non-condamnation…), et les choix que je devrai faire, avec ta recommandation pour chacun : date de début d'activité, description de l'activité et code APE, nom commercial « PULSACITY », adresse de l'entreprise, option pour le versement libératoire, demande d'ACRE, régime de TVA, déclaration du chiffre d'affaires mensuelle ou trimestrielle.

2. Puis guide-moi écran par écran. À chaque étape, je te dis ce que je vois ; tu me dis quoi choisir ou quoi écrire. Appuie-toi sur la documentation officielle à jour, et préviens-moi quand une réponse peut changer quelque chose d'important.

3. Après l'envoi : les délais, comment suivre le dossier, ce que je reçois (SIREN, avis de situation de l'INSEE), et ce que je fais aussitôt : compte sur autoentrepreneur.urssaf.fr, espace professionnel sur impots.gouv.fr, déclaration initiale de CFE, plateforme de facturation électronique, et le reste de la liste du compte rendu 1.1.

Rappelle-moi que la démarche est gratuite sur le site officiel, et qu'aucun site intermédiaire n'est nécessaire.

Termine par le « Compte rendu pour Claude Code » : la date de dépôt, ce qui reste à recevoir et à faire. Rien d'autre : ni nom, ni adresse, ni numéro.
```

---

## 2.2 Les adresses e-mail professionnelles, chez OVH

Où : Claude in Chrome. Avant ce prompt : connectez-vous vous-même à votre espace client OVHcloud, et gardez votre boîte de réception ouverte dans un autre onglet.

Quatre adresses, gratuites : contact@ (mentions légales), support@ (aide aux créateurs, « Écrivez-nous »), facturation@ (abonnements, réponses aux reçus Stripe), rgpd@ (données personnelles). La configuration du domaine n'est pas touchée : vos e-mails actuels continuent comme avant.

```
Tu m'aides à créer des adresses e-mail professionnelles sur le domaine pulsacity.com, chez OVHcloud, sans rien payer et sans toucher à la configuration du domaine.

Où : https://www.ovh.com/manager/ (je suis connecté), partie « Web Cloud », domaine pulsacity.com, rubrique des e-mails.

Ce qu'il ne faut surtout pas toucher :
- la zone DNS du domaine : enregistrements MX, SPF (TXT), DKIM, DMARC, et tous les autres ;
- les boîtes e-mail existantes, leurs mots de passe et leurs réglages ;
- toute commande, option ou offre payante. Si une étape demande un paiement, arrête-toi et dis-le-moi.

Étapes :
1. Fais l'inventaire, sans rien changer : les boîtes e-mail qui existent sur pulsacity.com (adresse et offre), les redirections et les alias existants. Donne-moi la liste.
2. Dis-moi ce qu'OVH permet gratuitement ici : des alias sur ma boîte existante, ou des redirections vers une adresse de mon choix. Si les deux sont possibles, préfère l'alias : il permet aussi de répondre depuis l'adresse professionnelle. Attends mon accord avant de créer quoi que ce soit.
3. Demande-moi l'adresse de destination, celle où je veux recevoir ces e-mails. Puis crée ces quatre adresses, toutes vers cette destination :
   - contact@pulsacity.com ;
   - support@pulsacity.com ;
   - facturation@pulsacity.com ;
   - rgpd@pulsacity.com.
   Si OVH propose de « conserver une copie », laisse le réglage par défaut.
4. Vérifie que chaque adresse apparaît dans la liste, vers la bonne destination.
5. Dis-moi : « Envoyez un e-mail de test à chacune des quatre adresses depuis une autre boîte, puis dites-moi OK. » Attends mon OK, puis demande-moi si chacun est bien arrivé.

Compte rendu à me donner : la méthode (alias ou redirection), les quatre adresses créées, le résultat de chaque test, et ce qui était déjà en place (le nombre de boîtes, sans leurs adresses). Ni l'adresse de destination, ni aucun mot de passe.
```

---

## 2.3 Le compte bancaire

Où : Claude Chat, projet « PULSACITY — Stratégie », nouvelle conversation. Vous ouvrez le compte vous-même.

```
Prompt 2.3 — Choisir le compte bancaire de l'entreprise.

Contexte : compte rendu 1.1. Je cherche le compte le moins cher, gratuit si possible, pour recevoir les virements de Stripe et payer les services de PULSACITY.

1. La loi m'impose-t-elle un compte dédié, et lequel : un second compte personnel suffit-il, ou faut-il un compte professionnel ?
2. Compare les offres d'octobre 2026, gratuites ou à moins de 10 € par mois, de banques en ligne et traditionnelles : prix, conditions (SIREN demandé, revenus), IBAN français, carte, réception des virements de Stripe, paiements en dollars (Vercel, Resend) et frais de change, export pour la comptabilité, plateforme de facturation électronique incluse ou partenaire.
3. Recommande une offre, et donne la liste de ce que je dois préparer pour l'ouvrir.

Termine par le « Compte rendu pour Claude Code » : le type de compte choisi (personnel dédié ou professionnel) et la date d'ouverture prévue. Ni banque, ni IBAN.
```

---

## 2.4 Les contrats de traitement des prestataires

Où : Claude in Chrome. Avant ce prompt : connectez-vous vous-même à Vercel, Supabase, Resend et Cloudflare (et à Stripe s'il existe déjà).

Ce compte rendu complète les « [À COMPLÉTER : garantie retenue pour chaque prestataire] » de la politique de confidentialité et des CGU.

```
Tu m'aides à vérifier les contrats de traitement des données (DPA) des prestataires de PULSACITY, et les garanties de leurs transferts hors de l'Union européenne. Tu lis : tu ne changes aucun réglage, sauf l'acceptation d'un DPA quand je te la confirme.

Je suis connecté à Vercel, Supabase, Resend et Cloudflare dans ce groupe d'onglets, et à Stripe s'il existe déjà.

Pour chaque prestataire, dans cet ordre : Vercel (hébergement), Supabase (base de données), Resend (envoi des e-mails), Cloudflare (stockage des photos, R2), Stripe (paiements), OVHcloud (domaine et e-mails du fondateur) :
1. Trouve sa page officielle de DPA (« Data Processing Addendum », dans ses pages légales ou dans les réglages du compte). Dis-moi s'il s'applique de lui-même avec les conditions d'utilisation, ou s'il faut l'accepter ou le signer dans le compte. S'il faut l'accepter, montre-moi la page et attends mon accord : c'est moi qui décide.
2. Trouve sa garantie de transfert hors de l'Union : certification au Data Privacy Framework (vérifie l'inscription sur https://www.dataprivacyframework.gov/list, avec le nom exact de la société et la date de ta vérification), clauses contractuelles types de la Commission européenne, ou les deux.
3. Note où sont stockées les données de PULSACITY chez lui, d'après le tableau de bord, sans rien changer. Attendu : Francfort pour Vercel et Supabase, Europe de l'Ouest pour Cloudflare R2, Irlande (eu-west-1) pour Resend.
4. Note l'adresse de la liste de ses sous-traitants ultérieurs.

Ne touche à aucun réglage, aucune région, aucune clé, aucune facturation.

Compte rendu à me donner : un tableau avec, pour chaque prestataire, le nom exact de la société et son pays, ce qu'il traite, le lieu de stockage, le DPA (adresse ; s'applique de lui-même, ou accepté le …), la garantie de transfert (DPF avec la date de vérification ; clauses types), et l'adresse de la liste de ses sous-traitants. Aucun identifiant de compte, aucune clé.
```

---

## 2.5 Le régime de TVA, confirmé par écrit

Où : Claude Chat, projet « PULSACITY — Stratégie », nouvelle conversation.

Le plus simple et gratuit : une question écrite à votre service des impôts des entreprises (SIE), par la messagerie de votre espace professionnel sur impots.gouv.fr, créé après le SIREN. Un expert-comptable reste possible, pour une consultation ponctuelle.

```
Prompt 2.5 — Faire confirmer mon régime de TVA.

Contexte : comptes rendus 1.1 et 1.3. Je veux une réponse écrite et officielle sur mon régime de TVA avant de brancher les paiements, gratuitement si possible.

1. À qui m'adresser : mon service des impôts des entreprises (messagerie de l'espace professionnel impots.gouv.fr, ou téléphone), un expert-comptable (prix d'une consultation ponctuelle), ou un conseil gratuit (CCI, réseaux d'accompagnement). Ce que vaut une réponse écrite du SIE, et ce qu'un rescrit apporterait de plus.
2. Rédige la question à envoyer, courte et précise : mon activité (abonnements à un logiciel en ligne, vendus surtout à des professionnels, en France, dans l'Union et ailleurs), mon statut, mon chiffre d'affaires prévu, et les points à confirmer : franchise en base, numéro de TVA intracommunautaire pour les clients professionnels de l'Union, ventes aux particuliers de l'Union, mentions des factures.
3. Si je choisis un expert-comptable : les questions pour un rendez-vous d'une heure (TVA, cotisations, facturation électronique, déclarations, ce que je peux faire seul).

Quand je reviens avec la réponse, explique-la-moi. Dis ce qu'elle change pour Stripe (taxe collectée ou non, numéro de TVA demandé au paiement) et pour la phrase sur la TVA de la page Tarifs. Puis donne le « Compte rendu pour Claude Code » : le régime confirmé, par qui et quand, la mention exacte des factures, et ce que Stripe doit collecter.
```

---

## 2.6 Les informations des textes légaux

Où : vous, vers Claude Code, au début du lot 4.9.

Le dépôt est public. Votre nom, votre adresse et votre téléphone doivent apparaître sur le site (la loi l'impose), mais pas dans le dépôt, qui garde tout son historique. Proposition du lot 4.9 : ces trois informations, avec le SIREN et le numéro de TVA, viennent de variables d'environnement que vous saisissez vous-même dans Vercel (prompt fourni par le lot). Le reste va dans les textes.

Remplissez ce modèle et envoyez-le à Claude Code. Les lignes « Vercel » ne s'envoient pas : vous les garderez pour le prompt du lot 4.9.

```
Informations pour les textes légaux (lot 4.9)

Mentions légales
- Forme juridique : [entrepreneur individuel (EI), ou forme de société et capital]
- Nom commercial : PULSACITY
- Immatriculation : [registre, d'après le compte rendu 1.1]
- TVA : [« TVA non applicable, art. 293 B du CGI », ou « numéro de TVA intracommunautaire » (le numéro lui-même : Vercel)]
- Directeur de la publication : [qualité, par exemple « l'entrepreneur » (le nom : Vercel)]
- E-mail de contact : contact@pulsacity.com
- Vercel : nom et prénom, adresse, téléphone, SIREN, numéro de TVA s'il y en a un

Confidentialité
- E-mail pour les données personnelles : rgpd@pulsacity.com
- Délai de suppression après la fermeture d'un espace : [par exemple 30 jours]
- Durée maximale des adresses « Me prévenir » si le connecteur ne sort pas : [par exemple 12 mois]
- Garanties des prestataires : [tableau du compte rendu 2.4]
- Mesure d'audience : [outil retenu en 1.6, ou aucune]

CGU
- Plafond de responsabilité : [d'après 2.7]
- Délai de suppression : [le même que ci-dessus]
- Tribunal compétent : [d'après 2.7]
- Durée de conservation des notifications des outils connectés : [par exemple 90 jours]

CGV
- Régime de TVA : [compte rendu 2.5]
- Passage à un plan inférieur : [compte rendu 1.3]
- Professionnels de cinq salariés au plus (article L221-3) : [d'après 2.7]
- Pénalités de retard et indemnité de 40 € : [d'après 1.1 et 2.7]
- Tribunal compétent : [d'après 2.7]
```

---

## 2.7 La relecture juridique

Où : Claude Chat, projet « PULSACITY — Stratégie », nouvelle conversation. Remplacez la ligne entre crochets par les quatre textes : copiez-les depuis les pages du site (`/mentions-legales`, `/cgu`, `/cgv`, `/confidentialite`).

Claude Chat prépare la relecture ; un juriste la fait. Ses corrections partent au lot 4.9.

```
Prompt 2.7 — Relire les textes légaux, avant un juriste.

Contexte : comptes rendus 1.1, 1.3, 2.4 et 2.5. Voici les quatre textes légaux de PULSACITY, encore en brouillon. Les passages « [À COMPLÉTER : …] » attendent une information ou une décision.

[Les quatre textes : mentions légales, CGU avec leur annexe de sous-traitance, CGV, politique de confidentialité.]

Relis-les comme le ferait un avocat spécialisé dans les logiciels en ligne, au regard du droit français et européen en vigueur en octobre 2026. Pour chaque point : ce qui va, ce qui manque, ce qui est risqué, et la rédaction que tu proposes.

1. Les mentions légales (LCEN), pour mon statut.
2. Les CGV entre professionnels : mentions obligatoires du Code de commerce (dont pénalités de retard et indemnité forfaitaire de 40 €), prix TVA comprise, renouvellement, résiliation, changement de plan (dont le passage à un plan inférieur décidé en 1.3), défaut de paiement, évolution des prix.
3. Le droit de rétractation : nos clients sont des professionnels, mais ceux qui ont cinq salariés au plus peuvent en bénéficier quand le contrat sort du champ de leur activité principale (article L221-3 du Code de la consommation). Est-ce notre cas ? Que faut-il prévoir (rétractation, information, médiateur de la consommation) ?
4. La responsabilité : quel plafond est valable et raisonnable, et ce qu'un juge écarterait.
5. Le tribunal compétent : une clause qui désigne la ville du siège vaut-elle face à des clients qui ne sont pas commerçants ?
6. Le RGPD : contrat de sous-traitance (article 28), information des personnes (articles 13 et 14), durées de conservation, transferts hors de l'Union (compte rendu 2.4), droits, registre des traitements, notification des violations de données.
7. Les cookies : nos deux cookies nécessaires, et ce que changerait une mesure d'audience sans cookie.
8. Les avis en ligne. Les créateurs publient les avis de leurs clients avec nos widgets. Que demandent le Code de la consommation (article L111-7-2 et articles D111-16 et suivants) et la directive Omnibus à celui qui publie des avis : informations sur leur collecte et leur vérification, date de l'avis, traitement des avis négatifs ? Notre badge « 4,9/5 · 87 avis » est calculé sur les témoignages que le créateur a validés : est-ce un risque de pratique commerciale trompeuse, et que faut-il afficher ou changer ? Qui en porte la responsabilité, le créateur ou PULSACITY ?
9. Le droit à l'image et le consentement : photo et texte du client, retrait du consentement, ce que dit notre case de consentement.
10. Les e-mails de demande d'avis aux clients des créateurs : base légale, information, désinscription, adresse postale de l'expéditeur.

Puis :
- les questions à poser au juriste, par ordre d'importance ;
- les options pour cette relecture (avocat spécialisé au forfait, services juridiques en ligne, consultations gratuites), avec leurs prix vérifiés, et ta recommandation ;
- le « Compte rendu pour Claude Code » : les corrections à faire dans chaque texte, les rédactions proposées, et ce qui attend encore le juriste.
```

---

## 2.8 Le compte Stripe

En trois temps.

### 2.8 a — Ouvrir le compte (vous)

Sur https://dashboard.stripe.com/register, avec l'adresse facturation@pulsacity.com. Activez vous-même la double authentification. Le mode test est utilisable tout de suite : c'est lui que le lot 4.5 utilise.

### 2.8 b — Régler le compte, en mode test (Claude in Chrome)

Avant ce prompt :
- connectez-vous à Stripe ;
- téléchargez depuis le dépôt l'icône `public/icon-512.png` et le logo `docs-internes/identite-v2/assets/svg/pulsacity-logo.svg` (ou ceux de la charte v2 s'ils existent déjà) ;
- préparez le pied de page des factures : les mentions du compte rendu 1.1, avec vos informations. Vous le collez vous-même dans Stripe, et il n'apparaît pas dans le compte rendu.

```
Tu m'aides à régler le compte Stripe de PULSACITY, en mode test. Je suis connecté. Tu ne crées ni produit, ni prix, ni webhook, ni clé : ce sera le lot suivant.

Où : https://dashboard.stripe.com/ . Vérifie d'abord que le mode test (environnement de test) est actif.

Ce qu'il ne faut surtout pas toucher : les clés API, les webhooks, les comptes bancaires, les informations d'identité et d'activation du compte, l'abonnement de Stripe lui-même.

1. Image de marque (Paramètres, « Image de marque ») : icône et logo avec les fichiers que je te donne ; couleur de marque et couleur d'accent : demande-les-moi (celles de la charte v2, ou Encre #16213E et Carmin #A3243B).
2. Informations publiques (Paramètres, « Informations publiques » ou « Détails publics ») : nom public « PULSACITY », site https://pulsacity.com, e-mail d'assistance support@pulsacity.com, libellé sur les relevés bancaires « PULSACITY ». Laisse vides les champs que je ne t'ai pas donnés, comme le téléphone.
3. Liens légaux, là où Stripe les demande (portail client, pages de paiement) : conditions https://pulsacity.com/cgv, confidentialité https://pulsacity.com/confidentialite.
4. E-mails aux clients (Paramètres, « E-mails clients ») : reçus des paiements réussis et des remboursements activés ; langue française si le réglage existe.
5. Factures (Paramètres de Billing, « Factures ») : numérotation séquentielle à l'échelle du compte. Pour le pied de page, ouvre le champ et dis-moi : « Collez votre pied de page, puis dites-moi OK. » Attends mon OK, puis enregistre.
6. Vérifie : un aperçu de facture et de reçu montre le logo, les couleurs, le nom public et le pied de page.

Compte rendu à me donner : chaque réglage fait, et ce que tu n'as pas trouvé. Ni le pied de page, ni aucune clé, ni aucun identifiant de compte.
```

### 2.8 c — Activer le compte (vous), plus tard

L'activation demande vos informations, votre SIREN et votre IBAN, et Stripe vérifie le site : mentions légales, CGV, contact et prix doivent y être complets. Faites-la après les lots 4.4 (aide et contact) et 4.9 (légal), juste avant le passage en mode réel du lot 4.5.
