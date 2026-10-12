# 1.3 — Tarifs (décidé le 12 octobre 2026)

Compte rendu du prompt 1.3 (Claude Chat, projet « PULSACITY — Stratégie »), reçu du fondateur le 12 octobre 2026 et rangé tel quel. Il remplace les montants de `docs-internes/decision_tarifs.md`. Les arbitrages de Claude Code sur ses points de friction avec les autres décisions sont dans `arbitrages.md`.

Prix publics, prix finaux (rien ne s'ajoute au paiement)
- Gratuit : 0 €.
- Essentiel : 14,99 € par mois, 149 € par an (priceCents 1499 et 14900).
- Pro : 24,99 € par mois, 249 € par an (priceCents 2499 et 24900).
- Annuel = 10 mois, arrondi à l'euro inférieur : « 2 mois offerts ».
- Prix fondateur, à vie tant que l'abonnement ne s'interrompt pas : Essentiel 9,99 € / 99 €, Pro 19,99 € / 199 € (999, 9900, 1999, 19900).
- Prix fondateur réservé aux bêta-testeurs et aux 100 premiers abonnés payants. Prix Stripe distincts ; l'espace garde son prix fondateur. Pas de prix barré.

Limites (inchangées)
- Gratuit : 15 témoignages validés, 20 demandes automatiques par mois, 1 widget, badge obligatoire.
- Essentiel : tout illimité, badge obligatoire.
- Pro : tout illimité, badge retirable.
- Tous les plans : 20 demandes saisies à la main par jour ; tri par offre ouvert à tous.
- Dépasser une limite ne supprime rien : l'ajout est bloqué et le plan supérieur proposé.

Contenu des plans
- V0 : Pro = Essentiel + retrait du badge, rien d'autre.
- Pistes Pro hors V0 : plusieurs espaces par compte, page publique du mur, domaine personnalisé de la page de collecte, vidéo, membres, statistiques du widget.

Bêta-testeurs
- 20 à 30. Essentiel offert 3 mois par code promotionnel Stripe (100 % pendant 3 mois), carte demandée à l'inscription.
- E-mail de rappel 7 jours avant le premier prélèvement, puis prix fondateur.
- Contrepartie : retours et un témoignage pour PULSACITY.
- Si 5 cartes ou plus sont enregistrées : lancer 6.1 un mois avant la fin de la gratuité (seuil des 5 clients payants).

Changements de plan
- Plan supérieur : immédiat, au prorata.
- Plan inférieur, mensuel vers annuel ou l'inverse, résiliation : à la fin de la période payée, sans remboursement au prorata.
- Retour au Gratuit : 1 widget reste actif (le plus ancien, ou le choix du créateur) ; les autres ne s'affichent plus sur la page hôte (rien, aucun saut de mise en page) et reviennent avec Essentiel.
- Au-delà de 15 témoignages validés : gardés et visibles dans l'espace ; le widget en montre 15 (mis en avant, puis les plus récents) ; les nouveaux attendent.
- Demandes automatiques au-delà de 20 par mois : statut « en attente », annulées après 30 jours sans retour à Essentiel.
- Badge : revient à la fin de la période Pro.
- Rien n'est jamais supprimé.

Changer un prix plus tard
- Un nouveau prix vaut pour les nouveaux abonnés ; les abonnements en cours gardent le leur.
- Hausse pour les abonnés en place : exceptionnelle, annoncée 30 jours avant par e-mail, résiliation possible avant l'échéance ; règle écrite dans les CGV (2.7).
- Baisse : pour tous, tout de suite.

TVA
- Page Tarifs, sous le titre : « Prix finaux : rien ne s'ajoute au paiement. »
- Question « Les prix incluent-ils la TVA ? », tant qu'aucune TVA n'est collectée : « Le prix affiché est celui que vous payez. PULSACITY ne facture pas de TVA aujourd'hui : il n'y en a donc aucune à récupérer sur nos factures. »
- En micro-entreprise en franchise : mention « TVA non applicable, art. 293 B du CGI » sur les factures.
- Le jour où la TVA est collectée : reprendre la réponse de decision_tarifs.md, avec Essentiel à 12,49 € HT.
- Stripe : prix en euros, tax_behavior « inclusive », Stripe Tax désactivé tant qu'aucune TVA n'est collectée.

Coûts retenus (par mois, TVA comprise)
- Technique : ~22 € jusqu'à ~30 espaces actifs ; ~42 € à 50 ; ~67 € de 200 à 500 ; 68 à 103 € à 1 000. Plus l'abonnement Claude.
- Vercel Pro avant le premier paiement.
- Resend Pro dès qu'une journée approche 100 e-mails.
- Supabase Pro quand la base approche 400 Mo.
- GitHub privé : gratuit.
- Purger le contenu brut des ventes reçues après 90 jours.
- Coût variable : moins de 0,10 € par espace payant et par mois, ~0,04 € par espace gratuit.

Seuils de rentabilité (micro-entreprise, versement libératoire, 90 % Essentiel, 25 % annuel, 100 € de coûts fixes)
- Reste moyen par abonné : 11,26 € ; 9,22 € une fois la TVA collectée.
- Franchise de TVA (37 500 € par an) dépassée vers 204 abonnés.
- Coûts couverts : 9 abonnés. 1 000 € nets : 98. 2 000 € : 187. 3 500 € : 391.
- Pour 391 abonnés : 13 000 inscrits à 3 %, 7 800 à 5 %, 4 900 à 8 % de passage au payant.

Revue : à 60 jours de paiements ou à 300 inscrits, puis chaque trimestre
- Suivre : passage au payant à 30 et 60 jours, part de l'annuel, départs par mois, part du Pro, motifs de résiliation, coût technique par espace actif, part des cartes hors d'Europe.
- Passage au payant sous 2 % : tester 12 € pour les nouveaux inscrits.
