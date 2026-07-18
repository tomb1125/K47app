# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

AsyncRPG is an army-builder web app for the Konflikt '47 tabletop wargame. Users pick a faction, build platoons of units, configure per-unit quality/options/upgrades, and the app computes total army points live. Armies can be exported to a JSON file and re-imported later.

The actual application lives in the `asyncrpg/` subdirectory (Vue 3 + Vite + Pinia + TypeScript). All commands below are run from `asyncrpg/`. The `package.json` at the repo root is a stale leftover, not the real app — ignore it.

## Commands

Run from `asyncrpg/`:

```sh
npm run dev          # start Vite dev server
npm run build         # type-check (vue-tsc --build) + production build
npm run preview       # preview a production build
npm run test:unit     # run Vitest unit tests
npm run test:unit -- path/to/file.spec.ts   # run a single test file
npm run lint          # oxlint --fix, then eslint --fix --cache
npm run format        # prettier --write on src/
```

There is no separate root-level test/build — always `cd asyncrpg` first (or run npm scripts with `--prefix asyncrpg`).

## Architecture

### Data flow: static JSON → Pinia stores → components

- **`public/data/factions/index.json`** is a manifest: `{ factions: [{ id, name, file }] }`.
- **`public/data/factions/<id>.json`** holds one faction's unit *definitions*: `{ id, name, units: Unit[] }` (see `src/types/unit.ts` for the `Unit`/`ArmyUpgrade`/`ArmyProperty` shape — quality-tier costs, `options` with per-quality cost overrides and `addModels`, squad-wide `upgrades` with `costPerUnit`).
- **`unitStore.ts`** (`useUnitStore`) fetches the manifest, then fetches every faction file in parallel and flattens all `units` into one array. **Unit ids must be globally unique across all faction files** — lookups elsewhere are a flat `.find(id)` with no per-faction scoping, so an id collision between factions silently corrupts the wrong unit's data. When adding a new faction, only `factions/<id>.json` + one manifest entry are needed — no code changes.
- **`armyStore.ts`** (`useArmyStore`) holds the *player's* army: `platoons: Platoon[]`, each with `units: ArmyUnit[]` (an `ArmyUnit` is a lightweight reference — `unitId`, chosen `quality`, `upgrades` counts, `properties` selections, computed `models`). `totalPoints` is a computed that walks every platoon/unit, looks up the matching definition in `unitStore`, and sums base quality cost + upgrade costs (using the per-quality cost override for the unit's chosen quality tier, falling back to `opt.cost`) + selected property costs (`costPerUnit * modelCount`).
- Definitions (`Unit`, from `unitStore`) and instances (`ArmyUnit`, from `armyStore`) are separate types that share ids — don't conflate "the static stat block" with "the player's configured copy" when reading store code.

### Component tree

`App.vue` (faction picker + total points header) → `Configurator.vue` (add platoon / save-army / load-army buttons) → `Platoon.vue` (add/remove unit) → `Unit.vue` (per-unit quality/options/properties form, reads/writes via `armyStore` actions).

### Save/load

`Configurator.vue` serializes `{ factionId, platoons }` straight from the stores to a downloaded `.json` file, and loading does `armyStore.$patch({ platoons })` + sets `unitStore.selectedFaction` from the parsed file — there's no schema versioning or migration, so a loaded file's shape must match the current `ArmyUnit`/`Platoon` types exactly.

## Adding a new faction from a PDF army list

There is a validated workflow (extraction from Konflikt '47 PDF army lists — rendering pages as images rather than trusting `pdftotext -layout`, what subset of the PDF to capture into the `Unit` schema, the id-collision gotcha, and a verification pass) recorded in project memory. Ask if you need the details re-derived rather than re-deriving the PDF-parsing approach from scratch.
