// ======================================================
// DRACONIA - MINI-JEU DE PÊCHE 🎣
// ======================================================

/*
 * Ce fichier est chargé après script.js.
 * Il améliore le mini-jeu de pêche sans toucher au reste du jeu.
 */

function injectFishingUpgradeStyles() {
    if (document.getElementById("draconia-fishing-upgrade-styles")) return;

    const style = document.createElement("style");
    style.id = "draconia-fishing-upgrade-styles";
    style.textContent = `
        #fishing-game {
            text-align: center;
        }

        #fishing-game .fishing-bar {
            position: relative;
            width: 100%;
            max-width: 520px;
            height: 34px;
            margin: 22px auto 18px;
            overflow: visible;
            border: 2px solid rgba(255,255,255,.16);
            border-radius: 999px;
            background: linear-gradient(180deg,#4b4f5d,#353944);
            box-shadow: inset 0 3px 8px rgba(0,0,0,.28), 0 8px 20px rgba(0,0,0,.12);
        }

        #fishing-game .fishing-green-zone {
            position: absolute;
            top: 3px;
            bottom: 3px;
            border-radius: 999px;
            background: linear-gradient(180deg,#5ee785,#27b65a);
            box-shadow: 0 0 12px rgba(72,220,116,.55), inset 0 1px 0 rgba(255,255,255,.35);
        }

        #fishing-game .fishing-arrow {
            position: absolute;
            top: 50%;
            width: 4px;
            height: 48px;
            transform: translate(-50%,-50%);
            border-radius: 999px;
            background: #fff;
            box-shadow: 0 0 0 2px rgba(20,24,35,.55), 0 0 14px rgba(255,255,255,.85);
            z-index: 5;
            pointer-events: none;
        }

        #fishing-game .fishing-arrow::before {
            content: "▼";
            position: absolute;
            left: 50%;
            top: -20px;
            transform: translateX(-50%);
            font-size: 22px;
            line-height: 1;
            color: #fff;
            text-shadow: 0 2px 4px rgba(0,0,0,.7), 0 0 10px rgba(255,255,255,.75);
        }

        #fishing-game .fishing-arrow::after {
            content: "▲";
            position: absolute;
            left: 50%;
            bottom: -20px;
            transform: translateX(-50%);
            font-size: 22px;
            line-height: 1;
            color: #fff;
            text-shadow: 0 2px 4px rgba(0,0,0,.7), 0 0 10px rgba(255,255,255,.75);
        }

        #fishing-catch-button {
            display: block;
            width: min(100%, 360px);
            min-height: 58px;
            margin: 22px auto 8px;
            padding: 14px 22px;
            border: 0;
            border-radius: 18px;
            background: linear-gradient(180deg,#38bdf8,#0ea5e9);
            color: #fff;
            font-size: 18px;
            font-weight: 900;
            letter-spacing: .2px;
            box-shadow: 0 8px 0 #087eae, 0 14px 24px rgba(14,165,233,.28);
            cursor: pointer;
            touch-action: manipulation;
            transition: transform .08s ease, box-shadow .08s ease, filter .15s ease;
        }

        #fishing-catch-button:active {
            transform: translateY(5px) scale(.99);
            box-shadow: 0 3px 0 #087eae, 0 8px 16px rgba(14,165,233,.22);
        }

        #fishing-catch-button:disabled {
            opacity: .5;
            filter: grayscale(.35);
            cursor: default;
        }

        #fishing-status {
            min-height: 42px;
            line-height: 1.45;
        }

        #fishing-game-message {
            min-height: 28px;
            margin-top: 14px;
            font-weight: 800;
        }
    `;

    document.head.appendChild(style);
}

function startFishingGame() {
    injectFishingUpgradeStyles();
    stopFishingGame();

    fishingActive = true;

    const catchButton = document.getElementById("fishing-catch-button");
    if (catchButton) {
        catchButton.disabled = false;
        catchButton.textContent = "🐟 ATTRAPER !";
    }

    fishingArrowDirection = Math.random() < 0.5 ? 1 : -1;
    fishingArrowPosition = fishingArrowDirection === 1 ? 0 : 100;

    const fishingSpeed = 1.05 + Math.random() * 2.15;

    fishingGreenWidth = 14 + Math.random() * 16;
    fishingGreenStart = 4 + Math.random() * (92 - fishingGreenWidth);

    const greenZone = document.getElementById("fishing-green-zone");
    if (greenZone) {
        greenZone.style.left = `${fishingGreenStart}%`;
        greenZone.style.width = `${fishingGreenWidth}%`;
    }

    updateFishingArrow();

    fishingInterval = setInterval(function() {
        fishingArrowPosition += fishingSpeed * fishingArrowDirection;

        if (fishingArrowPosition >= 100) {
            fishingArrowPosition = 100;
            fishingArrowDirection = -1;
        }

        if (fishingArrowPosition <= 0) {
            fishingArrowPosition = 0;
            fishingArrowDirection = 1;
        }

        updateFishingArrow();
    }, 20);

    const status = document.getElementById("fishing-status");
    if (status) {
        status.textContent = "🎣 Appuie sur ATTRAPER quand la flèche blanche est dans la zone verte !";
    }

    const message = document.getElementById("fishing-game-message");
    if (message) message.textContent = "";
}

injectFishingUpgradeStyles();

// ======================================================
// CHARGEMENT DES EXTENSIONS DE MINI-JEUX
// ======================================================

(function loadDraconiaMiniGames() {
    function loadScriptOnce(src, key, onload) {
        const selector = `script[data-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}="true"]`;
        const existing = document.querySelector(selector);

        if (existing) {
            if (onload) {
                if (existing.dataset.loaded === "true") {
                    onload();
                } else {
                    existing.addEventListener("load", onload, { once: true });
                }
            }
            return;
        }

        const script = document.createElement("script");
        script.src = src;
        script.dataset[key] = "true";

        script.addEventListener("load", function() {
            script.dataset.loaded = "true";
            if (onload) onload();
        }, { once: true });

        document.body.appendChild(script);
    }

    loadScriptOnce("hunting.js?v=2", "draconiaHunting");
    loadScriptOnce("cooking.js?v=1", "draconiaCooking");
    loadScriptOnce("missions.js?v=2", "draconiaMissions");
    loadScriptOnce("achievements.js?v=1", "draconiaAchievements");
    loadScriptOnce("playerprogression.js?v=1", "draconiaPlayerProgression");
    loadScriptOnce(
        "eggs.js?v=1",
        "draconiaEggs",
        function() {
            loadScriptOnce("exploration.js?v=2", "draconiaExploration");
        }
    );

    loadScriptOnce(
        "dragoncare.js?v=1",
        "draconiaDragonCare",
        function() {
            loadScriptOnce("dragonrest.js?v=1", "draconiaDragonRest");
        }
    );
})();
