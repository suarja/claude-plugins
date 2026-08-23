#!/usr/bin/env bun

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const LOCALES = new Set(["fr", "en", "es"]);
const DEVICES = new Set(["iphone", "ipad", "android-phone", "android-tablet"]);
const SURFACES = new Set(["landing", "apple-store", "google-play", "design-review"]);
const TEMPLATES = new Set(["catalog", "freeform", "wedding", "birthday", "baptism", "vacation", "b2b-future"]);
const FRAMES = new Set([
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
  "book-cover",
  "host-participants",
  // Historical manifests remain valid.
  "party",
  "mission",
  "book",
  "route",
  "table",
]);
const ACTIVE_FRAMES = new Set([
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
  "book-cover",
  "host-participants",
]);
const HISTORICAL_FRAMES = new Set(["party", "mission", "book", "route", "table"]);
const OPTIONAL_FRAMES = new Set(["book-cover", "host-participants"]);
const FRAME_ROUTES: Record<string, string> = {
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
  party: "app/party/[id].tsx",
  mission: "app/party/[id]/camera.tsx",
  book: "app/book/[bookId].tsx",
  route: "app/book/[bookId].tsx",
  table: "app/book/[bookId].tsx",
};
const FRAME_EVENT_TEMPLATES: Record<string, "catalog" | "wedding"> = {
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
};
const STATUSES = new Set([
  "draft",
  "review",
  "approved",
  "required",
  "capture-ready",
  "capture-ready-generic-fallback",
  "brief-only",
  "not-needed",
  "pending",
]);
const OUTPUT_STATUSES = new Set(["draft", "approved"]);
const SENSITIVE_KEYS = /token|secret|apikey|partyid|partycode|invitetoken|qr/i;

function allowedDevicesForSurface(surface: string): Set<string> | null {
  if (surface === "apple-store") return new Set(["iphone", "ipad"]);
  if (surface === "google-play") return new Set(["android-phone", "android-tablet"]);
  return null;
}

function usage(): never {
  console.error("Usage: bun run validate-showcase.ts <manifest.json> [--repo-root <path>]");
  process.exit(1);
}

function flag(args: string[], name: string): string | undefined {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredString(value: unknown, path: string, errors: string[]): value is string {
  if (typeof value !== "string" || value.trim() === "") {
    errors.push(`${path} must be a non-empty string`);
    return false;
  }
  return true;
}

function scanSensitiveKeys(value: unknown, path: string, errors: string[]): void {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => scanSensitiveKeys(entry, `${path}[${index}]`, errors));
    return;
  }
  if (!isRecord(value)) return;
  for (const [key, child] of Object.entries(value)) {
    if (SENSITIVE_KEYS.test(key)) errors.push(`${path}.${key} is not versionable`);
    scanSensitiveKeys(child, `${path}.${key}`, errors);
  }
}

function main(): void {
  const args = process.argv.slice(2);
  const manifestPath = args.find((arg) => !arg.startsWith("-"));
  if (!manifestPath) usage();

  const repoRoot = resolve(flag(args, "--repo-root") ?? process.cwd());
  const errors: string[] = [];
  let manifest: unknown;
  try {
    manifest = JSON.parse(readFileSync(resolve(manifestPath), "utf8"));
  } catch (error) {
    throw new Error(`Cannot read JSON manifest: ${error instanceof Error ? error.message : error}`);
  }

  if (!isRecord(manifest)) throw new Error("Manifest root must be an object");
  if (manifest.schemaVersion !== 1) errors.push("schemaVersion must be 1");
  requiredString(manifest.showcaseId, "showcaseId", errors);
  if (!SURFACES.has(String(manifest.surface))) errors.push("surface is not supported");
  if (!TEMPLATES.has(String(manifest.eventTemplate))) errors.push("eventTemplate is not supported");
  if (manifest.templateIntent !== manifest.eventTemplate) errors.push("templateIntent must match eventTemplate");
  if (!LOCALES.has(String(manifest.locale))) errors.push("locale must be fr, en or es");
  if (manifest.appLanguage !== manifest.locale) errors.push("appLanguage must match locale");
  if (!STATUSES.has(String(manifest.fixtureStatus))) errors.push("fixtureStatus is invalid");
  if (!STATUSES.has(String(manifest.captureStatus))) errors.push("captureStatus is invalid");
  if (!STATUSES.has(String(manifest.copyStatus))) errors.push("copyStatus is invalid");
  const surface = String(manifest.surface);
  const allowedDevices = allowedDevicesForSurface(surface);
  if (!Array.isArray(manifest.devices) || !manifest.devices.length) {
    errors.push("devices must contain at least one device");
  } else {
    for (const device of manifest.devices) {
      if (!DEVICES.has(String(device))) errors.push(`unsupported device: ${String(device)}`);
      if (allowedDevices && !allowedDevices.has(String(device))) {
        errors.push(`${surface} does not support device: ${String(device)}`);
      }
    }
  }

  if (!isRecord(manifest.title)) {
    errors.push("title must be an object");
  } else {
    requiredString(manifest.title.value, "title.value", errors);
    if (!STATUSES.has(String(manifest.title.status))) errors.push("title.status is invalid");
  }

  if (!isRecord(manifest.claim)) {
    errors.push("claim must be an object");
  } else {
    requiredString(manifest.claim.text, "claim.text", errors);
    requiredString(manifest.claim.source, "claim.source", errors);
    if (!STATUSES.has(String(manifest.claim.status))) errors.push("claim.status is invalid");
  }

  if (!Array.isArray(manifest.frames) || !manifest.frames.length) {
    errors.push("frames must contain at least one frame");
  } else {
    const maxFrames = surface === "apple-store" ? 10 : surface === "google-play" ? 8 : null;
    if (maxFrames !== null && manifest.frames.length > maxFrames) {
      errors.push(`${surface} supports at most ${maxFrames} frames`);
    }
    const hasHistoricalFrame = manifest.frames.some(
      (candidate) => isRecord(candidate) && HISTORICAL_FRAMES.has(String(candidate.id)),
    );
    const hasNewActiveFrame = manifest.frames.some(
      (candidate) => isRecord(candidate) && ACTIVE_FRAMES.has(String(candidate.id)) && candidate.id !== "reveal",
    );
    const seen = new Set<string>();
    for (const [index, frame] of manifest.frames.entries()) {
      if (!isRecord(frame)) {
        errors.push(`frames[${index}] must be an object`);
        continue;
      }
      const id = String(frame.id);
      if (!FRAMES.has(id)) errors.push(`frames[${index}].id is invalid: ${id}`);
      if (seen.has(id)) errors.push(`duplicate frame: ${id}`);
      seen.add(id);
      requiredString(frame.route, `frames[${index}].route`, errors);
      if (FRAME_ROUTES[id] && frame.route !== FRAME_ROUTES[id]) {
        errors.push(`frames[${index}].route does not match ${id}: expected ${FRAME_ROUTES[id]}`);
      }
      if (frame.sourceKind !== "real-capture") errors.push(`frames[${index}].sourceKind must be real-capture`);
      if (!STATUSES.has(String(frame.status))) errors.push(`frames[${index}].status is invalid`);
      if (ACTIVE_FRAMES.has(id)) {
        // Only manifests that still contain an old frame may omit the newer
        // metadata. A new active series must declare both fields, including
        // for reveal.
        const hasActiveMetadata = frame.optional !== undefined || frame.eventTemplate !== undefined;
        const isHistoricalReveal = id === "reveal" && hasHistoricalFrame && !hasNewActiveFrame;
        if (!isHistoricalReveal || hasActiveMetadata) {
          if (typeof frame.optional !== "boolean") errors.push(`frames[${index}].optional must be boolean`);
          if (typeof frame.optional === "boolean" && frame.optional !== OPTIONAL_FRAMES.has(id)) {
            errors.push(`frames[${index}].optional does not match ${id}`);
          }
          if (frame.eventTemplate !== FRAME_EVENT_TEMPLATES[id]) {
            errors.push(`frames[${index}].eventTemplate must be ${FRAME_EVENT_TEMPLATES[id]}`);
          }
        }
      } else if (frame.eventTemplate !== undefined && frame.eventTemplate !== "catalog" && frame.eventTemplate !== "wedding") {
        errors.push(`frames[${index}].eventTemplate must be catalog or wedding`);
      }
      if (frame.status === "approved") {
        const sourcePath = typeof frame.sourcePath === "string" ? frame.sourcePath.trim() : "";
        if (!sourcePath) {
          errors.push(`approved frame ${id} needs sourcePath`);
        } else if (!existsSync(resolve(repoRoot, sourcePath))) {
          errors.push(`missing frame source: ${sourcePath}`);
        }
      } else if (typeof frame.sourcePath === "string" && frame.sourcePath.trim() !== "") {
        if (!existsSync(resolve(repoRoot, frame.sourcePath.trim()))) {
          errors.push(`missing frame source: ${frame.sourcePath}`);
        }
      }
      if (surface === "apple-store" || surface === "google-play") {
        if (manifest.ownerDecision === "approved" && frame.optional === true) {
          errors.push(`published ${surface} cannot include optional frame ${id}`);
        }
      }
    }
  }

  if (!isRecord(manifest.artwork)) {
    errors.push("artwork must be an object");
  } else {
    const artworkStatus = String(manifest.artwork.status);
    if (!new Set(["not-needed", "draft", "approved"]).has(artworkStatus)) errors.push("artwork.status is invalid");
    if (typeof manifest.artwork.path === "string") {
      if (!existsSync(resolve(repoRoot, manifest.artwork.path))) errors.push(`missing artwork: ${manifest.artwork.path}`);
    } else if (artworkStatus === "approved") {
      errors.push("approved artwork needs path");
    }
    if (artworkStatus === "approved" && !isRecord(manifest.artwork.provenance)) errors.push("approved artwork needs provenance");
  }

  if (!isRecord(manifest.fixture)) {
    errors.push("fixture must be an object");
  } else {
    if (manifest.fixture.requestedTemplate !== manifest.eventTemplate) errors.push("fixture.requestedTemplate must match eventTemplate");
    if (!STATUSES.has(String(manifest.fixture.status))) errors.push("fixture.status is invalid");
    const representation = String(manifest.fixture.representation);
    if (!new Set(["exact", "generic-fallback", "brief-only"]).has(representation)) errors.push("fixture.representation is invalid");
    if (manifest.fixture.resolvedTemplate !== null
      && manifest.fixture.resolvedTemplate !== "freeform"
      && manifest.fixture.resolvedTemplate !== "wedding"
      && manifest.fixture.resolvedTemplate !== "birthday") {
      errors.push("fixture.resolvedTemplate must be null, freeform, wedding or birthday for the current runners");
    }
    if (manifest.fixture.status !== manifest.fixtureStatus) errors.push("fixture.status must match fixtureStatus");
    if (manifest.fixture.resolvedTemplate === null) {
      if (manifest.fixture.runner !== null || manifest.fixture.command !== null) errors.push("brief-only fixture cannot have runner or command");
      if (representation !== "brief-only") errors.push("brief-only fixture must use brief-only representation");
      if (manifest.fixture.status !== "brief-only" || manifest.fixtureStatus !== "brief-only") {
        errors.push("brief-only fixture must use brief-only status");
      }
      if (manifest.fixture.titleRelationship !== "not-applicable") errors.push("brief-only fixture must use titleRelationship not-applicable");
    } else {
      if (typeof manifest.fixture.runner !== "string" || !existsSync(resolve(repoRoot, manifest.fixture.runner))) errors.push("fixture.runner must point to an existing runner");
      if (typeof manifest.fixture.command !== "string") errors.push("capture-ready fixture needs command");
      if (typeof manifest.fixture.expectedTitle !== "string") errors.push("capture-ready fixture needs expectedTitle");
      if (representation === "exact") {
        if (manifest.fixture.status !== "capture-ready" || manifest.fixtureStatus !== "capture-ready") {
          errors.push("exact fixture must use capture-ready status");
        }
        if (manifest.fixture.resolvedTemplate !== manifest.eventTemplate) errors.push("exact fixture must match eventTemplate");
        if (manifest.fixture.titleRelationship !== "exact") errors.push("exact fixture must declare titleRelationship exact");
        if (manifest.title && isRecord(manifest.title) && manifest.title.value !== manifest.fixture.expectedTitle) {
          errors.push("exact fixture title must match the runner's expected title");
        }
        if ((manifest.fixture.resolvedTemplate === "wedding" || manifest.fixture.resolvedTemplate === "birthday")
          && manifest.locale !== "fr") {
          errors.push(`${manifest.fixture.resolvedTemplate} exact capture is currently available only in fr; localized capture is Task 7`);
        }
      } else if (representation === "generic-fallback") {
        if (manifest.fixture.status !== "capture-ready-generic-fallback"
          || manifest.fixtureStatus !== "capture-ready-generic-fallback") {
          errors.push("generic fallback must use capture-ready-generic-fallback status");
        }
        if (manifest.fixture.resolvedTemplate === manifest.eventTemplate) errors.push("generic fallback must differ from eventTemplate");
        if (manifest.fixture.titleRelationship !== "generic-fallback") errors.push("generic fallback must declare titleRelationship generic-fallback");
        if (manifest.ownerDecision === "approved") errors.push("generic fallback cannot be approved as the requested template");
      } else {
        errors.push("capture-ready fixture must use exact or generic-fallback representation");
      }
    }
  }
  if (!isRecord(manifest.review)) {
    errors.push("review must be an object");
  } else {
    if (!STATUSES.has(String(manifest.review.copy))) errors.push("review.copy is invalid");
    if (!STATUSES.has(String(manifest.review.visual))) errors.push("review.visual is invalid");
    if (!STATUSES.has(String(manifest.review.owner))) errors.push("review.owner is invalid");
    if (manifest.copyStatus !== manifest.review.copy) errors.push("copyStatus must match review.copy");
  }
  if (!Array.isArray(manifest.outputs)) {
    errors.push("outputs must be an array");
  } else {
    for (const [index, output] of manifest.outputs.entries()) {
      if (!isRecord(output)) {
        errors.push(`outputs[${index}] must be an object`);
        continue;
      }
      requiredString(output.path, `outputs[${index}].path`, errors);
      requiredString(output.sourcePath, `outputs[${index}].sourcePath`, errors);
      requiredString(output.device, `outputs[${index}].device`, errors);
      if (allowedDevices && typeof output.device === "string" && !allowedDevices.has(output.device)) {
        errors.push(`${surface} does not support output device: ${output.device}`);
      }
      if (!OUTPUT_STATUSES.has(String(output.status))) errors.push(`outputs[${index}].status is invalid`);
      if (!Number.isInteger(output.width) || Number(output.width) <= 0) errors.push(`outputs[${index}].width must be positive`);
      if (!Number.isInteger(output.height) || Number(output.height) <= 0) errors.push(`outputs[${index}].height must be positive`);
    }
    if (manifest.ownerDecision === "approved" && manifest.outputs.length === 0) errors.push("approved showcase needs at least one output");
    if (manifest.ownerDecision === "approved" && manifest.outputs.some((output) => !isRecord(output) || output.status !== "approved")) errors.push("approved showcase needs approved outputs");
  }
  if (manifest.ownerDecision !== "pending" && manifest.ownerDecision !== "approved") {
    errors.push("ownerDecision must be pending or approved");
  }
  scanSensitiveKeys(manifest, "manifest", errors);

  if (errors.length) {
    console.error(`Showcase manifest invalid (${errors.length} error${errors.length === 1 ? "" : "s"}):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }
  console.log(`Showcase manifest valid: ${resolve(manifestPath)}`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
