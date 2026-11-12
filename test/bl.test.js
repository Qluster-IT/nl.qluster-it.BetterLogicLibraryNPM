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
    t.after(() => BL.detroy());

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
    t.after(() => BL.detroy());

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
