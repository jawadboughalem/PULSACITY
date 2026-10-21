# Le seuil de la micro-entreprise

Décision du fondateur, le 12 octobre 2026 : PULSACITY encaisse dès la V0, en tant que particulier. La micro-entreprise se crée quand les paiements deviennent réguliers.

## Le seuil

Dès que l'un de ces repères est atteint, créer la micro-entreprise devient la priorité, avant tout autre lot :

| Repère | Seuil |
| --- | --- |
| Clients payants en même temps | **5** |
| Mois de suite avec au moins un paiement | **3** |
| Total encaissé depuis le premier paiement | **500 €** |
| Premier client payant établi dans un autre pays de l'Union | **1** (repère proposé par 2.7, le 12 octobre : il faut alors un numéro de TVA intracommunautaire et une déclaration européenne de services) |

Le premier repère atteint compte. Ce jour-là : lancer le prompt 6.1 le jour même, et déposer la déclaration dans les quinze jours.

Ces chiffres sont une règle de prudence, pas une règle de la loi : 1.1 peut les ajuster.
- La loi ne fixe pas de nombre de clients. Elle distingue une activité occasionnelle d'une activité habituelle exercée pour en tirer un revenu, qui doit être déclarée. Sans déclaration, c'est du travail dissimulé.
- Un abonnement mensuel se renouvelle tout seul : la régularité peut être retenue dès les premiers renouvellements. Plus bas, le seuil est plus sûr.

## Pourquoi ne pas attendre au-delà

- **Créer la micro-entreprise ne coûte rien.** La déclaration est gratuite, sur formalites.entreprises.gouv.fr. Sans chiffre d'affaires, les cotisations sont nulles, puisqu'elles en sont un pourcentage. Elle se ferme gratuitement. 6.1 le vérifie.
- **Le SIREN arrive en une à quatre semaines.** Pendant ce temps, les paiements continuent : mieux vaut lancer la démarche tôt.
- **Les clients ne voient rien changer** : même site, mêmes prix, mêmes abonnements, si le compte Stripe passe au nom de l'entreprise sans recréer les abonnements. 6.5 le vérifie.

## En attendant le seuil

- **Déclarer ce qui est encaissé.** Chaque euro reçu se déclare avec vos revenus de l'année : déclaration 2042 C PRO, ligne 5NP (micro-BIC non professionnel, prestations de services), d'après 2.7.
- **Garder la trace de chaque paiement.** Stripe la garde : clients, paiements, factures.
- **Des textes légaux de vendeur particulier** : votre nom dans les mentions légales, les CGV en ligne ; ni votre adresse ni votre téléphone (décision du 21 octobre). Le lot 4.9 les publie, votre nom venant d'une variable Vercel, jamais du dépôt.

## Suivre les repères

- Dans Stripe, « Clients » (les abonnements actifs et leur pays) et « Paiements » (les mois et le total). Un paiement remboursé par la garantie de 14 jours (CGV, article 7) ne compte pas dans le total : la requête `docs-internes/requetes/seuil-micro-entreprise.md` ne le retire pas d'elle-même.
- Le 1er de chaque mois, un coup d'œil aux trois repères. Claude Code peut programmer ce rappel si vous le voulez.

## Le jour du seuil

Dans l'ordre (`prompts-6-le-jour-ou-ca-marche.md`) :
1. **6.1** Le statut, la TVA et les démarches (Claude Chat).
2. **6.2** L'immatriculation (vous, guidé par Claude Chat).
3. **6.3** Le compte bancaire, et **6.4** le régime de TVA confirmé par écrit.
4. **6.5** Le compte Stripe passé au nom de l'entreprise.
5. **6.6** Le lot « Passer à l'entreprise » : mentions légales, CGV, factures, TVA.
6. **6.7** La relecture des CGV par un juriste.
