# Life OS — Claude Context

## Who
19 years old, turning 20 on November 2, 2026. From Myanmar/Thailand.
Hard goal: reach $20K+/month income AND save $20K+ for university abroad — both before 20th birthday.
School options: China (~$8-12K/yr, preferred but family won't allow), Singapore (~$25-35K/yr, family preference).
Diploma cert arrives June–July 2026.

## 5 Ventures (priority order)
1. **AI Faceless Video Service** — Fiverr gig → retainer clients → agency (primary focus)
2. **YouTube Automation** — faceless channels, viral niches, ad revenue + affiliates
3. **E-Commerce** — Chinese suppliers → dropshipping
4. **Digital Products** — templates/tools/guides, build once sell forever
5. **ZEN Travel Agency** — Myanmar→Thailand outbound tours (family business, existing clients)

## The App
Single-file mobile PWA at `index.html`.
- **6 tabs**: Today / Goals / Pipeline / Focus / Reflect / Plan
- Pure HTML/CSS/JS — no frameworks, no build step, no npm
- All data in localStorage (keys prefixed `lfs_`)
- Offline-capable via `sw.js` service worker + `manifest.json`
- Dark theme, mobile-first design
- Book frameworks applied INVISIBLY — techniques shape features but names never appear in UI

## Key Constants (top of `<script>` block)
```
SPRINT_START = May 9, 2026
B20_DL       = Nov 2, 2026  (20th birthday deadline)
ABROAD_DL    = Sept 1, 2026 (target departure)
VENTURES     = array of 5 ventures with id, name, note, col
MORNING      = 6-item morning routine checklist
MOVES_DEFAULTS = 5 pre-filled next moves
```

## Files
- `index.html`    — entire app
- `manifest.json` — PWA metadata
- `sw.js`         — service worker for offline caching
- `icon.svg`      — app icon
- `CLAUDE.md`     — this file

## Rules for Working on This App
- **Never show book names or titles in the UI**
- No comments explaining what the code does — only add comments for non-obvious WHY
- Mobile-first, content over decoration
- Don't add features beyond what's asked
- Push finished changes to **main branch** of `doub78/My-life`
- Keep it a single HTML file — no splitting into multiple files

## Next 5 Moves (pre-filled)
1. Launch Fiverr gig for AI faceless video service
2. Land first paid client ($150–300)
3. Convert to first monthly retainer ($300–500/mo)
4. Reach $1,000/month from 3 clients
5. Hit school fund target and depart abroad
