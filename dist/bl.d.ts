/**
 * Loads and exposes the Better Logic Library for a Homey app.
 */
export class BL {
    /** @private @type {BL} */
    private static get Current();
    /** @private @type {import("../dist/bll").BLL} */
    private static get L();
    /** @private */
    private static get l();
    /**
     * Decodes BLL expressions in text when the Better Logic Library is ready.
     * If it is not ready, the input text is returned unchanged.
     * @param {string} text Text that may contain BLL expressions.
     * @param {Object} [options] Formatting options passed to the BLL decoder.
     * @param {string} [options.locale] Locale to use when formatting values.
     * @param {string} [options.timeZone] Time zone to use when formatting values.
     * @returns {Promise<string>} Decoded text, or the original text if BLL is not ready.
     */
    static decode(text: string, { locale, timeZone }?: {
        locale?: string;
        timeZone?: string;
    }, ...args: any[]): Promise<string>;
    /**
     * Evaluates a BLL expression and supplies properties to its execution context.
     * @param {string} expression Expression to evaluate.
     * @param {Object} contextProperties Properties to add to the expression context.
     * @returns {Promise<Object>} The expression result.
     * @throws {Error} If BLL is not ready or expression evaluation is unavailable.
     */
    static express(expression: string, contextProperties: any, ...args: any[]): Promise<any>;
    /**
     * Requests a download URL from the loaded BLL instance.
     * This method is not yet intended for public use.
     * @param {Object} [options={}] Download content and metadata.
     * @param {string} [options.base64] Base64-encoded content.
     * @param {string} [options.contentType] Content MIME type.
     * @param {*} [options.buffer] Content as a buffer.
     * @param {Object} [options.json] Content as JSON.
     * @param {string} [options.text] Content as text.
     * @param {string} [options.filename] Suggested download filename.
     * @param {Function} [options.callback] Callback used by the download implementation.
     * @returns {Promise<*>} The URL returned by BLL, or `null` if BLL is unavailable.
     */
    static getDownloadUrl({ base64, contentType, buffer, json, text, filename, callback }?: {
        base64?: string;
        contentType?: string;
        buffer?: any;
        json?: any;
        text?: string;
        filename?: string;
        callback?: Function;
    }, ...args: any[]): Promise<any>;
    /**
     * Updates a download URL through the loaded BLL instance.
     * This method is not yet intended for public use.
     * @param {Object} [options={}] Link and content metadata.
     * @param {string} [options.link] Existing link to update.
     * @param {string} [options.base64] Base64-encoded content.
     * @param {string} [options.contentType] Content MIME type.
     * @param {*} [options.buffer] Content as a buffer.
     * @param {Object} [options.json] Content as JSON.
     * @param {string} [options.text] Content as text.
     * @param {string} [options.filename] Suggested download filename.
     * @param {Function} [options.callback] Callback used by the download implementation.
     * @returns {Promise<*>} The result returned by BLL, or `null` if BLL is unavailable.
     */
    static setDownloadUrl({ link, base64, contentType, buffer, json, text, filename, callback }?: {
        link?: string;
        base64?: string;
        contentType?: string;
        buffer?: any;
        json?: any;
        text?: string;
        filename?: string;
        callback?: Function;
    }, ...args: any[]): Promise<any>;
    /**
     * Indicates whether the Better Logic Library app has been reported as installed.
     * @returns {boolean} Whether the app was detected as installed by the latest initialization.
     */
    static get isLoaded(): boolean;
    /**
     * Checks whether a BLL instance is available.
     * @returns {Promise<boolean>} `true` when BLL is available, otherwise `false`.
     * @throws {Error} If the current app requires BLL but it is not running.
     */
    static isInit(): Promise<boolean>;
    /** @private */
    static set _(arg: any);
    /**
     * Gets the loaded Lodash library.
     * @returns {*} The Lodash instance loaded by BLL.
     * @throws {Error} If Lodash is unavailable.
     */
    static get _(): any;
    /** @private */
    static set datetime(arg: typeof import("../dist/dateTime"));
    /**
     * Gets the DateTime library used to format dates and times.
     * @type {typeof import('../dist/dateTime')}
     * @throws {Error} If the DateTime library is unavailable.
     */
    static get datetime(): typeof import("../dist/dateTime");
    /** @private */
    static set number(arg: typeof import("../dist/number"));
    /**
     * Gets the number utility library.
     * @type {typeof import('../dist/number')}
     * @throws {Error} If the number library is unavailable.
     */
    static get number(): typeof import("../dist/number");
    /** @private */
    static set proto(arg: typeof import("../dist/proto"));
    /**
     * Gets the Proto utility library.
     * @type {typeof import('../dist/proto')}
     * @throws {Error} If the Proto library is unavailable.
     */
    static get proto(): typeof import("../dist/proto");
    /** @private */
    static set json(arg: typeof import("../dist/json"));
    /**
     * Gets the JSON utility library, including JSON conversion helpers.
     * @type {typeof import('../dist/json')}
     * @throws {Error} If the JSON library is unavailable.
     */
    static get json(): typeof import("../dist/json");
    /**
     * Initializes BLL for a Homey app.
     * Any existing BLL instance is cleaned up first. Cleanup is also registered
     * for the Homey's `unload` event; the app's `onUninit` method is left untouched.
     * @param {Object} options Initialization options.
     * @param {Object} options.homey Homey instance used by this app.
     * @param {string[]} [options.modules] BLL modules to load.
     * @param {boolean} [options.silent] Whether to initialize the loaded BLL silently.
     * @param {number} [options.waitTime] Wait-time setting passed to the BLL wrapper.
     * @param {boolean} [options.required] Whether the app requires BLL.
     * @returns {Promise<BL>} The initialized BLL wrapper.
     */
    static init({ homey, modules, silent, waitTime, required }?: {
        homey: any;
        modules?: string[];
        silent?: boolean;
        waitTime?: number;
        required?: boolean;
    }): Promise<BL>;
    /**
     * Deletes the own enumerable properties of an object.
     * @param {Object} obj Object whose own properties should be cleared.
     * @returns {void}
     */
    static clearObj(obj: any): void;
    /**
     * Cleans up the current BLL instance and its install, uninstall, unload and realtime listeners.
     * @returns {void}
     */
    static destroy(): void;
    /**
     * Override hook invoked when a variable-change realtime event is received.
     * The default implementation intentionally does nothing.
     * @param {Object} options Variable update details.
     * @param {Object} options.variable Updated variable, or the previous variable when removed.
     * @param {string} options.variable.name Variable name.
     * @param {*} options.variable.value Variable value.
     * @param {string} options.variable.type Variable type, normally `string`, `number`, `boolean`, or `trigger`.
     * @param {boolean} [options.variable.remove] Whether the variable was removed.
     * @param {Date} [options.variable.lastChanged] Last change time, converted to a Date by the wrapper.
     * @param {number} [options.variable.lastChangedTick] Last change time as milliseconds since the Unix epoch.
     * @param {boolean} [options.variable.auto] Whether the variable was created automatically.
     * @param {string} options.formattedDate Formatted last change time supplied by the BLL app.
     * @returns {Promise<void>}
     */
    static onVariableUpdate({ variable, formattedDate }: {
        variable: {
            name: string;
            value: any;
            type: string;
            remove?: boolean;
            lastChanged?: Date;
            lastChangedTick?: number;
            auto?: boolean;
        };
        formattedDate: string;
    }): Promise<void>;
    /**
     * Gets all Better Logic variables through the current BLL instance.
     * @returns {Promise<*>} Variables returned by the Better Logic Library app.
     */
    static getVariables(): Promise<any>;
    /**
     * Creates a BLL wrapper. Prefer {@link BL.init} to initialize it.
     * @param {Object} options Constructor options.
     * @param {Object} options.homey Homey instance used by this app.
     * @param {string[]} [options.modules] BLL modules to load.
     * @param {boolean} [options.silent] Whether to initialize the loaded BLL silently.
     * @param {number} [options.waitTime] Wait-time setting passed to the BLL wrapper.
     * @param {boolean} [options.required] Whether the app requires BLL.
     */
    constructor({ homey, modules, silent, waitTime, required }?: {
        homey: any;
        modules?: string[];
        silent?: boolean;
        waitTime?: number;
        required?: boolean;
    });
    /** @private @type {import("../dist/bll").BLL} */
    private get l();
    /**
     * Handles realtime events received from the Better Logic Library app.
     * @param {string} event Realtime event name.
     * @param {Object} data Event payload.
     * @returns {Promise<void>}
     */
    realtimeFunction(event: string, data: any): Promise<void>;
    homey: any;
    required: number | boolean;
    silent: boolean;
    modules: string[];
    waitTime: number;
    isReady: boolean;
    _destroyed: boolean;
    _uninstallGeneration: number;
    _previousLibraryInitialization: any;
    _installListener: () => void;
    _uninstallListener: () => void;
    api: any;
    _l: any;
    _defer: Defer;
    /**
     * Loads or refreshes the BLL API and, when available, the requested modules.
     * @param {Object} [options={}] Initialization controls.
     * @param {boolean} [options.reload=false] Forces a fresh initialization.
     * @returns {Promise<BL>} This BLL wrapper after initialization completes.
     */
    init({ reload }?: {
        reload?: boolean;
    }): Promise<BL>;
    _initializing: any;
    /** @private @returns {Promise<BL>} */
    private initialize;
    /**
     * Promise resolved when the BLL instance becomes ready.
     * Resolves only once; use `BL.isReady` to check availability after a stop.
     * @type {Promise<BL>}
     */
    get ready(): Promise<BL>;
    /**
     * Loads the BLL bundle and initializes its exported library.
     * @private
     * @returns {Promise<BL>} This wrapper after the bundle initialization attempt.
     */
    private initBll;
    bllFile: any;
    /**
     * Retrieves a library bundle from this app or from the Better Logic Library API.
     * @private
     * @param {string} libraryName Name of the library to retrieve.
     * @returns {Promise<Object>} Library response containing the bundle file.
     */
    private getLibrary;
    /**
     * Compiles JavaScript source text as a Node module and returns its exports.
     * @private
     * @param {string} src JavaScript source code.
     * @param {string} [filename] Filename used for the compiled module.
     * @returns {Object} The compiled module's exports.
     */
    private requireFromString;
    /**
     * Gets this app's API client for another Homey app.
     * @private
     * @param {string} appId Target app ID.
     * @param {string} appname Human-readable target app name for errors.
     * @param {boolean} [onlyApi=false] Returns the API client without checking installation.
     * @returns {Promise<Object>} The target app's API client.
     * @throws {Error} If the API client cannot be obtained or the target app is unavailable.
     */
    private getAppApi;
    _appApi: any;
    /**
     * Gets all Better Logic variables from the Better Logic Library app.
     * @returns {Promise<*>} Variables returned by the Better Logic Library app.
     */
    getVariables(): Promise<any>;
}
/**
 * Wraps a promise with explicit resolve/reject controls and optional forwarding.
 */
export class Defer {
    /**
     * Creates a controllable promise.
     * @param {number} [timeout] Timeout in milliseconds before rejecting.
     * @param {Promise<*>} [originalPromise] Promise whose result should be forwarded.
     * @param {Function} [onTimeout] Callback invoked after a timeout rejection.
     */
    constructor(timeout?: number, originalPromise?: Promise<any>, onTimeout?: Function);
    /** @param {boolean} value Whether the deferred promise has settled. */
    set isDefered(arg: boolean);
    /** @returns {boolean} Whether this deferred promise has been resolved or rejected. */
    get isDefered(): boolean;
    _isDefered: boolean;
    /** @param {Promise<*>} value Promise to wrap. */
    set promise(arg: Promise<any>);
    /** @returns {Promise<*>} The wrapped promise. */
    get promise(): Promise<any>;
    _promise: any;
    _resolve: any;
    _reject: any;
    timeout: any;
    /**
     * Registers a fulfillment handler and returns this deferred wrapper.
     * @param {Function} fun Fulfillment handler.
     * @returns {Defer} This wrapper for chaining.
     */
    then(fun: Function): Defer;
    /**
     * Registers a rejection handler and returns this deferred wrapper.
     * @param {Function} fun Rejection handler.
     * @returns {Defer} This wrapper for chaining.
     */
    catch(fun: Function): Defer;
    /**
     * Registers a handler to run after settlement and returns this wrapper.
     * @param {Function} fun Settlement handler.
     * @returns {Defer} This wrapper for chaining.
     */
    finally(fun: Function): Defer;
    /**
     * Resolves the wrapped promise and clears its timeout.
     * @param {*} val1 Resolution value.
     * @returns {Promise<*>} The wrapped promise.
     */
    resolve(val1: any, val2: any, val3: any, val4: any): Promise<any>;
    /**
     * Rejects the wrapped promise and clears its timeout.
     * @param {*} val1 Rejection reason.
     * @returns {Promise<*>} The wrapped promise.
     */
    reject(val1: any, val2: any, val3: any, val4: any): Promise<any>;
}
//# sourceMappingURL=bl.d.ts.map