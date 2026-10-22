# 2.7 — Les textes légaux d'un vendeur particulier (décidé le 12 octobre 2026)

Compte rendu du prompt 2.7 (Claude Chat, projet « PULSACITY — Stratégie »), reçu du fondateur avec le lot 4.9 le 21 octobre 2026. Les quatre textes sont publiés dans `src/content/legal/` (mentions légales, CGV, CGU et leur annexe, politique de confidentialité) : ils ne sont pas recopiés ici. Les valeurs « [CODE : …] » y sont alignées sur le code, et les écarts avec le texte de 2.7 sont listés dans `docs-internes/etat.md` (« Décisions du 21 octobre (lot 4.9) »).

## Changement du 21 octobre 2026 (fondateur)

- Ni l'adresse ni le téléphone de l'exploitant ne sont publiés, nulle part : ni sur le site, ni dans les e-mails, ni dans les prompts. Seul son nom apparaît, dans les textes légaux, par `LEGAL_PUBLISHER_NAME` (Vercel, Production et Preview). Sans elle, les phrases qui le nomment s'en passent ; jamais de passage entre crochets. (Le nom est retiré à son tour le 22 octobre, ci-dessous.)
- Hébergeur : Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis (https://vercel.com/legal/privacy-notice). Vercel ne publie aucun numéro de téléphone : contact privacy@vercel.com.
- Fonctions de Vercel en FRA1 (Francfort), relevé sur le déploiement d59885e ; le réglage du projet indique cdg1, marqué « Overridden » par `vercel.json`. Offre Hobby.
- Ce changement remplace, ci-dessous, l'adresse publiée (options A et B), le mobile publié, l'adresse de l'exploitant sur les reçus Stripe et « Vercel stocke à Paris ».

## Changement du 22 octobre 2026 (fondateur, compte rendu du prompt 6)

- Aucun nom, une voix d'équipe, aucune mention de l'absence d'entreprise. Les textes disent « l'équipe PULSACITY » ou « PULSACITY (« nous ») » : éditeur et directeur de la publication, vendeur (CGV 1.1), exploitant (CGU 2), sous-traitant (annexe, point 1), responsable du traitement (confidentialité, 1). `LEGAL_PUBLISHER_NAME` n'est plus lue : la variable peut être supprimée de Vercel. La publication ne dépend plus que de `LEGAL_VALIDATED`.
- Retirés : « une personne physique, sans entreprise immatriculée à ce jour », « PULSACITY est le nom du service, pas celui d'une société », « exploité par une seule personne » (CGU 8.1 : « Le service repose sur des prestataires en ligne. »), « Seul l'exploitant accède aux données » (annexe 6 : « Seule l'équipe PULSACITY accède aux données. »), et l'article 13 des CGV, « Quand PULSACITY deviendra une entreprise » (immatriculation, transfert à une société, article 1216) ; l'article 14 devient le 13, et l'article 6.2 finit par « sauf à l'article 7 et dans les cas prévus par les CGU ».
- Gardés : contact@pulsacity.com, « TVA non applicable, art. 293 B du CGI », Vercel Inc. et son adresse, la région FRA1.
- Sauvegardes : l'offre Free de Supabase n'en fait aucune (« Free Plan does not include project backups », relevé du prompt 2). Les promesses de sauvegardes (CGU 10.4, annexe 7 et 12) sont retirées. À revoir au passage en Supabase Pro ou aux sauvegardes faites par nous (lot 4.10).
- Umami : « Clauses contractuelles types. » ajouté à sa ligne (relevé du prompt 4 : Umami Software, Inc., Delaware, hors DPF, CCT 2021/914 modules 2 et 3 dans son DPA).
- Rappel avant un renouvellement annuel (CGV 5.2) : envoyé par PULSACITY, pas par Stripe, dont le réglage écrirait aussi avant chaque paiement mensuel (relevé du prompt 3). E-mail `AnnualRenewalEmail`, 7 jours avant, une fois par échéance (`renewalReminderPeriodEnd`), par la tâche planifiée et à l'événement `invoice.upcoming`.
- Risque, pour la relecture du juriste (6.7) : sans nom ni adresse, le site ne dit pas qui l'édite (article 6-III de la LCEN), qui vend (article 19 de la LCEN) ni qui est responsable du traitement (article 13 du RGPD). Décision du fondateur, prise en connaissance de cause. Stripe peut demander une identité et une adresse à l'activation du mode réel (2.8 c).

## Décisions de 2.7

- Vendeur et éditeur : personne physique non immatriculée ; les textes n'en disent rien depuis le 22 octobre (« l'équipe PULSACITY »). Ni adresse ni mobile publiés (changement du 21 octobre ; 2.7 prévoyait l'adresse, option A ou B, et le mobile).
- Abonnements payants réservés aux professionnels. Pas de médiateur de la consommation. Mention des pénalités L441-10 (3 × taux légal) et de l'indemnité de 40 €.
- Aucune clause attributive de juridiction (art. 48 CPC). Droit français.
- L221-3 ne s'applique pas aux contrats en ligne : garantie volontaire de remboursement à la place, 14 jours après le premier paiement (y compris le premier prélèvement après la bêta), une fois par espace.
- Prix fondateur jamais augmenté. La clause de hausse ne vise que les prix publics.
- Défaut de paiement : 14 jours de relances Stripe, puis retour au Gratuit. Prix fondateur perdu, période impayée non due.
- Renouvellement annuel : e-mail 7 jours avant (envoyé par PULSACITY : changement du 22 octobre).
- Demandes automatiques au-delà de 20 par mois : gardées, envoyées le 1er du mois suivant (arbitrage n° 4).
- Reçus Stripe : « TVA non applicable, art. 293 B du CGI » (ni adresse ni nom : changements des 21 et 22 octobre ; le nom public du compte Stripe est PULSACITY).
- Responsabilité plafonnée aux sommes payées sur 12 mois, minimum 100 €.
- Fin du service : préavis de 3 mois, export, remboursement au prorata du prépayé.
- Données supprimées 30 jours après la suppression de l'espace. Reçus gardés 10 ans.
- DSA : point de contact contact@pulsacity.com ; signalement par /aide (sujet « Signaler un contenu ») ; exposé des motifs à l'auteur du signalement et au créateur.
- Avis : les points 1, 2, 3, 5 et 6 du lot 4.13 sont des obligations légales. Dates des avis affichées avant le premier widget réel. Paragraphes [4.13] publiés seulement une fois construits.
- Consentement : nouveau texte de case. Retrait par le lien de l'e-mail de demande (l'état « déjà utilisé » devient « Gérer mon avis »). Aides sous le texte et la photo.
- E-mails de demande : aucun contenu promotionnel ; pied d'information art. 14 RGPD ; adresse postale facultative.
- Vercel Pro avant le premier paiement (le DPA ne couvre pas Hobby). « Vercel stocke à Paris (cdg1) » : non, les fonctions tournent en FRA1 (relevé du 21 octobre) ; le brief reste « Francfort ».
- Aucune donnée des clients des créateurs par e-mail au support (boîte sans DPA).
- Registre des traitements (art. 30) tenu avec le modèle CNIL.
- Nouveau repère proposé pour `seuil-micro-entreprise.md` : premier client payant professionnel établi dans un autre pays de l'UE (numéro de TVA intracommunautaire et déclaration européenne de services requis).
- Déclaration des recettes jusqu'au seuil : 2042 C PRO, ligne 5NP (micro-BIC, prestations de services).

## Marques des textes

- [INFO : …] : information personnelle du fondateur. Aucune n'est publiée : les marques sont retirées des textes (changements des 21 et 22 octobre).
- [CODE : …] : valeur technique alignée sur le code ou un tableau de bord.
- [4.13] : paragraphe à publier seulement quand le lot 4.13 est en ligne. Le lot 4.13 est en ligne depuis le 19 octobre : tous sont publiés.

## Textes associés

Case de consentement (page de collecte), proposée par 2.7 :

> J'ai 18 ans ou plus et j'accepte que [nom de l'espace] publie mon avis sur ses pages de vente : ma note, mon texte, mon prénom et l'initiale de mon nom, ma photo si j'en ajoute une, et la date. Je peux retirer mon accord à tout moment avec le lien « Gérer mon avis » de l'e-mail reçu.

[CODE : n'énumérer que les champs réellement affichés par le widget]. Le texte publié est dans `src/lib/testimonials/build-consent-text.ts`.

- Sous le champ de texte : « Votre avis sera public. Évitez les détails sur votre santé ou celle de vos proches. »
- Sous la photo : « Une photo de vous seulement, pas d'une autre personne. »
- État « lien déjà utilisé » : devient « Votre avis est enregistré », avec le bouton « Retirer mon accord ».

Pied des e-mails de demande et de relance :

> Vous recevez ce message parce que vous avez acheté « [offre] » auprès de [nom de l'espace]. [Nom de l'espace] utilise PULSACITY pour recueillir les avis de ses clients. Vos données : [lien vers la section 9 de la politique de confidentialité]. Ne plus recevoir de demande : [lien de désinscription].

Aucun contenu promotionnel dans ces e-mails.

## Le jour de la micro-entreprise (lot 6.6)

- Mentions légales, CGV, CGU et annexe : ajouter l'entreprise (statut d'entrepreneur individuel, SIREN) là où les textes disent « l'équipe PULSACITY ». Mention « EI » à vérifier en 6.1.
- Adresse : celle de la domiciliation, si elle existe.
- Reçus Stripe : deviennent des factures complètes (SIREN, numérotation, pénalités de retard, indemnité de 40 €). La mention « TVA non applicable, art. 293 B du CGI » reste tant que la franchise s'applique.
- E-mail d'information aux abonnés 30 jours avant le changement des CGV (article 13, « Modification des CGV ») ; l'ancien article 13 (« Quand PULSACITY deviendra une entreprise ») est retiré le 22 octobre.
- Compte Stripe passé au nom de l'entreprise sans recréer les abonnements (6.5).
- Numéro de TVA intracommunautaire et déclaration européenne de services si des clients professionnels sont établis ailleurs dans l'Union.
- Relecture des CGV, de la page « À propos de ces avis » et des règles de masquage par un juriste (6.7).

## À faire avant publication

- ~~Choix de l'adresse (A ou B) par le fondateur~~ : aucune adresse publiée (21 octobre).
- Vercel en plan Pro.
- Adresse de Vercel relevée sur vercel.com (21 octobre) ; Vercel ne publie pas de téléphone.
- Région de stockage de Resend.
- Noms des deux cookies.
- Durée des journaux (relevée) ; sauvegardes : aucune sur l'offre Free de Supabase, promesses retirées (22 octobre).
- Réglage des relances Stripe (14 jours, prompt 3) ; e-mail avant le renouvellement annuel envoyé par PULSACITY (22 octobre).
- Sujet « Signaler un contenu » dans le formulaire de /aide.
- Dates des avis dans le widget, avant le premier widget réel.
- Paragraphes [4.13] retirés tant que le lot n'est pas livré.
- ~~Brief : Vercel stocke à Paris~~ : FRA1 confirmé le 21 octobre, le brief reste juste.

Où en est chacun : `docs-internes/recette/lot-4-9-textes-legaux.md`.
