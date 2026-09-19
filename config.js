// ======================================================
// DRACONIA - CONFIGURATION CENTRALE
// Modifier les valeurs ici permet d'équilibrer le jeu sans chercher
// des nombres ou des clés de sauvegarde dans tous les fichiers.
// ======================================================

(function initDraconiaConfig(global) {
    const config = {
        saveVersion: 1,

        // À compléter avec les deux valeurs PUBLIQUES du projet Supabase.
        cloud: {
            supabaseUrl: "https://qaucukmxomlgumoryxxh.supabase.co",
            supabaseAnonKey: "sb_publishable_WyAN-yBGBVfwylB6sGGJFwu_u7f-8-tr"
        },

        storage: {
            version: "draconiaSaveVersion",
            player: "draconiaPlayer",
            inventory: "draconiaInventory",
            preparedMeals: "draconiaPreparedMeals",
            weather: "draconiaDailyWeatherV2",
            discoveredDragons: "draconiaDiscoveredDragons",
            ownedDragons: "draconiaOwnedDragons",
            achievements: "draconiaAchievementsV1",
            adventureLog: "draconiaAdventureLogV1",
            dailyRewards: "draconiaDailyRewardsV1",
            activeEgg: "draconiaActiveEggV1",
            explorationZone: "draconiaExplorationZone",
            explorationCompanion: "draconiaExplorationCompanionV1",
            dailyMissions: "draconiaDailyMissionsV1"
        },

        timings: {
            plainsGrowth: 60000,
            weatherRefresh: 60000
        }
    };

    Object.freeze(config.cloud);
    Object.freeze(config.storage);
    Object.freeze(config.timings);
    global.DraconiaConfig = Object.freeze(config);
})(typeof window !== "undefined" ? window : globalThis);
