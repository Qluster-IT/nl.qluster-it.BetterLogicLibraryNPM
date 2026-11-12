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
