import './Cancellable/InjectContentScripts_imperative.js'
import './Cancellable/InjectContentScripts_declarative.js'
import './Cancellable/CleanProfileAndAvatar.js'
import './Cancellable/SettingsListener.js'
import './Cancellable/StartPluginHost.js'
import './Cancellable/StartSandboxedPluginHost.js'

if (import.meta.webpackHot) import.meta.webpackHot.accept()
