-- Sovereign Notify — server exports
-- Any server resource: exports.sovereign_notify:Objective(source, text) etc.

local function send(source, payload)
  if not source or source == 0 or type(payload) ~= 'table' then return end
  TriggerClientEvent('sovereign_notify:show', source, payload)
end

exports('Notify', send)

exports('Objective', function(source, text)
  send(source, { kind = 'objective', text = text })
end)

exports('Tick', function(source, text)
  send(source, { kind = 'tick', text = text })
end)

---variant: 'started' | 'complete' | 'failed' | 'cancelled' | nil (plain)
exports('Card', function(source, variant, title, body)
  send(source, { kind = 'card', variant = variant, title = title, body = body })
end)

exports('Subtitle', function(source, speaker, text, ms)
  send(source, { kind = 'subtitle', speaker = speaker, text = text, ms = ms })
end)

print('^6[sovereign_notify]^7 ready — exports: Notify, Objective, Tick, Card, Subtitle')
