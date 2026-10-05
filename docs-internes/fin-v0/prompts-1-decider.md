# Étape 0 et étape 1 : décider

Prompts pour Claude Chat, dans le projet « PULSACITY — Stratégie ». Une conversation par prompt, recherche web activée.

| N° | Sujet | Quand |
| --- | --- | --- |
| 0 | Créer le projet Claude | En premier, 10 minutes |
| 1.1 | Statut juridique et création de l'entreprise | Tout de suite : l'immatriculation prend du temps |
| 1.2 | Le catalogue des connecteurs | En parallèle |
| 1.3 | Les tarifs sont-ils rentables ? | Après 1.1, ou tout de suite (l'analyse traite alors les deux cas de TVA) |
| 1.4 | La direction visuelle de la v2 | En parallèle ; vous explorez vous-même entre les deux temps du prompt |
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
2. Instructions du projet : collez le bloc ci-dessous.
3. Fichiers du projet. Ouvrez chacun de ces liens, cliquez sur l'icône « Download raw file » en haut à droite du fichier, puis ajoutez le fichier au projet :
   - https://github.com/jawadboughalem/PULSACITY/blob/main/docs-internes/fin-v0/brief-pulsacity.md
   - https://github.com/jawadboughalem/PULSACITY/blob/main/docs-internes/fin-v0/inventaire-ecrans.md
   - https://github.com/jawadboughalem/PULSACITY/blob/main/docs-internes/decision_tarifs.md
4. Dans chaque conversation : la recherche web activée. Pour 1.2, 1.3, 1.4 et 1.6, le mode de recherche approfondie s'il vous est proposé.

```
Tu conseilles le fondateur de PULSACITY. Il construit ce logiciel seul, avec Claude : Claude Chat pour décider, Claude Design pour dessiner, Claude Code pour construire, Claude in Chrome pour agir sur les services en ligne.

Avant chaque réponse, appuie-toi sur les fichiers du projet : brief-pulsacity.md (le produit, les prix, les coûts, les contraintes), inventaire-ecrans.md (les écrans), decision_tarifs.md (les prix TVA comprise), et les comptes rendus déjà ajoutés.

Ta façon de travailler :
- Français, vouvoiement, phrases courtes. Pas de jargon sans explication.
- Pragmatique : un fondateur seul, un petit budget, peu de temps. Il veut des décisions. Termine chaque analyse par une recommandation nette, avec ses raisons, ses risques et ce qui la ferait changer.
- Le gratuit d'abord. Quand une option est payante, donne son prix et l'alternative gratuite si elle existe.
- Vérifie par la recherche web chaque chiffre, prix, seuil, taux, délai ou règle, et cite la source avec sa date. Ce que tu n'as pas pu vérifier, écris-le « non vérifié ». N'invente jamais un chiffre, une statistique, un témoignage ou un client.
- Pour les règles françaises, préfère les sources officielles : entreprendre.service-public.fr, service-public.fr, urssaf.fr, autoentrepreneur.urssaf.fr, impots.gouv.fr, economie.gouv.fr, cnil.fr, legifrance.gouv.fr, inpi.fr.
- Dis ce qui demande un professionnel (expert-comptable, avocat) et ce qui peut se faire seul.
- Si une question dépend de ma situation personnelle, pose-la-moi d'abord, en une seule liste.
- Ne me demande jamais de secret (mot de passe, clé, code reçu par SMS). Mes informations personnelles servent à la conversation, jamais au compte rendu.
- Finis chaque réponse qui décide quelque chose par un bloc « Compte rendu pour Claude Code » : les décisions et les chiffres retenus, en liste, sans aucune donnée personnelle (ni nom, ni adresse, ni téléphone, ni numéro d'entreprise), prêt à être copié tel quel.
```

---

## 1.1 Statut juridique et création de l'entreprise

Où : Claude Chat, projet « PULSACITY — Stratégie », nouvelle conversation. À lancer en premier.

Ce que vous en tirez : le statut, le régime de TVA, les mentions des factures et des pages légales, la liste ordonnée des démarches. C'est la base des prompts 1.3 et 2.1 à 2.8.

```
Prompt 1.1 — Statut juridique et création de l'entreprise.

Contexte : je n'ai pas encore d'entreprise. Je veux encaisser les abonnements de PULSACITY (brief-pulsacity.md) le plus tôt possible, légalement, au moindre coût. J'envisage la micro-entreprise.

Commence par me poser, en une seule liste, les questions dont tu as besoin sur ma situation. Par exemple : si je suis salarié, et ce que dit mon contrat (exclusivité, non-concurrence, loyauté) ; si j'ai déjà une autre activité ou une entreprise ; si j'ai droit à des aides (demandeur d'emploi, moins de 26 ans…) ; mon revenu fiscal de référence (pour le versement libératoire) ; le chiffre d'affaires que j'espère la première et la deuxième année ; si je veux éviter d'afficher mon adresse personnelle. Attends mes réponses avant d'analyser.

Ensuite, réponds à tout ceci, avec les règles en vigueur en octobre 2026.

1. Le statut. Compare pour mon cas : micro-entreprise, entreprise individuelle au réel, EURL, SASU. Coûts de création et coûts annuels, cotisations, impôt, protection du patrimoine, obligations comptables, crédibilité auprès des clients et de Stripe, facilité à changer plus tard. Recommandes-en un.

2. L'activité. PULSACITY vend des abonnements à un logiciel en ligne, surtout à des professionnels. Est-ce une activité commerciale (BIC) ou libérale (BNC) ? Quel code APE (par exemple 58.29C, 62.01Z ou 63.11Z) ? Quels taux de cotisations, quel plafond de chiffre d'affaires, quel taux de versement libératoire en découlent ? Quelle inscription (registre national des entreprises) ?

3. La TVA. Les seuils de la franchise en base pour les prestations de services en 2026, et ce que sont devenues les réformes de seuil annoncées ces dernières années. Puis, pour chaque cas :
   - les ventes à des entreprises françaises ;
   - à des entreprises d'un autre pays de l'Union : autoliquidation, et faut-il un numéro de TVA intracommunautaire même en franchise ?
   - à des particuliers de l'Union : seuil de 10 000 €, guichet unique OSS, régime de franchise européen des petites entreprises ;
   - à la Suisse et au Canada (Québec compris), pour des services numériques.
   Dis ce qui est le plus simple et le plus avantageux pour moi, et la mention exacte à porter sur les factures et les pages légales.

4. Les aides et les charges :
   - ACRE : qui y a droit, comment la demander ;
   - CFE : l'exonération de la première année, l'ordre de grandeur ensuite ;
   - assurance responsabilité civile professionnelle : obligatoire ou non, utile pour un sous-traitant de données personnelles, prix ;
   - compte bancaire dédié : obligatoire à partir de quand ?

5. L'adresse et le téléphone. Les mentions légales du site doivent donner une adresse et un numéro de téléphone (LCEN). Puis-je éviter d'afficher mon domicile, et à quel prix (domiciliation) ? Quelles options gratuites, ou les moins chères, pour un numéro joignable distinct de mon numéro personnel ?

6. Le nom. Exploiter « PULSACITY » comme nom commercial d'une entreprise individuelle : les mentions obligatoires (« EI » ou « entrepreneur individuel »). Faut-il déposer la marque à l'INPI maintenant ? Classes utiles, coût, risque à attendre.

7. Les factures. Leurs mentions obligatoires (entre professionnels : pénalités de retard et indemnité forfaitaire de 40 €), leur numérotation, et si les factures de Stripe Billing suffisent.

8. La facturation électronique. Le calendrier de la réforme pour une micro-entreprise : réception, émission, e-reporting des ventes aux particuliers et à l'étranger. Ce que cela impose à mes factures d'abonnement, quelles plateformes agréées sont gratuites ou peu chères, et ce que je dois faire dès l'immatriculation.

9. Le RGPD. PULSACITY est sous-traitant des données des clients des créateurs : registre des traitements, contrat de sous-traitance, ce que je dois avoir avant le premier client.

10. Les démarches. Une liste ordonnée, de l'immatriculation au premier paiement reçu : chaque étape avec son site officiel, son coût, son délai, et ce que je dois préparer. Mets-moi en garde contre les sites payants qui imitent les démarches gratuites.

Termine par :
- ta recommandation en cinq lignes ;
- ce qui mérite l'avis d'un expert-comptable ou d'un avocat, et ce que je peux faire seul ;
- le « Compte rendu pour Claude Code » : statut, nature de l'activité et code APE, régime de TVA et mention exacte, mentions obligatoires des factures et des pages légales (sans mes informations personnelles), calendrier de la facturation électronique, liste ordonnée des démarches.
```

---

## 1.2 Le catalogue des connecteurs

Où : Claude Chat, projet « PULSACITY — Stratégie », nouvelle conversation, recherche approfondie si proposée.

Ce que vous en tirez : les familles, les outils, leur ordre de construction, ce qui s'affiche en « Bientôt » dès la V0, et leurs textes.

```
Prompt 1.2 — Le catalogue des connecteurs.

Contexte : PULSACITY reçoit les ventes là où les indépendants encaissent, grâce à des connecteurs. Un seul existe : Systeme.io. Stripe et Calendly sont annoncés « Bientôt ». Je ne veux plus que tout tourne autour de Systeme.io. Je veux décider dès maintenant du catalogue complet, groupé par familles, comme l'annuaire des connecteurs de Claude (par exemple « Formations : Systeme.io… », « E-commerce : Shopify… »). Tout le catalogue sera visible dès la V0, avec la mention « Bientôt » pour ce qui n'est pas encore là.

Règle du produit : un connecteur n'est construit qu'après la capture de vraies notifications de l'outil. « Bientôt » ne promet donc pas de date.

1. Les familles. Propose 6 à 9 familles, nommées en mots simples pour un indépendant. Par exemple : formations et tunnels de vente ; paiements ; rendez-vous et séances ; e-commerce ; facturation ; événements et billetterie ; communautés et abonnements ; e-mailing et CRM ; automatisation (Zapier, Make, n8n, et un connecteur universel).

2. Les outils. Pour chaque famille, les outils les plus utilisés par les indépendants francophones (coachs, formateurs, consultants, thérapeutes, créateurs), en France, en Belgique, en Suisse et au Québec. N'oublie pas les outils français : par exemple Learnybox, Schoolmaker, Teachizy, HelloAsso, Weezevent, Livestorm, Brevo, et ceux que tu trouves. Pour chacun, vérifie et donne :
   - l'événement qui déclencherait une demande d'avis (vente, inscription, séance réalisée, facture payée…) ;
   - le moyen technique : notification automatique de l'outil (webhook), connexion du compte (API avec OAuth), ou seulement par Zapier ou Make ;
   - si ce moyen demande un abonnement payant de l'outil ;
   - les données disponibles : e-mail, prénom, nom, produit, prix, date ;
   - sa notoriété auprès de notre cible (élevée, moyenne, faible), avec une source si possible ;
   - l'effort de construction (petit, moyen, gros) ;
   - une contrainte de ses conditions d'utilisation (interdiction de solliciter des avis, accès réservé aux partenaires…).

3. Le raccourci universel. Évalue un connecteur universel : une adresse PULSACITY qui accepte des ventes dans un format simple, depuis Zapier, Make, n8n ou n'importe quel outil capable d'envoyer une notification. Combien d'outils couvrirait-il tout de suite ? Faut-il publier une application officielle sur Zapier et sur Make, et qu'est-ce que cela demande ?

4. Les priorités. Classe les connecteurs à construire après Systeme.io en trois vagues, avec tes raisons : taille de la cible, facilité, effet sur les inscriptions. Dis si l'ordre prévu (Stripe, puis Calendly ou Cal.com) tient.

5. Ce qui s'affiche en V0. Combien d'outils montrer en « Bientôt » sans perdre en crédibilité ? Lesquels ? Faut-il une page publique par outil (comme /integrations/stripe), ou seulement pour les prioritaires ? « Me prévenir » mesure déjà la demande : comment s'en servir pour décider ?

6. Où s'affiche le widget. Il se colle dans toute page qui accepte du HTML. Liste les constructeurs de pages de nos créateurs (Systeme.io, WordPress, Wix, Webflow, Framer, Shopify, Kajabi, Podia, Notion, Carrd…), en notant ceux qui ne l'acceptent pas, ou seulement sur un plan payant. Ce sera une seconde liste, « Compatible avec votre site », distincte des connecteurs.

7. Les textes. Pour chaque famille : un titre et une phrase. Pour chaque outil affiché : une phrase qui dit ce qui déclenche la demande, sur le modèle de « Paiements en ligne : une demande d'avis après chaque paiement réussi. » Français, vouvoiement, phrases courtes, aucun mot technique (ni « webhook », ni « API », ni « token »).

Termine par le « Compte rendu pour Claude Code » :
- les familles, dans l'ordre, avec leur titre et leur phrase ;
- un tableau des outils : nom, famille, statut (disponible, bientôt, plus tard), vague, page publique (oui ou non), phrase affichée, événement déclencheur, moyen technique ;
- le verdict sur le connecteur universel ;
- la liste « Compatible avec votre site ».
```

---

## 1.3 Les tarifs sont-ils rentables ?

Où : Claude Chat, projet « PULSACITY — Stratégie », nouvelle conversation, recherche approfondie si proposée. Remplacez la ligne entre crochets par le compte rendu de 1.1, ou supprimez-la.

Ce que vous en tirez : garder ou changer les prix, avec les chiffres, et la règle de passage à un plan inférieur (qui manque aux CGV).

```
Prompt 1.3 — Les tarifs sont-ils rentables ?

Contexte : brief-pulsacity.md (plans, limites, coûts) et decision_tarifs.md (prix TVA comprise). J'ai voulu rester sous la barre psychologique des 10 € : Essentiel à 9,99 € par mois (99 € par an), Pro à 19,99 € par mois (199 € par an), et un plan Gratuit. Je ne suis pas sûr de ce choix. Je dois être pragmatique : ce projet doit me rapporter un revenu. Tranche : on garde, ou on change, et pour quels prix.

[Compte rendu de 1.1. S'il n'est pas là, traite les deux cas : TVA collectée à 20 % et franchise en base.]

1. Les coûts, vérifiés aujourd'hui. Pour chaque service du brief (Vercel, Supabase, Resend, Cloudflare R2, Stripe, domaines, GitHub), et pour ce qui viendra (mesure d'audience, suivi des erreurs, plateforme de facturation électronique, assurance, comptabilité, abonnement Claude) : le prix actuel, les seuils des offres gratuites, et le moment où il faut passer au payant. Donne les coûts fixes par mois à 0, 50, 200, 500 et 1 000 créateurs actifs.

2. Les coûts variables. Un créateur qui fait 30 ventes par mois déclenche jusqu'à 60 e-mails de demande et de relance, plus les e-mails de connexion et de nouveau témoignage. Un espace Gratuit peut envoyer 20 demandes par mois, soit jusqu'à 40 e-mails. Calcule ce que coûtent les e-mails, les photos et les fonctions par espace, et ce que coûtent les espaces gratuits à grande échelle.

3. Ce qui me reste par abonné, en mensuel et en annuel, pour chaque plan. Retire les frais Stripe (paiement, Billing, Tax), puis les cotisations sociales et l'impôt selon le statut retenu (la micro-entreprise, à défaut).

4. Les seuils. Combien d'abonnés payants pour couvrir les coûts fixes ? Pour gagner, après cotisations, 1 000 €, 2 000 € et 3 500 € par mois ? Avec combien d'inscrits, selon des taux de passage au payant réalistes ?

5. Les repères. Pour un petit logiciel vendu à des indépendants : taux de passage du gratuit au payant, part de l'annuel, taux de départ mensuel, durée de vie d'un client, coût d'acquisition acceptable. Sources et dates.

6. La concurrence. Les prix d'octobre 2026, en euros, mensuels et annuels, et ce que permet chaque offre gratuite : Senja, Testimonial.to, Famewall, Shapo, Trustmary, Vocal Video, EmbedSocial, Elfsight, et les acteurs français. Où se place PULSACITY ?

7. Les questions à trancher :
   - 9,99 € est-il le bon prix d'Essentiel, ou laisse-t-il de l'argent sur la table ? Que se passerait-il à 12 € ou à 14,99 € ?
   - Le Pro n'a qu'un avantage : retirer le badge. Justifie-t-il le double ? Que devrait-il contenir plus tard (par exemple les témoignages vidéo de la V1), sans rien changer à la V0 ?
   - L'annuel à deux mois offerts est-il bien réglé ?
   - Le plan Gratuit (15 témoignages validés, 20 demandes par mois, 1 widget) est-il trop généreux ou trop serré, sachant que son badge fait connaître PULSACITY ?
   - Faut-il un essai gratuit du plan payant, un prix de lancement pour les premiers abonnés, des codes promotionnels ?
   - Quand un créateur passe à un plan inférieur : à quelle date, et que deviennent ses widgets en trop, ses témoignages au-delà de la limite, son badge ? Rien n'est jamais supprimé.
   - Comment changer un prix plus tard sans fâcher les abonnés déjà là ?

8. Le verdict. Les prix et les limites que tu recommandes, plan par plan, mensuels et annuels, TVA comprise. Si tu recommandes de garder les prix actuels, dis-le franchement. Dis quand réexaminer (après combien d'abonnés ou de mois) et quels chiffres surveiller.

Termine par le « Compte rendu pour Claude Code » : les prix et les limites retenus, ce que contient chaque plan, l'essai ou le prix de lancement s'il y en a, la règle de passage à un plan inférieur, la phrase sur la TVA de la page Tarifs selon le régime, et les seuils de rentabilité.
```

---

## 1.4 La direction visuelle de la v2

Où : Claude Chat, projet « PULSACITY — Stratégie », nouvelle conversation, recherche approfondie si proposée.

Le prompt se fait en deux temps. Claude vous donne les sites et la grille ; vous explorez vous-même, en remplissant la grille et en prenant des captures ; puis vous revenez dans la même conversation avec la grille et les captures.

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
   - des galeries où chercher (par exemple Land-book, Lapa Ninja, Godly, Awwwards, Mobbin, Refero).
   Pour chacun : l'adresse, pourquoi il est là, et ce que je dois regarder (couleurs, typographie, mise en page, illustrations ou photos, mouvement, façon de montrer le produit, ton).

3. La grille. Une grille à remplir pour chaque site : ce que j'aime, ce que je n'aime pas, ce qu'on pourrait prendre pour PULSACITY, une note de 1 à 5, capture prise ou non.

4. Les pièges. Les tendances de 2026 qui vieilliront vite. Et nos interdits, qui restent en v2 : étiquettes en majuscules espacées au-dessus des titres, un mot du titre en couleur ou en italique, flèches « → » dans les boutons, grilles de cartes identiques avec la même ombre, dégradés décoratifs, animations d'apparition sur chaque section, numérotation 01/02/03 hors d'une vraie séquence.

5. Les polices. Des polices gratuites pour un usage commercial sur le web (Google Fonts, Fontshare, et d'autres), pour les titres et pour l'interface. Vérifie leur licence, leurs accents français et leurs chiffres.

6. Le logo. Des exemples de logos qui ont gagné en caractère sans changer d'idée. Ce qui rendrait la fusée et l'étoile plus fortes, lisibles à 16 px, en une seule couleur et sur fond sombre.

Puis attends : je reviens avec ma grille remplie et mes captures. À ce moment-là :

7. Fais la synthèse de mes choix, puis propose trois directions, décrites en mots : un nom, l'ambiance, la palette (avec les contrastes d'accessibilité à respecter), les polices, les formes (coins, bordures, ombres), les images, le mouvement, et ce qui garde notre empreinte. Dis laquelle tu recommandes pour notre cible.

8. Dis-moi quelles captures donner à Claude Design (10 à 15), et ce qu'il faut dire de chacune.

Termine par le « Compte rendu pour Claude Code » : les références retenues avec leur adresse et ce qu'on y prend, les trois directions, la piste du logo, les polices candidates, et la liste de ce qu'il faut éviter.
```

---

## 1.5 Le positionnement et une page d'accueil qui vend

Où : Claude Chat, projet « PULSACITY — Stratégie », nouvelle conversation. Remplacez la ligne entre crochets par le compte rendu de 1.2, ou supprimez-la.

Ce que vous en tirez : le texte complet de la page d'accueil v2, que Claude Design dessine (3.5) et que Claude Code intègre (4.7).

```
Prompt 1.5 — Le positionnement et une page d'accueil qui vend.

Contexte : brief-pulsacity.md. La page d'accueil actuelle explique bien, mais elle ne donne pas assez envie d'essayer. Elle tourne trop autour de Systeme.io, alors que PULSACITY est fait pour tous les outils où l'on encaisse. Je veux mieux vendre l'outil, sans être intrusif.

[Compte rendu de 1.2.]

1. La cible. Décris nos trois ou quatre profils de créateurs : ce qu'ils vendent, où ils encaissent, où ils construisent leur page de vente, leur rapport aux avis, leurs mots à eux.

2. Les douleurs et les objections. Pourquoi ils n'ont pas assez de témoignages, et ce qui les retiendrait d'essayer (« mes clients ne répondront pas », « j'ai déjà un formulaire », « encore un abonnement », « je ne suis pas technique », « ça va casser ma page », le RGPD…). Pour chaque objection, la réponse que le produit apporte vraiment.

3. Les alternatives : ne rien faire, un formulaire Google ou Tally avec des captures d'écran, Google Avis ou Trustpilot, les concurrents du brief. Ce que PULSACITY fait mieux, et ce qu'il fait moins bien.

4. Le positionnement : une phrase (pour qui, quoi, contrairement à quoi), la promesse, trois messages clés, et les preuves qu'on peut honnêtement montrer aujourd'hui, sans aucun client inventé.

5. Les avis vérifiés. Les témoignages de PULSACITY viennent de vraies ventes. Vérifie ce que les règles françaises et européennes sur les avis en ligne demandent à ceux qui les affichent, et dis si « des avis de vrais clients » peut devenir un argument, et à quelles conditions.

6. La page d'accueil v2, section par section, dans l'ordre : le rôle de chaque section, son titre, son texte, son bouton. Garde la démo en quatre temps (vente, e-mail, avis, mur) et l'exemple de widget réel. Montre tout le catalogue des connecteurs, par familles. Propose des incitations qui ne dérangent pas : bouton qui reste visible en bas de l'écran sur téléphone, « gratuit, sans carte bancaire », temps d'installation, démo à manipuler… Pas de fenêtre qui surgit, pas de compte à rebours, pas de fausse rareté.

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

Contexte : brief-pulsacity.md. Je suis seul, avec peu de budget et un temps limité. J'ai déjà des comptes LinkedIn et Instagram. Je ferai moi-même, avec Claude, les publicités, les vidéos (motion design compris) et les publications. Je veux être prêt pour une grosse campagne quand la V0 sera complète.

[Compte rendu de 1.5.]

1. Les canaux. Classe les canaux d'acquisition pour notre cible, selon leur coût, le temps qu'ils me prennent et leur effet probable : référencement et guides, YouTube, groupes Facebook (communautés Systeme.io et d'indépendants), LinkedIn, Instagram, TikTok, partenariats (formateurs qui enseignent Systeme.io ou d'autres outils, communautés de coachs), programme d'affiliation, badge « Propulsé par PULSACITY » et parrainage, annuaires de logiciels, podcasts, webinaires à deux, prospection directe. Garde les trois ou quatre meilleurs.

2. Les réseaux sociaux. Dois-je faire TikTok, YouTube, Facebook, Pinterest, Threads ou X, en plus de LinkedIn et d'Instagram ? Décide, avec tes raisons. Pour chaque réseau retenu : son rôle, ses formats, un rythme réaliste pour une personne seule, et ce qui se recycle d'un réseau à l'autre.

3. Les contenus. Quatre ou cinq piliers (par exemple : la preuve sociale sur une page de vente, les coulisses de la construction, les tutoriels, les avant-après de pages de vente, les erreurs à éviter), avec dix idées par pilier.

4. La production avec Claude. Un circuit simple : Claude Chat écrit les textes par séries, Claude Design dessine les modèles, Claude Code anime les vidéos (avec un outil comme Remotion) et produit les visuels en série. Combien de publications préparer d'avance ? Tout d'un coup, ou par vagues ? Quels outils gratuits pour programmer les publications ?

5. Le lancement. Une bêta privée de 15 à 30 créateurs : où les trouver, quoi leur offrir, comment recueillir leurs avis sur PULSACITY avec PULSACITY lui-même. Puis la semaine de lancement, jour par jour.

6. Le plan à 90 jours, semaine par semaine : ce que je fais, le temps que cela me prend, et l'objectif chiffré (visites, inscriptions, premiers widgets affichés, premiers abonnés).

7. La mesure. Les indicateurs à suivre, et l'outil de mesure d'audience sans cookie (donc sans bandeau de consentement) à choisir, avec son prix. Comment savoir quel réseau amène des inscriptions.

8. Les règles. Ce que la loi encadre : publicité et partenariats rémunérés (loi sur l'influence de 2023), mention des liens d'affiliation, prospection par e-mail entre professionnels, musique dans les vidéos, citation des marques des outils (Systeme.io, Stripe…), usage des avis des bêta-testeurs dans nos publicités.

9. Ce que le produit doit offrir pour soutenir la commercialisation : parrainage enregistré, programme d'affiliation, e-mails d'accueil des nouveaux créateurs, liens suivis, mur d'avis de PULSACITY sur pulsacity.com… Classe-les par priorité.

10. La publicité payante, plus tard : quand la lancer, sur quel réseau, avec quel budget de test, et ce qu'un pixel publicitaire imposerait (bandeau de consentement).

Termine par le « Compte rendu pour Claude Code » : les canaux retenus, les réseaux retenus avec leur rythme, les piliers de contenu, le plan à 90 jours en titres, les indicateurs, l'outil de mesure, et la liste priorisée de ce que le produit doit offrir.
```
