// ======================================================
// DRACONIA - OEUFS ET ECLOSION 🥚✨
// ======================================================

(function initDragonEggs() {
    const STORAGE_KEY = "draconiaActiveEggV1";

    const hatchTimes = {
        "Commun": 30000,
        "Peu commun": 45000,
        "Rare": 60000,
        "Épique": 90000,
        "Légendaire": 120000
    };

    let timer = null;

    function loadEgg() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY));
        } catch (error) {
            return null;
        }
    }

    function saveEgg(egg) {
        if (!egg) localStorage.removeItem(STORAGE_KEY);
        else localStorage.setItem(STORAGE_KEY, JSON.stringify(egg));
    }

    function formatTime(ms) {
        const total = Math.max(0, Math.ceil(ms / 1000));
        const min = Math.floor(total / 60);
        const sec = String(total % 60).padStart(2, "0");
        return `${min}:${sec}`;
    }

    function getDragon(dragonId) {
        if (typeof dragons === "undefined") return null;
        return dragons.find(dragon => dragon.id === dragonId) || null;
    }

    function injectStyles() {
        if (document.getElementById("draconia-eggs-style")) return;

        const style = document.createElement("style");
        style.id = "draconia-eggs-style";
        style.textContent = `
            .dragon-egg-panel{margin:14px 0;padding:14px;border-radius:18px;background:linear-gradient(145deg,rgba(250,204,21,.11),rgba(168,85,247,.09));border:1px solid rgba(168,85,247,.18);text-align:center}.dragon-egg-panel.empty{opacity:.76}.dragon-egg-big{font-size:54px;line-height:1;margin-bottom:8px}.dragon-egg-panel h3{margin:4px 0 6px}.dragon-egg-panel p{margin:4px 0;font-size:12px;line-height:1.45}.dragon-egg-progress{height:10px;margin:10px 0;border-radius:999px;background:rgba(0,0,0,.09);overflow:hidden}.dragon-egg-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,#a855f7,#f59e0b);transition:width .8s linear}.dragon-egg-hatch{margin-top:10px;border:0;border-radius:12px;padding:10px 14px;background:#7c3aed;color:white;font-weight:900;cursor:pointer}.dragon-egg-hatch:disabled{opacity:.45}.dragon-egg-ready{font-weight:900;color:#7c3aed}
        `;
        document.head.appendChild(style);
    }

    function ensurePanel() {
        const card = document.querySelector(".egg-card");
        if (!card) return null;

        let panel = document.getElementById("dragon-egg-panel");
        if (!panel) {
            panel = document.createElement("div");
            panel.id = "dragon-egg-panel";
            panel.className = "dragon-egg-panel";

            const button = document.getElementById("egg-button");
            if (button) button.insertAdjacentElement("afterend", panel);
            else card.appendChild(panel);
        }

        return panel;
    }

    function render() {
        injectStyles();
        const panel = ensurePanel();
        if (!panel) return;

        const egg = loadEgg();
        const exploreButton = document.getElementById("egg-button");

        if (!egg) {
            panel.className = "dragon-egg-panel empty";
            panel.innerHTML = `
                <div class="dragon-egg-big">🥚</div>
                <h3>Aucun œuf en incubation</h3>
                <p>Explore une zone pour tenter de trouver un œuf de dragon.</p>
            `;
            if (exploreButton) exploreButton.disabled = false;
            return;
        }

        const dragon = getDragon(egg.dragonId);
        if (!dragon) {
            saveEgg(null);
            render();
            return;
        }

        const now = Date.now();
        const remaining = Math.max(0, egg.hatchAt - now);
        const duration = Math.max(1, egg.hatchAt - egg.startedAt);
        const progress = Math.min(100, Math.round(((duration - remaining) / duration) * 100));
        const ready = remaining <= 0;

        panel.className = "dragon-egg-panel";
        panel.innerHTML = `
            <div class="dragon-egg-big">${ready ? "✨🥚✨" : "🥚"}</div>
            <h3>Œuf ${dragon.element}</h3>
            <p>${dragon.rarity} • Trouvé dans ${egg.zoneName || "Draconia"}</p>
            <div class="dragon-egg-progress"><div class="dragon-egg-fill" style="width:${progress}%"></div></div>
            <p class="${ready ? "dragon-egg-ready" : ""}">${ready ? "✨ L'œuf est prêt à éclore !" : `⏳ Éclosion dans ${formatTime(remaining)}`}</p>
            <button class="dragon-egg-hatch" id="dragon-egg-hatch-button" ${ready ? "" : "disabled"}>🐣 Faire éclore</button>
        `;

        if (exploreButton) exploreButton.disabled = true;

        const hatchButton = document.getElementById("dragon-egg-hatch-button");
        if (hatchButton) hatchButton.addEventListener("click", hatchEgg);
    }

    function receiveEgg(dragon, zoneName) {
        if (!dragon) return false;

        if (loadEgg()) {
            render();
            return false;
        }

        const duration = hatchTimes[dragon.rarity] || 60000;
        const startedAt = Date.now();

        saveEgg({
            dragonId: dragon.id,
            zoneName: zoneName || "Draconia",
            startedAt,
            hatchAt: startedAt + duration
        });

        render();
        return true;
    }

    function hatchEgg() {
        const egg = loadEgg();
        if (!egg || Date.now() < egg.hatchAt) return;

        const dragon = getDragon(egg.dragonId);
        if (!dragon) {
            saveEgg(null);
            render();
            return;
        }

        saveEgg(null);

        if (typeof discoverDragon === "function") {
            discoverDragon(dragon);
        }

        render();

        const message = document.getElementById("egg-message");
        if (message) {
            message.textContent = `🐣 ${dragon.name} vient d'éclore ! Il rejoint maintenant tes dragons.`;
        }
    }

    function startTimer() {
        if (timer) clearInterval(timer);
        timer = setInterval(render, 1000);
    }

    window.draconiaReceiveEgg = receiveEgg;
    window.draconiaHasActiveEgg = function() {
        return Boolean(loadEgg());
    };
    window.renderDragonEgg = render;

    function start() {
        render();
        startTimer();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start, { once: true });
    } else {
        start();
    }
})();
