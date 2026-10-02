---
name: "creating-presi-shorts"
description: "Créer ou réviser une vidéo verticale Presi pour TikTok, Reels ou Shorts à partir d’un extrait réel, de Presi animée et du partage natif vers une carte. Use when the user asks for a Presi short, its pacing or gesture overlays, or its version in the review gallery."
---

# Créer les shorts Presi

Le nom de l’application et de la mascotte est **Presi**. Montrer un parcours réel : un extrait politique, Pause, Partager, Presi dans la feuille native, la carte reçue, son retournement puis la lecture. Monter avec HyperFrames. Le format de départ est 9:16, 1080 × 1920, 30 images/s.

## Reprendre le bon projet

Lire le README, design.md et la direction HyperFrames du pilote concerné avant de modifier son montage. Pour le pilote actuel et la galerie, lire [references/pilot.md](references/pilot.md). Conserver les versions rendues et leurs liens ; chaque itération a un numéro.

Utiliser les skills HyperFrames de composition et de CLI présents dans le projet, et animating-presi pour le personnage. Ils sont actuellement dans `.claude/skills/` ; un agent Codex peut aussi lire ces instructions. Utiliser serve-sim pour le simulateur Apple. Ne pas recopier leurs manuels dans ce skill.

Ce format social suit les choix du propriétaire pour le pilote. Les anciennes règles de filming-a-demo relatives au hackathon, aux deux posts, à une durée impérative ou à l’anneau ne remplacent pas ces choix. Ne produire des textes de publication que s’ils sont demandés.

## Choisir et préparer la matière

- Partir d’une carte réellement analysée et choisir le passage vidéo correspondant, compréhensible en quelques secondes. Conserver URL, titre, locuteur, minutage exact, carte et environnement dans le README.
- Les affirmations d’actualité doivent rester attribuées et fidèles à leur source. Une recherche utile sert à choisir et vérifier le passage ; les sous-titres reprennent ce qui est dit.
- Conserver la voix originale. Écouter l’extrait entier et regarder les prises utilisées pour repérer les publicités, interstitiels ou écrans parasites.
- Réutiliser une vidéo déjà analysée pour filmer son partage connu. Vérifier la carte réellement ouverte. Une préparation de tournage ne lance pas implicitement une nouvelle analyse payante.
- Avant le partage, laisser Presi sur un autre écran, par exemple Candidats. La prévisualisation doit apparaître devant cet écran, puis mener à la carte ; filmer depuis la même carte déjà ouverte brouille le parcours.

## Capturer le parcours réel

Filmer le partage depuis YouTube ou TikTok, puis la feuille native et Presi. Sur simulateur, le site YouTube dans Safari est une source réelle utilisable. Ne pas construire une page imitant le partage.

Rejouer d’abord le parcours et vérifier l’icône, les polices, les images et les yeux de Presi. Un rond vert dans une carte peut être le rendu de secours d’une image en erreur : inspecter le chargement avant de recapturer, plutôt que masquer le défaut dans le montage.

Préférer le build déjà installé s’il convient. Pour une capture, ne pas lancer un prebuild ou reconstruire sans nécessité vérifiée. Relever le simulateur, le build, le serveur et les ports actifs avant d’agir ; préserver ceux des autres travaux. Sur ce Mac, connecter un dev client à Metro sur 127.0.0.1 peut suffire à rétablir les assets. Ce diagnostic reste à vérifier dans chaque environnement.

Enregistrer suffisamment longtemps : montée entière de la feuille, réception, carte au repos, retournement et lecture. **Prévoir le défilement final** : laisser lire le début du dos, effectuer un glissement réel lent vers le bas de l’analyse, puis laisser le bas lisible. Capturer le défilement dans l’application ; une translation d’une capture fixe ne montre pas le contenu hors écran.

Si la prise existante ne contient pas le bas, recapturer cette fin sur la même carte. Un raccord se fait entre états concordants, à l’arrêt. Mentionner les coupes et les images prolongées.

Convertir la prise du simulateur à cadence constante, 30 images/s, **avant de mesurer les appuis et de produire les planches de contrôle**. Les prises variables peuvent donner de faux timings lors des recherches d’images.

## Composer et guider

En ouverture, découper l’écran : extrait et contrôles utiles en haut, fond de la marque et Presi animée en bas. Garder assez de métadonnées pour reconnaître la vidéo et son bouton Partager. La mascotte écoute et réagit au passage ; son regard accompagne ensuite l’action. La capture native prend le plein cadre au partage.

Lire [references/gestures.md](references/gestures.md) pour les appuis, la caméra et le défilement.

- Laisser chaque écran arriver et se stabiliser avant son guide.
- Laisser la feuille native finir de monter, puis marquer une pause avant le zoom vers Presi.
- Employer la main exacte du tutoriel du fil, avec approche, arrêt, appui et retrait.
- Zooms légers sur les petits contrôles ; retour immédiat au cadre complet à l’appui, avant l’écran suivant.
- Garder la grande carte entière au retournement : la main suffit.
- Après le retournement, conserver un temps de lecture, le glissement puis un arrêt sur le bas. Ajuster la durée globale à cette lisibilité ; 15–25 s est une intention, pas un motif pour escamoter une action demandée.

Conserver la vitesse capturée des transitions qui portent le parcours. Couper une longue attente immobile ou tenir une image pour lire est possible, à documenter. Ne pas présenter un montage comme une mesure de performance.

## Rendre et contrôler

Mettre à jour ensemble la composition, design.md et la direction active. Le README décrit les sources, les coupes, les contrôles et le rendu actuel ; il ne doit pas continuer à prescrire les anciens gestes.

Exécuter le lint HyperFrames, la validation et l’inspection aux instants critiques, puis rendre le MP4. Contrôler le **MP4 exporté**, avec son audio et une planche d’images : ouverture, main, feuille au repos avant zoom, icône, prévisualisation, Presi chargée, retournement sans zoom, défilement et bas lisible. Comparer la nouvelle version à la précédente.

Un avertissement sur un texte masqué par une vidéo doit être vérifié dans le rendu, puis expliqué. Un fichier existant ou un aperçu demandé ne prouve pas son rendu. Distinguer contrôles techniques et réception visuelle du propriétaire.

## Livrer et publier les itérations

Livrer le MP4 et un résumé des changements. Quand la mise à jour de la galerie est demandée ou couverte par le mandat, utiliser Sites sur le projet existant de [references/pilot.md](references/pilot.md). Préserver son accès privé et ses versions. Ne pas créer un Site par vidéo.

Ajouter le fichier, la durée, les changements, le téléchargement et le lien direct de la nouvelle version ; le lecteur principal présente la dernière. La comparaison conserve les commandes communes et un seul son actif. Son compteur suit le temps réel du lecteur, y compris pendant le chargement.

Suivre les skills Sites pour publier et ne donner l’URL qu’après confirmation de succès. Ne pas publier sur les réseaux sociaux sans mandat. Conserver les checkpoints autorisés dans des commits limités aux fichiers du travail ; préserver le checkout concurrent.
