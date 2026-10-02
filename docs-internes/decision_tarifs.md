# Décision : des prix TVA comprise

Arrêtée le 2 octobre 2026, à la demande du fondateur, avant la page Tarifs (maquette 8) et le lot Stripe.

## La décision

Les prix de PULSACITY sont des prix **TVA comprise** : le montant affiché est celui que le créateur paie.

| Plan | Par mois | Par an |
| --- | --- | --- |
| Gratuit | 0 € | 0 € |
| Essentiel | 9 € | 90 € |
| Pro | 19 € | 190 € |

Les montants ne changent pas : `src/config/plans.ts` (`priceCents`) les tient déjà, et ce sont désormais des montants TVA comprise.

## Pourquoi

### 1. Pour la plupart de nos créateurs, la TVA est un coût

Notre cible, ce sont des indépendants : coachs, formateurs, consultants, créateurs. Beaucoup ne récupèrent pas la TVA :
- les micro-entrepreneurs sous la franchise en base (« TVA non applicable, art. 293 B du CGI ») ne facturent pas de TVA et ne récupèrent pas celle qu'ils paient ;
- les formateurs déclarés comme organisme de formation sont souvent exonérés de TVA sur leurs formations (art. 261-4-4° du CGI), et ne récupèrent pas non plus celle de leurs achats liés à cette activité.

Pour eux, « 9 € HT » est un prix qu'ils ne paient jamais : ils paient 10,80 €. Afficher HT, c'est leur montrer un prix plus bas que la réalité, et le corriger à la dernière étape du paiement.

### 2. Un prix rond qui reste rond

« 9 € » devient « 10,80 € » au moment de payer : la surprise arrive à l'écran où l'on perd le plus de clients, et elle casse la promesse de m8 (« Un prix simple, qui suit vos ventes »). Avec un prix TVA comprise, on paie le prix annoncé, sans calcul.

### 3. Un seul prix dans tous les pays francophones

La TVA varie d'un pays à l'autre (20 % en France, 21 % en Belgique, 17 % au Luxembourg), et la Suisse, le Québec ou l'Afrique francophone ont leurs propres règles. En TVA comprise, tout le monde voit et paie 9 €. C'est notre marge qui varie un peu, pas le prix des clients.

### 4. Ceux qui récupèrent la TVA y gagnent

- Une entreprise française assujettie paie 9 €, en récupère 1,50 € et revient à 7,50 € HT : moins cher qu'à 9 € HT.
- Une entreprise d'un autre pays de l'Union, avec un numéro de TVA, est en autoliquidation : elle paie 9 €, sans TVA, et nous gardons les 9 €.

Personne ne paie plus qu'avec un prix HT.

### 5. Le prix public ne dépend pas du régime de TVA de PULSACITY

Que l'entité qui facture soit en franchise en base ou assujettie, le prix affiché ne bouge pas. Le jour où elle devient assujettie, aucun client ne voit son prix augmenter de 20 % : seule notre part nette baisse. Avec un prix HT, ce jour-là imposerait une hausse à tous les abonnés.

### 6. C'est la règle pour le grand public

Les prix proposés aux consommateurs s'affichent TTC en France. Nos clients sont des professionnels, donc l'affichage HT serait permis. Mais beaucoup d'indépendants, au début, se comportent en particuliers : ils comparent sans logiciel de comptabilité, et paient souvent avec leur carte personnelle.

## Ce que ça coûte

Par abonné Essentiel mensuel en France, à 9 € :

| | Prix HT (9 € + TVA) | Prix TTC (9 € TVA comprise) |
| --- | --- | --- |
| Payé par le client | 10,80 € | 9,00 € |
| TVA reversée | 1,80 € | 1,50 € |
| Frais Stripe (carte européenne, Billing, Tax) | ≈ 0,54 € | ≈ 0,49 € |
| **Reste à PULSACITY** | **≈ 8,46 €** | **≈ 7,01 €** |

Soit environ 1,45 € de moins par mois et par abonné Essentiel (−17 %). Pour Pro (19 €), environ 15,07 € au lieu de 18,13 €. En annuel, les frais fixes par paiement pèsent moins : Essentiel à 90 € par an laisse environ 72,30 €.

Frais Stripe pris en compte, à revérifier sur la grille Stripe au lot Stripe : 1,5 % + 0,25 € par paiement par carte européenne, 0,7 % pour Billing, 0,5 % pour Stripe Tax.

Les coûts variables d'un espace (e-mails de demande, photos) restent de l'ordre de quelques centimes par mois ; le reste (Vercel, Supabase, Resend) est un coût fixe. La marge reste donc très large dans les deux cas. Nous acceptons de gagner un peu moins par abonné pour en convaincre davantage.

## Ce qui a été écarté

- **9 € HT** : environ 1,45 € de plus par abonné, mais un prix qui n'est pas le vrai pour la majorité de notre cible, une hausse à la dernière étape du paiement, et un total différent selon le pays.
- **10 € TTC pour compenser** : passer la barre des 10 € pour 1 € de plus par mois. Si les prix doivent monter un jour, ce sera pour les nouveaux abonnés seulement.

## Ce que ça change

### Textes

- Dans l'application : « 9 € par mois », sans mention de taxe. L'encadré du plan Gratuit (m18) dit « Avec le plan Essentiel, à 9 € par mois, vous créez autant de widgets que vous voulez : un pour chaque page de vente. »
- Page Tarifs (m8), à faire redessiner par Design :
  - sous chaque prix, « par mois » (ou « par an »), sans « HT » ;
  - sous le titre, « TVA comprise » au lieu de « prix hors taxes » ;
  - question « Les prix incluent-ils la TVA ? » : « Oui. Le prix affiché est celui que vous payez, TVA comprise. Si votre entreprise récupère la TVA, la facture la détaille : Essentiel vous revient à 7,50 € HT par mois. Avec un numéro de TVA d'un autre pays de l'Union européenne, la TVA est autoliquidée : vous payez 9 €, sans TVA. »
  - « Tri par offre » : à retirer des avantages d'Essentiel et à montrer dans tous les plans, puisque le choix d'une offre est ouvert au plan Gratuit (décision du 2 octobre, `etat.md`).
- CGV : les prix y sont indiqués TVA comprise (à relire avant `LEGAL_VALIDATED=true`).

### Stripe (lot Stripe)

- Prix en euros, `tax_behavior: "inclusive"` : 900, 9000, 1900 et 19000 centimes, comme `priceCents`.
- Si l'entité qui facture est assujettie : Stripe Tax activé là où elle est immatriculée, adresse et numéro de TVA demandés au paiement (autoliquidation pour les entreprises de l'Union hors de France), TVA détaillée sur chaque facture.
- Si elle est en franchise en base : pas de TVA collectée, et la mention « TVA non applicable, art. 293 B du CGI » sur les factures.

## Ce qui reste au fondateur

- Confirmer avec votre expert-comptable le régime de TVA de l'entité qui facture PULSACITY (franchise en base ou assujettie), et, le cas échéant, l'immatriculation au guichet unique de l'Union (OSS) pour les ventes aux particuliers des autres pays de l'Union. Ça ne change pas les prix affichés, seulement la configuration de Stripe et les mentions des factures.
- Les ventes hors de l'Union (Suisse, Canada) : à revoir si elles deviennent importantes, car ces pays imposent leurs propres règles aux services numériques au-delà de certains seuils.
