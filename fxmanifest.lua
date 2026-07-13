-- Sovereign Notify — county-wide notification system for RedM
-- Standalone: any resource on the server can use it (origin: Storyworks K4)

fx_version 'cerulean'
game 'rdr3'
rdr3_warning 'I acknowledge that this is a prerelease build of RedM, and I am aware my resources *will* become incompatible once RedM ships.'

lua54 'yes'

author 'Sovereign County RP'
description 'Sovereign Notify — branded notification overlay (objective slips, progress ticks, mission cards) with a simple export API'
version '1.0.0'

shared_scripts {
  'config.lua',
}

client_scripts {
  'client/main.lua',
}

server_scripts {
  'server/main.lua',
}

ui_page 'ui/dist/index.html'

files {
  'ui/dist/index.html',
  'ui/dist/assets/*',
}
