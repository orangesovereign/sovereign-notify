# Sovereign Notify

County-wide branded notification system for RedM — the Sovereign County design system (parchment objective slips, quiet progress ticks, document-header mission cards) as a standalone resource any script on the server can use. Never full-screen, never takes focus. Extracted from Sovereign Storyworks (feature K4, owner ruling #9: the stock notification system goes in its entirety).

## Install

1. Drop `sovereign_notify` into resources (rebuild `ui/` only if you change it — `ui/dist` ships prebuilt).
2. `server.cfg`:
   ```cfg
   ensure sovereign_notify
   ```
   Start it before any resource that uses it.

## Configure

Everything visual lives in `config.lua` — anchor corner, scale, durations, slip stacking. Server owner sets it; every player sees the same.

## API

### Server

```lua
exports.sovereign_notify:Objective(source, 'Ride to the mill before sundown.')
exports.sovereign_notify:Tick(source, 'Distance covered: 41 of 60 meters')
exports.sovereign_notify:Card(source, 'complete', 'Mission Complete', 'The county thanks you.')
-- variants: 'started' | 'complete' | 'failed' | 'cancelled' | nil (plain)
exports.sovereign_notify:Notify(source, { kind = 'card', variant = 'failed', title = 'Mission Failed', body = '...' })
```

### Client

```lua
exports.sovereign_notify:Objective('Ride to the mill before sundown.')
exports.sovereign_notify:Tick('Reloading the press...')
exports.sovereign_notify:Card('started', 'Shift Begun', 'The mail wagon waits out front.')
```

### Message kinds

| Kind | Looks like | Use for |
|---|---|---|
| `objective` | parchment telegram slip, "New Objective" + wax seal | instructions the player must not miss |
| `tick` | slim dark chip | progress chatter; a new tick replaces the last |
| `card` | top-center document header (brass = complete, oxblood = failed) | big moments; auto-dismisses, never blocks the view |

## Development

```bash
cd ui
npm install
npm run build   # commit the dist/ output — fxmanifest ships only dist
```
