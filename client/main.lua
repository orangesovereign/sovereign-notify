-- Sovereign Notify — client bridge & exports
-- Relays notification payloads into the HUD NUI (which never takes focus)
-- and exposes client-side exports for other client scripts.

local configPushed = false

local function pushConfig()
  SendNUIMessage({ type = 'sn:config', config = NotifyConfig })
  configPushed = true
end

CreateThread(function()
  Wait(1000) -- let the NUI frame finish loading
  pushConfig()
end)

local VALID = { objective = 'sn:objective', tick = 'sn:tick', card = 'sn:card', subtitle = 'sn:subtitle' }

local function show(payload)
  if type(payload) ~= 'table' then return end
  local nuiType = VALID[payload.kind]
  if not nuiType then return end
  if not configPushed then pushConfig() end
  SendNUIMessage({
    type = nuiType,
    text = payload.text,
    variant = payload.variant,
    title = payload.title,
    body = payload.body,
    speaker = payload.speaker,
    ms = payload.ms,
  })
end

RegisterNetEvent('sovereign_notify:show', show)

-- client exports ------------------------------------------------------------

exports('Notify', show)

exports('Objective', function(text)
  show({ kind = 'objective', text = text })
end)

exports('Tick', function(text)
  show({ kind = 'tick', text = text })
end)

---variant: 'started' | 'complete' | 'failed' | 'cancelled' | nil (plain)
exports('Card', function(variant, title, body)
  show({ kind = 'card', variant = variant, title = title, body = body })
end)

exports('Subtitle', function(speaker, text, ms)
  show({ kind = 'subtitle', speaker = speaker, text = text, ms = ms })
end)
