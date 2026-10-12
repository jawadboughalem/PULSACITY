# Étape 0 et étape 1 : décider

Prompts pour Claude Chat, dans le projet « PULSACITY — Stratégie ». Une conversation par prompt, recherche web activée.

| N° | Sujet | Quand |
| --- | --- | --- |
| 0 | Créer le projet Claude | En premier, 10 minutes |
| 0 bis | Ajouter le skill UI UX Pro Max à Claude | Juste après, 5 minutes |
| 1.1 | Encaisser sans entreprise : ce qui est permis | Tout de suite |
| 1.2 | Le catalogue des connecteurs | Fait le 10 octobre |
| 1.3 | Les tarifs | Après 1.1 |
| 1.4 | La direction visuelle de la v2, avec uupm.cc et le skill | En parallèle ; vous explorez vous-même entre les deux temps du prompt |
| 1.5 | Le positionnement et la page d'accueil | En parallèle, mieux après 1.2 |
| 1.6 | Commercialiser PULSACITY | Après 1.5 |

Après chaque prompt :
1. Ajoutez son « Compte rendu pour Claude Code » aux fichiers du projet Claude, en texte, sous le nom « Compte rendu 1.x » : les prompts suivants s'en servent.
2. Gardez-le pour Claude Code : le lot 4.1 les inscrit tous dans le dépôt.

Dans un prompt, une ligne entre crochets est à remplacer par ce qu'elle dit (un compte rendu à coller), ou à supprimer.

---

## 0. Le projet Claude

Où : claude.ai, « Projets », « Créer un projet ».

1. Nom : PULSACITY — Stratégie.
2. Instructions du projet : collez le bloc ci-dessous. Si le projet existe déjà, remplacez ses instructions par celles-ci.
3. Fichiers du projet. Ouvrez chacun de ces liens, cliquez sur l'icône « Download raw file » en haut à droite du fichier, puis ajoutez le fichier au projet (remplacez les anciennes versions) :
   - https://github.com/jawadboughalem/PULSACITY/blob/main/docs-internes/fin-v0/brief-pulsacity.md
   - https://github.com/jawadboughalem/PULSACITY/blob/main/docs-internes/fin-v0/inventaire-ecrans.md
   - https://github.com/jawadboughalem/PULSACITY/blob/main/docs-internes/fin-v0/seuil-micro-entreprise.md
   - https://github.com/jawadboughalem/PULSACITY/blob/main/docs-internes/decision_tarifs.md
   - https://github.com/jawadboughalem/PULSACITY/blob/main/docs-internes/decisions/connecteurs.md (le compte rendu 1.2)
4. Dans chaque conversation : la recherche web activée. Pour 1.2, 1.3, 1.4 et 1.6, le mode de recherche approfondie s'il vous est proposé.

```
Tu conseilles le fondateur de PULSACITY. Il construit ce logiciel seul, avec Claude : Claude Chat pour décider, Claude Design pour dessiner, Claude Code pour construire, Claude in Chrome pour agir sur les services en ligne.

Sa stratégie : lancer PULSACITY avec ses abonnements payants et encaisser en tant que particulier, sans entreprise, pour faire ses preuves. Il créera une micro-entreprise dès que les paiements deviendront réguliers, au seuil fixé dans seuil-micro-entreprise.md. C'est sa décision : ne la remets pas en cause à chaque réponse. Dis-lui seulement, sources à l'appui, ce qu'elle impose (déclarations, mentions, limites), et si un fait nouveau oblige à avancer le seuil.

Avant chaque réponse, appuie-toi sur les fichiers du projet : brief-pulsacity.md (le produit, les prix, les coûts, les contraintes), inventaire-ecrans.md (les écrans), seuil-micro-entreprise.md (le seuil), decision_tarifs.md (les prix TVA comprise), connecteurs.md (le catalogue des connecteurs), et les comptes rendus déjà ajoutés.

Ta façon de travailler :
- Français, vouvoiement, phrases courtes. Pas de jargon sans explication.
- Pragmatique : un fondateur seul, sans budget, avec peu de temps. Il veut des décisions. Termine chaque analyse par une recommandation nette, avec ses raisons, ses risques et ce qui la ferait changer.
- Le gratuit d'abord. Quand une option est payante, donne son prix et l'alternative gratuite si elle existe.
- Vérifie par la recherche web chaque chiffre, prix, seuil, taux, délai ou règle, et cite la source avec sa date. Ce que tu n'as pas pu vérifier, écris-le « non vérifié ». N'invente jamais un chiffre, une statistique, un témoignage ou un client.
- Pour les règles françaises, préfère les sources officielles : entreprendre.service-public.fr, service-public.fr, urssaf.fr, autoentrepreneur.urssaf.fr, impots.gouv.fr, economie.gouv.fr, cnil.fr, legifrance.gouv.fr, inpi.fr.
- Dis ce qui demande un professionnel (expert-comptable, avocat) et ce qui peut se faire seul.
- Si une question dépend de ma situation personnelle, pose-la-moi d'abord, en une seule liste.
- Ne me demande jamais de secret (mot de passe, clé, code reçu par SMS). Mes informations personnelles servent à la conversation, jamais au compte rendu.
- Finis chaque réponse qui décide quelque chose par un bloc « Compte rendu pour Claude Code » : les décisions et les chiffres retenus, en liste, sans aucune donnée personnelle (ni nom, ni adresse, ni téléphone), prêt à être copié tel quel.
```

---

## 0 bis. Ajouter le skill UI UX Pro Max à Claude

Le skill est un ensemble de fichiers (règles UX, catalogue de styles, de palettes et de polices, et un petit programme qui les interroge). Ajouté à Claude, il sert au prompt 1.4. Claude Code vous l'a envoyé dans la conversation : `ui-ux-pro-max.zip`, avec ses deux fichiers de règles, `quick-reference.md` et `pro-rules.md` (gardez-les pour Claude Design, étape 3).

Où : claude.ai, réglages.
1. Dans la partie des fonctionnalités (« Capabilities »), vérifiez que l'exécution de code et la création de fichiers sont activées : le skill en a besoin.
2. Dans « Skills », choisissez d'importer un skill, puis le fichier `ui-ux-pro-max.zip`, sans le décompresser.
3. Vérifiez qu'il apparaît dans la liste, activé.

Si vous ne trouvez pas l'option « Skills », dites-le à Claude Code : le prompt 1.4 se fait aussi sans le skill, avec la galerie d'uupm.cc seule.

---

## 1.1 Encaisser sans entreprise : ce qui est permis

Où : Claude Chat, projet « PULSACITY — Stratégie », nouvelle conversation.

Ce que vous en tirez : ce que vous devez déclarer, ce que les textes légaux doivent dire, ce que Stripe accepte, et le seuil confirmé ou ajusté. C'est la base des prompts 1.3, 2.6, 2.7, 2.8 et du lot 4.9.

```
Prompt 1.1 — Encaisser sans entreprise.

Contexte : je lance PULSACITY avec ses abonnements payants (brief-pulsacity.md) et j'encaisse en tant que particulier, sans entreprise, pour faire mes preuves. Je créerai une micro-entreprise dès que les paiements deviendront réguliers, au seuil de seuil-micro-entreprise.md. C'est ma décision. Les créateurs qui paient sont des professionnels ; PULSACITY traite les données de leurs clients (nom, e-mail, avis, photo).

Commence par me poser, en une seule liste, les questions dont tu as besoin sur ma situation : par exemple si je suis salarié et ce que dit mon contrat (exclusivité, loyauté, non-concurrence), si j'ai déjà une activité déclarée. Attends mes réponses avant d'analyser.

Ensuite, avec les règles en vigueur en octobre 2026, sources officielles à l'appui :

1. L'occasionnel et le régulier. Comment la loi distingue une activité occasionnelle d'une activité habituelle, pour des abonnements qui se renouvellent chaque mois. Le seuil de seuil-micro-entreprise.md (5 clients payants, 3 mois de suite avec des paiements, ou 500 € encaissés, le premier atteint) est-il prudent ? Ajuste-le si besoin, avec tes raisons. Ce que je risque si je le dépasse sans m'être déclaré.

2. Déclarer. Comment déclarer ce que j'encaisse avant la micro-entreprise : quelle déclaration, quelle ligne, quels prélèvements sociaux, à quelle date.

3. Stripe. Peut-on ouvrir un compte Stripe en France en tant que particulier, sans numéro d'entreprise, pour des abonnements ? Ce qu'il demande (identité, adresse, site, description de l'activité), ce que ses conditions disent, et si le compte pourra passer au nom de la micro-entreprise sans recréer les abonnements.

4. La TVA. En tant que particulier, je ne facture pas de TVA : confirme, et dis ce qu'il faut écrire sur les reçus et les factures de Stripe.

5. Les mentions légales d'un vendeur particulier (LCEN) : ce que je dois publier (nom, adresse, téléphone, e-mail), et les options pour ne pas publier mon adresse personnelle. Une domiciliation (Kandbaz, par exemple) est-elle possible sans entreprise immatriculée ?

6. Les CGV d'un vendeur particulier à des professionnels : ce qu'elles doivent dire (prix TVA non applicable, renouvellement, résiliation, rétractation des professionnels de cinq salariés au plus, médiateur), et ce qui change par rapport à celles d'une entreprise.

7. Le RGPD sans entreprise. Je suis responsable du traitement pour les données de mes créateurs, et sous-traitant pour celles de leurs clients. Mes obligations : informations à publier (mon identité), registre, contrat de sous-traitance (l'annexe de nos CGU), sécurité, violations de données.

8. Les CGU : la responsabilité d'un particulier qui vend un service en ligne, ce qu'un plafond de responsabilité peut couvrir, et si mon assurance responsabilité civile me couvre.

9. Vercel, l'hébergeur, réserve son offre gratuite à un usage non commercial : je passe à l'offre payante avant le premier paiement. Confirme.

10. Le jour du seuil : ce que coûte une micro-entreprise sans chiffre d'affaires (cotisations, CFE), le délai entre la déclaration et le SIREN, et comment la fermer si ça ne marche pas.

Termine par :
- ta recommandation en cinq lignes ;
- ce qui mérite l'avis d'un professionnel, et ce que je peux faire seul ;
- le « Compte rendu pour Claude Code » : le seuil confirmé ou ajusté, la façon de déclarer, ce que Stripe accepte, la mention de TVA, le contenu attendu des mentions légales, des CGV, des CGU et de la politique de confidentialité (sans mes informations personnelles), et la position sur Vercel.
```

---

## 1.2 Le catalogue des connecteurs

Fait le 10 octobre. Le compte rendu est dans le dépôt, `docs-internes/decisions/connecteurs.md`, et s'ajoute aux fichiers du projet Claude (prompt 0).

---

## 1.3 Les tarifs

Où : Claude Chat, projet « PULSACITY — Stratégie », nouvelle conversation, recherche approfondie si proposée. Remplacez la ligne entre crochets par le compte rendu de 1.1.

Ce que vous en tirez : garder ou changer les prix, avec les chiffres, la règle de passage à un plan inférieur (qui manque aux CGV), et l'offre aux bêta-testeurs.

```
Prompt 1.3 — Les tarifs sont-ils rentables ?

Contexte : brief-pulsacity.md (plans, limites, coûts) et decision_tarifs.md (prix TVA comprise). J'encaisse en tant que particulier, sans TVA, jusqu'au seuil de seuil-micro-entreprise.md ; ensuite, une micro-entreprise, probablement en franchise de TVA. J'ai voulu rester sous la barre psychologique des 10 € : Essentiel à 9,99 € par mois (99 € par an), Pro à 19,99 € par mois (199 € par an), et un plan Gratuit. Je ne suis pas sûr de ce choix. Je dois être pragmatique : ce projet doit me rapporter un revenu. Tranche : on garde, ou on change, et pour quels prix.

[Compte rendu de 1.1.]

1. Les coûts, vérifiés aujourd'hui. Pour chaque service du brief (Vercel, Supabase, Resend, Cloudflare R2, Stripe, domaines, GitHub), et pour ce qui viendra (mesure d'audience, suivi des erreurs, abonnement Claude) : le prix actuel, les seuils des offres gratuites, et le moment où il faut passer au payant. Donne les coûts fixes par mois à 0, 50, 200, 500 et 1 000 créateurs actifs.

2. Les coûts variables. Un créateur qui fait 30 ventes par mois déclenche jusqu'à 60 e-mails de demande et de relance, plus les e-mails de connexion et de nouveau témoignage. Un espace Gratuit peut envoyer 20 demandes par mois, soit jusqu'à 40 e-mails. Calcule ce que coûtent les e-mails, les photos et les fonctions par espace, et ce que coûtent les espaces gratuits à grande échelle.

3. Ce qui me reste par abonné, en mensuel et en annuel, pour chaque plan : en particulier (sans TVA, avec les prélèvements de 1.1), puis en micro-entreprise en franchise de TVA (frais Stripe, cotisations, impôt).

4. Les seuils de rentabilité. Combien d'abonnés payants pour couvrir les coûts fixes ? Pour gagner 1 000 €, 2 000 € et 3 500 € par mois ? Avec combien d'inscrits, selon des taux de passage au payant réalistes ?

5. Les repères. Pour un petit logiciel vendu à des indépendants : taux de passage du gratuit au payant, part de l'annuel, taux de départ mensuel, durée de vie d'un client. Sources et dates.

6. La concurrence. Les prix d'octobre 2026, en euros, mensuels et annuels, et ce que permet chaque offre gratuite : Senja, Testimonial.to, Famewall, Shapo, Trustmary, Vocal Video, EmbedSocial, Elfsight, et les acteurs français. Où se place PULSACITY ?

7. Les questions à trancher :
   - 9,99 € est-il le bon prix d'Essentiel, ou laisse-t-il de l'argent sur la table ? Que se passerait-il à 12 € ou à 14,99 € ?
   - le Pro n'a qu'un avantage, retirer le badge : justifie-t-il le double ? Que devrait-il contenir plus tard, sans rien changer à la V0 ?
   - l'annuel à deux mois offerts est-il bien réglé ?
   - le plan Gratuit (15 témoignages validés, 20 demandes par mois, 1 widget) est-il trop généreux ou trop serré, sachant que son badge fait connaître PULSACITY ?
   - les bêta-testeurs : Essentiel offert par un code promotionnel, combien de temps, et quelle promesse pour la suite (prix de lancement à vie, par exemple) ?
   - quand un créateur passe à un plan inférieur : à quelle date, et que deviennent ses widgets en trop, ses témoignages au-delà de la limite, son badge ? Rien n'est jamais supprimé.
   - comment changer un prix plus tard sans fâcher les abonnés déjà là ?

8. Le verdict. Les prix et les limites que tu recommandes, plan par plan, mensuels et annuels, TVA comprise. Si tu recommandes de garder les prix actuels, dis-le franchement. Dis quand réexaminer, et quels chiffres surveiller.

Termine par le « Compte rendu pour Claude Code » : les prix et les limites retenus, ce que contient chaque plan, l'offre aux bêta-testeurs, la règle de passage à un plan inférieur, la phrase sur la TVA de la page Tarifs, et les seuils de rentabilité.
```

---

## 1.4 La direction visuelle de la v2, avec uupm.cc et le skill

Où : Claude Chat, projet « PULSACITY — Stratégie », nouvelle conversation, recherche approfondie si proposée. Le skill UI UX Pro Max doit être ajouté (0 bis).

Le prompt se fait en deux temps. Claude vous donne les sites, la grille, et ce que le skill propose ; vous explorez vous-même, en remplissant la grille et en prenant des captures (galerie d'uupm.cc comprise) ; puis vous revenez dans la même conversation.

Ce que vous en tirez : trois directions décrites en mots, la piste du logo, et 10 à 15 captures pour Claude Design (prompt 3.1).

```
Prompt 1.4 — Trouver la direction visuelle de la v2.

Contexte : brief-pulsacity.md, partie « L'identité actuelle ». Je trouve le design actuel trop basique, trop linéaire, pas assez moderne, fade, et trop proche du style des assistants d'IA. Je veux une v2 sobre et accessible, mais pas fade, et pas « claudesque ». Seul le visuel change : la logique, les parcours et les textes restent. Notre empreinte reste aussi, à commencer par le logo (la fusée portée par une étoile), que je veux rendre moins fade.

Je vais explorer des sites moi-même. Guide-moi.

1. Le diagnostic. Qu'est-ce qui fait qu'un site paraît « fait par une IA » en 2026, et en quoi notre v1 en a les traits (titres à empattements, fond crème, filets fins, une seule couleur d'accent, grands blancs, cartes identiques…) ? Qu'est-ce qui fait, au contraire, un site sobre mais vivant ?

2. Les références : 25 à 30 sites, dont tu vérifies qu'ils sont en ligne, en cinq groupes :
   - nos concurrents (collecte et affichage d'avis) ;
   - les outils des créateurs (formations, paiements, prise de rendez-vous, pages de vente) ;
   - des logiciels modernes, sobres sans être fades ;
   - des marques françaises à l'identité forte (par exemple Alan, Qonto, Swile, Malt, lemlist, Pennylane, Shine, Indy, Doctolib) ;
   - des galeries où chercher : Land-book, Lapa Ninja, Godly, Awwwards, Mobbin, Refero, et la galerie de https://uupm.cc (les styles nommés du skill UI UX Pro Max, avec leurs palettes et leurs polices).
   Pour chacun : l'adresse, pourquoi il est là, et ce que je dois regarder (couleurs, typographie, mise en page, illustrations ou photos, mouvement, façon de montrer le produit, ton).

3. Le skill UI UX Pro Max, que j'ai ajouté. Lance son générateur de design system pour PULSACITY, avec trois descriptions différentes du produit (par exemple : un logiciel pour indépendants qui transforme leurs ventes en témoignages ; un outil de preuve sociale pour formateurs en ligne ; un service de confiance pour coachs francophones). Montre-moi ce qu'il propose pour chacune : style, palette, polices, effets, ce qu'il dit d'éviter. Puis juge ces propositions avec franchise : ce qui sert notre cible, et ce qui ferait « généré » ou « claudesque ». Garde aussi ses règles UX et sa liste de contrôle avant livraison : elles serviront à Claude Design.

4. La grille. Une grille à remplir pour chaque site et chaque style d'uupm.cc que je retiens : ce que j'aime, ce que je n'aime pas, ce qu'on pourrait prendre pour PULSACITY, une note de 1 à 5, capture prise ou non.

5. Les pièges. Les tendances de 2026 qui vieilliront vite. Et nos interdits, qui restent en v2 : étiquettes en majuscules espacées au-dessus des titres, un mot du titre en couleur ou en italique, flèches « → » dans les boutons, grilles de cartes identiques avec la même ombre, dégradés décoratifs, animations d'apparition sur chaque section, numérotation 01/02/03 hors d'une vraie séquence.

6. Les polices. Des polices gratuites pour un usage commercial sur le web (Google Fonts, Fontshare, et d'autres, et les paires du skill), pour les titres et pour l'interface. Vérifie leur licence, leurs accents français et leurs chiffres.

7. Le logo. Des exemples de logos qui ont gagné en caractère sans changer d'idée. Ce qui rendrait la fusée et l'étoile plus fortes, lisibles à 16 px, en une seule couleur et sur fond sombre.

Puis attends : je reviens avec ma grille remplie et mes captures. À ce moment-là :

8. Fais la synthèse de mes choix. Relance le skill avec les styles et les mots que j'ai retenus, pour avoir des palettes et des paires de polices de plus, à juger comme le reste. Puis propose trois directions, décrites en mots : un nom, l'ambiance, la palette (avec les contrastes d'accessibilité à respecter), les polices, les formes (coins, bordures, ombres), les images, le mouvement, et ce qui garde notre empreinte. Dis laquelle tu recommandes pour notre cible.

9. Dis-moi quelles captures donner à Claude Design (10 à 15), et ce qu'il faut dire de chacune.

Termine par le « Compte rendu pour Claude Code » : les références retenues avec leur adresse et ce qu'on y prend, les styles d'uupm.cc retenus et écartés, les trois directions, la piste du logo, les polices candidates, et la liste de ce qu'il faut éviter.
```

---

## 1.5 Le positionnement et une page d'accueil qui vend

Où : Claude Chat, projet « PULSACITY — Stratégie », nouvelle conversation.

Ce que vous en tirez : le texte complet de la page d'accueil v2, que Claude Design dessine (3.5) et que Claude Code intègre (4.7).

```
Prompt 1.5 — Le positionnement et une page d'accueil qui vend.

Contexte : brief-pulsacity.md. La page d'accueil actuelle explique bien, mais elle ne donne pas assez envie d'essayer. Elle tourne trop autour de Systeme.io, alors que PULSACITY est fait pour tous les outils où l'on encaisse. Je veux mieux vendre l'outil, sans être intrusif.

Le catalogue des connecteurs est décidé : connecteurs.md, dans les fichiers du projet.

1. La cible. Décris nos trois ou quatre profils de créateurs : ce qu'ils vendent, où ils encaissent, où ils construisent leur page de vente, leur rapport aux avis, leurs mots à eux.

2. Les douleurs et les objections. Pourquoi ils n'ont pas assez de témoignages, et ce qui les retiendrait d'essayer (« mes clients ne répondront pas », « j'ai déjà un formulaire », « encore un abonnement », « je ne suis pas technique », « ça va casser ma page », le RGPD…). Pour chaque objection, la réponse que le produit apporte vraiment.

3. Les alternatives : ne rien faire, un formulaire Google ou Tally avec des captures d'écran, Google Avis ou Trustpilot, les concurrents du brief. Ce que PULSACITY fait mieux, et ce qu'il fait moins bien.

4. Le positionnement : une phrase (pour qui, quoi, contrairement à quoi), la promesse, trois messages clés, et les preuves qu'on peut honnêtement montrer aujourd'hui, sans aucun client inventé.

5. Les avis vérifiés. Les témoignages de PULSACITY viennent de vraies ventes. Vérifie ce que les règles françaises et européennes sur les avis en ligne demandent à ceux qui les affichent, et dis si « des avis de vrais clients » peut devenir un argument, et à quelles conditions.

6. La page d'accueil v2, section par section, dans l'ordre : le rôle de chaque section, son titre, son texte, son bouton. Garde la démo en quatre temps (vente, e-mail, avis, mur) et l'exemple de widget réel. Montre tout le catalogue des connecteurs, par familles (connecteurs.md). Propose des incitations qui ne dérangent pas : bouton qui reste visible en bas de l'écran sur téléphone, « gratuit, sans carte bancaire », temps d'installation, démo à manipuler… Pas de fenêtre qui surgit, pas de compte à rebours, pas de fausse rareté.

7. Les chiffres. Des statistiques sur l'effet des avis sur les ventes, seulement avec leur source et leur date, de préférence françaises ou européennes. Si une statistique très citée est fragile, dis-le.

8. Les textes. Le texte complet de la page, prêt à intégrer : français, vouvoiement, phrases courtes, casse de phrase. Le bouton d'inscription dit exactement « Créer mon espace ». Aucun mot technique (ni « webhook », ni « API », ni « token »). Respecte nos interdits : pas d'étiquette en majuscules au-dessus d'un titre, pas de mot du titre en couleur ou en italique, pas de « → » dans un bouton. Puis dix variantes du grand titre, avec ce que chacune met en avant.

9. Le référencement : les recherches que font nos créateurs (par exemple « récolter des témoignages clients », « widget avis Systeme.io »), le titre et la description de la page.

Termine par le « Compte rendu pour Claude Code » : le positionnement, les sections dans l'ordre avec tous leurs textes, les deux titres que tu préfères parmi les variantes, les incitations retenues, les mots-clés, et la position sur les avis vérifiés.
```

---

## 1.6 Commercialiser PULSACITY

Où : Claude Chat, projet « PULSACITY — Stratégie », nouvelle conversation, recherche approfondie si proposée. Après 1.5 : remplacez la ligne entre crochets par son compte rendu.

Ce que vous en tirez : les canaux, les réseaux retenus, le plan à 90 jours, et ce que le produit doit offrir pour la commercialisation (le lot 4.1 le range dans la feuille de route).

```
Prompt 1.6 — Commercialiser PULSACITY.

Contexte : brief-pulsacity.md. Je suis seul, avec peu de budget et un temps limité. J'encaisse en tant que particulier, et je créerai une micro-entreprise au seuil de seuil-micro-entreprise.md. J'ai déjà des comptes LinkedIn et Instagram. Je ferai moi-même, avec Claude, les vidéos (motion design compris) et les publications. Je veux être prêt pour une grosse campagne quand la V0 sera complète.

[Compte rendu de 1.5.]

1. Les canaux. Classe les canaux d'acquisition pour notre cible, selon leur coût, le temps qu'ils me prennent et leur effet probable : référencement et guides, YouTube, groupes Facebook (communautés Systeme.io et d'indépendants), LinkedIn, Instagram, TikTok, partenariats (formateurs qui enseignent Systeme.io ou d'autres outils, communautés de coachs), badge « Propulsé par PULSACITY » et parrainage, annuaires de logiciels, podcasts, webinaires à deux, prospection directe. Garde les trois ou quatre meilleurs.

2. Les réseaux sociaux. Dois-je faire TikTok, YouTube, Facebook, Pinterest, Threads ou X, en plus de LinkedIn et d'Instagram ? Décide, avec tes raisons. Pour chaque réseau retenu : son rôle, ses formats, un rythme réaliste pour une personne seule, et ce qui se recycle d'un réseau à l'autre.

3. Les contenus. Quatre ou cinq piliers (par exemple : la preuve sociale sur une page de vente, les coulisses de la construction, les tutoriels, les avant-après de pages de vente, les erreurs à éviter), avec dix idées par pilier.

4. La production avec Claude. Un circuit simple : Claude Chat écrit les textes par séries, Claude Design dessine les modèles, Claude Code anime les vidéos (avec un outil comme Remotion) et produit les visuels en série. Combien de publications préparer d'avance ? Tout d'un coup, ou par vagues ? Quels outils gratuits pour programmer les publications ?

5. Le lancement. Une bêta privée de 15 à 30 créateurs : où les trouver, quoi leur offrir (Essentiel offert le temps de la bêta, par exemple), comment recueillir leurs avis sur PULSACITY avec PULSACITY lui-même. Puis la semaine de lancement, jour par jour.

6. Le plan à 90 jours, semaine par semaine : ce que je fais, le temps que cela me prend, et l'objectif chiffré (visites, inscriptions, premiers widgets affichés, premiers abonnés).

7. La mesure. Les indicateurs à suivre, et l'outil de mesure d'audience sans cookie (donc sans bandeau de consentement) à choisir, gratuit si possible. Comment savoir quel réseau amène des inscriptions.

8. Les règles. Ce que la loi encadre : publicité et partenariats (loi sur l'influence de 2023), mention des liens d'affiliation, prospection par e-mail entre professionnels, musique dans les vidéos, citation des marques des outils (Systeme.io, Stripe…), usage des avis des bêta-testeurs dans nos publications. Ce qui change pour un vendeur particulier, avant la micro-entreprise.

9. Ce que le produit doit offrir pour soutenir la commercialisation : parrainage enregistré, programme d'affiliation, e-mails d'accueil des nouveaux créateurs, liens suivis, mur d'avis de PULSACITY sur pulsacity.com… Classe-les par priorité.

10. La publicité payante, plus tard : quand la lancer, sur quel réseau, avec quel budget de test, et ce qu'un pixel publicitaire imposerait (bandeau de consentement).

Termine par le « Compte rendu pour Claude Code » : les canaux retenus, les réseaux retenus avec leur rythme, les piliers de contenu, le plan à 90 jours en titres, les indicateurs, l'outil de mesure, et la liste priorisée de ce que le produit doit offrir.
```
