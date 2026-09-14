// ======================================================
// DRACONIA - STOCKAGE VERSIONNÉ
// Toutes les lectures et écritures persistantes passent par ce service.
// ======================================================

(function initDraconiaStorage(global) {
    const config = global.DraconiaConfig;
    if (!config) {
        throw new Error("DraconiaConfig doit être chargé avant storage.js.");
    }

    const backend = global.localStorage;
    const migrations = {
        // Version 0 = sauvegardes historiques, déjà réparties dans plusieurs clés.
        // Aucune donnée n'est déplacée : on les marque simplement comme compatibles.
        0: function preserveLegacySave() {}
    };

    function getItem(key) {
        try {
            return backend.getItem(key);
        } catch (error) {
            console.warn("Lecture de sauvegarde impossible :", key);
            return null;
        }
    }

    function setItem(key, value) {
        try {
            backend.setItem(key, value);
            return true;
        } catch (error) {
            console.warn("Sauvegarde impossible :", key);
            return false;
        }
    }

    function removeItem(key) {
        try {
            backend.removeItem(key);
            return true;
        } catch (error) {
            console.warn("Suppression de sauvegarde impossible :", key);
            return false;
        }
    }

    function readJSON(key, fallback) {
        const raw = getItem(key);
        if (raw === null) return fallback;

        try {
            return JSON.parse(raw);
        } catch (error) {
            console.warn("Sauvegarde invalide ignorée :", key);
            return fallback;
        }
    }

    function writeJSON(key, value) {
        return setItem(key, JSON.stringify(value));
    }

    function initialize() {
        const versionKey = config.storage.version;
        const rawVersion = getItem(versionKey);
        let version = rawVersion === null ? 0 : Number.parseInt(rawVersion, 10);

        if (!Number.isInteger(version) || version < 0) version = 0;

        if (version > config.saveVersion) {
            console.warn("Cette sauvegarde provient d'une version plus récente de Draconia.");
            return version;
        }

        while (version < config.saveVersion) {
            const migrate = migrations[version];
            if (typeof migrate !== "function") {
                throw new Error(`Migration de sauvegarde manquante : ${version}.`);
            }

            migrate();
            version += 1;
            setItem(versionKey, String(version));
        }

        return version;
    }

    const api = Object.freeze({
        getItem,
        setItem,
        removeItem,
        readJSON,
        writeJSON,
        initialize
    });

    global.DraconiaStorage = api;
    initialize();

    if (typeof module !== "undefined" && module.exports) {
        module.exports = api;
    }
})(typeof window !== "undefined" ? window : globalThis);
