#!/usr/bin/env bun

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const SURFACES = ["landing", "apple-store", "google-play", "design-review"] as const;
const LOCALES = ["fr", "en", "es"] as const;
const DEVICES = ["iphone", "ipad", "android-phone", "android-tablet"] as const;
const TEMPLATES = ["catalog", "freeform", "wedding", "birthday", "baptism", "vacation", "b2b-future"] as const;
const FIXTURE_TEMPLATES = ["freeform", "wedding", "birthday"] as const;

const FRAME_ROUTES = {
  "home-hub": "app/(tabs)/index.tsx",
  "event-types": "app/party/type.tsx",
  "scheduled-countdown": "app/party/[id].tsx",
  "host-hub": "app/party/[id]/host.tsx",
  "host-missions": "app/party/[id]/host/missions.tsx",
  "party-board": "app/party/[id].tsx",
  "live-mission": "app/party/[id]/camera.tsx",
  "vertical-feed": "app/party/[id].tsx",
  "book-moments": "app/book/[bookId].tsx",
  reveal: "app/reveal/[sessionId].tsx",
  "book-cover": "app/book/[bookId].tsx",
  "host-participants": "app/party/[id]/host/participants.tsx",
  // Historical manifests remain generatable and are validated by the
  // compatibility path in validate-showcase.ts.
  party: "app/party/[id].tsx",
  mission: "app/party/[id]/camera.tsx",
  book: "app/book/[bookId].tsx",
  route: "app/book/[bookId].tsx",
  table: "app/book/[bookId].tsx",
} as const;

const FRAME_EVENT_TEMPLATES = {
  "home-hub": "catalog",
  "event-types": "catalog",
  "scheduled-countdown": "wedding",
  "host-hub": "wedding",
  "host-missions": "wedding",
  "party-board": "wedding",
  "live-mission": "wedding",
  "vertical-feed": "wedding",
  "book-moments": "wedding",
  reveal: "wedding",
  "book-cover": "wedding",
  "host-participants": "wedding",
  party: "wedding",
  mission: "wedding",
  book: "wedding",
  route: "wedding",
  table: "wedding",
} as const;

const OPTIONAL_FRAMES = new Set(["book-cover", "host-participants"]);
const ALL_FRAMES = Object.keys(FRAME_ROUTES) as Array<keyof typeof FRAME_ROUTES>;
const LANDING_FRAMES = ["party", "mission", "book", "reveal"] as const;
const APPLE_STORE_FRAMES = [
  "home-hub",
  "event-types",
  "scheduled-countdown",
  "host-hub",
  "host-missions",
  "party-board",
  "live-mission",
  "vertical-feed",
  "book-moments",
  "reveal",
] as const;
const GOOGLE_STORE_FRAMES = [
  "event-types",
  "scheduled-countdown",
  "host-hub",
  "host-missions",
  "live-mission",
  "vertical-feed",
  "book-moments",
  "reveal",
] as const;

const FIXTURE_TITLES = {
  freeform: { fr: "Les potes", en: "The Crew", es: "El coro" },
  wedding: { fr: "Le grand jour", en: "The Big Day", es: "El gran día" },
  birthday: {
    fr: "Un anniversaire à partager",
    en: "A birthday to share",
    es: "Un cumpleaños para compartir",
  },
} as const;

const FIXTURE_RUNNERS = {
  freeform: {
    runner: "tools/demo-assets/scenarios/store-capture.ts",
    command: (locale: Locale) =>
      `bun run tools/demo-assets/scenarios/store-capture.ts create --collection full-party-v3 --locale ${locale}`,
  },
  wedding: {
    runner: "tools/demo-assets/scenarios/wedding-capture.ts",
    command: (locale: Locale) =>
      `bun run tools/demo-assets/scenarios/wedding-capture.ts create --locale ${locale}`,
  },
  birthday: {
    runner: "tools/demo-assets/scenarios/birthday-capture.ts",
    command: (locale: Locale) =>
      `bun run tools/demo-assets/scenarios/birthday-capture.ts create --locale ${locale}`,
  },
} as const;

type Surface = (typeof SURFACES)[number];
type Locale = (typeof LOCALES)[number];
type FixtureTemplate = (typeof FIXTURE_TEMPLATES)[number];

function usage(): never {
  console.error(`Usage:
  bun run scripts/create-showcase-manifest.ts \
    --id <slug> --surface <landing|apple-store|google-play|design-review> \
    --template <catalog|freeform|wedding|birthday|baptism|vacation|b2b-future> \
    --locale <fr|en|es> --device <iphone|ipad|android-phone|android-tablet> \
    --title <localized-title> --claim <verified-claim> --out <path> \
    [--fixture-template wedding|freeform|birthday] \
    [--frames frame-a,frame-b] [--artwork not-needed|draft|approved] [--force]`);
  process.exit(1);
}

function valueFor(args: string[], flag: string, required = true): string | undefined {
  const index = args.indexOf(flag);
  const value = index >= 0 ? args[index + 1] : undefined;
  if (required && (!value || value.startsWith("-"))) usage();
  return value;
}

function oneOf<T extends readonly string[]>(value: string, values: T, label: string): T[number] {
  if (!(values as readonly string[]).includes(value)) {
    throw new Error(`${label} must be one of: ${values.join(", ")}`);
  }
  return value as T[number];
}

function platformForDevice(device: (typeof DEVICES)[number]): "apple" | "google" {
  return device === "iphone" || device === "ipad" ? "apple" : "google";
}

function assertSurfaceDeviceCompatibility(
  surface: Surface,
  device: (typeof DEVICES)[number],
): void {
  if (surface === "apple-store" && platformForDevice(device) !== "apple") {
    throw new Error(`apple-store supports only iphone or ipad; received ${device}`);
  }
  if (surface === "google-play" && platformForDevice(device) !== "google") {
    throw new Error(`google-play supports only android-phone or android-tablet; received ${device}`);
  }
}

function framesFor(surface: Surface, device: (typeof DEVICES)[number]): Array<keyof typeof FRAME_ROUTES> {
  if (surface === "landing" || surface === "design-review") return [...LANDING_FRAMES];
  return platformForDevice(device) === "apple" ? [...APPLE_STORE_FRAMES] : [...GOOGLE_STORE_FRAMES];
}

function main(): void {
  const args = process.argv.slice(2);
  if (args.includes("--help")) usage();

  const id = valueFor(args, "--id")!;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
    throw new Error("--id must be a lowercase hyphenated slug");
  }

  const surface = oneOf(valueFor(args, "--surface")!, SURFACES, "--surface");
  const template = oneOf(valueFor(args, "--template")!, TEMPLATES, "--template");
  const locale = oneOf(valueFor(args, "--locale")!, LOCALES, "--locale");
  const device = oneOf(valueFor(args, "--device")!, DEVICES, "--device");
  assertSurfaceDeviceCompatibility(surface, device);
  const title = valueFor(args, "--title")!;
  const claim = valueFor(args, "--claim")!;
  const out = resolve(valueFor(args, "--out")!);
  const artwork = valueFor(args, "--artwork", false) ?? "not-needed";
  oneOf(artwork, ["not-needed", "draft", "approved"] as const, "--artwork");

  const requestedFixtureTemplate = valueFor(args, "--fixture-template", false);
  if (requestedFixtureTemplate) {
    oneOf(requestedFixtureTemplate, FIXTURE_TEMPLATES, "--fixture-template");
  }
  const fixtureTemplate = requestedFixtureTemplate as FixtureTemplate | undefined;
  if ((fixtureTemplate === "wedding" || fixtureTemplate === "birthday") && locale !== "fr") {
    throw new Error(`${fixtureTemplate} capture currently supports only fr; localized capture is Task 7`);
  }

  const requestedFrames = valueFor(args, "--frames", false);
  const frameIds = requestedFrames
    ? requestedFrames.split(",").map((frame) => frame.trim()).filter(Boolean)
    : framesFor(surface, device);
  if (!frameIds.length || frameIds.some((frame) => !ALL_FRAMES.includes(frame as keyof typeof FRAME_ROUTES))) {
    throw new Error(`--frames must contain only: ${ALL_FRAMES.join(", ")}`);
  }
  if (new Set(frameIds).size !== frameIds.length) throw new Error("--frames cannot contain duplicates");
  const maxFrames = surface === "apple-store" ? 10 : surface === "google-play" ? 8 : null;
  if (maxFrames !== null && frameIds.length > maxFrames) {
    throw new Error(`${surface} supports at most ${maxFrames} frames`);
  }
  if (existsSync(out) && !args.includes("--force")) {
    throw new Error(`${out} already exists; pass --force to replace it`);
  }

  const resolvedTemplate = fixtureTemplate ?? (template === "freeform" ? "freeform" : null);
  const isExactFixture = resolvedTemplate === template && resolvedTemplate !== null;
  const isGenericFallback = resolvedTemplate !== null && !isExactFixture;
  const fixtureStatus = resolvedTemplate === null
    ? "brief-only"
    : isGenericFallback
      ? "capture-ready-generic-fallback"
      : "capture-ready";
  const expectedFixtureTitle = resolvedTemplate
    ? FIXTURE_TITLES[resolvedTemplate][locale]
    : null;
  const titleRelationship = expectedFixtureTitle === null
    ? "not-applicable"
    : isGenericFallback
      ? "generic-fallback"
      : title === expectedFixtureTitle
        ? "exact"
        : "mismatch";
  if (isExactFixture && titleRelationship !== "exact") {
    throw new Error(`--title must be exactly "${expectedFixtureTitle}" for the ${locale} ${template} fixture`);
  }

  const fixtureRunner = resolvedTemplate ? FIXTURE_RUNNERS[resolvedTemplate] : null;
  const fixtureCommand = fixtureRunner?.command(locale) ?? null;
  const manifest = {
    schemaVersion: 1,
    showcaseId: id,
    surface,
    eventTemplate: template,
    templateIntent: template,
    locale,
    appLanguage: locale,
    devices: [device],
    fixtureStatus,
    captureStatus: "required",
    copyStatus: "draft",
    title: { value: title, status: "draft", source: "human-review" },
    claim: { text: claim, status: "draft", source: "owner-to-verify" },
    frames: frameIds.map((frame) => ({
      id: frame,
      route: FRAME_ROUTES[frame as keyof typeof FRAME_ROUTES],
      eventTemplate: FRAME_EVENT_TEMPLATES[frame as keyof typeof FRAME_EVENT_TEMPLATES],
      optional: OPTIONAL_FRAMES.has(frame),
      sourceKind: "real-capture",
      status: "required",
      sourcePath: null,
    })),
    artwork: {
      status: artwork,
      sourceKind: "generated-artwork",
      path: null,
      provenance: null,
    },
    fixture: {
      requestedTemplate: template,
      resolvedTemplate,
      status: fixtureStatus,
      representation: resolvedTemplate === null ? "brief-only" : isGenericFallback ? "generic-fallback" : "exact",
      runner: fixtureRunner?.runner ?? null,
      command: fixtureCommand,
      expectedTitle: expectedFixtureTitle,
      titleRelationship,
      identifiers: "local-only",
    },
    outputs: [],
    review: { copy: "draft", visual: "draft", owner: "pending" },
    ownerDecision: "pending",
  };

  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`Created showcase manifest: ${out}`);
  console.log(`Fixture status: ${fixtureStatus}`);
  console.log(`Frames: ${frameIds.join(", ")}`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
