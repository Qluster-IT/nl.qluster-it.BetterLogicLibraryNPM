const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const { test } = require('node:test');
const { BL, Defer } = require('../src/bl');

test('timed deferred promises release their original Homey timer on resolution, rejection, and timeout', async () => {
    for (const action of ['resolve', 'reject', 'timeout']) {
        const timers = new Map();
        let cancelled = 0;
        const owner = {
            setTimeout(callback) {
                const handle = {};
                timers.set(handle, callback);
                return handle;
            },
            clearTimeout(handle) { cancelled++; timers.delete(handle); }
        };
        BL.homey = owner;
        let expired = 0;
        const deferred = new Defer(1000, undefined, () => { expired++; });
        const callback = timers.get(deferred.timeout);
        BL.homey = { clearTimeout() { assert.fail('Timer cancellation must use its original owner'); } };
        if (action === 'resolve') {
            deferred.resolve('done');
            assert.equal(await deferred.promise, 'done');
        } else {
            const rejected = assert.rejects(deferred.promise);
            if (action === 'reject') deferred.reject(new Error('failed'));
            else callback();
            await rejected;
        }
        assert.equal(cancelled, 1);
        assert.equal(timers.size, 0);
        assert.equal(deferred.timeout, undefined);
        assert.equal(expired, action === 'timeout' ? 1 : 0);
    }
});

test('bundle requests release Homey deadline bookkeeping on success and failure', async t => {
    t.after(() => BL.destroy());
    for (const fails of [false, true]) {
        const { homey, api } = createLifecycleHomey();
        const timers = new Set();
        homey.setTimeout = (...args) => {
            const handle = setTimeout(...args);
            timers.add(handle);
            return handle;
        };
        homey.clearTimeout = handle => { timers.delete(handle); clearTimeout(handle); };
        if (fails) api.get = async () => { throw new Error('bundle unavailable'); };
        const bl = await BL.init({ homey });
        assert.equal(bl.isReady, !fails);
        assert.equal(timers.size, 0);
    }
});

test('module cleanup retains API access until its realtime listeners have been removed', async t => {
    t.after(() => BL.destroy());
    for (const action of ['uninstall', 'destroy']) {
        const { homey, api, errors } = createLifecycleHomey();
        const bl = await BL.init({ homey });
        const listener = () => {};
        api.on('realtime', listener);
        let destroyed = false;
        bl.l.destroy = () => {
            BL.Current.api.off('realtime', listener);
            destroyed = true;
        };
        if (action === 'uninstall') api.emit('uninstall');
        else BL.destroy();
        assert.equal(destroyed, true);
        assert.equal(api.listenerCount('realtime'), 0);
        assert.deepEqual(errors, []);
        assert.equal(bl.api, null);
    }
});

    function createLifecycleHomey() {
        const homey = new EventEmitter();
        const api = new EventEmitter();
        const errors = [];
        homey.app = { id: 'example.app', onUninit() {} };
        homey.settings = { get: () => true, set() {} };
        homey.api = { getApiApp: () => api };
        homey.log = () => {};
        homey.error = (...args) => errors.push(args);
        homey.setTimeout = setTimeout;
        homey.clearTimeout = clearTimeout;
        api.getInstalled = async () => true;
        api.getVersion = async () => '1';
        api.get = async () => ({
            file: `class BLL {
                static get Current() { return this.current; }
                constructor() { BLL.current = this; }
                destroy() { BLL.current = null; }
            }
            module.exports = { BLL };`,
        });
        return { homey, api, errors };
    }

    test('BLL retries on install, clears readiness on uninstall and removes lifecycle listeners', async (t) => {
        const { homey, api } = createLifecycleHomey();
        let installed = false;
        api.getInstalled = async () => installed;
        t.after(() => BL.destroy());
        const bl = await BL.init({ homey });
        const ready = bl.ready;
        assert.equal(BL.isReady, false);
        assert.equal(api.listenerCount('realtime'), 0);

        installed = true;
        api.emit('install');
        api.emit('install');
        await ready;
        await new Promise(resolve => setImmediate(resolve));
        assert.equal(bl.isReady, true);
        assert.equal(api.listenerCount('realtime'), 1);

        api.emit('uninstall');
        assert.equal(BL.isReady, false);
        assert.equal(bl.isReady, false);
        assert.equal(api.listenerCount('realtime'), 0);
        assert.equal(bl.ready, ready);
        api.emit('install');
        await new Promise(resolve => setImmediate(resolve));
        assert.equal(BL.isReady, true);
        assert.equal(api.listenerCount('realtime'), 1);
        homey.emit('unload');
        for (const event of ['install', 'uninstall', 'realtime']) assert.equal(api.listenerCount(event), 0);
        assert.equal(BL.isReady, false);
        await bl.init();
        assert.equal(api.listenerCount('install'), 0);
    });

    test('install during a failed installation check retries after that check', async (t) => {
        const { homey, api } = createLifecycleHomey();
        let finish;
        let started;
        const checking = new Promise(resolve => { started = resolve; });
        let checks = 0;
        api.getInstalled = () => {
            if (++checks > 1) return Promise.resolve(true);
            started();
            return new Promise(resolve => { finish = resolve; });
        };
        t.after(() => BL.destroy());
        const initializing = BL.init({ homey });
        await checking;
        api.emit('install');
        finish(false);
        const bl = await initializing;
        await bl.ready;
        assert.equal(bl.isReady, true);
        assert.equal(api.listenerCount('realtime'), 1);
    });

    test('uninstall and replacement invalidate pending installation checks', async (t) => {
        t.after(() => BL.destroy());
        for (const action of ['uninstall', 'replace']) {
            const { homey, api } = createLifecycleHomey();
            let finish;
            let started;
            const checking = new Promise(resolve => { started = resolve; });
            api.getInstalled = () => {
                started();
                return new Promise(resolve => { finish = resolve; });
            };
            const initializing = BL.init({ homey });
            await checking;
            if (action === 'uninstall') api.emit('uninstall');
            else {
                const next = createLifecycleHomey();
                next.api.getInstalled = async () => false;
                await BL.init({ homey: next.homey });
            }
            finish(true);
            const bl = await initializing;
            assert.equal(bl.isReady, false);
            assert.equal(BL.isReady, false);
            assert.equal(api.listenerCount('realtime'), 0);
        }
    });

    test('BLL bundle failure does not resolve readiness and can be retried', async (t) => {
        const { homey, api, errors } = createLifecycleHomey();
        const get = api.get;
        api.get = async () => { throw new Error('App Not Ready'); };
        t.after(() => BL.destroy());
        const bl = await BL.init({ homey });
        let ready = false;
        bl.ready.then(() => { ready = true; });
        assert.equal(bl.isReady, false);
        assert.equal(ready, false);
        assert.ok(errors.length > 0);
        api.get = get;
        await bl.init();
        await bl.ready;
        assert.equal(BL.isReady, true);
        assert.equal(api.listenerCount('realtime'), 1);
    });

test('installation check errors leave BLL unready and allow a later retry', async (t) => {
    const { homey, api, errors } = createLifecycleHomey();
    const failure = new Error('installation check failed');
    api.getInstalled = async () => { throw failure; };
    t.after(() => BL.destroy());
    const bl = await BL.init({ homey });
    assert.equal(bl.isReady, false);
    assert.equal(BL.isReady, false);
    assert.equal(api.listenerCount('realtime'), 0);
    assert.equal(errors[0][1], failure);
    api.getInstalled = async () => true;
    await bl.init();
    assert.equal(bl.isReady, true);
});

test('express returns the expression when BLL is not installed in silent mode and throws for required apps', async (t) => {
    t.after(() => BL.destroy());
    for (const modules of [undefined, ['_']]) {
        const { homey, api } = createLifecycleHomey();
        api.getInstalled = async () => false;
        const bl = await BL.init({ homey, modules });
        assert.equal(bl.silent, !modules);
        if (bl.silent) assert.equal(await BL.express('1 + 1'), '1 + 1');
        else await assert.rejects(BL.express('1 + 1'), /not loaded/);
        BL.destroy();
    }
});

test('replacement waits for an in-progress module constructor and rejects its stale exports', async (t) => {
    const first = createLifecycleHomey();
    const second = createLifecycleHomey();
    let finish;
    let started;
    const constructing = new Promise(resolve => { started = resolve; });
    const gate = new Promise(resolve => { finish = resolve; });
    t.after(() => BL.destroy());
    const firstInit = BL.init({ homey: first.homey });
    const firstBl = BL.Current;
    firstBl.requireFromString = () => ({
        BLL: class {
            constructor() {
                started();
                return gate.then(() => {
                    BL.__ = 'stale lodash';
                    return this;
                });
            }
            destroy() {}
        },
    });
    await constructing;
    const secondInit = BL.init({ homey: second.homey });
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(BL.isReady, false);
    finish();
    await firstInit;
    const secondBl = await secondInit;
    assert.equal(firstBl.isReady, false);
    assert.equal(secondBl.isReady, true);
    assert.equal(BL.__, undefined);
    assert.equal(first.api.listenerCount('realtime'), 0);
});

test('late bundle responses cannot overwrite the replacement library', async (t) => {
    const first = createLifecycleHomey();
    const second = createLifecycleHomey();
    const get = first.api.get;
    let finish;
    let started;
    const downloading = new Promise(resolve => { started = resolve; });
    first.api.get = () => {
        started();
        return new Promise(resolve => { finish = resolve; });
    };
    t.after(() => BL.destroy());
    const firstInit = BL.init({ homey: first.homey });
    await downloading;
    const secondBl = await BL.init({ homey: second.homey });
    const library = secondBl.l;
    finish(await get());
    const firstBl = await firstInit;
    assert.equal(firstBl.isReady, false);
    assert.equal(secondBl.isReady, true);
    assert.equal(secondBl.l, library);
    assert.equal(BL.isReady, true);
});

test('unload and reinitialization clean up BLL without replacing app lifecycle methods', async (t) => {
    const first = createLifecycleHomey();
    const second = createLifecycleHomey();
    const firstHomey = first.homey;
    const firstApi = first.api;
    const onUninit = firstHomey.app.onUninit;
    t.after(() => BL.destroy());
    await BL.init({ homey: firstHomey });

    assert.equal(firstHomey.app.onUninit, onUninit);
    assert.equal(firstHomey.listenerCount('unload'), 1);
    assert.equal(firstApi.listenerCount('realtime'), 1);

    const secondHomey = second.homey;
    const secondApi = second.api;
    secondHomey.app = { onUninit };
    secondHomey.app.id = 'example.app';
    await BL.init({ homey: secondHomey });

    assert.equal(firstHomey.listenerCount('unload'), 0);
    assert.equal(firstApi.listenerCount('realtime'), 0);
    assert.equal(secondHomey.app.onUninit, onUninit);
    assert.equal(secondHomey.listenerCount('unload'), 1);
    assert.equal(secondApi.listenerCount('realtime'), 1);

    firstHomey.emit('unload');
    assert.equal(secondHomey.listenerCount('unload'), 1);

    secondHomey.emit('unload');
    assert.equal(secondHomey.listenerCount('unload'), 0);
    assert.equal(secondApi.listenerCount('realtime'), 0);
    assert.equal(BL.Current, null);
});

test('support notification uses the localized app name and is sent only once', async (t) => {
    const homey = new EventEmitter();
    const api = new EventEmitter();
    const settings = new Map();
    const notifications = [];
    homey.app = { id: 'example.app' };
    homey.manifest = { name: { en: 'Example App', nl: 'Voorbeeld App' } };
    homey.__ = (translations) => translations.nl || translations.en;
    homey.settings = {
        get: (key) => settings.get(key),
        set: (key, value) => settings.set(key, value),
    };
    homey.notifications = { createNotification: async (notification) => notifications.push(notification) };
    api.getInstalled = async () => false;
    homey.api = { getApiApp: () => api };
    homey.log = () => {};
    homey.error = (message, error) => assert.fail(`${message}: ${error}`);
    t.after(() => BL.destroy());

    await BL.init({ homey });
    await BL.init({ homey });

    assert.equal(notifications.length, 1);
    assert.equal(notifications[0].excerpt, 'Deze app (Voorbeeld App) ondersteunt nu BLL-codering in flowkaarten.\nInstalleer de Better Logic Library-app vanuit de Athom Store om BLL-codering te gebruiken.\nBekijk de instellingen van de BLL-app voor meer informatie.');
});

test('support notification is translated for all Homey languages with an English fallback', async (t) => {
    const homey = new EventEmitter();
    const api = new EventEmitter();
    const settings = new Map();
    const notifications = [];
    let language;
    homey.app = { id: 'example.app' };
    homey.manifest = { name: { en: 'Example App' } };
    homey.__ = (translations) => translations[language] || translations.en;
    homey.settings = {
        get: (key) => settings.get(key),
        set: (key, value) => settings.set(key, value),
    };
    homey.notifications = { createNotification: async (notification) => notifications.push(notification) };
    api.getInstalled = async () => false;
    homey.api = { getApiApp: () => api };
    homey.log = () => {};
    homey.error = (message, error) => assert.fail(`${message}: ${error}`);
    t.after(() => BL.destroy());

    const excerpts = {};
    for (language of ['en', 'nl', 'de', 'fr', 'it', 'sv', 'no', 'es', 'da', 'ru', 'pl', 'ko', 'ar', 'unknown']) {
        settings.delete('notification_bll_supported');
        await BL.init({ homey });
        excerpts[language] = notifications.at(-1).excerpt;
        assert.ok(excerpts[language].includes('Example App'), language);
        assert.equal(excerpts[language].split('\n').length, 3, language);
    }

    for (const locale of ['nl', 'de', 'fr', 'it', 'sv', 'no', 'es', 'da', 'ru', 'pl', 'ko', 'ar']) {
        assert.notEqual(excerpts[locale], excerpts.en, locale);
    }
    assert.equal(excerpts.unknown, excerpts.en);
});
