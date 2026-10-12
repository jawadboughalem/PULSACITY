# Étape 2 : le légal, sans entreprise

Stratégie du 12 octobre : PULSACITY se lance gratuitement, édité par un particulier. L'immatriculation, la banque, la TVA et Stripe attendent le jour où des créateurs veulent payer (`prompts-6-le-jour-ou-ca-marche.md`).

| N° | Quoi | Qui | Quand |
| --- | --- | --- | --- |
| K | Résilier la domiciliation Kandbaz | Claude in Chrome | En premier |
| 2.2 | Trois adresses e-mail professionnelles | Claude in Chrome, chez OVH | Cette semaine |
| 2.4 | Les contrats de traitement des prestataires | Claude in Chrome | Avant le lot 4.9 |
| 2.7 | La relecture des textes légaux | Claude Chat | Après 1.1 et 2.4 |
| 2.6 | Les informations des textes légaux | Vous, vers Claude Code | Au début du lot 4.9 |

Les prompts Claude Chat se lancent dans le projet « PULSACITY — Stratégie » (prompt 0). Les prompts Claude in Chrome, dans le groupe d'onglets « PULSACITY », après vous être connecté vous-même au service.

Ce que deviennent les textes légaux, d'ici au premier abonnement :

| Texte | Sort |
| --- | --- |
| Mentions légales | Gardées : l'éditeur est un particulier, à titre non professionnel, avec l'hébergeur et l'adresse de contact |
| Politique de confidentialité, cookies compris | Gardée : le RGPD s'applique aussi à un particulier |
| CGU, avec l'annexe de sous-traitance RGPD | Gardées : celles d'un service gratuit, en phase de lancement |
| CGV | Retirées du site jusqu'au premier abonnement ; leur fichier est gardé dans le dépôt |
| Contact | `/aide` (lot 4.4) et contact@pulsacity.com dans les mentions légales |

1.1 confirme ou corrige ce tableau ; 2.7 relit les textes ; le lot 4.9 les met en ligne.

---

## K. Résilier la domiciliation Kandbaz

Où : Claude in Chrome. Avant ce prompt :
- connectez-vous vous-même à votre espace client Kandbaz ;
- si vous avez commencé un dossier d'immatriculation sur le guichet unique avec cette adresse, ne l'envoyez pas. S'il est déjà parti, dites-le à Claude Code avant tout : la suite change.

```
Tu m'aides à mettre fin à mon contrat de domiciliation chez Kandbaz, que j'ai payé pour une entreprise que je ne crée plus. Je suis connecté à mon espace client. Tu ne paies rien, tu n'acceptes aucune nouvelle offre, et tu n'envoies rien sans mon accord.

Où : mon espace client Kandbaz, ouvert dans ce groupe d'onglets.

1. L'état des lieux, sans rien changer : l'offre souscrite, la date de souscription, la date et le montant de chaque paiement, la durée d'engagement, la date de fin prévue, le renouvellement automatique ou non, et l'état du dossier (contrat signé ou non, adresse déjà attribuée, courrier déjà reçu).
2. Les règles : trouve les conditions générales de vente de Kandbaz (dans l'espace client ou sur kandbaz.com), et relève ce qu'elles disent de la rétractation, de la résiliation, du préavis et du remboursement. Cite les articles.
3. Ce que j'ai le droit de demander. Si le paiement date de moins de 14 jours, le droit de rétractation d'un contrat conclu à distance peut s'appliquer : vérifie s'il est prévu ou exclu par leurs conditions. Sinon, la résiliation selon leurs conditions, et le remboursement de la période non utilisée si elles le permettent. Dis-moi ce que tu proposes de demander, et attends mon accord.
4. La demande, une fois mon accord donné :
   - si l'espace client a un bouton ou un formulaire de résiliation, remplis-le, montre-le-moi, et attends mon OK avant d'envoyer ;
   - sinon, rédige le message pour le service client, court et poli : mon contrat (numéro de client ou de contrat seulement), la demande (rétractation ou résiliation), la date d'effet, le remboursement demandé et son fondement, et une demande de confirmation écrite. Je l'enverrai moi-même.
5. Si l'espace le permet, vérifie que le renouvellement automatique est arrêté.

Ne modifie ni mes coordonnées ni mon moyen de paiement, et ne supprime pas le compte avant la confirmation de la résiliation.

Compte rendu à me donner : l'offre, les dates (souscription, paiements, fin), ce que disent leurs conditions, ce qui a été demandé, la réponse ou le délai de réponse annoncé, et le remboursement attendu. Ni mes coordonnées, ni mon numéro de contrat.
```

Après le prompt : gardez la confirmation écrite de Kandbaz. Le remboursement, s'il est accordé, revient sur le moyen de paiement utilisé.

---

## 2.2 Les adresses e-mail professionnelles, chez OVH

Où : Claude in Chrome. Avant ce prompt :
- connectez-vous vous-même à votre espace client OVHcloud ;
- gardez votre boîte de réception ouverte dans un autre onglet.

Trois adresses gratuites, sans toucher à la configuration du domaine (vos e-mails actuels continuent comme avant) :
- contact@ pour les mentions légales ;
- support@ pour l'aide aux créateurs et « Écrivez-nous » ;
- rgpd@ pour les données personnelles.

facturation@ viendra avec les abonnements (6.5).

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
3. Demande-moi l'adresse de destination, celle où je veux recevoir ces e-mails. Puis crée ces trois adresses, toutes vers cette destination :
   - contact@pulsacity.com ;
   - support@pulsacity.com ;
   - rgpd@pulsacity.com.
   Si OVH propose de « conserver une copie », laisse le réglage par défaut.
4. Vérifie que chaque adresse apparaît dans la liste, vers la bonne destination.
5. Dis-moi : « Envoyez un e-mail de test à chacune des trois adresses depuis une autre boîte, puis dites-moi OK. » Attends mon OK, puis demande-moi si chacun est bien arrivé.

Compte rendu à me donner : la méthode (alias ou redirection), les trois adresses créées, le résultat de chaque test, et ce qui était déjà en place (le nombre de boîtes, sans leurs adresses). Ni l'adresse de destination, ni aucun mot de passe.
```

---

## 2.4 Les contrats de traitement des prestataires

Où : Claude in Chrome. Avant ce prompt : connectez-vous vous-même à Vercel, Supabase, Resend et Cloudflare.

Ce compte rendu complète les « [À COMPLÉTER : garantie retenue pour chaque prestataire] » de la politique de confidentialité et des CGU. Stripe viendra avec les abonnements.

```
Tu m'aides à vérifier les contrats de traitement des données (DPA) des prestataires de PULSACITY, et les garanties de leurs transferts hors de l'Union européenne. Tu lis : tu ne changes aucun réglage, sauf l'acceptation d'un DPA quand je te la confirme.

Je suis connecté à Vercel, Supabase, Resend et Cloudflare dans ce groupe d'onglets.

Pour chaque prestataire, dans cet ordre : Vercel (hébergement), Supabase (base de données), Resend (envoi des e-mails), Cloudflare (stockage des photos, R2), OVHcloud (domaine et e-mails du fondateur) :
1. Trouve sa page officielle de DPA (« Data Processing Addendum », dans ses pages légales ou dans les réglages du compte). Dis-moi s'il s'applique de lui-même avec les conditions d'utilisation, ou s'il faut l'accepter ou le signer dans le compte. S'il faut l'accepter, montre-moi la page et attends mon accord : c'est moi qui décide.
2. Trouve sa garantie de transfert hors de l'Union : certification au Data Privacy Framework (vérifie l'inscription sur https://www.dataprivacyframework.gov/list, avec le nom exact de la société et la date de ta vérification), clauses contractuelles types de la Commission européenne, ou les deux.
3. Note où sont stockées les données de PULSACITY chez lui, d'après le tableau de bord, sans rien changer. Attendu : Francfort pour Vercel et Supabase, Europe de l'Ouest pour Cloudflare R2, Irlande (eu-west-1) pour Resend.
4. Note l'adresse de la liste de ses sous-traitants ultérieurs.

Ne touche à aucun réglage, aucune région, aucune clé, aucune facturation.

Compte rendu à me donner : un tableau avec, pour chaque prestataire, le nom exact de la société et son pays, ce qu'il traite, le lieu de stockage, le DPA (adresse ; s'applique de lui-même, ou accepté le …), la garantie de transfert (DPF avec la date de vérification ; clauses types), et l'adresse de la liste de ses sous-traitants. Aucun identifiant de compte, aucune clé.
```

---

## 2.7 La relecture des textes légaux

Où : Claude Chat, projet « PULSACITY — Stratégie », nouvelle conversation. Remplacez la ligne entre crochets par les textes : copiez-les depuis les pages du site (`/mentions-legales`, `/cgu`, `/confidentialite`).

Pour un service gratuit, une relecture par Claude Chat, appuyée sur les sources officielles et les modèles de la CNIL, suffit à mon avis pour le lancement. La relecture par un juriste devient conseillée le jour des abonnements, avec les CGV (6.7).

```
Prompt 2.7 — Relire les textes légaux d'un service gratuit, édité par un particulier.

Contexte : compte rendu 1.1 (le cadre sans entreprise) et compte rendu 2.4 (les prestataires). Voici trois textes de PULSACITY, écrits pour une entreprise et encore en brouillon. Les passages « [À COMPLÉTER : …] » attendent une information ou une décision. Les CGV seront retirées du site jusqu'au premier abonnement.

[Les trois textes : mentions légales, CGU avec leur annexe de sous-traitance, politique de confidentialité.]

Réécris-les pour un service gratuit, en phase de lancement, édité par un particulier à titre non professionnel, au regard du droit français et européen en vigueur en octobre 2026. Pour chaque point : ce qui va, ce qui manque, ce qui est risqué, et la rédaction que tu proposes.

1. Les mentions légales d'un éditeur non professionnel (LCEN) : ce qui est publié, ce qui est gardé pour l'hébergeur.
2. La politique de confidentialité : l'identité du responsable du traitement, les finalités, les bases légales, les durées de conservation, les destinataires et les transferts hors de l'Union (compte rendu 2.4), les droits, les deux cookies nécessaires.
3. Les CGU : objet, gratuité et phase de lancement, ce qui se passera quand les abonnements ouvriront (prévenir, ne jamais faire payer sans accord, rien de supprimé), engagements du créateur, contenus, disponibilité, responsabilité d'un particulier, fin du service et suppression des données, modification des conditions, droit applicable et tribunal compétent.
4. L'annexe de sous-traitance (article 28 du RGPD) : ce qu'elle doit contenir, quand le sous-traitant est un particulier.
5. Les avis en ligne. Les créateurs publient les avis de leurs clients avec nos widgets. Que demandent le Code de la consommation (article L111-7-2 et articles D111-16 et suivants) et la directive Omnibus à celui qui publie des avis : informations sur leur collecte et leur vérification, date de l'avis, traitement des avis négatifs ? Notre badge « 4,9/5 · 87 avis » est calculé sur les témoignages que le créateur a validés : est-ce un risque de pratique commerciale trompeuse, et que faut-il afficher ou changer ? Qui en porte la responsabilité, le créateur ou PULSACITY ?
6. Le droit à l'image et le consentement : photo et texte du client, retrait du consentement, ce que dit notre case de consentement.
7. Les e-mails de demande d'avis aux clients des créateurs : base légale, information, désinscription, adresse postale de l'expéditeur.
8. La page Tarifs pendant la phase gratuite : la formulation des plans « Bientôt ».
9. Les CGV : ce qu'il faudra y revoir le jour des abonnements, pour que ce jour-là soit court.

Puis :
- dis si une relecture par un juriste est utile dès maintenant, ou seulement le jour des abonnements, et pourquoi ;
- le « Compte rendu pour Claude Code » : les trois textes réécrits en entier, prêts à intégrer, avec des marques [INFO : …] là où une de mes informations personnelles doit apparaître, et la liste de ce qui attend le jour des abonnements.
```

---

## 2.6 Les informations des textes légaux

Où : vous, vers Claude Code, au début du lot 4.9.

Le dépôt est public et garde tout son historique. Vos informations personnelles (votre nom, et ce que 1.1 exige de publier) apparaîtront sur le site, mais viendront de variables d'environnement que vous saisissez vous-même dans Vercel : le lot 4.9 vous donne le prompt. Elles ne s'envoient pas à Claude Code.

Remplissez ce modèle et envoyez-le à Claude Code, avec le compte rendu de 2.7 :

```
Informations pour les textes légaux (lot 4.9)

Éditeur
- Qualité : particulier, à titre non professionnel (d'après 1.1)
- Nom commercial du service : PULSACITY
- Ce qui est publié : [d'après 1.1 : nom seul, ou nom et adresse…] (les valeurs : Vercel)
- E-mail de contact : contact@pulsacity.com

Confidentialité
- E-mail pour les données personnelles : rgpd@pulsacity.com
- Délai de suppression après la fermeture d'un espace : [par exemple 30 jours]
- Durée maximale des adresses « Me prévenir » : [par exemple 12 mois]
- Garanties des prestataires : [tableau du compte rendu 2.4]
- Mesure d'audience : [outil retenu en 1.6, ou aucune]

CGU
- Responsabilité : [d'après 2.7]
- Tribunal compétent : [d'après 2.7]
- Durée de conservation des notifications des outils connectés : [par exemple 90 jours]

CGV
- Retirées du site jusqu'au premier abonnement.

Tarifs
- Phrase des plans à venir : [d'après 1.3 et 2.7]
```
