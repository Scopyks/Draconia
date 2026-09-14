const test = require("node:test");
const assert = require("node:assert/strict");

function createBackend(initial = {}) {
    const data = new Map(Object.entries(initial));
    return {
        getItem: key => data.has(key) ? data.get(key) : null,
        setItem: (key, value) => data.set(key, String(value)),
        removeItem: key => data.delete(key),
        snapshot: () => Object.fromEntries(data)
    };
}

function loadStorage(initial = {}) {
    const modulePath = require.resolve("../storage.js");
    delete require.cache[modulePath];

    global.DraconiaConfig = {
        saveVersion: 1,
        storage: { version: "draconiaSaveVersion" }
    };
    global.localStorage = createBackend(initial);

    return {
        storage: require("../storage.js"),
        backend: global.localStorage
    };
}

test("conserve les anciennes sauvegardes et ajoute leur version", () => {
    const legacy = JSON.stringify({ coins: 250, level: 4 });
    const { backend } = loadStorage({ draconiaPlayer: legacy });
    const snapshot = backend.snapshot();

    assert.equal(snapshot.draconiaPlayer, legacy);
    assert.equal(snapshot.draconiaSaveVersion, "1");
});

test("écrit et relit les objets JSON", () => {
    const { storage } = loadStorage();
    const value = { fish: 3, berry: 2 };

    assert.equal(storage.writeJSON("inventory", value), true);
    assert.deepEqual(storage.readJSON("inventory", {}), value);
});

test("utilise la valeur de secours pour un JSON invalide", () => {
    const { storage } = loadStorage({ broken: "{" });
    assert.deepEqual(storage.readJSON("broken", { safe: true }), { safe: true });
});

test("supprime une clé sans toucher aux autres", () => {
    const { storage, backend } = loadStorage({ one: "1", two: "2" });

    assert.equal(storage.removeItem("one"), true);
    assert.deepEqual(backend.snapshot(), {
        two: "2",
        draconiaSaveVersion: "1"
    });
});
