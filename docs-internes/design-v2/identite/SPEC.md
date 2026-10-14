# PULSACITY — Logo v2 « Galet » : spécification d'implémentation

Destinataire : Claude Code. Émetteur : Design. Statut : piste Galet choisie le 12 octobre 2026, à implémenter telle quelle. Remplace `identite-v2/SPEC.md`.

**Règle générale : n'ajoute aucune fusée et aucune animation au-delà de ce document.** Si un cas n'est pas prévu ici, ne fais rien et signale-le à Design.

Référence visuelle : canvas « PULSACITY v2 », page « Logo final » (3 planches). Exports PNG dans `maquettes/` : `v2-logo-declinaisons-desktop-01-horizontal-symbole-compact.png`, `v2-logo-icones-desktop-01-favicon-applications-email-mention.png`, `v2-logo-regles-desktop-01-protection-tailles-interdits.png`.

---

## 1. Concept (ne pas réinterpréter)

- **Le symbole** : une fusée Encre aux formes pleines et arrondies (le « galet »), avec un hublot rond, portée par une étoile Corail qui remplace la flamme. La pointe haute de l'étoile s'engage dans une encoche à la base de la fusée, séparée d'elle par un vide constant.
- **Le récit** : les avis (les étoiles) font décoller l'activité (la fusée).
- **Le logotype** : « PULSACITY » en capitales, Bricolage Grotesque 800, vectorisé (aucune police à charger). Version « petit » : lettres espacées de +30/1000 pour rester lisibles sous 32 px.
- **Couleurs** : fusée Encre #16213E (Blanc sur fond Encre), étoile Corail #F0674A dans les deux cas. Version une couleur : tout en `currentColor`.
- **Grille** : symbole dessiné sur 64 × 64. Hublot : cercle de rayon 6,5 centré en (32, 23). Vide autour de l'étoile : tracé de l'étoile en 11 unités (normal) ou 13 unités (petit, sans hublot).
- Le reste de l'identité est décrit dans `charte-v2.md`.

## 2. Assets fournis

N'utilise que les fichiers de `logo/`. Ne redessine rien, ne modifie aucun tracé, ne ré-exporte rien.

| Fichier | Usage |
| --- | --- |
| `svg/pulsacity-logo.svg` | Logo horizontal clair (symbole normal + logotype). Pour une hauteur affichée de 32 px ou plus. Fonds Blanc, Nuage, Ciel. |
| `svg/pulsacity-logo-sombre.svg` | Idem, sur fond Encre (fusée et logotype blancs, étoile Corail). |
| `svg/pulsacity-logo-petit.svg` | Logo horizontal avec le symbole petit et le logotype espacé. Pour une hauteur affichée de 20 à 31 px. |
| `svg/pulsacity-logo-petit-sombre.svg` | Idem, sur fond Encre. |
| `svg/pulsacity-logo-compact.svg`, `-sombre` | Symbole au-dessus du logotype. Formats carrés uniquement (avatar de réseau social, impression). Non utilisé dans l'application. |
| `svg/pulsacity-symbole.svg`, `-sombre` | Symbole normal (avec hublot), à partir de 32 px. |
| `svg/pulsacity-symbole-petit.svg`, `-petit-sombre` | Symbole petit (sans hublot, vide élargi), de 16 à 31 px. |
| `svg/pulsacity-symbole-mono.svg`, `-petit-mono` | Symbole une couleur en `currentColor`. |
| `svg/pulsacity-wordmark.svg`, `-sombre`, `-mono` | Logotype seul. Documents, pied de page légal, écran où le symbole est déjà visible. |
| `svg/pulsacity-mention-mono.svg` | Symbole petit + logotype, une couleur (`currentColor`), 14 px de haut. Pour « Propulsé par » (page de collecte, widgets). |
| `svg/favicon.svg`, `favicon.ico`, `png/favicon-16/32/48.png` | Favicon. Le 16 px est dessiné au pixel : ne le remplace pas par une réduction du SVG. `favicon.svg` passe la fusée en blanc en thème sombre (prefers-color-scheme). `favicon.ico` contient 16, 32 et 48. |
| `png/apple-touch-icon.png` (180), `png/icon-192.png`, `png/icon-512.png` | Icônes d'application : fond Encre plein, symbole sombre à 72 % du côté. |
| `png/icon-maskable-512.png` | Icône Android à marge de sécurité : symbole à 56 % du côté, tout le dessin dans le cercle de 80 %. |
| `png/email-symbole-48.png` | Symbole des e-mails, 48 × 48, affiché à 24 × 24. |
| `png/pulsacity-*-<hauteur>.png` | Rendus PNG transparents de chaque SVG (logo 128 px, petit 64, compact 224, symbole 256, symbole petit 64, logotype 112, mention 56 ; versions une couleur rendues en Encre). Pour les outils qui n'acceptent pas le SVG (réseaux sociaux, documents, Stripe). |
| `code/pulsacity-motion.css` | Jetons de mouvement, keyframes et réduction du mouvement. |
| `code/head-favicons.html`, `code/site.webmanifest` | Balises `<head>` et manifeste. |

**Note technique.** Les SVG utilisent un `<mask>` pour l'encoche et le hublot.
- Pour un affichage statique, utilise-les en `<img>` : c'est le cas par défaut.
- Si tu les intègres en ligne (symbole animé, mention du widget), donne à chaque instance un identifiant de masque unique, sinon deux instances se masquent mutuellement.
- Les classes `pz-fusee` (fusée) et `pz-etoile` (étoile) doivent être conservées : ce sont elles que les animations ciblent.
- N'intègre jamais `favicon.svg` en ligne dans une page : sa règle CSS `.pz-fusee` s'appliquerait à tous les symboles de la page.

## 3. Choisir la bonne variante

Applique cet ordre, sans exception :

1. **Écran de l'espace, hors navigation**, et tout composant (bouton, carte, menu, tableau, formulaire, badge, onglet, message flottant) : **aucun symbole.**
2. **Barre de navigation ou en-tête** : **logo horizontal**.
   - Hauteur affichée de 32 px ou plus : `pulsacity-logo(-sombre).svg`.
   - De 20 à 31 px : `pulsacity-logo-petit(-sombre).svg`.
3. **Place très réduite, ou marque déjà nommée juste à côté** (favicon, e-mails, mention « Propulsé par ») : **symbole seul** ou **mention**.
   - À partir de 32 px : version normale.
   - De 16 à 31 px : `-petit`.
4. **Documents, pied de page légal, ou écran où le symbole est déjà visible** : **logotype seul**.
5. **Fond** : fond Encre, utilise `-sombre`. Fonds Blanc, Nuage, Ciel : version claire. Aucune autre couleur de fond n'accueille le logo (ni Soleil, ni Corail, ni photo, ni dégradé), sauf la version une couleur des mentions « Propulsé par », qui prend la couleur du texte secondaire de la page.

Tailles minimales :
- logo horizontal : 32 px de haut ; logo petit : 20 px ;
- symbole normal : 32 px ; symbole petit : 16 px ;
- logotype seul : 12 px de haut ;
- mention « Propulsé par » : 12 px de haut.

Zone de protection : un vide égal à 0,4 × la hauteur du symbole sur les quatre côtés (pour le logo horizontal, la hauteur du symbole est celle du logo). Rien n'y entre : texte, bord d'écran, autre logo, bouton.

## 4. Où remplacer le logo

| Endroit | Aujourd'hui | Remplacer par | Hauteur affichée |
| --- | --- | --- | --- |
| Navigation desktop de l'espace (haut de la colonne de 264 px) | Logo v1 petit | `pulsacity-logo-petit.svg` | 27 px |
| En-tête mobile de l'espace | Logo v1 petit | `pulsacity-logo-petit.svg` | 24 px |
| En-têtes publics desktop : accueil, tarifs, intégrations, guides, inscription, connexion, onboarding, pages d'erreur | Logo v1 | `pulsacity-logo.svg` | 32 px |
| En-têtes publics mobiles, mêmes pages | Logo v1 petit | `pulsacity-logo-petit.svg` | 24 px |
| Pied de page du site (fond Encre) | Logo v1 sombre | `pulsacity-logo-sombre.svg` | 32 px |
| En-tête des e-mails envoyés au nom de PULSACITY : lien de connexion, nouveau témoignage, code du widget | Symbole v1 + « Pulsacity » en Georgia | `email-symbole-48.png` à 24 × 24, `alt=""`, suivi de « PULSACITY » en Helvetica, Arial 20/24 gras, espace de 8 px | 24 px |
| E-mails envoyés au nom du créateur : demande, relance | Logo ou initiales du créateur | Inchangé (logo ou initiales du créateur, 44 px). Pied : « Envoyé avec PULSACITY pour … » en texte | — |
| Mention « Propulsé par » : pied de la page de collecte, sous les widgets | « Propulsé par » + symbole petit mono + « Pulsacity » | « Propulsé par » (police de la page, 12/16, couleur secondaire) + `pulsacity-mention-mono.svg` en `currentColor`, espace de 6 px | 14 px (12 px au minimum) |
| Favicon et icônes d'application | Fichiers v1 | Fichiers du tableau 2, balises de `code/head-favicons.html` | — |

Accessibilité :
- Un logo qui sert de lien : `aria-label="Pulsacity, accueil"` sur le lien, `alt=""` sur l'image.
- Un logo seul : `alt="Pulsacity"`.
- Un symbole placé à côté du nom : décoratif, `alt=""` ou `aria-hidden="true"`.
- La mention du widget est un lien « Propulsé par Pulsacity » ; le SVG y est `aria-hidden="true"` avec le nom en texte masqué, ou `role="img" aria-label="Pulsacity"`.

## 5. Les seuls moments de marque dans le produit

| Moment | Contenu | Symbole | Animation |
| --- | --- | --- | --- |
| Ouverture de l'espace après le lien de connexion, si l'attente dépasse 1 s | Symbole centré, « Ouverture de votre espace… » en 17/26 600, puis « Cela prend quelques secondes la première fois. » en 15/22 Gris, fond Nuage | `pulsacity-symbole.svg`, 48 px | Attente |
| État vide « Premier jour » (tableau de bord sans témoignage) | Symbole au-dessus du titre « Pas encore de témoignage », aligné à gauche, 16 px d'écart | `pulsacity-symbole.svg`, 48 px | Décollage, une seule fois (6.3) |
| Premier témoignage validé | Bandeau de succès « Votre premier témoignage est en ligne. », le symbole remplace l'icône | `pulsacity-symbole-petit.svg`, 24 px | Décollage, une seule fois (6.3) |

Aucun autre état vide, écran ou composant ne reçoit le symbole.

## 6. Micro-animations

Il y en a quatre, exactement. Les classes, keyframes et jetons sont dans `code/pulsacity-motion.css`. Les autres mouvements de l'interface (survol, ouverture des menus, squelettes) sont décrits dans `charte-v2.md`, section Mouvement.

Principes :
- On anime seulement `transform` et `opacity`, rien qui décale la mise en page.
- Au plus une animation de marque par écran.
- Aucune animation d'apparition : aucun fondu ni glissement au chargement des pages, cartes ou listes.
- `prefers-reduced-motion: reduce` est toujours respecté, avec la version décrite pour chaque animation.
- Les transitions de couleur au survol et au focus restent à 120 ms. Ce ne sont pas des animations.

### 6.1 Étoile choisie
- **Composant** : sélecteur de note de la page de collecte, et lui seul.
- **Déclencheur** : choix d'une note (toucher, clic, clavier).
- **Mouvement** : l'étoile choisie passe de l'échelle 1 à 1,18 puis revient à 1, en 240 ms, courbe ressort. Les étoiles précédentes se remplissent sans délai ni cascade.
- **Implémentation** : classe `is-choisie` sur le bouton de l'étoile choisie (conteneur `.pz-note-etoile`). Pour rejouer, retirer puis remettre la classe.
- **Mouvement réduit** : remplissage seul.

### 6.2 Attente
- **Composant** : `ChargementMarque` (symbole 48 px et texte obligatoire). Conteneur `.pz-chargement`, `role="status"`.
- **Où** : ouverture de l'espace après le lien de connexion, premier import des ventes depuis l'outil connecté, première génération d'un widget.
- **Déclencheur** : l'attente dépasse 1 s. Avant 1 s, rien ne s'affiche. Le composant disparaît sans animation.
- **Mouvement** : l'étoile seule respire (opacité 1 → 0,55 → 1, échelle 1 → 0,9 → 1), 1 400 ms en boucle. La fusée ne bouge pas.
- **Mouvement réduit** : symbole statique, texte inchangé.
- **Jamais** dans un bouton, une liste, une carte ou un tableau : ceux-là gardent « Envoi… » et les squelettes.

### 6.3 Décollage
- **Composants** : le symbole de l'état « Premier jour », et le bandeau de succès « Votre premier témoignage est en ligne. » (symbole petit 24 px à la place de l'icône).
- **Déclencheur** : une seule fois par compte et par moment (première arrivée dans l'espace après l'onboarding ; premier témoignage validé). Mémorise côté serveur que chaque moment a eu lieu : jamais rejouée, ni au rechargement ni sur un autre appareil.
- **Mouvement** : 640 ms, courbe décollage `cubic-bezier(0.6, 0, 0.2, 1)`.
  - Fusée : translation verticale 0 → +1,2 → −6 → 0 unité de la grille 64.
  - Étoile : échelle 1 → 0,9 → 1,14 → 1, origine à sa pointe haute.
  - Tout revient à sa place.
- **Implémentation** : classe `.pz-decollage` sur le conteneur du symbole intégré en ligne.
- **Mouvement réduit** : aucun mouvement.

### 6.4 Témoignage validé
- **Composant** : badge de statut, dans la liste et dans le détail d'un témoignage.
- **Déclencheur** : clic sur « Valider ».
- **Mouvement** : le badge passe d'« En attente » à « Validé ». Ses couleurs changent en 240 ms. La coche (second tracé de l'icône, classe `pz-coche`) se trace en 240 ms. La ligne ne bouge pas.
- **Mouvement réduit** : changement immédiat.
- **Pas de fusée.**

### Animations écartées : ne pas implémenter
- Mouvement du logo au survol.
- Fondu ou cascade à l'apparition des pages, cartes et listes.
- Compteurs animés du tableau de bord.
- Confettis, étoiles qui tombent, fusée qui traverse l'écran.
- Fusée dans un bouton pendant un envoi.

## 7. Ce qui change par rapport à la v1

- Le symbole : fusée « galet » plus pleine et arrondie, étoile Corail #F0674A (au lieu de Carmin), vide autour de l'étoile élargi, grille 64 (au lieu de 32).
- Le logotype : Bricolage Grotesque 800 en capitales (au lieu de Newsreader).
- Nouveau fichier `pulsacity-mention-mono.svg` : la mention ne charge plus aucune police.
- Nouveaux rendus PNG de chaque SVG.
- E-mails : « PULSACITY » en Helvetica, Arial (au lieu de Georgia).
- Fonds permis : Blanc, Nuage, Ciel, Encre (Papier disparaît avec la charte v2).
- La bibliothèque d'icônes ne reçoit toujours **aucune icône « fusée »**. Le symbole n'est pas une icône.

## 8. Interdits

- Incliner, étirer, recolorer ou redessiner le symbole ou le logotype.
- Séparer l'étoile de la fusée, ou combler le vide entre elles.
- Ajouter une flamme, de la fumée ou une traînée.
- Ajouter une ombre, un contour, un dégradé ou un effet.
- Retaper le logotype dans une police, ou l'écrire en minuscules.
- Mettre le symbole dans un bouton, une puce, une icône de liste, un état de chargement de composant ou un message flottant (seule exception : le bandeau décrit en 6.3).
- Utiliser l'émoji 🚀 dans un texte, un e-mail ou une notification.
- Afficher deux symboles en grand sur le même écran.
- Placer le logo sur un fond qui n'est ni Blanc, ni Nuage, ni Ciel, ni Encre (sauf la version une couleur des mentions « Propulsé par »).
- Empiéter sur la zone de protection, ou descendre sous les tailles minimales.

## 9. Critères d'acceptation

- [ ] Les endroits du tableau 4 affichent la bonne variante, à la bonne hauteur.
- [ ] Aucune autre occurrence du symbole dans le code : il n'apparaît que dans les en-têtes, les e-mails au nom de PULSACITY, les mentions « Propulsé par », les favicons, les icônes d'application et les trois moments du tableau 5.
- [ ] Le favicon 16 px est le PNG dessiné au pixel ; `favicon.svg` n'est jamais intégré en ligne.
- [ ] Les e-mails restent lisibles avec les images bloquées : « PULSACITY » reste visible en texte.
- [ ] La mention « Propulsé par » ne charge aucune police.
- [ ] Les quatre animations respectent les durées et les déclencheurs ci-dessus. Aucune autre animation de marque n'a été ajoutée.
- [ ] Avec `prefers-reduced-motion: reduce`, aucune ne bouge.
- [ ] Le décollage ne se joue qu'une fois par compte et par moment, même après un rechargement.
