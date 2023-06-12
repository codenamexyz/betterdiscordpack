/**
 * @name DevTools
 * @version 0.5.1
 * @author Zerthox
 * @authorLink https://github.com/Zerthox
 * @description Utilities for development.
 * @website https://github.com/Zerthox/BetterDiscord-Plugins
 * @source https://github.com/Zerthox/BetterDiscord-Plugins/tree/master/src/DevTools
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

const load = (key) => BdApi.Data.load(getMeta().name, key);
const save = (key, value) => BdApi.Data.save(getMeta().name, key, value);
const deleteEntry = (key) => BdApi.Data.delete(getMeta().name, key);

const data = {
    __proto__: null,
    deleteEntry,
    load,
    save
};

const join = (...filters) => {
    return ((...args) => filters.every((filter) => filter(...args)));
};
const query$2 = ({ filter, name, keys, protos, source }) => join(...[
    ...[filter].flat(),
    typeof name === "string" ? byName$2(name) : null,
    keys instanceof Array ? byKeys$2(...keys) : null,
    protos instanceof Array ? byProtos$2(...protos) : null,
    source instanceof Array ? bySource$2(...source) : null
].filter(Boolean));
const checkObjectValues = (target) => target !== window && target instanceof Object && target.constructor?.prototype !== target;
const byEntry = (filter, every = false) => {
    return ((target, ...args) => {
        if (checkObjectValues(target)) {
            const values = Object.values(target);
            return values.length > 0 && values[every ? "every" : "some"]((value) => filter(value, ...args));
        }
        else {
            return false;
        }
    });
};
const byName$2 = (name) => {
    return (target) => (target?.displayName ?? target?.constructor?.displayName) === name;
};
const byKeys$2 = (...keys) => {
    return (target) => target instanceof Object && keys.every((key) => key in target);
};
const byProtos$2 = (...protos) => {
    return (target) => target instanceof Object && target.prototype instanceof Object && protos.every((proto) => proto in target.prototype);
};
const bySource$2 = (...fragments) => {
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

const filters = {
    __proto__: null,
    byEntry,
    byKeys: byKeys$2,
    byName: byName$2,
    byProtos: byProtos$2,
    bySource: bySource$2,
    checkObjectValues,
    join,
    query: query$2
};

const hasOwnProperty = (object, property) => Object.prototype.hasOwnProperty.call(object, property);
const sleep = (duration) => new Promise((resolve) => setTimeout(resolve, duration));
const alert = (title, content) => BdApi.UI.alert(title, content);
const confirm = (title, content, options = {}) => BdApi.UI.showConfirmationModal(title, content, options);
const toast = (content, options) => BdApi.UI.showToast(content, options);
const mappedProxy = (target, mapping) => {
    const map = new Map(Object.entries(mapping));
    return new Proxy(target, {
        get(target, prop) {
            return target[map.get(prop) ?? prop];
        },
        set(target, prop, value) {
            target[map.get(prop) ?? prop] = value;
            return true;
        },
        deleteProperty(target, prop) {
            delete target[map.get(prop) ?? prop];
            map.delete(prop);
            return true;
        },
        has(target, prop) {
            return map.has(prop) || prop in target;
        },
        ownKeys() {
            return [...map.keys(), ...Object.keys(target)];
        },
        getOwnPropertyDescriptor(target, prop) {
            return Object.getOwnPropertyDescriptor(target, map.get(prop) ?? prop);
        },
        defineProperty(target, prop, attributes) {
            Object.defineProperty(target, map.get(prop) ?? prop, attributes);
            return true;
        }
    });
};

const find$1 = (filter, { resolve = true, entries = false } = {}) => BdApi.Webpack.getModule(filter, {
    defaultExport: resolve,
    searchExports: entries
});
const query$1 = (query, options) => find$1(query$2(query), options);
const byEntries = (...filters$1) => find$1(join(...filters$1.map((filter) => byEntry(filter))));
const byName$1 = (name, options) => find$1(byName$2(name), options);
const byKeys$1 = (keys, options) => find$1(byKeys$2(...keys), options);
const byProtos$1 = (protos, options) => find$1(byProtos$2(...protos), options);
const bySource$1 = (contents, options) => find$1(bySource$2(...contents), options);
const all$1 = {
    find: (filter, { resolve = true, entries = false } = {}) => BdApi.Webpack.getModule(filter, {
        first: false,
        defaultExport: resolve,
        searchExports: entries
    }) ?? [],
    query: (query, options) => all$1.find(query$2(query), options),
    byName: (name, options) => all$1.find(byName$2(name), options),
    byKeys: (keys, options) => all$1.find(byKeys$2(...keys), options),
    byProtos: (protos, options) => all$1.find(byProtos$2(...protos), options),
    bySource: (contents, options) => all$1.find(bySource$2(...contents), options)
};
const resolveKey = (target, filter) => [target, Object.entries(target ?? {}).find(([, value]) => filter(value))?.[0]];
const demangle = (mapping, required, proxy = false) => {
    const req = required ?? Object.keys(mapping);
    const found = find$1((target) => (checkObjectValues(target)
        && req.every((req) => Object.values(target).some((value) => mapping[req](value)))));
    return proxy ? mappedProxy(found, Object.fromEntries(Object.entries(mapping).map(([key, filter]) => [
        key,
        Object.entries(found ?? {}).find(([, value]) => filter(value))?.[0]
    ]))) : Object.fromEntries(Object.entries(mapping).map(([key, filter]) => [
        key,
        Object.values(found ?? {}).find((value) => filter(value))
    ]));
};
let controller = new AbortController();
const waitFor = (filter, { resolve = true, entries = false } = {}) => BdApi.Webpack.waitForModule(filter, {
    signal: controller.signal,
    defaultExport: resolve,
    searchExports: entries
});
const abort = () => {
    controller.abort();
    controller = new AbortController();
};

const finder = {
    __proto__: null,
    abort,
    all: all$1,
    byEntries,
    byKeys: byKeys$1,
    byName: byName$1,
    byProtos: byProtos$1,
    bySource: bySource$1,
    demangle,
    find: find$1,
    query: query$1,
    resolveKey,
    waitFor
};

const COLOR = "#3a71c1";
const print = (output, ...data) => output(`%c[${getMeta().name}] %c${getMeta().version ? `(v${getMeta().version})` : ""}`, `color: ${COLOR}; font-weight: 700;`, "color: #666; font-size: .8em;", ...data);
const log = (...data) => print(console.log, ...data);
const warn = (...data) => print(console.warn, ...data);
const error = (...data) => print(console.error, ...data);

const logger = {
    __proto__: null,
    error,
    log,
    print,
    warn
};

const patch = (type, object, method, callback, options) => {
    const original = object?.[method];
    if (!(original instanceof Function)) {
        throw TypeError(`patch target ${original} is not a function`);
    }
    const cancel = BdApi.Patcher[type](getMeta().name, object, method, options.once ? (...args) => {
        const result = callback(cancel, original, ...args);
        cancel();
        return result;
    } : (...args) => callback(cancel, original, ...args));
    if (!options.silent) {
        log(`Patched ${options.name ?? String(method)}`);
    }
    return cancel;
};
const instead = (object, method, callback, options = {}) => patch("instead", object, method, (cancel, original, context, args) => callback({ cancel, original, context, args }), options);
const before = (object, method, callback, options = {}) => patch("before", object, method, (cancel, original, context, args) => callback({ cancel, original, context, args }), options);
const after = (object, method, callback, options = {}) => patch("after", object, method, (cancel, original, context, args, result) => callback({ cancel, original, context, args, result }), options);
let menuPatches = [];
const contextMenu = (navId, callback, options = {}) => {
    const cancel = BdApi.ContextMenu.patch(navId, options.once ? (tree) => {
        const result = callback(tree);
        cancel();
        return result;
    } : callback);
    menuPatches.push(cancel);
    if (!options.silent) {
        log(`Patched ${options.name ?? `"${navId}"`} context menu`);
    }
    return cancel;
};
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

const patcher = {
    __proto__: null,
    after,
    before,
    contextMenu,
    instead,
    unpatchAll
};

const inject = (styles) => {
    if (typeof styles === "string") {
        BdApi.DOM.addStyle(getMeta().name, styles);
    }
};
const clear = () => BdApi.DOM.removeStyle(getMeta().name);
const suffix = (...classNames) => {
    const result = {};
    for (const className of classNames) {
        Object.defineProperty(result, className, {
            get: () => {
                const value = className + "-" + getMeta().name;
                Object.defineProperty(result, className, {
                    value,
                    configurable: true,
                    enumerable: true
                });
                return value;
            },
            configurable: true,
            enumerable: true
        });
    }
    return result;
};

const styles = {
    __proto__: null,
    clear,
    inject,
    suffix
};

const ChannelStore = /* @__PURE__ */ byName$1("ChannelStore");
const ChannelActions = /* @__PURE__ */ byKeys$1(["selectChannel"]);
const SelectedChannelStore = /* @__PURE__ */ byName$1("SelectedChannelStore");
const VoiceStateStore = /* @__PURE__ */ byName$1("VoiceStateStore");

const Platforms = /* @__PURE__ */ find$1(byEntry(byKeys$2("WINDOWS", "WEB")));
const ClientActions = /* @__PURE__ */ byKeys$1(["toggleGuildFolderExpand"]);
const UserSettings = /* @__PURE__ */ find$1(byEntry(byKeys$2("updateSetting"), true));
const LocaleStore = /* @__PURE__ */ byName$1("LocaleStore");
const ThemeStore = /* @__PURE__ */ byName$1("ThemeStore");
const MediaEngineStore = /* @__PURE__ */ byName$1("MediaEngineStore");
const MediaEngineActions = /* @__PURE__ */ byKeys$1(["setLocalVolume"]);

const { ComponentDispatch, ComponentDispatcher } = /* @__PURE__ */ demangle({
    ComponentDispatch: byKeys$2("dispatchToLastSubscribed"),
    ComponentDispatcher: byProtos$2("dispatchToLastSubscribed")
});

const Dispatcher$1 = /* @__PURE__ */ byKeys$1(["dispatch", "subscribe"]);

const ExperimentStore = /* @__PURE__ */ byName$1("ExperimentStore");

const { default: Legacy, Dispatcher, Store, BatchedStoreListener, useStateFromStores } = /* @__PURE__ */ demangle({
    default: byKeys$2("Store", "connectStores"),
    Dispatcher: byProtos$2("dispatch"),
    Store: byProtos$2("emitChange"),
    BatchedStoreListener: byProtos$2("attach", "detach"),
    useStateFromStores: bySource$2("useStateFromStores")
}, ["Store", "Dispatcher", "useStateFromStores"]);
const SnapshotStore = /* @__PURE__ */ byProtos$1(["readSnapshot"]);

const flux = {
    __proto__: null,
    BatchedStoreListener,
    Dispatcher,
    Legacy,
    SnapshotStore,
    Store,
    useStateFromStores
};

const Constants = /* @__PURE__ */ byKeys$1(["Permissions", "RelationshipTypes"]);
const i18n = /* @__PURE__ */ byKeys$1(["languages", "getLocale"]);

const GuildStore = /* @__PURE__ */ byName$1("GuildStore");
const GuildActions = /* @__PURE__ */ byKeys$1(["requestMembers"]);
const GuildMemberStore = /* @__PURE__ */ byName$1("GuildMemberStore");
const SortedGuildStore = /* @__PURE__ */ byName$1("SortedGuildStore");
const SortedGuildDeprecatedStore = /* @__PURE__ */ byName$1("SortedGuildDeprecatedStore");
const ExpandedGuildFolderStore = /* @__PURE__ */ byName$1("ExpandedGuildFolderStore");

const MessageStore = /* @__PURE__ */ byName$1("MessageStore");
const MessageActions = /* @__PURE__ */ byKeys$1(["jumpToMessage", "_sendMessage"]);

const { React } = BdApi;
const { ReactDOM } = BdApi;
const ReactSpring = /* @__PURE__ */ byKeys$1(["SpringContext", "animated"]);
const classNames = /* @__PURE__ */ find$1((exports) => exports instanceof Object && exports.default === exports && Object.keys(exports).length === 1);
const EventEmitter = /* @__PURE__ */ find$1((exports) => exports.prototype instanceof Object && Object.prototype.hasOwnProperty.call(exports.prototype, "prependOnceListener"));
const lodash = /* @__PURE__ */ byKeys$1(["cloneDeep", "flattenDeep"]);
const Immutable = /* @__PURE__ */ byKeys$1(["OrderedSet"]);
const semver = /* @__PURE__ */ byKeys$1(["SemVer"]);
const moment = /* @__PURE__ */ byKeys$1(["utc", "months"]);
const SimpleMarkdown = /* @__PURE__ */ byKeys$1(["parseBlock", "parseInline"]);
const hljs = /* @__PURE__ */ byKeys$1(["highlight", "highlightBlock"]);
const platform = /* @__PURE__ */ byKeys$1(["os", "manufacturer"]);
const lottie = /* @__PURE__ */ byKeys$1(["setSubframeRendering"]);
const stemmer = /* @__PURE__ */ bySource$1([".test", ".exec", ".substr"]);

const PopoutWindowStore = /* @__PURE__ */ byName$1("PopoutWindowStore");

const mapping = {
    Redirect: bySource$2(".computedMatch", ".to"),
    Route: bySource$2(".computedMatch", ".location"),
    Router: byKeys$2("computeRootMatch"),
    Switch: bySource$2(".cloneElement"),
    withRouter: bySource$2("withRouter("),
    RouterContext: byName$2("Router")
};
const Router = /* @__PURE__ */ demangle(mapping, ["withRouter"]);

const UserStore = /* @__PURE__ */ byName$1("UserStore");
const PresenceStore = /* @__PURE__ */ byName$1("PresenceStore");
const RelationshipStore = /* @__PURE__ */ byName$1("RelationshipStore");

const Modules = {
    __proto__: null,
    ChannelActions,
    ChannelStore,
    ClientActions,
    ComponentDispatch,
    ComponentDispatcher,
    Constants,
    Dispatcher: Dispatcher$1,
    EventEmitter,
    ExpandedGuildFolderStore,
    ExperimentStore,
    Flux: flux,
    GuildActions,
    GuildMemberStore,
    GuildStore,
    Immutable,
    LocaleStore,
    MediaEngineActions,
    MediaEngineStore,
    MessageActions,
    MessageStore,
    Platforms,
    PopoutWindowStore,
    PresenceStore,
    React,
    ReactDOM,
    ReactSpring,
    RelationshipStore,
    Router,
    SelectedChannelStore,
    SimpleMarkdown,
    SortedGuildDeprecatedStore,
    SortedGuildStore,
    ThemeStore,
    UserSettings,
    UserStore,
    VoiceStateStore,
    classNames,
    hljs,
    i18n,
    lodash,
    lottie,
    moment,
    platform,
    semver,
    stemmer
};

const Common = /* @__PURE__ */ byKeys$1(["Button", "Switch", "Select"]);

const Button = Common.Button;

const Clickable = Common.Clickable;

const Embed = /* @__PURE__ */ byProtos$1(["renderSuppressButton"], { entries: true });

const Flex = /* @__PURE__ */ byKeys$1(["Child", "Justify"], { entries: true });

const { FormSection, FormItem, FormTitle, FormText, FormLabel, FormDivider, FormSwitch, FormNotice } = Common;

const GuildsNav = /* @__PURE__ */ bySource$1(["guildsnav"], { entries: true });

const { Link, NavLink, LinkRouter } = /* @__PURE__ */ demangle({
    NavLink: bySource$2(".sensitive", ".to"),
    Link: bySource$2(".component"),
    LinkRouter: bySource$2("this.history")
}, ["NavLink", "Link"]);

const { Menu, Group: MenuGroup, Item: MenuItem, Separator: MenuSeparator, CheckboxItem: MenuCheckboxItem, RadioItem: MenuRadioItem, ControlItem: MenuControlItem } = BdApi.ContextMenu;

const MessageFooter = /* @__PURE__ */ byProtos$1(["renderRemoveAttachmentConfirmModal"], { entries: true });

const RadioGroup = Common.RadioGroup;

const { Select, SingleSelect } = Common;

const Slider = Common.Slider;

const Switch = Common.Switch;

const ChannelTextArea = bySource$1(["pendingReply"]);

const { TextInput, InputError } = Common;

const Text = Common.Text;

const margins = /* @__PURE__ */ byKeys$1(["marginLarge"]);

const Components = {
    __proto__: null,
    Button,
    ChannelTextArea,
    Clickable,
    Common,
    Embed,
    Flex,
    FormDivider,
    FormItem,
    FormLabel,
    FormNotice,
    FormSection,
    FormSwitch,
    FormText,
    FormTitle,
    GuildsNav,
    InputError,
    Link,
    LinkRouter,
    Menu,
    MenuCheckboxItem,
    MenuControlItem,
    MenuGroup,
    MenuItem,
    MenuRadioItem,
    MenuSeparator,
    MessageFooter,
    NavLink,
    RadioGroup,
    Select,
    SingleSelect,
    Slider,
    Switch,
    Text,
    TextInput,
    margins
};

const ReactInternals = React?.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
const [getInstanceFromNode, getNodeFromInstance, getFiberCurrentPropsFromNode, enqueueStateRestore, restoreStateIfNeeded, batchedUpdates] = ReactDOM?.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED?.Events ?? [];
const ReactDOMInternals = {
    getInstanceFromNode,
    getNodeFromInstance,
    getFiberCurrentPropsFromNode,
    enqueueStateRestore,
    restoreStateIfNeeded,
    batchedUpdates
};

const FCHook = ({ children: { type, props }, callback }) => {
    const result = type(props);
    return callback(result, props) ?? result;
};
const hookFunctionComponent = (target, callback) => {
    const props = {
        children: { ...target },
        callback
    };
    target.props = props;
    target.type = FCHook;
    return target;
};
const queryTree = (node, predicate) => {
    const worklist = [node].flat();
    while (worklist.length !== 0) {
        const node = worklist.shift();
        if (predicate(node)) {
            return node;
        }
        if (node?.props?.children) {
            worklist.push(...[node.props.children].flat());
        }
    }
    return null;
};
const queryTreeAll = (node, predicate) => {
    const result = [];
    const worklist = [node].flat();
    while (worklist.length !== 0) {
        const node = worklist.shift();
        if (predicate(node)) {
            result.push(node);
        }
        if (node?.props?.children) {
            worklist.push(...[node.props.children].flat());
        }
    }
    return result;
};
const queryTreeForParent = (tree, predicate) => {
    let childIndex = -1;
    const parent = queryTree(tree, (node) => {
        const children = node?.props?.children;
        if (children instanceof Array) {
            const index = children.findIndex(predicate);
            if (index > -1) {
                childIndex = index;
                return true;
            }
        }
    });
    return [parent, childIndex];
};
const getFiber = (node) => ReactDOMInternals.getInstanceFromNode(node ?? {});
const queryFiber = (fiber, predicate, direction = "up" , depth = 30) => {
    if (depth < 0) {
        return null;
    }
    if (predicate(fiber)) {
        return fiber;
    }
    if (direction === "up"  || direction === "both" ) {
        let count = 0;
        let parent = fiber.return;
        while (parent && count < depth) {
            if (predicate(parent)) {
                return parent;
            }
            count++;
            parent = parent.return;
        }
    }
    if (direction === "down"  || direction === "both" ) {
        let child = fiber.child;
        while (child) {
            const result = queryFiber(child, predicate, "down" , depth - 1);
            if (result) {
                return result;
            }
            child = child.sibling;
        }
    }
    return null;
};
const findOwner = (fiber, depth = 50) => {
    return queryFiber(fiber, (node) => node?.stateNode instanceof React.Component, "up" , depth);
};
const forceUpdateOwner = (fiber) => new Promise((resolve) => {
    const owner = findOwner(fiber);
    if (owner) {
        owner.stateNode.forceUpdate(() => resolve(true));
    }
    else {
        resolve(false);
    }
});
const forceFullRerender = (fiber) => new Promise((resolve) => {
    const owner = findOwner(fiber);
    if (owner) {
        const { stateNode } = owner;
        instead(stateNode, "render", () => null, { once: true, silent: true });
        stateNode.forceUpdate(() => stateNode.forceUpdate(() => resolve(true)));
    }
    else {
        resolve(false);
    }
});

const index$1 = {
    __proto__: null,
    alert,
    confirm,
    findOwner,
    forceFullRerender,
    forceUpdateOwner,
    getFiber,
    hasOwnProperty,
    hookFunctionComponent,
    mappedProxy,
    queryFiber,
    queryTree,
    queryTreeAll,
    queryTreeForParent,
    sleep,
    toast
};

const SettingsContainer = ({ name, children, onReset }) => (React.createElement(FormSection, null,
    children,
    onReset ? (React.createElement(React.Fragment, null,
        React.createElement(FormDivider, { className: classNames(margins.marginTop20, margins.marginBottom20) }),
        React.createElement(Flex, { justify: Flex.Justify.END },
            React.createElement(Button, { size: Button.Sizes.SMALL, onClick: () => confirm(name, "Reset all settings?", {
                    onConfirm: () => onReset()
                }) }, "Reset")))) : null));

class SettingsStore {
    constructor(defaults, onLoad) {
        this.listeners = new Set();
        this.update = (settings) => {
            Object.assign(this.current, typeof settings === "function" ? settings(this.current) : settings);
            this._dispatch(true);
        };
        this.addReactChangeListener = this.addListener;
        this.removeReactChangeListener = this.removeListener;
        this.defaults = defaults;
        this.onLoad = onLoad;
    }
    load() {
        this.current = { ...this.defaults, ...load("settings") };
        this.onLoad?.();
        this._dispatch(false);
    }
    _dispatch(save$1) {
        for (const listener of this.listeners) {
            listener(this.current);
        }
        if (save$1) {
            save("settings", this.current);
        }
    }
    reset() {
        this.current = { ...this.defaults };
        this._dispatch(true);
    }
    delete(...keys) {
        for (const key of keys) {
            delete this.current[key];
        }
        this._dispatch(true);
    }
    useCurrent() {
        return useStateFromStores([this], () => this.current, undefined, () => false);
    }
    useSelector(selector, deps, compare) {
        return useStateFromStores([this], () => selector(this.current), deps, compare);
    }
    useState() {
        return useStateFromStores([this], () => [
            this.current,
            this.update
        ]);
    }
    useStateWithDefaults() {
        return useStateFromStores([this], () => [
            this.current,
            this.defaults,
            this.update
        ]);
    }
    useListener(listener, deps) {
        React.useEffect(() => {
            this.addListener(listener);
            return () => this.removeListener(listener);
        }, deps ?? [listener]);
    }
    addListener(listener) {
        this.listeners.add(listener);
        return listener;
    }
    removeListener(listener) {
        this.listeners.delete(listener);
    }
    removeAllListeners() {
        this.listeners.clear();
    }
}
const createSettings = (defaults, onLoad) => new SettingsStore(defaults, onLoad);

const version = "0.6.0";

const createPlugin = (plugin) => (meta) => {
    setMeta(meta);
    const { start, stop, styles: styles$1, Settings, SettingsPanel } = (plugin instanceof Function ? plugin(meta) : plugin);
    Settings?.load();
    return {
        start() {
            log("Enabled");
            inject(styles$1);
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

const dium = {
    __proto__: null,
    Data: data,
    Filters: filters,
    Finder: finder,
    Flux: flux,
    Logger: logger,
    Patcher: patcher,
    React,
    ReactDOM,
    ReactDOMInternals,
    ReactInternals,
    SettingsStore,
    Styles: styles,
    Utils: index$1,
    createPlugin,
    createSettings,
    getMeta,
    setMeta,
    version
};

const getWebpackRequire = () => {
    const chunkName = Object.keys(window).find((key) => key.startsWith("webpackChunk"));
    const chunk = window[chunkName];
    let webpackRequire;
    try {
        chunk.push([["__DIUM__"], {}, (require) => {
                webpackRequire = require;
                throw Error();
            }]);
    }
    catch {
    }
    return webpackRequire;
};
const webpackRequire = getWebpackRequire();
const byExportsFilter = (exported) => {
    return (target) => target === exported;
};
const byModuleSourceFilter = (contents) => {
    return (_, module) => {
        const source = sourceOf(module.id).toString();
        return contents.every((content) => source.includes(content));
    };
};
const applyFilter = (filter, keys = ["default", "Z", "ZP"]) => (module) => {
    const { exports } = module;
    const check = typeof keys === "boolean" ? (keys ? Object.keys(exports ?? {}) : []) : keys;
    return (filter(exports, module, String(module.id))
        || exports instanceof Object
            && check.some((key) => key in exports && filter(exports[key], module, String(module.id))));
};
const modules = () => Object.values(webpackRequire.c);
const sources = () => Object.values(webpackRequire.m);
const sourceOf = (id) => webpackRequire.m[id] ?? null;
const find = (filter, keys) => modules().find(applyFilter(filter, keys)) ?? null;
const query = (query, keys) => find(query$2(query), keys);
const byId = (id) => webpackRequire.c[id] ?? null;
const byExports = (exported, keys) => find(byExportsFilter(exported), keys);
const byName = (name, keys) => find(byName$2(name), keys);
const byKeys = (props, keys) => find(byKeys$2(...props), keys);
const byProtos = (protos, keys) => find(byProtos$2(...protos), keys);
const bySource = (contents, keys) => find(bySource$2(...contents), keys);
const byModuleSource = (contents) => find(byModuleSourceFilter(contents));
const all = {
    find: (filter, keys) => modules().filter(applyFilter(filter, keys)),
    query: (query, keys) => all.find(query$2(query), keys),
    byExports: (exported, keys) => all.find(byExportsFilter(exported), keys),
    byName: (name, keys) => all.find(byName$2(name), keys),
    byKeys: (keys, checkKeys) => all.find(byKeys$2(...keys), checkKeys),
    byProtos: (protos, keys) => all.find(byProtos$2(...protos), keys),
    bySource: (contents, keys) => all.find(bySource$2(...contents), keys),
    byModuleSource: (contents) => all.find(byModuleSourceFilter(contents))
};
const resolveImportIds = (module) => {
    const source = sourceOf(module.id).toString();
    const match = source.match(/^(?:function)?\s*\(\w+,\w+,(\w+)\)\s*(?:=>)?\s*{/);
    if (match) {
        const requireName = match[1];
        const calls = Array.from(source.matchAll(new RegExp(`\\W${requireName}\\((\\d+)\\)`, "g")));
        return calls.map((call) => parseInt(call[1]));
    }
    else {
        return [];
    }
};
const resolveImports = (module) => resolveImportIds(module).map((id) => byId(id));
const resolveStyles = (module) => resolveImports(module).filter((imported) => (imported instanceof Object
    && "exports" in imported
    && Object.values(imported.exports).every((value) => typeof value === "string")
    && Object.entries(imported.exports).find(([key, value]) => (new RegExp(`^${key}-([a-zA-Z0-9-_]){6}(\\s.+)$`)).test(value))));
const resolveUsersById = (id) => all.find((_, user) => resolveImportIds(user).includes(id));
const resolveUsers = (module) => resolveUsersById(module.id);

const DevFinder = {
    __proto__: null,
    all,
    byExports,
    byId,
    byKeys,
    byModuleSource,
    byName,
    byProtos,
    bySource,
    find,
    modules,
    query,
    require: webpackRequire,
    resolveImportIds,
    resolveImports,
    resolveStyles,
    resolveUsers,
    resolveUsersById,
    sourceOf,
    sources
};

const { Logger } = dium;
const diumGlobal = {
    ...dium,
    Finder: { ...finder, dev: DevFinder },
    Modules,
    Components
};
const checkForMissing = (type, toCheck) => {
    const missing = Object.entries(toCheck)
        .filter(([, value]) => value === undefined || value === null)
        .map(([key]) => key);
    if (missing.length > 0) {
        Logger.warn(`Missing ${type}: ${missing.join(", ")}`);
    }
    else {
        Logger.log(`All ${type} found`);
    }
};
const index = createPlugin({
    start() {
        window.dium = diumGlobal;
        checkForMissing("modules", Modules);
        checkForMissing("components", Components);
    },
    stop() {
        delete window.dium;
    }
});

module.exports = index;

/*@end @*/
