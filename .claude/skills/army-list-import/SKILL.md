---
name: army-list-import
description: Import or refresh a Konflikt '47 faction's unit data from an official army-list PDF into asyncrpg/public/data/factions/<id>.json. Use when the user provides/points to an army-list PDF and asks to load, import, add, update, or refresh unit data for a faction.
---

# Army list PDF import

Turns a Konflikt '47 army-list PDF into `asyncrpg/public/data/factions/<id>.json`, matching the `Unit`/`Faction` schema in `asyncrpg/src/types/unit.ts`.

**Expected use going forward is REPLACING an existing faction file's contents** (points changes, unit reworks, new official errata), not adding brand-new factions — the game's faction roster is essentially fixed, new factions are unlikely. Default to: read the target faction's existing `<id>.json`, treat the PDF as the new source of truth, and overwrite units accordingly. Only treat it as a net-new faction (new file + new `factions/index.json` entry) if the user says this is a faction that isn't in `index.json` yet.

## Process

1. **Rendering the PDF**: `pdftotext -layout` mangles multi-column stat-block tables (points/limits get attributed to the wrong option row) — don't trust it beyond a rough page-count/section survey. Instead render each page to a PNG and read it visually:
   ```
   python -c "import fitz; doc = fitz.open(r'<pdf>'); [p.get_pixmap(dpi=200).save(rf'<outdir>\page_%02d.png' % (i+1)) for i, p in enumerate(doc)]"
   ```
   `pymupdf` (`pip install --user pymupdf`) is the tool to use; `pdftoppm`/poppler is not reliably installable here (no admin rights). On Windows/Git-Bash, pass Windows-style paths (`C:/Users/...`) to the Python script, not mingw `/c/Users/...` paths.

2. **What to extract**: the app's `Unit` schema is a points/options calculator only — no weapon stats, movement, Damage/Morale Value, or full special-rule prose. Capture per unit: `id`, `name`, `factionId`, `models` (from "Unit/Team Composition"), `quality` (points per tier present), `options` (`cost`/`costInexperienced`/`costRegular`/`costVeteran`, `addModels`, `limit`), `upgrades` (squad-wide `costPerUnit` items). Add short `rules` tags (id+name only, no rule text) for parity with existing factions — `rules` isn't consumed by any code, so don't transcribe full special-rule paragraphs.

3. **ID collisions**: unit ids must be globally unique across ALL faction files — `unitStore.ts` merges every faction's units into one flat array and `armyStore.ts` looks units up by a global `.find(id)`, not scoped per faction. Generic role names (`platoon_commander`, `medic`, `mmg_team`, `sniper_team`, etc.) WILL collide across factions — suffix with `_<factionId>` (e.g. `medic_axis`) when the name isn't already faction-distinctive. Known pre-existing bug: `cmn.json` and `jpn.json` both use unsuffixed `platoon_commander` — don't fix this in passing, ask first if you notice it.

4. **Work section by section** (Heroes → HQ → Infantry → Support Teams → Vehicles/Walkers/Tanks → Transports is the typical layout), batch-reading 3-4 page images per turn. Append to a scratch draft JSON in the session scratchpad (NOT the repo) as you go, validating with a quick `JSON.parse` + id-dupe check periodically. Use TaskCreate/TaskUpdate to track section progress — this is a long, high-turn-count task and losing track of what's done is the main failure mode, not transcription accuracy.

5. **Final verification**: cross-check final unit count against `grep -c "REQUISITION POINTS" <extracted-text>` (one per unit block, roughly). Then write the final `<faction>.json` into `asyncrpg/public/data/factions/` (overwriting the existing file if this is a refresh; if genuinely new, also add one entry to `factions/index.json`). Run `vue-tsc --build` from `asyncrpg/`. Do a live check: `npm run dev`, replay `unitStore.ts`'s fetch+merge logic against `http://localhost:5173` to confirm all factions merge with no new id collisions.

## Scale note

One ~50-page/60-unit faction fits comfortably in a single conversation. Two similar PDFs in one prompt is fine (process sequentially, same workflow, roughly double the turns). For 3+, prefer separate sessions per faction so each gets its own clean verification pass.
