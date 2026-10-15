# Stripe Billing de PULSACITY : les événements capturés

Les abonnements des créateurs à PULSACITY passent par Stripe (lot 4.5). Ce n'est pas un connecteur, mais la même règle s'applique : les vrais événements du mode test sont d'abord capturés, puis deviennent les fixtures des tests.

## Ce que le code lit

L'adresse : `/api/stripe/webhook`. La signature (`Stripe-Signature`) est vérifiée sur les octets reçus, puis l'événement est gardé entier dans `stripe_events` avant tout traitement. Version d'API : `2026-09-30.endive`, celle du paquet `stripe` 23.0.0 (`src/lib/billing/stripe-client.ts`) ; la destination du webhook est créée avec la même (prompt 6 de `recette/lot-4-5-abonnement.md`).

Un événement ne sert qu'à savoir quel abonnement relire chez Stripe (`findEventSubscription`) :

| Objet de l'événement | Abonnement relu |
| --- | --- |
| `subscription` (`customer.subscription.*`) | son `id` |
| `checkout.session` (`checkout.session.*`, en mode `subscription`) | `subscription` |
| `invoice` (`invoice.paid`, `invoice.payment_failed`, `invoice.payment_action_required`, `invoice.upcoming`) | `parent.subscription_details.subscription` |
| `subscription_schedule` (`subscription_schedule.*`) | `subscription` |
| `customer` (`customer.updated`) et `payment_method` (`payment_method.attached`) | l'abonnement courant de l'espace de ce client |

L'abonnement relu (`subscriptions.retrieve`, développé : `default_payment_method`, `latest_invoice`, `discounts`, `schedule.phases.items.price`, `customer.invoice_settings.default_payment_method`) est lu par `readSubscriptionSnapshot` :
- `items.data[0].price.lookup_key` : le plan, la période et le prix fondateur ou public ; un autre prix est ignoré ;
- `items.data[0].current_period_end` : la prochaine échéance (elle a quitté l'abonnement pour ses éléments depuis l'API « basil ») ;
- `status`, `cancel_at`, `cancel_at_period_end`, `ended_at` ;
- `discounts[].source.coupon` = `beta-essentiel-3-mois` et `discounts[].end` : le bêta-testeur et la fin de ses mois offerts ;
- `schedule.current_phase.end_date` et la phase suivante : le changement programmé ;
- `default_payment_method.card` (sinon celle du client) : la marque et les quatre derniers chiffres ;
- `latest_invoice` ouverte et tentée, quand l'abonnement est `past_due` : le paiement refusé.
- `metadata.space_id` (mis par Checkout) relie l'abonnement à l'espace ; à défaut, `customer`.

`invoice.paid` garde en plus la facture payée (`amount_paid` > 0) dans `billing_payments`, pour le seuil de la micro-entreprise. `invoice.upcoming` déclenche le rappel d'un bêta-testeur 7 jours avant son premier prélèvement.

## Les captures

À faire avec la recette (prompts 8 à 12) : chaque paiement de test envoie ses événements à l'aperçu ; le prompt 12 les exporte. Les fixtures en sont tirées, anonymisées (adresses `example.com`, identifiants remplacés), et remplacent ou complètent celles de `src/lib/billing/stripe-fixtures.ts`, écrites d'après les types du paquet `stripe` en attendant.

Relevé des captures : à compléter après le prompt 12.
