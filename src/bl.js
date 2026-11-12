//let this._l;
//let BL.__, BL._datetime, BL._proto;
//let BL._isLoaded = false;


//let BL._ready, BL._defer, BL._initDefer;

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

        try {
            return await bl.init({ reload: true });
        } catch (error) {

        }
        return bl;
        //return bl.ready;

        //return new BL().init({ homey, modules, silent, waitTime, required });
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
                    BL.Current.init({ reload });

                    //}
                } catch (error) {

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
     * Cleans up the current BLL instance and its Homey/realtime listeners.
     * The misspelling is retained for compatibility with existing callers.
     * @returns {void}
     */
    static detroy() {
        //BL.homey.settings.set('___TEST___', 'detroy');
        try {
            //BL.homey.settings.set('___TEST___', 'BL.Current' + !!(BL.Current));
            if (!BL.Current) return;
            BL.Current.homey.removeListener('unload', BL.detroy);
            if (BL.Current.api) {
                BL.Current.api.off('realtime', BL.Current.realtimeFunction);
                //BL.Current.api.unregister();
            }
            if (BL.Current.l) {
                //BL.homey.settings.set('___TEST___', 'CLEANING');
                //let clearObj = BL.Current.L.clearObj;
                BL.Current.l.detroy();
                BL.clearObj(BL.Current);
                BL.clearObj(BL);
            }
        } catch (error) { console.log(error); }
        BL._current = null;
        //throw new Error('DONE FINISHED');
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

        BL._defer = new Defer();
        BL._ready = BL._defer.promise;
        BL.ready = BL._ready;
        BL._ready.then(() => {
            BL.isReady = this.isReady = true;
            BL.clearObj(BL._ready);
        });
    }
    /**
     * Loads or refreshes the BLL API and, when available, the requested modules.
     * @param {Object} [options={}] Initialization controls.
     * @param {boolean} [options.reload=false] Forces a fresh initialization.
     * @returns {Promise<BL>} This BLL wrapper after initialization completes.
     */
    async init({ reload } = {}) {
        BL.homey.log('bl.init');
        if (reload === true) {
            BL._isLoaded = false;
            if (BL._initDefer) BL._initDefer.resolve(this);
            BL._initDefer = new Defer();
        } else {
            if (BL._initDefer) return await BL._initDefer.promise;
            else BL._initDefer = new Defer();
            if (BL._isLoaded) return this;
        }        
        BL.homey.log('bl.init after initDefer');

        if (this.homey.app.id !== 'net.i-dev.betterlogic' && !await this.homey.settings.get('notification_bll_supported')) {
            try {
                this.homey.settings.set('notification_bll_supported', true);
                await this.homey.notifications.createNotification({ excerpt: `This app (${this.homey.app.id}) now supports BLL coding within flowcards.\nInstall the Better Logic Library App from the Athom Store to use BLL coding.\nSee the BLL App Settings for more information.` });
            } catch (error) { }
        }
        if (!this.api) {
            try {
                BL.homey.log('bl.init loading api');
                this.api = await this.getAppApi('net.i-dev.betterlogic', 'Better Logic Library', true);//true);
                BL.homey.log('bl.init loading api done');

                this.api.on('realtime', this.realtimeFunction);
            } catch (error) {
                this.homey.error('BL.init', error);
                //initDefer.reject();
                BL._initDefer.resolve(this);
                BL._initDefer = null;
                return this;
            }
        }
        try {
            BL.homey.log('bl.init api getInstalled');
            BL._isLoaded = await this.api.getInstalled();
            BL.homey.log('bl.init api getInstalled done');
            if (!BL._isLoaded) {
                if (this.required) {
                    if (!await this.homey.settings.get('notification_bll_required')) {
                        this.homey.notifications.createNotification({ excerpt: `Warning: The Better Logic Library App is required for this app (${this.homey.app.id}) (to support BLL Coding and reduce install size).\nPlease install the Better Logic Library App from the Athom Store.` });
                        this.homey.settings.set('notification_bll_required', true);
                    }
                }
                BL._initDefer.resolve(this);
                BL._initDefer = null;
                return this;
            } else this.homey.settings.set('notification_bll_required', true);

        } catch (error) {
            BL._initDefer.resolve(this);
            BL._initDefer = null;
            return this;
        }
        try {
            //if(BL.Current.isReady) return this;
            BL.homey.log('bl.init loading initBLL');

            let bll = this.initBll()
            .then(x => {                 
                BL.homey.log('bl.init loading initBLL then');
                BL._defer.resolve(this);
             });
            //  .catch(x => {
            //     BL.homey.log('bl.init loading initBLL catch');
            //     //defer.resolve(this);

            //     // if (this.silent === false) {
            //     //     this.homey.notifications.createNotification({ excerpt: `Warning: Better Logic Library could not be loaded and is required (for full functionality). Install the Better Logic Library App to continue to use this app (${this.homey.app.id}).` });
            //     //     defer.reject(new Error('The Better Logic Library could not be loaded.'));
            //     // } 
            //     // else if (!this.required) defer.resolve(this); else defer.reject(x); 
            // });
            
            BL.homey.log('bl.init loading initBLL await');
            let result = await bll;
            BL.homey.log('bl.init loading initBLL await done');
            BL._initDefer.resolve(this);

            return this;
        } catch (error) {            
            if (BL._initDefer) BL._initDefer.resolve(this);
            BL._initDefer = null;
            BL.homey.log('bl.init loading initBLL error');
            BL.homey.error('bl.init loading initBLL error');
            BL.homey.error(error);
            return this;
        }
    }

    /**
     * Promise resolved when the BLL instance becomes ready.
     * @type {Promise<BL>}
     */
    get ready() { return BL._ready; }

    /**
     * Loads the BLL bundle and initializes its exported library.
     * @private
     * @returns {Promise<BL>} This wrapper after the bundle initialization attempt.
     */
    async initBll() {
        let version;
        try {
            version = await this.api.getVersion();
        } catch (error) {

        }
        BL.homey.log('initBll loading');
        if (version && version === BL._version && process.env.DEBUG !== '1') return this;
        BL.homey.log('initBll loading version change');
        //let bllFile = this.bllFile;
        try {
            //if (!this.bllFile) 
            BL.homey.log('initBll loading library');
            this.bllFile = await this.getLibrary('bll');
            BL.homey.log('initBll loading library done');
        } catch (error) {
            BL.homey.error(error);
            throw new Error('The Better Logic Library app is not started.');
            //throw error;
        }
        //this.bllFile = bllFile;
        try {
            BL.homey.log('initBll loading requireFromString');
            const bll = this.requireFromString(this.bllFile.file, 'bll');
            delete this.bllFile; //Remove the String for performance
            let old_bll = this.l;
            //if(old_bll) return this;

            if (true || !old_bll) {
                BL.homey.log('initBll loading new bll.BLL');
                this._l = await new bll.BLL({ homey: this.homey, modules: this.modules, silent: this.silent });
                BL._L = bll.BLL;
                if (old_bll) old_bll.destroy();
            } else {
                await new bll.BLL({ homey: this.homey, modules: this.modules, silent: this.silent });
            }
            BL._version = version;// || await this.api.getVersion();
        } catch (error) {
            BL.homey.error('BL.initBll', error);
        }
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
        if(BL.homey.app.id === 'net.i-dev.betterlogic') return BL.homey.app.getLibrary(libraryName);

        let defer = new Defer();
        defer.promise.then(() => { }).catch(() => { });
        BL.homey.setTimeout(() => (!defer || defer.isDefered ? null : defer.reject('Timeout: 5000')) & (defer = null), 5000);
        try {
            this.getAppApi('net.i-dev.betterlogic', 'Better Logic Library').then((api) => {
                try {
                    api.get('/library/' + libraryName).then((x) => !defer || defer.isDefered ? null : defer.resolve(x) & (defer = null)).catch(err => !defer || defer.isDefered ? null : defer.reject(err) & (defer = null));
                } catch (err) { // Try once more.                                        
                    defer.reject(new Error(err));
                    // try {
                    //     defer.resolve(api.get('/library/' + libraryName));
                    // } catch (error) {
                    //     defer.reject(new Error(error));
                    //     //throw new Error(error);
                    // }
                }
            }).catch(err => !defer || defer.isDefered ? null : defer.reject(err) & (defer = null));

        } catch (err) {
            console.log(err);
            if (defer) defer.reject(new Error(err));
            defer = null;
            //throw new Error(err);
        }
        return defer.promise;
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
        try {
            if (!this.api) this.api = this.homey.api.getApiApp(appId);
        } catch (error) {
            throw new Error(error);
        }
        if (onlyApi === true) return this.api;
        if (!this.api) throw new Error(appname + ' is not installed.');
        else {
            try {
                BL._isLoaded = await this.api.getInstalled();
            } catch (error) { }
            if (!BL._isLoaded) throw new Error(appname + ' is not installed.');
        }
        return this.api;
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