/**
 * @name PlatformEmulator
 * @version 1.0.1
 * @description Lets you trick Discord into thinking you're running on a different operating system.
 * @author Kyza
 * @source https://github.com/Kyza/BetterDiscordPlugins/src/PlatformEmulator
 * @updateUrl https://raw.githubusercontent.com/Kyza/BetterDiscordPlugins/master/builds/PlatformEmulator.plugin.js
 */
const config = {
	"info": {
		"name": "Platform Emulator",
		"version": "1.0.1",
		"description": "Lets you trick Discord into thinking you're running on a different operating system.",
		"authors": [{
			"name": "Kyza",
			"discord_id": "220584715265114113",
			"github_username": "Kyza"
		}],
		"github": "https://github.com/Kyza/BetterDiscordPlugins/src/PlatformEmulator",
		"github_raw": "https://raw.githubusercontent.com/Kyza/BetterDiscordPlugins/master/builds/PlatformEmulator.plugin.js"
	},
	"build": {
		"zlibrary": true,
		"scssHash": true,
		"alias": {
			"components": "components/index.js"
		},
		"release": {
			"source": true,
			"readme": true,
			"public": true,
			"previews": []
		}
	}
};
function buildPlugin([BasePlugin, PluginApi]) {
	const module = {
		exports: {}
	};
	(() => {
		"use strict";
		class StyleLoader {
			static styles = "";
			static element = null;
			static append(module, css) {
				this.styles += `/* ${module} */\n${css}`;
			}
			static inject(name = config.info.name) {
				if (this.element) this.element.remove();
				this.element = document.head.appendChild(Object.assign(document.createElement("style"), {
					id: name,
					textContent: this.styles
				}));
			}
			static remove() {
				if (this.element) {
					this.element.remove();
					this.element = null;
				}
			}
		}
		function ___createMemoize___(instance, name, value) {
			value = value();
			Object.defineProperty(instance, name, {
				value,
				configurable: true
			});
			return value;
		};
		const Modules = {
			get 'react-spring'() {
				return ___createMemoize___(this, 'react-spring', () => BdApi.findModuleByProps('useSpring'))
			},
			'@discord/utils': {
				get 'joinClassNames'() {
					return ___createMemoize___(this, 'joinClassNames', () => BdApi.findModule(m => typeof m?.default?.default === 'function')?.default)
				},
				get 'useForceUpdate'() {
					return ___createMemoize___(this, 'useForceUpdate', () => BdApi.findModuleByProps('useForceUpdate')?.useForceUpdate)
				},
				get 'Logger'() {
					return ___createMemoize___(this, 'Logger', () => BdApi.findModuleByProps('setLogFn')?.default)
				},
				get 'Navigation'() {
					return ___createMemoize___(this, 'Navigation', () => BdApi.findModuleByProps('replaceWith'))
				}
			},
			'@discord/components': {
				get 'Tooltip'() {
					return ___createMemoize___(this, 'Tooltip', () => BdApi.findModuleByDisplayName('Tooltip'))
				},
				get 'TooltipContainer'() {
					return ___createMemoize___(this, 'TooltipContainer', () => BdApi.findModuleByProps('TooltipContainer')?.TooltipContainer)
				},
				get 'TextInput'() {
					return ___createMemoize___(this, 'TextInput', () => BdApi.findModuleByDisplayName('TextInput'))
				},
				get 'SlideIn'() {
					return ___createMemoize___(this, 'SlideIn', () => BdApi.findModuleByDisplayName('SlideIn'))
				},
				get 'SettingsNotice'() {
					return ___createMemoize___(this, 'SettingsNotice', () => BdApi.findModuleByDisplayName('SettingsNotice'))
				},
				get 'TransitionGroup'() {
					return ___createMemoize___(this, 'TransitionGroup', () => BdApi.findModuleByDisplayName('TransitionGroup'))
				},
				get 'Button'() {
					return ___createMemoize___(this, 'Button', () => BdApi.findModuleByProps('DropdownSizes'))
				},
				get 'Flex'() {
					return ___createMemoize___(this, 'Flex', () => BdApi.findModuleByDisplayName('Flex'))
				},
				get 'Text'() {
					return ___createMemoize___(this, 'Text', () => BdApi.findModuleByDisplayName('Text'))
				},
				get 'Card'() {
					return ___createMemoize___(this, 'Card', () => BdApi.findModuleByDisplayName('Card'))
				}
			},
			'@discord/modules': {
				get 'Dispatcher'() {
					return ___createMemoize___(this, 'Dispatcher', () => BdApi.findModuleByProps('dirtyDispatch', 'subscribe'))
				},
				get 'EmojiUtils'() {
					return ___createMemoize___(this, 'EmojiUtils', () => BdApi.findModuleByProps('uploadEmoji'))
				},
				get 'PermissionUtils'() {
					return ___createMemoize___(this, 'PermissionUtils', () => BdApi.findModuleByProps('computePermissions'))
				},
				get 'DMUtils'() {
					return ___createMemoize___(this, 'DMUtils', () => BdApi.findModuleByProps('openPrivateChannel'))
				}
			},
			'@discord/stores': {
				get 'Messages'() {
					return ___createMemoize___(this, 'Messages', () => BdApi.findModuleByProps('getMessage', 'getMessages'))
				},
				get 'Channels'() {
					return ___createMemoize___(this, 'Channels', () => BdApi.findModuleByProps('getChannel'))
				},
				get 'Guilds'() {
					return ___createMemoize___(this, 'Guilds', () => BdApi.findModuleByProps('getGuild'))
				},
				get 'SelectedGuilds'() {
					return ___createMemoize___(this, 'SelectedGuilds', () => BdApi.findModuleByProps('getGuildId', 'getLastSelectedGuildId'))
				},
				get 'SelectedChannels'() {
					return ___createMemoize___(this, 'SelectedChannels', () => BdApi.findModuleByProps('getChannelId', 'getLastSelectedChannelId'))
				},
				get 'Info'() {
					return ___createMemoize___(this, 'Info', () => BdApi.findModuleByProps('getSessionId'))
				},
				get 'Status'() {
					return ___createMemoize___(this, 'Status', () => BdApi.findModuleByProps('getStatus'))
				},
				get 'Users'() {
					return ___createMemoize___(this, 'Users', () => BdApi.findModuleByProps('getUser', 'getCurrentUser'))
				},
				get 'SettingsStore'() {
					return ___createMemoize___(this, 'SettingsStore', () => BdApi.findModuleByProps('afkTimeout', 'status'))
				},
				get 'UserProfile'() {
					return ___createMemoize___(this, 'UserProfile', () => BdApi.findModuleByProps('getUserProfile'))
				},
				get 'Members'() {
					return ___createMemoize___(this, 'Members', () => BdApi.findModuleByProps('getMember'))
				},
				get 'Activities'() {
					return ___createMemoize___(this, 'Activities', () => BdApi.findModuleByProps('getActivities'))
				},
				get 'Games'() {
					return ___createMemoize___(this, 'Games', () => BdApi.findModuleByProps('getGame'))
				},
				get 'Auth'() {
					return ___createMemoize___(this, 'Auth', () => BdApi.findModuleByProps('getId', 'isGuest'))
				},
				get 'TypingUsers'() {
					return ___createMemoize___(this, 'TypingUsers', () => BdApi.findModuleByProps('isTyping'))
				}
			},
			'@discord/actions': {
				get 'ProfileActions'() {
					return ___createMemoize___(this, 'ProfileActions', () => BdApi.findModuleByProps('fetchProfile'))
				},
				get 'GuildActions'() {
					return ___createMemoize___(this, 'GuildActions', () => BdApi.findModuleByProps('requestMembersById'))
				}
			},
			get '@discord/i18n'() {
				return ___createMemoize___(this, '@discord/i18n', () => BdApi.findModuleByProps('getLocale'))
			},
			get '@discord/constants'() {
				return ___createMemoize___(this, '@discord/constants', () => BdApi.findModuleByProps('API_HOST'))
			},
			get '@discord/contextmenu'() {
				return ___createMemoize___(this, '@discord/contextmenu', () => {
					const ctx = Object.assign({}, BdApi.findModuleByProps('openContextMenu'), BdApi.findModuleByProps('MenuItem'));
					ctx.Menu = ctx.default;
					return ctx;
				})
			},
			get '@discord/forms'() {
				return ___createMemoize___(this, '@discord/forms', () => BdApi.findModuleByProps('FormItem'))
			},
			get '@discord/scrollbars'() {
				return ___createMemoize___(this, '@discord/scrollbars', () => BdApi.findModuleByProps('ScrollerAuto'))
			},
			get '@discord/native'() {
				return ___createMemoize___(this, '@discord/native', () => BdApi.findModuleByProps('requireModule'))
			},
			get '@discord/flux'() {
				return ___createMemoize___(this, '@discord/flux', () => Object.assign({}, BdApi.findModuleByProps('useStateFromStores').default, BdApi.findModuleByProps('useStateFromStores')))
			},
			get '@discord/modal'() {
				return ___createMemoize___(this, '@discord/modal', () => Object.assign({}, BdApi.findModuleByProps('ModalRoot'), BdApi.findModuleByProps('openModal')))
			},
			get '@discord/connections'() {
				return ___createMemoize___(this, '@discord/connections', () => BdApi.findModuleByProps('get', 'isSupported', 'map'))
			},
			get '@discord/sanitize'() {
				return ___createMemoize___(this, '@discord/sanitize', () => BdApi.findModuleByProps('stringify', 'parse', 'encode'))
			},
			get '@discord/icons'() {
				return ___createMemoize___(this, '@discord/icons', () => BdApi.findAllModules(m => m.displayName && ~m.toString().indexOf('currentColor')).reduce((icons, icon) => (icons[icon.displayName] = icon, icons), {}))
			},
			'@discord/classes': {
				get 'Timestamp'() {
					return ___createMemoize___(this, 'Timestamp', () => BdApi.findModuleByPrototypes('toDate', 'month'))
				},
				get 'Message'() {
					return ___createMemoize___(this, 'Message', () => BdApi.findModuleByPrototypes('getReaction', 'isSystemDM'))
				},
				get 'User'() {
					return ___createMemoize___(this, 'User', () => BdApi.findModuleByPrototypes('tag'))
				},
				get 'Channel'() {
					return ___createMemoize___(this, 'Channel', () => BdApi.findModuleByPrototypes('isOwner', 'isCategory'))
				}
			}
		};
		var __webpack_modules__ = {
			832: module => {
				module.exports = BdApi.React;
			}
		};
		var __webpack_module_cache__ = {};
		function __webpack_require__(moduleId) {
			var cachedModule = __webpack_module_cache__[moduleId];
			if (void 0 !== cachedModule) return cachedModule.exports;
			var module = __webpack_module_cache__[moduleId] = {
				exports: {}
			};
			__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
			return module.exports;
		}
		(() => {
			__webpack_require__.n = module => {
				var getter = module && module.__esModule ? () => module["default"] : () => module;
				__webpack_require__.d(getter, {
					a: getter
				});
				return getter;
			};
		})();
		(() => {
			__webpack_require__.d = (exports, definition) => {
				for (var key in definition)
					if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) Object.defineProperty(exports, key, {
						enumerable: true,
						get: definition[key]
					});
			};
		})();
		(() => {
			__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
		})();
		(() => {
			__webpack_require__.r = exports => {
				if ("undefined" !== typeof Symbol && Symbol.toStringTag) Object.defineProperty(exports, Symbol.toStringTag, {
					value: "Module"
				});
				Object.defineProperty(exports, "__esModule", {
					value: true
				});
			};
		})();
		var __webpack_exports__ = {};
		(() => {
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, {
				default: () => PlatformEmulator
			});
			const external_PluginApi_namespaceObject = PluginApi;
			const external_BasePlugin_namespaceObject = BasePlugin;
			var external_BasePlugin_default = __webpack_require__.n(external_BasePlugin_namespaceObject);
			const Platforms = {
				Linux: "linux",
				OSX: "darwin",
				Web: "web",
				Windows: "win32"
			};
			function getPlatform(platform) {
				for (let key in Platforms)
					if (key.toLowerCase() === platform.toLowerCase()) return Platforms[key];
				return null;
			}
			const Platform = external_PluginApi_namespaceObject.WebpackModules.getModule((m => m.PlatformTypes?.WINDOWS));
			const storage = external_PluginApi_namespaceObject.PluginUtilities.loadData("PlatformEmulator", "settings", {
				platform: getPlatform(Platform.default.getPlatform()),
				websocket: "default"
			});
			function set(path, value) {
				_.set(storage, path, value);
				external_PluginApi_namespaceObject.PluginUtilities.saveData("PlatformEmulator", "settings", storage);
				return storage;
			}
			function get(path, defaultValue) {
				return _.get(external_PluginApi_namespaceObject.PluginUtilities.loadData("PlatformEmulator", "settings", storage), path, defaultValue);
			}
			function forceUpdateApp() {
				let root = document.getElementById("app-mount")._reactRootContainer._internalRoot.current;
				while ("App" !== root?.type?.displayName) {
					root?.stateNode?.forceUpdate?.();
					root = root.child;
				}
			}
			const FluxDisptacher = external_PluginApi_namespaceObject.WebpackModules.getByProps("_dispatch");
			let ws;
			function die() {
				FluxDisptacher.unsubscribe("MESSAGE_CREATE", die);
				throw "Resetting WebSocket.";
			}
			function WebSocket_reset() {
				if (!ws) try {
					FluxDisptacher.subscribe("MESSAGE_CREATE", die);
					FluxDisptacher.dispatch({
						type: "MESSAGE_CREATE"
					});
				} catch {} else ws.close();
			}
			var React = __webpack_require__(832);
			const {
				useState
			} = React;
			const Header = external_PluginApi_namespaceObject.WebpackModules.getByDisplayName("Header");
			const FormDivider = external_PluginApi_namespaceObject.WebpackModules.getByDisplayName("FormDivider");
			const RadioGroup = external_PluginApi_namespaceObject.WebpackModules.getByDisplayName("RadioGroup");
			function Settings() {
				const [platform, setPlatform] = useState(get("platform"));
				const [websocket, setWebsocket] = useState(get("websocket"));
				return React.createElement(React.Fragment, null, React.createElement(Header, null, "UI Spoof"), React.createElement(FormDivider, {
					style: {
						marginTop: "8px",
						marginBottom: "8px"
					}
				}), React.createElement(RadioGroup, {
					options: [{
						name: "Windows",
						value: "win32"
					}, {
						name: "OSX",
						value: "darwin"
					}, {
						name: "Linux",
						value: "linux"
					}],
					value: platform,
					onChange: e => {
						if (e.value !== platform) {
							setPlatform(e.value);
							set("platform", e.value);
							forceUpdateApp();
						}
					}
				}), React.createElement(Header, null, "WebSocket Spoof"), React.createElement(FormDivider, {
					style: {
						marginTop: "8px",
						marginBottom: "8px"
					}
				}), React.createElement(RadioGroup, {
					options: [{
						name: "Default",
						value: "default"
					}, {
						name: "Windows",
						value: "win32"
					}, {
						name: "OSX",
						value: "darwin"
					}, {
						name: "Linux",
						value: "linux"
					}, {
						name: "TempleOS",
						value: "temple"
					}, {
						name: "Web",
						value: "web"
					}, {
						name: "Android",
						value: "android"
					}, {
						name: "iOS",
						value: "ios"
					}],
					value: websocket,
					onChange: e => {
						if (e.value !== websocket) {
							setWebsocket(e.value);
							set("websocket", e.value);
							WebSocket_reset();
						}
					}
				}));
			}
			var PlatformEmulator_React = __webpack_require__(832);
			const PlatformEmulator_Platform = external_PluginApi_namespaceObject.WebpackModules.getModule((m => m.PlatformTypes?.WINDOWS));
			const Packer = external_PluginApi_namespaceObject.WebpackModules.getModule((m => m.prototype?.hasOwnProperty("unpack"))).prototype;
			class PlatformEmulator extends(external_BasePlugin_default()) {
				onStart() {
					for (const [functionName, platformName] of Object.entries(Platforms)) external_PluginApi_namespaceObject.Patcher.instead(PlatformEmulator_Platform.default, `is${functionName}`, (() => get("platform").toLowerCase() === platformName.toLowerCase()));
					external_PluginApi_namespaceObject.Patcher.before(WebSocket.prototype, "send", ((that, args) => {
						ws = that;
						if (!(args[0] instanceof ArrayBuffer)) return;
						const data = Packer.unpack(args[0]);
						if (2 === data.op) switch (get("websocket")) {
							case "win32":
								data.d.properties = {
									browser: "Discord Client",
									os: "Windows"
								};
								break;
							case "darwin":
								data.d.properties = {
									browser: "Discord Client",
									os: "Mac OS X"
								};
								break;
							case "linux":
								data.d.properties = {
									browser: "Discord Client",
									os: "Linux"
								};
								break;
							case "temple":
								data.d.properties = {
									browser: "Discord Client",
									os: "TempleOS"
								};
								break;
							case "web":
								data.d.properties = {
									browser: "Discord Web",
									os: "Other"
								};
								break;
							case "android":
								data.d.properties = {
									browser: "Discord Android",
									os: "Android"
								};
								break;
							case "ios":
								data.d.properties = {
									browser: "Discord iOS",
									os: "iOS"
								};
								break;
						}
						args[0] = Packer.pack(data);
						return args;
					}));
					forceUpdateApp();
					if ("default" !== get("websocket")) WebSocket_reset();
				}
				onStop() {
					external_PluginApi_namespaceObject.Patcher.unpatchAll();
					forceUpdateApp();
					if ("default" !== get("websocket")) WebSocket_reset();
				}
				getSettingsPanel() {
					return PlatformEmulator_React.createElement(Settings, null);
				}
			}
		})();
		module.exports.LibraryPluginHack = __webpack_exports__;
	})();
	const PluginExports = module.exports.LibraryPluginHack;
	return PluginExports?.__esModule ? PluginExports.default : PluginExports;
}
module.exports = window.hasOwnProperty("ZeresPluginLibrary") ?
	buildPlugin(window.ZeresPluginLibrary.buildPlugin(config)) :
	class {
		getName() {
			return config.info.name;
		}
		getAuthor() {
			return config.info.authors.map(a => a.name).join(", ");
		}
		getDescription() {
			return `${config.info.description}. __**ZeresPluginLibrary was not found! This plugin will not work!**__`;
		}
		getVersion() {
			return config.info.version;
		}
		load() {
			BdApi.showConfirmationModal(
				"Library plugin is needed",
				[`The library plugin needed for ${config.info.name} is missing. Please click Download to install it.`], {
					confirmText: "Download",
					cancelText: "Cancel",
					onConfirm: () => {
						require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
							if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
							await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
						});
					}
				}
			);
		}
		start() {}
		stop() {}
	};
/*@end@*/
