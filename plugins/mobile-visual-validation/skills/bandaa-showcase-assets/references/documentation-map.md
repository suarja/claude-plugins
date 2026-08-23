# Carte documentaire de la pipeline Showcase Bandaa

Cette carte indique où trouver le détail et ce qui a effectivement servi à
construire les fixtures, les mockups, le workbench et la landing. Les statuts
évitent de confondre une spec, une fixture de test et une preuve du build réel.

## Produit et direction

| Chemin exact | Rôle | Sortie | Statut |
| --- | --- | --- | --- |
| `docs/PRD.md` | claims et frontières produit : Party privée, Missions, Book, Reveal, consentement, purge | vocabulaire et copy | actuel |
| `CONTEXT.md` | vocabulaire métier : Quest, Shot, Chapter, Moment, Table, Reveal | noms de domaine et états | actuel |
| `docs/design-direction.md` | journal d'expédition nocturne, palettes et typographie | direction UI/Book/artwork | actuel |
| `docs/polaroid-style-guide.md` | cadre blanc, caption Caveat, date mono, rotation et vieillissement | présentation des images | actuel |
| `docs/research/marketing-workshop-bandaa.md` | audit concurrentiel et différenciateur Missions → Book → Reveal | brief marketing | draft à relire |

## Génération d'images et fixtures

| Chemin exact | Rôle réel | Sortie | Statut |
| --- | --- | --- | --- |
| `docs/specs/shipaton/o3-demo-books-art-direction.md` | décisions propriétaires pour visages, réalisme contextuel, téléphones, contraintes et checkpoints | règle canonique des cinq Books exemples | approuvé le 17 août 2026 |
| `docs/assets/event-template-artworks/manifest.json` | provenance des artworks approuvés, crops et format runtime | masters et dérivés Event Templates | actuel |
| `scripts/generate-images.ts` | gpt-image-1 via Vercel AI Gateway, inclut placeholders Party | collections Book/Route/Party | actuel |
| `scripts/generate-replicate-images.ts` | Flux Schnell pour image avec visage ou hero | `book-cover/hero-replicate.jpg` | actuel, brief spécialisé |
| `scripts/generate-openai-images.ts` | gpt-image-1 direct | `book-cover/hero-openai.jpg` | actuel, brief spécialisé |
| `scripts/generate-gateway-images.ts` | Flux gateway historique | `book-cover/hero-gateway.jpg` | historique à vérifier |
| `tools/demo-assets/generate-images.ts` | catalogue Pollinations historique | `tools/demo-assets/collections/` | historique |
| `tools/demo-assets/generate-base-images.ts` | hero, arrivées, fin de nuit via Replicate | `collections/base-images/*.jpg` | support de démo |
| `tools/demo-assets/generate-full-party-images.ts` | collection complète de scènes | `collections/full-party/*.jpg` | support, pas la référence Store v3 |
| `tools/demo-assets/collections/full-party-v2/README.md` | brief de 15 scènes candidates | fixture candidate | à comparer |
| `tools/demo-assets/collections/full-party-v3/README.md` | 21 scènes récentes, sans alcool, sans texte | fixture Store/Book actuelle | actuel |

## Scénarios exécutables

| Chemin exact | Usage | Sortie | Statut |
| --- | --- | --- | --- |
| `tools/demo-assets/scenarios/store-capture.ts` | crée, inspecte et termine une Party localisée pour capture | Party live, Mission, Book prêt, Reveal | actuel |
| `tools/demo-assets/scenarios/full-party.ts` | pipeline complet de démo Book | 21 Shots, Chapters, Moments | support |
| `tools/demo-assets/scenarios/simple-party.ts` | smoke minimal Book/hero | 1 Chapter, hero | support |
| `tools/demo-assets/scenarios/three-chapters.ts` | chronologie et Route | Book à trois Chapters | support |
| `tools/demo-assets/scenarios/sync-moment.ts` | rafale synchronisée | Moment multi-angle | support |
| `tools/demo-assets/scenarios/t3-propagation.ts` | propagation/remplacement de hero | cas technique | support technique |
| `docs/testing/demo-pipeline-architecture.md` | contrat de seed et validation Book | harnais reproductible | actuel |

## Mockups, workbench et exports

| Chemin exact | Rôle | Sortie | Statut |
| --- | --- | --- | --- |
| `docs/mockups/design-chart.html` | gate visuel des directions et landing | HTML validé, jamais build réel | actuel |
| `docs/mockups/store-creative-workbench.html` | ancien atelier HTML exploratoire | composition/localStorage historique | remplacé |
| `docs/assets/bandaa-mobile/app-store-generator/README.md` | contrat opératoire de l'atelier Next.js | sources, devices, exports, manifest | actuel |
| `docs/assets/bandaa-mobile/app-store-generator/src/app/_data/frames.ts` | hero et six frames | catalogue de sortie | actuel |
| `docs/assets/bandaa-mobile/app-store-generator/src/app/_data/devices.ts` | profils et présentation device | Apple frame / Android native | actuel |
| `docs/assets/bandaa-mobile/app-store-generator/src/app/_data/copy.ts` | captions localisées | draft copy | actuel |
| `docs/assets/bandaa-mobile/app-store-generator/src/app/_data/listings.ts` | champs listings | draft Apple/Google | actuel |
| `docs/assets/bandaa-mobile/app-store-generator/src/app/_lib/export-bundle.ts` | export et provenance | PNG/JPEG/ZIP + manifest | actuel |
| `docs/assets/bandaa-mobile/app-store-generator/public/assets/bandaa-store-hero-v6-mission-phone.png` | hero marketing distinct d'une capture | artwork hero | draft |
| `docs/assets/bandaa-mobile/app-store-generator/public/screenshots/` | sources du build réel par Store/device/locale | 72 PNG | ready-for-review |
| `docs/mockups/assets/bandaa-store-hero-v4-universal.png` | variante hero historique | artwork | historique |
| `docs/mockups/assets/bandaa-store-hero-v5-mission.png` | variante hero historique | artwork | historique |
| `docs/mockups/assets/bandaa-store-hero-v6-mission-phone.png` | variante hero retenue pour le workbench | artwork | actuel/draft |

## Landing et listings

| Chemin exact | Rôle | Sortie | Statut |
| --- | --- | --- | --- |
| `.agents/skills/bandaa-store-listings` (dépôt privé) | matrice devices/locales, provenance et régénération | contrat Store propriétaire | actuel |
| `references/store-capture-protocol.md` | matrice FR, fixture, chemins et preuves de capture réelle | frames et exports | actuel |
| `.agents/skills/bandaa-store-listings/references/store-listing-english-bandaa.md` (dépôt privé) | proposition anglaise Apple/Google | listings draft | à relire |
| `docs/research/aso-bandaa.md` | registre FR/EN/ES des champs Store | ASO draft | à relire |
| `docs/plans/2026-08-09-landing-redesign-design.md` | architecture et claims landing | brief landing | actuel |
| `docs/agents/landing-handoff.md` | provenance des copies web et validation production | `web/public/landing/*` | actuel |
| `web/public/landing/` | copies locales des captures iPhone approuvées | assets landing | actuel |

## Chemin actif à utiliser

```text
full-party-v3
  → tools/demo-assets/scenarios/store-capture.ts
  → build réel (party / mission / book / route / table / reveal)
  → docs/assets/bandaa-mobile/app-store-generator
  → exports Apple/Google et copies landing
```

Les générations historiques, les anciens mockups et les fixtures de test
restent consultables pour comprendre l'origine d'une décision, mais ne doivent
pas remplacer cette chaîne ni être présentés comme des captures réelles.
