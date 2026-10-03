# Décision : des prix TVA comprise, à 9,99 € et 19,99 €

Arrêtée le 2 octobre 2026, avant la page Tarifs (maquette 8) et le lot Stripe. Claude Code a proposé les prix TVA comprise ; le fondateur a fixé les montants à 9,99 € et 19,99 € pour préserver la marge.

## La décision

Les prix de PULSACITY sont des prix **TVA comprise** : le montant affiché est celui que le créateur paie.

| Plan | Par mois | Par an |
| --- | --- | --- |
| Gratuit | 0 € | 0 € |
| Essentiel | 9,99 € | 99 € |
| Pro | 19,99 € | 199 € |

L'annuel vaut dix mois : 10 × 9,99 € = 99,90 €, arrondi à 99 €. « Annuel : 2 mois offerts » reste vrai.

`src/config/plans.ts` (`priceCents`) tient ces montants : 999 et 9900, 1999 et 19900 centimes.

## Pourquoi TVA comprise

### 1. Pour la plupart de nos créateurs, la TVA est un coût

Notre cible, ce sont des indépendants : coachs, formateurs, consultants, créateurs. Beaucoup ne récupèrent pas la TVA :
- les micro-entrepreneurs sous la franchise en base (« TVA non applicable, art. 293 B du CGI ») ne facturent pas de TVA et ne récupèrent pas celle qu'ils paient ;
- les formateurs déclarés comme organisme de formation sont souvent exonérés de TVA sur leurs formations (art. 261-4-4° du CGI), et ne récupèrent pas non plus celle de leurs achats liés à cette activité.

Pour eux, un prix HT est un prix qu'ils ne paient jamais : « 9,99 € HT » deviendrait 11,99 € au paiement. Afficher HT, c'est leur montrer un prix plus bas que la réalité, et le corriger à la dernière étape.

### 2. Le prix annoncé est le prix payé

La surprise d'une TVA ajoutée arrive à l'écran où l'on perd le plus de clients, et elle casse la promesse de m8 (« Un prix simple, qui suit vos ventes »). Avec un prix TVA comprise, on paie le prix annoncé, sans calcul.

### 3. Un seul prix dans tous les pays francophones

La TVA varie d'un pays à l'autre (20 % en France, 21 % en Belgique, 17 % au Luxembourg), et la Suisse, le Québec ou l'Afrique francophone ont leurs propres règles. En TVA comprise, tout le monde voit et paie 9,99 €. C'est notre marge qui varie un peu, pas le prix des clients.

### 4. Ceux qui récupèrent la TVA y gagnent

- Une entreprise française assujettie paie 9,99 €, en récupère 1,67 € et revient à 8,33 € HT.
- Une entreprise d'un autre pays de l'Union, avec un numéro de TVA, est en autoliquidation : elle paie 9,99 €, sans TVA, et nous gardons les 9,99 €.

### 5. Le prix public ne dépend pas du régime de TVA de PULSACITY

Que l'entité qui facture soit en franchise en base ou assujettie, le prix affiché ne bouge pas. Le jour où elle devient assujettie, aucun client ne voit son prix augmenter de 20 % : seule notre part nette baisse. Avec un prix HT, ce jour-là imposerait une hausse à tous les abonnés.

### 6. C'est la règle pour le grand public

Les prix proposés aux consommateurs s'affichent TTC en France. Nos clients sont des professionnels, donc l'affichage HT serait permis. Mais beaucoup d'indépendants, au début, se comportent en particuliers : ils comparent sans logiciel de comptabilité, et paient souvent avec leur carte personnelle.

## Pourquoi 9,99 € et 19,99 € plutôt que 9 € et 19 €

Arbitrage du fondateur :
- à 9 € TVA comprise, il reste 7,50 € HT ; à 9,99 €, 8,33 € HT, soit 11 % de plus pour couvrir les coûts de structure ;
- 9,99 € reste sous la barre des 10 € : il se lit « 9 et quelques ».

Deux réserves, notées pour plus tard :
- l'effet sur la conversion devrait être faible, puisque le premier chiffre ne change pas, mais il n'est pas nul par principe : on le vérifiera avec les premiers chiffres de Stripe (taux de passage au payant), et un changement de prix ne s'appliquerait qu'aux nouveaux abonnés ;
- « 9,99 € » se lit plus « commerce » qu'un prix rond, dans une charte sobre : c'est à Design de le rendre posé sur la page Tarifs (taille des centimes, alignement).

## Ce que ça rapporte

Par abonné en France, en mensuel :

| | Essentiel 9 € | Essentiel 9,99 € | Pro 19 € | Pro 19,99 € |
| --- | --- | --- | --- | --- |
| Payé par le client | 9,00 € | 9,99 € | 19,00 € | 19,99 € |
| HT (TVA de 20 % retirée) | 7,50 € | 8,33 € | 15,83 € | 16,66 € |
| Frais Stripe (carte européenne, Billing, Tax) | ≈ 0,49 € | ≈ 0,52 € | ≈ 0,76 € | ≈ 0,79 € |
| **Reste à PULSACITY** | **≈ 7,01 €** | **≈ 7,81 €** | **≈ 15,07 €** | **≈ 15,87 €** |

En annuel, les frais fixes par paiement pèsent moins : Essentiel à 99 € par an laisse environ 79,60 € (82,50 € HT), Pro à 199 € environ 160,20 € (165,83 € HT).

Pour comparaison, un prix de 9 € HT (10,80 € payés) laisserait environ 8,46 € : 9,99 € TVA comprise rattrape plus de la moitié de l'écart (7,81 € au lieu de 7,01 €), pour un client qui paie 0,81 € de moins qu'avec 9 € HT.

Frais Stripe pris en compte, à revérifier sur la grille Stripe au lot Stripe : 1,5 % + 0,25 € par paiement par carte européenne, 0,7 % pour Billing, 0,5 % pour Stripe Tax.

Les coûts variables d'un espace (e-mails de demande, photos) restent de l'ordre de quelques centimes par mois ; le reste (Vercel, Supabase, Resend) est un coût fixe.

## Ce qui a été écarté

- **Prix HT** : un prix qui n'est pas le vrai pour la majorité de notre cible, une hausse à la dernière étape du paiement, et un total différent selon le pays.
- **9 € et 19 € TVA comprise** : 11 % de moins par abonné, pour un gain de conversion probablement faible sous la barre des 10 €.
- **10 € et 20 €** : passer la barre des 10 € pour 0,01 € de plus.

## Ce que ça change

### Textes

- Dans l'application : « 9,99 € par mois », sans mention de taxe. L'encadré du plan Gratuit (m18) dit « Avec le plan Essentiel, à 9,99 € par mois, vous créez autant de widgets que vous voulez : un pour chaque page de vente. »
- Page Tarifs (m8), redessinée par Design le 3 octobre 2026 :
  - prix : 9,99 € et 19,99 € par mois, 99 € et 199 € par an ;
  - sous chaque prix, « par mois » (ou « par an »), sans « HT » ;
  - sous le titre, « TVA comprise » au lieu de « prix hors taxes » ;
  - question « Les prix incluent-ils la TVA ? » : « Oui. Le prix affiché est celui que vous payez, TVA comprise. Si votre entreprise récupère la TVA, la facture la détaille : Essentiel vous revient à 8,33 € HT par mois. Avec un numéro de TVA d'un autre pays de l'Union européenne, la TVA est autoliquidée : vous payez 9,99 €, sans TVA. »
  - « Tri par offre » : à retirer des avantages d'Essentiel et à montrer dans tous les plans, puisque le choix d'une offre est ouvert au plan Gratuit (décision du 2 octobre, `etat.md`).
- CGV : les prix y sont indiqués TVA comprise (à relire avant `LEGAL_VALIDATED=true`).

### Stripe (lot Stripe)

- Prix en euros, `tax_behavior: "inclusive"` : 999, 9900, 1999 et 19900 centimes, comme `priceCents`.
- Si l'entité qui facture est assujettie : Stripe Tax activé là où elle est immatriculée, adresse et numéro de TVA demandés au paiement (autoliquidation pour les entreprises de l'Union hors de France), TVA détaillée sur chaque facture.
- Si elle est en franchise en base : pas de TVA collectée, et la mention « TVA non applicable, art. 293 B du CGI » sur les factures.

## Ce qui reste au fondateur

- Confirmer avec votre expert-comptable le régime de TVA de l'entité qui facture PULSACITY (franchise en base ou assujettie), et, le cas échéant, l'immatriculation au guichet unique de l'Union (OSS) pour les ventes aux particuliers des autres pays de l'Union. Ça ne change pas les prix affichés, seulement la configuration de Stripe et les mentions des factures.
- Les ventes hors de l'Union (Suisse, Canada) : à revoir si elles deviennent importantes, car ces pays imposent leurs propres règles aux services numériques au-delà de certains seuils.
