const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const { test } = require('node:test');
const { BL } = require('../src/bl');

test('unload and reinitialization clean up BLL without replacing app lifecycle methods', async (t) => {
    const firstHomey = new EventEmitter();
    const firstApi = new EventEmitter();
    const onUninit = () => {};
    firstHomey.app = { onUninit };
    firstHomey.api = firstApi;
    const originalInit = BL.prototype.init;
    BL.prototype.init = async function () {
        this.api = this.homey.api;
        this.api.on('realtime', this.realtimeFunction);
        return this;
    };
    t.after(() => {
        BL.prototype.init = originalInit;
        BL.detroy();
    });

    await BL.init({ homey: firstHomey });

    assert.equal(firstHomey.app.onUninit, onUninit);
    assert.equal(firstHomey.listenerCount('unload'), 1);
    assert.equal(firstApi.listenerCount('realtime'), 1);

    const secondHomey = new EventEmitter();
    const secondApi = new EventEmitter();
    secondHomey.app = { onUninit };
    secondHomey.api = secondApi;
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
    homey.__ = (name) => {
        assert.equal(name, homey.manifest.name);
        return name.nl;
    };
    homey.settings = {
        get: (key) => settings.get(key),
        set: (key, value) => settings.set(key, value),
    };
    homey.notifications = { createNotification: async (notification) => notifications.push(notification) };
    api.getInstalled = async () => false;
    homey.api = { getApiApp: () => api };
    homey.log = () => {};
    homey.error = (message, error) => assert.fail(`${message}: ${error}`);
    t.after(() => BL.detroy());

    await BL.init({ homey });
    await BL.init({ homey });

    assert.equal(notifications.length, 1);
    assert.equal(notifications[0].excerpt, 'This app (Voorbeeld App) now supports BLL coding within flowcards.\nInstall the Better Logic Library App from the Athom Store to use BLL coding.\nSee the BLL App Settings for more information.');
});
