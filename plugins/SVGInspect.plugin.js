/**
 * @name SvgInspect
 * @version 0.1.1
 * @author Zerthox
 * @authorLink https://github.com/Zerthox
 * @description View all SVG components bundled in Discord
 * @website https://github.com/Zerthox/BetterDiscord-Plugins
 * @source https://github.com/Zerthox/BetterDiscord-Plugins/tree/master/src/SVGInspect
**/

/*@cc_on @if (@_jscript)
var pluginName = WScript.ScriptName.split(".")[0];
var shell = WScript.CreateObject("WScript.Shell");
shell.Popup(
    "Do NOT run scripts from the internet with the Windows Script Host!\nMove this file to your BetterDiscord plugins folder.",
    0,
    pluginName + ": Warning!",
    0x1030
);
var fso = new ActiveXObject("Scripting.FileSystemObject");
var pluginsPath = shell.expandEnvironmentStrings("%appdata%\\BetterDiscord\\plugins");
if (!fso.FolderExists(pluginsPath)) {
    var popup = shell.Popup(
        "Unable to find BetterDiscord on your computer.\nOpen the download page of BetterDiscord?",
        0,
        pluginName + ": BetterDiscord not found",
        0x34
    );
    if (popup === 6) {
        shell.Exec("explorer \"https://betterdiscord.app\"");
    }
} else if (WScript.ScriptFullName === pluginsPath + "\\" + WScript.ScriptName) {
    shell.Popup(
        "This plugin is already in the correct folder.\nNavigate to the \"Plugins\" settings tab in Discord and enable it there.",
        0,
        pluginName,
        0x40
    );
} else {
    var popup = shell.Popup(
        "Open the BetterDiscord plugins folder?",
        0,
        pluginName,
        0x34
    );
    if (popup === 6) {
        shell.Exec("explorer " + pluginsPath);
    }
}
WScript.Quit();
@else @*/

'use strict';

let meta = null;
const getMeta = () => {
    if (meta) {
        return meta;
    }
    else {
        throw Error("Accessing meta before initialization");
    }
};
const setMeta = (newMeta) => {
    meta = newMeta;
};

const join = (...filters) => {
    return ((...args) => filters.every((filter) => filter(...args)));
};
const query = ({ filter, name, keys, protos, source }) => join(...[
    ...[filter].flat(),
    typeof name === "string" ? byName(name) : null,
    keys instanceof Array ? byKeys$1(...keys) : null,
    protos instanceof Array ? byProtos(...protos) : null,
    source instanceof Array ? bySource(...source) : null
].filter(Boolean));
const byName = (name) => {
    return (target) => (target?.displayName ?? target?.constructor?.displayName) === name;
};
const byKeys$1 = (...keys) => {
    return (target) => target instanceof Object && keys.every((key) => key in target);
};
const byProtos = (...protos) => {
    return (target) => target instanceof Object && target.prototype instanceof Object && protos.every((proto) => proto in target.prototype);
};
const bySource = (...fragments) => {
    return (target) => {
        while (target instanceof Object && "$$typeof" in target) {
            target = target.render ?? target.type;
        }
        if (target instanceof Function) {
            const source = target.toString();
            const renderSource = target.prototype?.render?.toString();
            return fragments.every((fragment) => typeof fragment === "string" ? (source.includes(fragment) || renderSource?.includes(fragment)) : (fragment(source) || renderSource && fragment(renderSource)));
        }
        else {
            return false;
        }
    };
};

const confirm = (title, content, options = {}) => BdApi.UI.showConfirmationModal(title, content, options);

const find = (filter, { resolve = true, entries = false } = {}) => BdApi.Webpack.getModule(filter, {
    defaultExport: resolve,
    searchExports: entries
});
const byKeys = (keys, options) => find(byKeys$1(...keys), options);
const all = {
    find: (filter, { resolve = true, entries = false } = {}) => BdApi.Webpack.getModule(filter, {
        first: false,
        defaultExport: resolve,
        searchExports: entries
    }) ?? [],
    query: (query$1, options) => all.find(query(query$1), options),
    byName: (name, options) => all.find(byName(name), options),
    byKeys: (keys, options) => all.find(byKeys$1(...keys), options),
    byProtos: (protos, options) => all.find(byProtos(...protos), options),
    bySource: (contents, options) => all.find(bySource(...contents), options)
};
let controller = new AbortController();
const abort = () => {
    controller.abort();
    controller = new AbortController();
};

const COLOR = "#3a71c1";
const print = (output, ...data) => output(`%c[${getMeta().name}] %c${getMeta().version ? `(v${getMeta().version})` : ""}`, `color: ${COLOR}; font-weight: 700;`, "color: #666; font-size: .8em;", ...data);
const log = (...data) => print(console.log, ...data);

let menuPatches = [];
const unpatchAll = () => {
    if (menuPatches.length + BdApi.Patcher.getPatchesByCaller(getMeta().name).length > 0) {
        for (const cancel of menuPatches) {
            cancel();
        }
        menuPatches = [];
        BdApi.Patcher.unpatchAll(getMeta().name);
        log("Unpatched all");
    }
};

const inject = (styles) => {
    if (typeof styles === "string") {
        BdApi.DOM.addStyle(getMeta().name, styles);
    }
};
const clear = () => BdApi.DOM.removeStyle(getMeta().name);

const { React } = BdApi;
const classNames = /* @__PURE__ */ find((exports) => exports instanceof Object && exports.default === exports && Object.keys(exports).length === 1);

const Common = /* @__PURE__ */ byKeys(["Button", "Switch", "Select"]);

const Button = Common.Button;

const Flex = /* @__PURE__ */ byKeys(["Child", "Justify"], { entries: true });

const { FormSection, FormItem, FormTitle, FormText, FormLabel, FormDivider, FormSwitch, FormNotice } = Common;

const margins = /* @__PURE__ */ byKeys(["marginLarge"]);

const SettingsContainer = ({ name, children, onReset }) => (React.createElement(FormSection, null,
    children,
    onReset ? (React.createElement(React.Fragment, null,
        React.createElement(FormDivider, { className: classNames(margins.marginTop20, margins.marginBottom20) }),
        React.createElement(Flex, { justify: Flex.Justify.END },
            React.createElement(Button, { size: Button.Sizes.SMALL, onClick: () => confirm(name, "Reset all settings?", {
                    onConfirm: () => onReset()
                }) }, "Reset")))) : null));

const createPlugin = (plugin) => (meta) => {
    setMeta(meta);
    const { start, stop, styles, Settings, SettingsPanel } = (plugin instanceof Function ? plugin(meta) : plugin);
    Settings?.load();
    return {
        start() {
            log("Enabled");
            inject(styles);
            start?.();
        },
        stop() {
            abort();
            unpatchAll();
            clear();
            stop?.();
            log("Disabled");
        },
        getSettingsPanel: SettingsPanel ? () => (React.createElement(SettingsContainer, { name: meta.name, onReset: Settings ? () => Settings.reset() : null },
            React.createElement(SettingsPanel, null))) : null
    };
};

const components = all.bySource([(source) => /\.(?:createElement|jsxs?)\)?\("svg",/.test(source)], { entries: true });
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    render() {
        return !this.state.hasError ? this.props.children : null;
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
}
const index = createPlugin({
    SettingsPanel: () => (React.createElement(React.Fragment, null, components.map((SVG, i) => (React.createElement(ErrorBoundary, { key: i },
        React.createElement(SVG, { open: true }))))))
});

module.exports = index;

/*@end @*/
