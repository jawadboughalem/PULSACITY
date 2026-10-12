# 1.5 — Positionnement et page d'accueil v2 (décidé le 12 octobre 2026)

Compte rendu du prompt 1.5 (Claude Chat, projet « PULSACITY — Stratégie »), reçu du fondateur le 12 octobre 2026 et rangé tel quel. Les arbitrages de Claude Code sur ses points de friction avec les autres décisions sont dans `arbitrages.md` : ils priment sur ce texte là où ils le corrigent (prix affichés, mention de la TVA).

## Positionnement
- Phrase : pour les indépendants francophones qui vendent des formations, des séances ou des accompagnements en ligne, PULSACITY transforme chaque vente en demande d'avis, envoyée au bon moment et à leur nom, puis affiche les témoignages sur leurs pages de vente. Contrairement aux murs de témoignages, il n'attend pas qu'on pense à envoyer un lien ; contrairement aux plateformes d'avis, il est fait pour leurs outils et leurs pages.
- Promesse : « Vos ventes deviennent des témoignages, automatiquement. »
- Messages : 1) ça part tout seul, de la vraie vente, quel que soit l'outil ; 2) vos clients répondent depuis leur téléphone, sans être harcelés ; 3) ça s'affiche sur votre page, à vos couleurs, sans la casser.
- Cible de la page : formateurs en ligne, coachs et accompagnants. Thérapeutes ensuite (Calendly, Cal.com). Consultants hors V0.
- Aucun client, logo, compteur ni témoignage inventé. Tout exemple porte la mention « Exemple, avis fictifs ».

## Titres
- Grand titre : « Vous vendez. PULSACITY demande l'avis. »
- Challenger à tester : « Vos ventes deviennent des témoignages, automatiquement. »

## Page d'accueil v2, sections dans l'ordre

### 1. En-tête
- Titre : Vous vendez. PULSACITY demande l'avis.
- Texte : Après chaque vente, votre client reçoit un e-mail à votre nom qui lui demande son avis, au bon moment. Vous validez, et les témoignages de vos clients s'affichent sur votre page de vente.
- Bouton : Créer mon espace
- Lien : Voir comment ça marche (vers la section 4)
- Sous le bouton : Gratuit, sans carte bancaire. Prix TVA comprise. Données hébergées dans l'Union européenne.
- Visuel : badge « 4,7/5 · 23 avis » et une carte de témoignage, marqués « Exemple ».

### 2. Bande des outils
- Titre : Fonctionne avec l'outil où vous encaissez
- Texte : Disponible avec Systeme.io et le connecteur universel. Stripe, Calendly, Learnybox, Kajabi et d'autres arrivent bientôt. Et tous vos autres outils, avec Zapier, Make ou n8n.
- Lien : Voir toutes les intégrations

### 3. Le problème
- Titre : Vos clients sont contents. Votre page de vente ne le dit pas.
- Texte : Demander un témoignage, c'est un message de plus à écrire, au bon moment, à chaque client. On oublie. On n'ose pas relancer. Et ceux qu'on reçoit dorment dans une boîte de réception ou une capture d'écran.
- Chiffre : 93 % des Français consultent des avis avant d'acheter ou de choisir un prestataire.
- Source, en petit, avec lien : Ifop pour Guest Suite, janvier 2026.

### 4. Démo en quatre temps (vraie séquence : chiffres permis)
- Titre : De la vente au témoignage, sans y penser
- 1, La vente : Un client achète votre formation ou réserve une séance. PULSACITY le reçoit depuis l'outil où vous encaissez.
- 2, L'e-mail : Quatorze jours plus tard, ou au délai choisi pour cette offre, il reçoit un e-mail à votre nom. Une relance au plus.
- 3, L'avis : Il note, écrit quelques mots et ajoute une photo s'il le veut, depuis son téléphone. Il accepte la publication d'un clic.
- 4, Le mur : Vous validez. Son témoignage s'affiche sur votre page de vente.
- Démo à manipuler : « Écrivez un avis de test et regardez-le arriver sur le mur. Rien n'est enregistré. »
- Bouton : Écrire un avis de test (nouveau composant, sans envoi au serveur)

### 5. Widget réel
- Titre : Il prend les couleurs de votre page
- Texte : Un mur, un carrousel ou un badge. Le widget reprend vos polices et vos couleurs. Il est léger : votre page reste rapide, et rien ne bouge pendant le chargement. Vous collez son code une seule fois ; les nouveaux témoignages apparaissent d'eux-mêmes.
- Sélecteur : Mur, Carrousel, Badge ; Clair, Sombre.
- Sous le widget : Exemple, avis fictifs.
- Ligne : Se colle sur Systeme.io, WordPress, Wix, Squarespace, Webflow et Carrd, selon votre formule.
- Lien : Votre site est-il compatible ?
- Bouton : Créer mon espace
- Exemples fictifs, avec au moins un avis à 4 étoiles :
  - « Les modules sont courts et concrets. J'ai lancé mon offre dès la troisième semaine. » Camille, formation en ligne, 5 étoiles.
  - « Un accompagnement exigeant et bienveillant. J'aurais aimé un peu plus d'exercices. » Karim, accompagnement, 4 étoiles.
  - « Une séance qui m'a vraiment apaisée. » Léa, séance, 5 étoiles.

### 6. Le bon moment pour chaque offre
- Titre : Le bon moment pour chaque offre
- Texte : Une formation ne se juge pas comme une séance. Pour chaque offre, vous choisissez quand part la demande.
- Une formation en ligne : après l'achat ou l'inscription, le temps que l'élève avance.
- Une séance : après la séance, jamais avant.
- Un accompagnement : vers sa fin, en réglant le délai sur sa durée.

### 7. Catalogue des connecteurs (familles et phrases de connecteurs.md)
- Titre : Reliez l'outil où vous encaissez
- Texte : Vous collez une adresse dans votre outil, une fois. Ensuite, chaque vente arrive toute seule.
- Formations et tunnels de vente : Systeme.io (Disponible) ; Learnybox, Kajabi, SchoolMaker, Podia (Bientôt).
- Rendez-vous et séances : Calendly, Cal.com (Bientôt).
- Paiements en ligne : Stripe, PayPal (Bientôt).
- Événements et webinaires : Livestorm, HelloAsso, Weezevent, Eventbrite (Bientôt).
- Boutiques en ligne : WooCommerce, Shopify (Bientôt).
- Tous vos autres outils : connecteur universel (Disponible) ; Zapier, Make, n8n (Bientôt).
- Chaque famille porte sa phrase de connecteurs.md. Chaque outil mène à sa page publique. Sous les « Bientôt » : En attendant : avec Zapier ou Make.
- Bouton : Voir toutes les intégrations
- Lien : Votre outil n'y est pas ? Dites-nous lequel.

### 8. Vrais clients
- Titre : Des avis de vrais clients, et la preuve qui va avec
- Chaque demande d'avis part d'une vraie vente, reçue de votre outil.
- Chaque témoignage porte sa date, et celle de l'achat. (Ligne à publier quand la fonction existe.)
- Votre client accepte la publication d'un clic. Son accord est daté et gardé.
- Deux e-mails au plus par client et par offre, avec un lien de désinscription dans chacun.
- Vos données sont hébergées dans l'Union européenne. Vous les exportez ou les supprimez quand vous voulez.
- Lien : À propos de ces avis (page à créer)

### 9. Tarifs
- Titre : Gratuit pour commencer, moins de 10 € ensuite
- Texte : Commencez gratuitement, sans carte bancaire. Les prix sont TVA comprise : vous payez le prix affiché.
- Gratuit, 0 € : 15 témoignages validés, 20 demandes automatiques par mois, 1 widget.
- Essentiel, 9,99 € par mois : témoignages, demandes et widgets illimités.
- Pro, 19,99 € par mois : tout Essentiel, sans le badge « Propulsé par PULSACITY ».
- Ligne : Annuel : 2 mois offerts. Dépasser une limite ne supprime jamais rien.
- Bouton : Créer mon espace
- Lien : Voir les tarifs

### 10. Les premiers créateurs
- Titre : PULSACITY est nouveau. Vous ne verrez ici aucun avis inventé.
- Texte : Les premiers témoignages de PULSACITY arriveront comme les vôtres : par PULSACITY, après une vraie vente. Vous voulez être parmi les premiers créateurs ? Écrivez-nous : nous offrons le plan Essentiel à nos premiers testeurs, en échange de leurs remarques sur le produit.
- Lien : Écrivez-nous (vers /aide#contact)
- À décider par le fondateur : la durée offerte, et un mot du fondateur avec prénom et photo (facultatif).

### 11. Questions
- Titre : Vos questions
- Et si mes clients ne répondent pas ?
  Personne ne peut promettre que tous répondront. PULSACITY met les chances de votre côté : la demande arrive à votre nom, au moment que vous choisissez, et se remplit depuis un téléphone. Une relance part si besoin, jamais plus.
- J'ai déjà un formulaire. Pourquoi changer ?
  Un formulaire attend qu'on pense à l'envoyer. PULSACITY l'envoie pour vous après chaque vente, relance une fois, garde l'accord de votre client et affiche son avis sur votre page. Vos anciens témoignages ? Ajoutez-les à la main ou importez-les d'un fichier.
- Je ne suis pas technique. C'est pour moi ?
  Oui. Vous collez une adresse dans votre outil de vente, puis un code sur votre page. Chaque étape a son guide, avec des images.
- Le widget peut-il abîmer ma page ?
  Non. Il s'affiche dans son propre cadre, sans toucher au reste de votre page, et ne la fait pas sauter pendant le chargement. Pour le retirer, vous supprimez le code.
- Que se passe-t-il si je reçois un avis négatif ?
  Vous recevez chaque avis avant qu'il s'affiche. Un avis critique mais honnête rend les autres plus crédibles : les acheteurs se méfient des notes trop parfaites. La note du badge compte tous les avis reçus. (Réponse à publier quand cette règle est construite.)
- Mes clients vont-ils être dérangés ?
  Non. Deux e-mails au plus par client et par offre : la demande et une relance. Chacun contient un lien de désinscription. Les réponses arrivent chez vous.
- Et les données personnelles ?
  Votre client donne son accord avant toute publication, et cet accord est daté et gardé. Les données sont hébergées dans l'Union européenne. PULSACITY les traite pour vous : vous pouvez tout exporter ou tout supprimer.
- Combien de temps avant le premier témoignage ?
  Le délai choisi pour l'offre : quatorze jours par défaut. Vous pouvez aussi demander un avis tout de suite à un client que vous saisissez à la main.
- Mon outil n'est pas dans la liste.
  Reliez-le avec Zapier, Make ou n8n, grâce au connecteur universel. Make propose un plan gratuit. Et dites-nous lequel : un outil demandé trois fois passe en « Bientôt ».

### 12. Appel final
- Titre : Votre prochaine vente peut devenir votre prochain témoignage
- Texte : Créez votre espace, reliez votre outil, collez le widget. Les demandes partent toutes seules.
- Bouton : Créer mon espace
- Sous le bouton : Gratuit, sans carte bancaire.

### Barre fixe sur téléphone
- Contenu : « Gratuit, sans carte bancaire » et le bouton Créer mon espace (hauteur d'au moins 44 px).
- Apparaît quand le bouton de l'en-tête sort de l'écran.
- Disparaît sur l'appel final et quand le clavier est ouvert.
- Ne masque aucun contenu : marge en bas de page.

## Incitations
- Retenues : barre fixe sur téléphone ; « Gratuit, sans carte bancaire » sous chaque bouton principal ; « TVA comprise » près des prix ; démo à écrire soi-même ; widget à basculer ; statuts honnêtes ; offre bêta annoncée.
- Exclues : fenêtre qui surgit, intention de sortie, compte à rebours, compteur d'inscrits, discussion qui s'ouvre seule.
- Durées : aucune durée d'installation ni de saisie affichée avant d'avoir chronométré trois vraies installations. Afficher ensuite la médiane mesurée.

## Référencement
- Titre de la page : Récoltez des témoignages clients automatiquement | PULSACITY
- Description : Après chaque vente, PULSACITY demande l'avis de votre client à votre nom et affiche son témoignage sur votre page de vente. Gratuit, sans carte bancaire.
- Image de partage : la promesse et le logo.
- Mots-clés de l'accueil : témoignages clients ; récolter des témoignages clients ; widget avis clients.
- Mots-clés des guides : comment demander un témoignage client ; modèle d'e-mail de demande d'avis ; relancer un client pour un avis ; preuve sociale page de vente.
- Mots-clés des pages d'intégration : « avis clients » ou « témoignages » suivi du nom de l'outil.
- Volumes non vérifiés : à mesurer dans Search Console après la mise en ligne.

## Avis de vrais clients : position
- Base légale : Code de la consommation, articles L111-7-2 et D111-16 à D111-19 (information, dates, contrôle, contrepartie, modification, motifs de refus), et L121-4 (interdiction de prétendre que des avis viennent d'acheteurs sans contrôle, et de modifier un avis).
- Permis dès maintenant sur le site : « Chaque demande d'avis part d'une vraie vente. »
- Interdit : l'expression « avis vérifiés » (marque de Skeepers, et promesse de contrôle).
- Toute mention de vérification dans le widget attend les huit points ci-dessous.
- Points à construire, dans cet ordre :
  1. Trois provenances stockées par témoignage : vente reçue, demande manuelle, ajout, import ou lien public. Seule la vente reçue peut porter une mention de vérification.
  2. Widget : date de l'avis et mois de l'achat sur chaque témoignage.
  3. Lien « À propos de ces avis » sur tous les plans, Pro compris, distinct du badge. Il mène à une page publique : contrôle (lien unique envoyé à l'adresse reçue avec la vente), contrepartie, modification, ordre d'affichage, motifs de refus.
  4. « Corriger le texte affiché » : correction soumise à l'accord du client par e-mail, original gardé. Sans accord, seul le masquage d'un nom ou d'une coordonnée reste permis.
  5. Note du badge calculée sur tous les avis reçus, sauf ceux refusés pour un motif déclaré. Mur et carrousel : sélection annoncée.
  6. « Masquer » demande un motif, transmis au client. La forme reste à confirmer par un juriste.
  7. Réglages : case « J'offre une contrepartie », affichée si cochée. Même règle pour les bêta-testeurs qui laissent un avis.
  8. Relecture par un juriste de la page « À propos de ces avis », des règles de masquage et des témoignages qui parlent de santé, regroupée avec la relecture des CGV (6.7).
- Exemple de badge sur le site : 4,7/5 plutôt que 4,9/5 (Spiegel Research Center, 2017 : l'effet culmine entre 4,0 et 4,7 étoiles).
- À suivre : proposition de loi du Sénat n° 488 (justificatif d'achat obligatoire), dont le statut n'est pas vérifié.
- Le seuil de la micro-entreprise ne change pas.

## Dépendances
- Publication de la v2 après la mise en ligne du connecteur universel (connecteurs.md).
- Nouveaux éléments à dessiner (Claude Design) : démo à écrire soi-même, page « À propos de ces avis », barre fixe sur téléphone.
- Chiffre affichable : Ifop pour Guest Suite, janvier 2026, 93 %, avec sa source. Pas d'autre statistique sur l'accueil.
