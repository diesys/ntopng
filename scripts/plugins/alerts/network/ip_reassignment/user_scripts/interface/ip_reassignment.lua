--
-- (C) 2019-21 - ntop.org
--

local user_scripts = require("user_scripts")

-- #################################################################

local IP_REASSIGNMENT_KEY = "ntopng.prefs.ifid_" .. interface.getId() .. ".ip_reassignment_alerts"

-- #################################################################

local function dummy()
   -- Nothing to do here, the plugin is only meant to set a preference which is then
   -- read from C.
   return
end

-- #################################################################

local script = {
   -- Script category
   category = user_scripts.script_categories.network,

   -- Off by default
   default_enabled = false,

   -- NOTE: hooks defined below
   hooks = {
      min = dummy
   },

   gui = {
      i18n_title = "ip_reassignment.title",
      i18n_description = "ip_reassignment.description",
   }
}

-- #################################################################

function script.onLoad(hook, hook_config)
   if hook_config and hook_config.enabled then
      ntop.setCache(IP_REASSIGNMENT_KEY, "1")
   end

end

-- #################################################################

function script.onUnload(hook, hook_config)
   ntop.delCache(IP_REASSIGNMENT_KEY)
end

-- #################################################################

function script.onEnable(hook, hook_config)
   ntop.setCache(IP_REASSIGNMENT_KEY, "1")
   tprint(IP_REASSIGNMENT_KEY)
end

-- #################################################################

function script.onDisable(hook, hook_config)
   ntop.delCache(IP_REASSIGNMENT_KEY)
end

-- #################################################################

return script