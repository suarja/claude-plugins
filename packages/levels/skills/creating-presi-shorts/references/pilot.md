# Pilote et galerie Presi

Référence de travail vérifiée le 3 octobre 2026. Ces chemins servent à reprendre les artefacts ; vérifier leur présence et leur état avant emploi.

## Pilote HyperFrames

Depuis la racine Levels :
- `docs/demos/2026-10-02-presi-bardella/README.md` : sources, captures et galerie.
- `index.html`, `design.md`, `.hyperframes/expanded-prompt.md` dans ce dossier : composition et direction active.
- `pilot-final.mp4` : V1 ; `pilot-v2.mp4` : V2 ; `pilot-v3.mp4` : V3, 24,8 s.
- `captures/share-v3.cfr.mp4` : prise native à cadence constante.
- `assets/main-onboarding.svg` : dessin du guide.
- `proof-v3.png`, `comparison-v2-v3.jpg`, `checks-v3.txt` : preuves du rendu.

Source : https://www.youtube.com/watch?v=aigg3DRq6fw
Extrait parlé : 12:02,600–12:08,460. Carte réellement reçue : 12:02, Attaque / Ad hominem. Les identifiants et textes restent ceux de la prise ; pour un autre sujet, choisir ses propres sources.

La V3 s’arrête sur le dos sans défilement. Retour reçu ensuite : montrer le bas de l’analyse par un vrai défilement, puis un arrêt. Ce geste est la prochaine correction, **pas une preuve déjà acquise**.

## Références de l’application

- `apps/mobile/assets/onboarding/geste.mp4` : référence de transitions.
- `docs/captures/t3b-onboarding/geste-storyboard.json` et `scripts/monter-geste.py` : ancien montage d’onboarding.
- `apps/mobile/src/features/fil/invitation-retournement.tsx` : main exacte du fil.
- `apps/mobile/src/features/ui/mascot.tsx` : chargement, yeux et rendu de secours.
- `.claude/skills/animating-presi/SKILL.md` : personnage et mouvements.

La V3 a nécessité une reconnexion du build installé à Metro local pour charger Presi. L’ancien prebuild avait supprimé des Pods ignorés ; vérifier l’état natif avant un futur build. Ce fait de session n’ordonne ni reconstruction ni réparation pendant un montage.

## Galerie existante

URL : https://presi-videos.swarecito.chatgpt.site
Accès : privé propriétaire au 3 octobre 2026.

Checkout du Site :
`/Users/mata/.codex/visualizations/2026/10/01/01a0f7bd-329d-79e2-8397-81e7e32cec24/presi-videos`

Identité enregistrée dans `.openai/hosting.json` :
`appgprj_6ac0397f4b54819196c2fea9ed247082`

Le Site a sa propre source Git, distincte du dépôt Levels. Ouvrir et synchroniser cette source avec le workflow Sites avant l’édition. Si le checkout manque, retrouver ce même Site et restaurer sa source ; ne pas le recréer.

Site statique : `dist/index.html`, `dist/style.css`, `dist/app.js`, `dist/media/`. Les versions sont décrites dans app.js. Liens actuels : `/#v1`, `/#v2`, `/#v3`, `/#comparer`.

Le lecteur natif offre le plein écran. La comparaison joue les deux versions au même temps ; celle qui finit d’abord reste sur sa dernière image. Son d’un seul lecteur, sélecteurs de versions et position commune. L’hébergement des MP4 doit permettre les requêtes partielles HTTP ; un serveur local sans Range peut laisser les vidéos bloquées au début malgré une commande Play résolue.
