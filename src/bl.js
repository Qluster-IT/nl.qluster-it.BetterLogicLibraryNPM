//let this._l;
//let BL.__, BL._datetime, BL._proto;
//let BL._isLoaded = false;


//let BL._ready, BL._defer, BL._initDefer;

const BLL_EXPORT_KEYS = ['_L', '_version', '__', '_math', 'math', '_datetime', '_number', '_proto', '_json', 'submodules'];

/**
 * Loads and exposes the Better Logic Library for a Homey app.
 */
class BL {
    /** @private @type {BL} */
    static get Current() { return this._current; }

    /** @private @type {import("../dist/bll").BLL} */
    static get L() { return BL._L; }

    /** @private @type {import("../dist/bll").BLL} */
    get l() { return this._l; }

    /** @private */
    static get l() { return BL && BL.L ? BL.L.Current : null; }


    /**
     * Decodes BLL expressions in text when the Better Logic Library is ready.
     * If it is not ready, the input text is returned unchanged.
     * @param {string} text Text that may contain BLL expressions.
     * @param {Object} [options] Formatting options passed to the BLL decoder.
     * @param {string} [options.locale] Locale to use when formatting values.
     * @param {string} [options.timeZone] Time zone to use when formatting values.
     * @returns {Promise<string>} Decoded text, or the original text if BLL is not ready.
     */
    static async decode(text, { locale, timeZone } = {}) {
        // if (!BL.l && BL && BL.Current && !BL.Current.silent) throw new Error('Better Logic Library is not loaded.');
        // if (!BL.l) return text;
        if (!BL.isReady) return text;

        return await BL.l.decode.apply(BL.l, arguments);
    }

    
    /**
     * Evaluates a BLL expression and supplies properties to its execution context.
     * @param {string} expression Expression to evaluate.
     * @param {Object} contextProperties Properties to add to the expression context.
     * @returns {Promise<Object>} The expression result.
     * @throws {Error} If BLL is not ready or expression evaluation is unavailable.
     */
    static async express(expression, contextProperties) {
        if (!BL.isReady || !BL.l.express) throw new Error('Better Logic Library is not loaded.');//return undefined;

        return await BL.l.express.apply(BL.l, arguments);
    }


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
    static async getDownloadUrl({ base64, contentType, buffer, json, text, filename, callback } = {}) {
        if (!BL.l && BL && BL.Current && !BL.Current.silent) throw new Error('Better Logic Library is not loaded.');
        if (!BL.l) return null;
        return await BL.l.getDownloadUrl.apply(BL.l, arguments);
    }
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
    static async setDownloadUrl({ link, base64, contentType, buffer, json, text, filename, callback } = {}) {
        if (!BL.l && BL && BL.Current && !BL.Current.silent) throw new Error('Better Logic Library is not loaded.');
        if (!BL.l) return null;
        return await BL.l.setDownloadUrl.apply(BL.l, arguments);
    }
    /**
     * Indicates whether the Better Logic Library app has been reported as installed.
     * @returns {boolean} Whether the app was detected as installed by the latest initialization.
     */
    static get isLoaded() { return BL._isLoaded; }

    /**
     * Checks whether a BLL instance is available.
     * @returns {Promise<boolean>} `true` when BLL is available, otherwise `false`.
     * @throws {Error} If the current app requires BLL but it is not running.
     */
    static async isInit() {
        // try {            
        //     await BL.Current.init();
        // } catch (error) {

        // }
        if (!BL.l && BL && BL.Current && !BL.Current.silent) throw new Error('The Better Logic Library App is not running.');//
        if (!BL.l) return false;
        return true;
        //return true;
    }
    /**
     * Gets the loaded Lodash library.
     * @returns {*} The Lodash instance loaded by BLL.
     * @throws {Error} If Lodash is unavailable.
     */
    static get _() { if (BL.__) return BL.__; throw new Error('The Better Logic Library App is not running.'); }//BLL: Lodash has not been loaded.'); }

    /** @private */
    static set _(val) { BL.__ = val; }

    /**
     * Gets the DateTime library used to format dates and times.
     * @type {typeof import('../dist/dateTime')}
     * @throws {Error} If the DateTime library is unavailable.
     */
    static get datetime() { if (BL._datetime) return BL._datetime; throw new Error('The Better Logic Library App is not running.'); }//BLL: DateTime has not been loaded.'); }


    /** @private */
    static set datetime(val) { BL._datetime = val; }

    /**
     * Gets the number utility library.
     * @type {typeof import('../dist/number')}
     * @throws {Error} If the number library is unavailable.
     */
    static get number() { if (BL._number) return BL._number; throw new Error('The Better Logic Library App is not running.'); }//BLL: DateTime has not been loaded.'); }


    /** @private */
    static set number(val) { BL._number = val; }


    /**
     * Gets the Proto utility library.
     * @type {typeof import('../dist/proto')}
     * @throws {Error} If the Proto library is unavailable.
     */
    static get proto() { if (BL._proto) return BL._proto; throw new Error('The Better Logic Library App is not running.'); }//BLL: Proto has not been loaded.'); }

    /** @private */
    static set proto(val) { BL._proto = val; }

    /**
     * Gets the JSON utility library, including JSON conversion helpers.
     * @type {typeof import('../dist/json')}
     * @throws {Error} If the JSON library is unavailable.
     */
    static get json() { if (BL._json) return BL._json; throw new Error('The Better Logic Library App is not running.'); }//BLL: DateTime has not been loaded.'); }

    /** @private */
    static set json(val) { BL._json = val; }

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
    static async init({ homey, modules, silent, waitTime, required } = {}) {
        if (BL.Current) BL.detroy();
        let bl = new BL({ homey, modules, silent, waitTime, required });

        homey.once('unload', BL.detroy);

        return await bl.init({ reload: true });
    }

    /**
     * Handles realtime events received from the Better Logic Library app.
     * @param {string} event Realtime event name.
     * @param {Object} data Event payload.
     * @returns {Promise<void>}
     */
    async realtimeFunction(event, data) {
        let reload = false;
        if(event==='variable_changed') {
            if(data && data.variable && data.variable.lastChanged) data.variable.lastChanged = new Date(data.variable.lastChanged);
            if(data) BL.onVariableUpdate({variable:data.variable, formattedDate:data.date});

        } else if (event.startsWith('running')) {
            if ((reload = (BL.homey.app.id !== 'net.i-dev.betterlogic' && event === 'running')) || ((event === 'running_2x' || event === 'running_3x') && !BL.isReady)) {
                //this.runningReceived = true;
                try {
                    //if(!BL.Current.isReady) {
                    BL.homey.log('BL.Current.init reload', reload);
                    await BL.Current.init({ reload });

                    //}
                } catch (error) {
                    BL.homey.error('BL.init', error);
                }
                // let x = async () => {
                //     await BL.Current.initBll({ version: await BL.Current.api.getVersion() });
                //     if (BL.Current.defer && !BL.Current.defer.isDefered) BL.Current.defer.resolve(this);
                // };
                // if (BL.Current.api.getInstalled()) x();

                // else {
                //     BL.homey.setTimeout(x, 15000);
                // }
            }
        }
    }

    /**
     * Deletes the own enumerable properties of an object.
     * @param {Object} obj Object whose own properties should be cleared.
     * @returns {void}
     */
    static clearObj(obj) {
        for (const key in obj)
            if (Object.hasOwnProperty.call(obj, key)) {
                try {
                    delete obj[key];
                } catch (ex) { }
            }
    }

    /**
     * Cleans up the current BLL instance and its install, uninstall, unload and realtime listeners.
     * The misspelling is retained for compatibility with existing callers.
     * @returns {void}
     */
    static detroy() {
        const current = BL.Current;
        if (!current) return;
        current._destroyed = true;
        current.isReady = BL.isReady = false;
        try {
            current.homey.removeListener('unload', BL.detroy);
            if (current._appApi) {
                current._appApi.off('install', current._installListener);
                current._appApi.off('uninstall', current._uninstallListener);
            }
            current._uninstallListener();
        } catch (error) {
            current.homey.error('BL.detroy', error);
        } finally {
            BL._current = null;
        }
    }

    /**
     * Creates a BLL wrapper. Prefer {@link BL.init} to initialize it.
     * @param {Object} options Constructor options.
     * @param {Object} options.homey Homey instance used by this app.
     * @param {string[]} [options.modules] BLL modules to load.
     * @param {boolean} [options.silent] Whether to initialize the loaded BLL silently.
     * @param {number} [options.waitTime] Wait-time setting passed to the BLL wrapper.
     * @param {boolean} [options.required] Whether the app requires BLL.
     */
    constructor({ homey, modules, silent, waitTime, required } = {}) {
        if (BL._current) return BL._current;
        BL._current = this;
        BL.homey = homey;
        // _modules = modules;
        // _silent = silent;
        // _waitTime = waitTime;
        // _required = required;


        this.homey = homey;
        this.required = required === undefined ? (modules && modules.length) : required;
        this.silent = silent === undefined ? (!modules || !modules.length || !this.required) : silent;
        this.modules = modules;
        this.waitTime = waitTime;
        BL.isReady = this.isReady = false;
        BL._isLoaded = false;
        this._destroyed = false;
        this._uninstallGeneration = 0;
        this._previousLibraryInitialization = BL._libraryInitializing;
        this._installListener = () => {
            const pending = this._initializing || Promise.resolve();
            pending.then(() => this.init({ reload: true })).catch(error => this.homey.error('BL.init', error));
        };
        this._uninstallListener = () => {
            this._uninstallGeneration++;
            this.isReady = false;
            if (this.api) {
                this.api.off('realtime', this.realtimeFunction);
                this.api = null;
            }
            if (BL.Current === this) {
                BL.isReady = BL._isLoaded = false;
                try {
                    if (this.l) this.l.destroy();
                } catch (error) {
                    this.homey.error('BL.destroyLibrary', error);
                } finally {
                    this._l = null;
                    for (const key of BLL_EXPORT_KEYS) {
                        delete BL[key];
                    }
                }
            }
        };

        BL._defer = this._defer = new Defer();
        BL._ready = BL._defer.promise;
        BL.ready = BL._ready;
    }
    /**
     * Loads or refreshes the BLL API and, when available, the requested modules.
     * @param {Object} [options={}] Initialization controls.
     * @param {boolean} [options.reload=false] Forces a fresh initialization.
     * @returns {Promise<BL>} This BLL wrapper after initialization completes.
     */
    async init({ reload } = {}) {
        if (this._destroyed) return this;
        if (this._initializing) return this._initializing;
        if (this.isReady && !reload) return this;
        this._initializing = Promise.resolve().then(() => this.initialize()).catch(error => {
            this.homey.error('BL.init', error);
            return this;
        }).finally(() => { this._initializing = null; });
        return this._initializing;
    }

    /** @private @returns {Promise<BL>} */
    async initialize() {
        if (this._destroyed) return this;
        const generation = this._uninstallGeneration;
        // Downloaded BLL modules write to BL's shared exports while initializing.
        if (this._previousLibraryInitialization) {
            await this._previousLibraryInitialization;
            this._previousLibraryInitialization = null;
            if (this._destroyed || generation !== this._uninstallGeneration) return this;
        }
        if (this.homey.app.id !== 'net.i-dev.betterlogic' && !await this.homey.settings.get('notification_bll_supported')) {
            try {
                this.homey.settings.set('notification_bll_supported', true);
                const appName = this.homey.__(this.homey.manifest.name);
                const excerpt = this.homey.__({
                    en: `This app (${appName}) now supports BLL coding within flowcards.\nInstall the Better Logic Library App from the Athom Store to use BLL coding.\nSee the BLL App Settings for more information.`,
                    nl: `Deze app (${appName}) ondersteunt nu BLL-codering in flowkaarten.\nInstalleer de Better Logic Library-app vanuit de Athom Store om BLL-codering te gebruiken.\nBekijk de instellingen van de BLL-app voor meer informatie.`,
                    de: `Diese App (${appName}) unterstützt jetzt BLL-Codierung in Flow-Karten.\nInstalliere die Better Logic Library-App aus dem Athom Store, um BLL-Codierung zu verwenden.\nWeitere Informationen findest du in den Einstellungen der BLL-App.`,
                    fr: `Cette application (${appName}) prend désormais en charge le codage BLL dans les cartes Flow.\nInstallez l'application Better Logic Library depuis l'Athom Store pour utiliser le codage BLL.\nConsultez les paramètres de l'application BLL pour plus d'informations.`,
                    it: `Questa app (${appName}) ora supporta la codifica BLL nelle schede Flow.\nInstalla l'app Better Logic Library dall'Athom Store per usare la codifica BLL.\nConsulta le impostazioni dell'app BLL per maggiori informazioni.`,
                    sv: `Den här appen (${appName}) stöder nu BLL-kodning i Flow-kort.\nInstallera Better Logic Library-appen från Athom Store för att använda BLL-kodning.\nSe BLL-appens inställningar för mer information.`,
                    no: `Denne appen (${appName}) støtter nå BLL-koding i Flow-kort.\nInstaller Better Logic Library-appen fra Athom Store for å bruke BLL-koding.\nSe innstillingene for BLL-appen for mer informasjon.`,
                    es: `Esta aplicación (${appName}) ahora admite codificación BLL en tarjetas Flow.\nInstala la aplicación Better Logic Library desde Athom Store para usar la codificación BLL.\nConsulta los ajustes de la aplicación BLL para obtener más información.`,
                    da: `Denne app (${appName}) understøtter nu BLL-kodning i Flow-kort.\nInstaller Better Logic Library-appen fra Athom Store for at bruge BLL-kodning.\nSe indstillingerne for BLL-appen for at få flere oplysninger.`,
                    ru: `Это приложение (${appName}) теперь поддерживает кодирование BLL в карточках Flow.\nУстановите приложение Better Logic Library из Athom Store, чтобы использовать кодирование BLL.\nДополнительную информацию см. в настройках приложения BLL.`,
                    pl: `Ta aplikacja (${appName}) obsługuje teraz kodowanie BLL w kartach Flow.\nZainstaluj aplikację Better Logic Library z Athom Store, aby korzystać z kodowania BLL.\nWięcej informacji znajdziesz w ustawieniach aplikacji BLL.`,
                    ko: `이 앱(${appName})은 이제 Flow 카드에서 BLL 코딩을 지원합니다.\nBLL 코딩을 사용하려면 Athom Store에서 Better Logic Library 앱을 설치하세요.\n자세한 내용은 BLL 앱 설정을 참조하세요.`,
                    ar: `يدعم هذا التطبيق (${appName}) الآن برمجة BLL في بطاقات Flow.\nثبّت تطبيق Better Logic Library من متجر Athom لاستخدام برمجة BLL.\nراجع إعدادات تطبيق BLL لمزيد من المعلومات.`,
                });
                await this.homey.notifications.createNotification({ excerpt });
            } catch (error) { }
        }
        if (this._destroyed || generation !== this._uninstallGeneration) return this;
        const api = await this.getAppApi('net.i-dev.betterlogic', 'Better Logic Library', true);
        const installed = await api.getInstalled();
        if (this._destroyed || generation !== this._uninstallGeneration) return this;
        BL._isLoaded = installed;
        if (!installed) {
            if (this.required) {
                if (!await this.homey.settings.get('notification_bll_required')) {
                    await this.homey.notifications.createNotification({ excerpt: `Warning: The Better Logic Library App is required for this app (${this.homey.app.id}) (to support BLL Coding and reduce install size).\nPlease install the Better Logic Library App from the Athom Store.` });
                    this.homey.settings.set('notification_bll_required', true);
                }
            }
            return this;
        }
        this.homey.settings.set('notification_bll_required', true);
        if (!this.api) {
            api.on('realtime', this.realtimeFunction);
            this.api = api;
        }
        await this.initBll();
        if (this._destroyed || generation !== this._uninstallGeneration) return this;
        this.isReady = BL.isReady = true;
        this._defer.resolve(this);
        return this;
    }

    /**
     * Promise resolved when the BLL instance becomes ready.
     * Resolves only once; use `BL.isReady` to check availability after a stop.
     * @type {Promise<BL>}
     */
    get ready() { return this._defer.promise; }

    /**
     * Loads the BLL bundle and initializes its exported library.
     * @private
     * @returns {Promise<BL>} This wrapper after the bundle initialization attempt.
     */
    async initBll() {
        const generation = this._uninstallGeneration;
        let version;
        try {
            version = await this.api.getVersion();
        } catch (error) {
            this.homey.error('BL.getVersion', error);
        }
        BL.homey.log('initBll loading');
        if (this._destroyed || generation !== this._uninstallGeneration) return this;
        if (this.l && version && version === BL._version && process.env.DEBUG !== '1') return this;
        BL.homey.log('initBll loading version change');
        //let bllFile = this.bllFile;
        try {
            //if (!this.bllFile) 
            BL.homey.log('initBll loading library');
            this.bllFile = await this.getLibrary('bll');
            if (this._destroyed || generation !== this._uninstallGeneration) return this;
            BL.homey.log('initBll loading library done');
        } catch (error) {
            this.homey.error(error);
            throw new Error('The Better Logic Library app is not started.');
            //throw error;
        }
        //this.bllFile = bllFile;
        const bll = this.requireFromString(this.bllFile.file, 'bll');
        delete this.bllFile;
        const old_bll = this.l;
        const initializing = Promise.resolve().then(async () => {
            if (this._destroyed || generation !== this._uninstallGeneration) return;
            try {
                const library = await new bll.BLL({ homey: this.homey, modules: this.modules, silent: this.silent });
                if (this._destroyed || generation !== this._uninstallGeneration) {
                    library.destroy();
                    return;
                }
                this._l = library;
                BL._L = bll.BLL;
                if (old_bll) old_bll.destroy();
                BL._version = version;
            } finally {
                if (this._destroyed || generation !== this._uninstallGeneration) {
                    for (const key of BLL_EXPORT_KEYS) delete BL[key];
                }
            }
        });
        BL._libraryInitializing = initializing.catch(error => this.homey.error('BL.initBll', error));
        await initializing;
        BL.homey.log('initBll loading done');
        return this;
    }

    /**
     * Retrieves a library bundle from this app or from the Better Logic Library API.
     * @private
     * @param {string} libraryName Name of the library to retrieve.
     * @returns {Promise<Object>} Library response containing the bundle file.
     */
    async getLibrary(libraryName) {
        if (this.homey.app.id === 'net.i-dev.betterlogic') return this.homey.app.getLibrary(libraryName);

        let timeout;
        const expired = new Promise((resolve, reject) => {
            timeout = this.homey.setTimeout(() => reject(new Error('Timeout: 5000')), 5000);
        });
        try {
            const request = this.getAppApi('net.i-dev.betterlogic', 'Better Logic Library')
                .then(api => api.get('/library/' + libraryName));
            return await Promise.race([request, expired]);
        } finally {
            clearTimeout(timeout);
        }
    }

    /**
     * Compiles JavaScript source text as a Node module and returns its exports.
     * @private
     * @param {string} src JavaScript source code.
     * @param {string} [filename] Filename used for the compiled module.
     * @returns {Object} The compiled module's exports.
     */
    requireFromString(src, filename) {
        let m = new module.constructor();
        m.paths = module.paths;
        m._compile(src, filename || '');
        return m.exports;
    }

    /**
     * Gets this app's API client for another Homey app.
     * @private
     * @param {string} appId Target app ID.
     * @param {string} appname Human-readable target app name for errors.
     * @param {boolean} [onlyApi=false] Returns the API client without checking installation.
     * @returns {Promise<Object>} The target app's API client.
     * @throws {Error} If the API client cannot be obtained or the target app is unavailable.
     */
    async getAppApi(appId, appname, onlyApi) {
        if (!this._appApi) {
            const api = this.homey.api.getApiApp(appId);
            if (!api) throw new Error(appname + ' is not installed.');
            api.on('install', this._installListener);
            api.on('uninstall', this._uninstallListener);
            this._appApi = api;
        }
        if (!onlyApi && !await this._appApi.getInstalled()) throw new Error(appname + ' is not installed.');
        return this._appApi;
    }

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
    static async onVariableUpdate({variable, formattedDate}) {
        //BL.homey.log('realtime variable update', variable);
        
    }
    /**
     * Gets all Better Logic variables through the current BLL instance.
     * @returns {Promise<*>} Variables returned by the Better Logic Library app.
     */
    static async getVariables() {
        return await BL.Current.getVariables();
    }

    /**
     * Gets all Better Logic variables from the Better Logic Library app.
     * @returns {Promise<*>} Variables returned by the Better Logic Library app.
     */
    async getVariables() {
        const api = await this.getAppApi('net.i-dev.betterlogic', 'Better Logic Library');
        return await api.get('/all');
    }




}

/**
 * Wraps a promise with explicit resolve/reject controls and optional forwarding.
 */
class Defer {
    /** @returns {boolean} Whether this deferred promise has been resolved or rejected. */
    get isDefered() { return !!this._isDefered; }

    /** @param {boolean} value Whether the deferred promise has settled. */
    set isDefered(v) { this._isDefered = v; }

    /** @returns {Promise<*>} The wrapped promise. */
    get promise() { return this._promise; }

    /** @param {Promise<*>} value Promise to wrap. */
    set promise(v) { this._promise = v; }

    /**
     * Creates a controllable promise.
     * @param {number} [timeout] Timeout in milliseconds before rejecting.
     * @param {Promise<*>} [originalPromise] Promise whose result should be forwarded.
     * @param {Function} [onTimeout] Callback invoked after a timeout rejection.
     */
    constructor(timeout, originalPromise, onTimeout) {
        this._promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
        if (timeout) {
            this.timeout = BL.homey.setTimeout(function () {
                if (!this.isDefered && this.promise) {
                    this.reject();
                    //if (this.promise.resolve) this.promise.resolve();
                    if (onTimeout) onTimeout();
                }
            }.bind(this), timeout);
        }
        if (originalPromise && originalPromise.then) originalPromise.then((val1, val2, val3, val4) => this.resolve(val1, val2, val3, val4)).catch((val1, val2, val3, val4) => this.reject(val1, val2, val3, val4));
    }
    /**
     * Registers a fulfillment handler and returns this deferred wrapper.
     * @param {Function} fun Fulfillment handler.
     * @returns {Defer} This wrapper for chaining.
     */
    then(fun) { this._promise.then(fun); return this; }

    /**
     * Registers a rejection handler and returns this deferred wrapper.
     * @param {Function} fun Rejection handler.
     * @returns {Defer} This wrapper for chaining.
     */
    catch(fun) { this._promise.catch(fun); return this; }

    /**
     * Registers a handler to run after settlement and returns this wrapper.
     * @param {Function} fun Settlement handler.
     * @returns {Defer} This wrapper for chaining.
     */
    finally(fun) { this._promise.finally(fun); return this; }

    /**
     * Resolves the wrapped promise and clears its timeout.
     * @param {*} val1 Resolution value.
     * @returns {Promise<*>} The wrapped promise.
     */
    resolve(val1, val2, val3, val4) { if (this.timeout) clearTimeout(this.timeout); this.isDefered = true; this._resolve(val1, val2, val3, val4); return this.promise; }

    /**
     * Rejects the wrapped promise and clears its timeout.
     * @param {*} val1 Rejection reason.
     * @returns {Promise<*>} The wrapped promise.
     */
    reject(val1, val2, val3, val4) { if (this.timeout) clearTimeout(this.timeout); this.isDefered = true; this._reject(val1, val2, val3, val4); return this.promise; }
}


module.exports = { BL, Defer };