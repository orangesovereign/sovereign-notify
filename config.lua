-- Sovereign Notify — presentation configuration
-- Server owner/dev sets this; identical for every player (no per-player toggles).

NotifyConfig = {
  -- where objective slips + progress ticks stack:
  -- 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  anchor = 'top-right',

  -- overall size multiplier for all elements
  scale = 1.0,

  -- how long things stay on screen (milliseconds)
  durations = {
    objective = 7000,   -- parchment objective slips
    tick = 2600,        -- progress ticks (small dark chips)
    cardStarted = 3800, -- 'started'-variant cards
    cardEnd = 5000,     -- complete/failed/cancelled/plain cards
  },

  -- how many objective slips may stack before the oldest drops
  maxSlips = 3,
}
