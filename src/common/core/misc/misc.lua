local class = require "middleclass"
local plugin = require "bunkerweb.plugin"
local utils = require "bunkerweb.utils"

local misc = class("misc", plugin)

local ngx = ngx
local HTTP_NOT_ALLOWED = ngx.HTTP_NOT_ALLOWED
local HTTP_BAD_REQUEST = ngx.HTTP_BAD_REQUEST
local HTTP_MOVED_PERMANENTLY = ngx.HTTP_MOVED_PERMANENTLY
local regex_match = utils.regex_match

function misc:initialize(ctx)
	-- Call parent initialize
	plugin.initialize(self, "misc", ctx)
end

function misc:access()
	-- Check if we need to redirect to HTTPS
	if self.ctx.bw.scheme == "http" and ((self.ctx.bw.https_configured == "yes" and self.variables["AUTO_REDIRECT_HTTP_TO_HTTPS"] == "yes") or self.variables["REDIRECT_HTTP_TO_HTTPS"] == "yes") then
		return self:ret(true, "redirect to HTTPS", HTTP_MOVED_PERMANENTLY, "https://" .. self.ctx.bw.http_host .. self.ctx.bw.request_uri)
	end
	-- Check if method is valid
	local method = self.ctx.bw.request_method
	if not method or not regex_match(method, "^[A-Z]+$") then
		return self:ret(true, "method is not valid", HTTP_BAD_REQUEST)
	end
	-- Check if method is allowed
	for allowed_method in self.variables["ALLOWED_METHODS"]:gmatch("[^|]+") do
		if method == allowed_method then
			return self:ret(true, "method " .. method .. " is allowed")
		end
	end
	self:set_metric("counters", "failed_method", 1)
	return self:ret(true, "method " .. method .. " is not allowed", HTTP_NOT_ALLOWED)
end

function misc:log_default()
	if self.variables["DISABLE_DEFAULT_SERVER"] == "yes" then
		self:set_metric("counters", "failed_default", 1)
	end
	return self:ret(true, "success")
end

return misc
