// ======================================================
// DRACONIA - EXPLORATION PAR ZONES 🗺️🐉
// ======================================================

(function initExplorationZones() {
    const STORAGE_KEY = "draconiaExplorationZone";

    const zones = {
        forest: {
            name: "Forêt ancienne",
            icon: "🌲",
            description: "Nature, Air et Terre sont plus fréquents.",
            elements: ["Nature", "Air", "Terre"]
        },
        lake: {
            name: "Lac brumeux",
            icon: "🌊",
            description: "Eau, Glace et Air sont plus fréquents.",
            elements: ["Eau", "Glace", "Air"]
        },
        mountain: {
            name: "Montagnes ardentes",
            icon: "⛰️",
            description: "Feu, Terre et Foudre sont plus fréquents.",
            elements: ["Feu", "Terre", "Foudre"]
        },
        ruins: {
            name: "Ruines célestes",
            icon: "🏛️",
            description: "Ombre, Lumière et Cosmique peuvent y apparaître plus souvent.",
            elements: ["Ombre", "Lumière", "Cosmique"]
        }
    };

    let selectedZone = localStorage.getItem(STORAGE_KEY);
    if (!zones[selectedZone]) selectedZone = "forest";

    const rarityWeights = {
        "Commun": 5,
        "Peu commun": 3.6,
        "Rare": 2,
        "Épique": 1,
        "Légendaire": 0.35
    };

    const weatherElementMap = {
        sun: "Lumière",
        water: "Eau",
        lightning: "Foudre",
        ice: "Glace",
        shadow: "Ombre",
        air: "Air",
        nature: "Nature"
    };

    function injectStyles() {
        if (document.getElementById("draconia-exploration-styles")) return;

        const style = document.createElement("style");
        style.id = "draconia-exploration-styles";
        style.textContent = `
            .exploration-zones{margin:18px 0 16px;text-align:left}.exploration-zones-title{margin:0 0 9px;font-size:13px;font-weight:900;opacity:.78}.exploration-zone-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.exploration-zone{border:1px solid rgba(124,58,237,.16);border-radius:15px;padding:11px;background:rgba(255,255,255,.65);text-align:left;cursor:pointer;transition:transform .15s ease,border-color .15s ease,box-shadow .15s ease}.exploration-zone:active{transform:scale(.98)}.exploration-zone.selected{border-color:#7c3aed;box-shadow:0 0 0 2px rgba(124,58,237,.12);background:rgba(124,58,237,.08)}.exploration-zone strong{display:block;font-size:13px}.exploration-zone small{display:block;margin-top:3px;font-size:10px;line-height:1.35;opacity:.7}.exploration-zone-icon{font-size:24px;margin-bottom:5px}.exploration-current{margin-top:10px;padding:9px 11px;border-radius:12px;background:rgba(124,58,237,.08);font-size:12px;line-height:1.4}.exploration-weather-bonus{margin-top:5px;font-size:11px;opacity:.76}@media(max-width:420px){.exploration-zone-grid{grid-template-columns:1fr 1fr}.exploration-zone{padding:9px}.exploration-zone strong{font-size:12px}}
        `;

        document.head.appendChild(style);
    }

    function getWeatherElement() {
        if (typeof getWeatherBonus !== "function") return null;
        return weatherElementMap[getWeatherBonus()] || null;
    }

    function renderZones() {
        injectStyles();

        const card = document.querySelector(".egg-card");
        if (!card) return;

        let container = document.getElementById("exploration-zones");
        if (!container) {
            container = document.createElement("div");
            container.id = "exploration-zones";
            container.className = "exploration-zones";

            const button = document.getElementById("egg-button");
            if (button) button.insertAdjacentElement("beforebegin", container);
            else card.appendChild(container);
        }

        const weatherElement = getWeatherElement();
        const zone = zones[selectedZone];

        container.innerHTML = `
            <p class="exploration-zones-title">🗺️ Choisis une zone à explorer</p>
            <div class="exploration-zone-grid">
                ${Object.entries(zones).map(([id, item]) => `
                    <button class="exploration-zone ${id === selectedZone ? "selected" : ""}" data-exploration-zone="${id}">
                        <div class="exploration-zone-icon">${item.icon}</div>
                        <strong>${item.name}</strong>
                        <small>${item.description}</small>
                    </button>
                `).join("")}
            </div>
            <div class="exploration-current">
                <strong>${zone.icon} Zone sélectionnée : ${zone.name}</strong>
                <div class="exploration-weather-bonus">${weatherElement ? `🌦️ La météo favorise aussi les dragons ${weatherElement}.` : "🌦️ La météo peut influencer certaines apparitions."}</div>
            </div>
        `;

        container.querySelectorAll("[data-exploration-zone]").forEach(button => {
            button.addEventListener("click", function() {
                selectedZone = button.dataset.explorationZone;
                localStorage.setItem(STORAGE_KEY, selectedZone);
                renderZones();

                const message = document.getElementById("egg-message");
                if (message) {
                    const chosen = zones[selectedZone];
                    message.textContent = `${chosen.icon} Tu exploreras maintenant : ${chosen.name}.`;
                }
            });
        });
    }

    function pickDragonForZone() {
        if (typeof dragons === "undefined" || !dragons.length) return null;

        const zone = zones[selectedZone];
        const weatherElement = getWeatherElement();

        const weighted = dragons.map(dragon => {
            let weight = rarityWeights[dragon.rarity] || 1;

            if (zone.elements.includes(dragon.element)) weight *= 3;
            if (weatherElement === dragon.element) weight *= 2.2;
            if (typeof isNight === "function" && isNight() && dragon.element === "Ombre") weight *= 1.7;

            return { dragon, weight };
        });

        const total = weighted.reduce((sum, item) => sum + item.weight, 0);
        let roll = Math.random() * total;

        for (const item of weighted) {
            roll -= item.weight;
            if (roll <= 0) return item.dragon;
        }

        return weighted[weighted.length - 1].dragon;
    }

    function enhancedFindEgg() {
        const button = document.getElementById("egg-button");
        const message = document.getElementById("egg-message");
        const zone = zones[selectedZone];

        if (typeof window.draconiaHasActiveEgg === "function" && window.draconiaHasActiveEgg()) {
            if (message) message.textContent = "🥚 Un œuf est déjà en incubation. Fais-le éclore avant de repartir explorer.";
            if (typeof window.renderDragonEgg === "function") window.renderDragonEgg();
            return;
        }

        if (button) button.disabled = true;
        if (message) message.textContent = `${zone.icon} Exploration de ${zone.name}...`;

        setTimeout(function() {
            const foundSomething = Math.random() < 0.55;

            if (!foundSomething) {
                if (message) message.textContent = `🍃 Aucun œuf trouvé dans ${zone.name} cette fois.`;
                if (button) button.disabled = false;
                return;
            }

            const dragon = pickDragonForZone();
            if (!dragon) {
                if (message) message.textContent = "Aucun œuf n'a pu être trouvé.";
                if (button) button.disabled = false;
                return;
            }

            if (typeof window.draconiaReceiveEgg !== "function") {
                if (message) message.textContent = "🥚 L'incubateur n'est pas encore prêt.";
                if (button) button.disabled = false;
                return;
            }

            const accepted = window.draconiaReceiveEgg(dragon, zone.name);

            if (message) {
                message.textContent = accepted
                    ? `🥚 Tu as trouvé un œuf ${dragon.element} • ${dragon.rarity} ! Il est maintenant en incubation.`
                    : "🥚 Un œuf est déjà en incubation.";
            }

            if (!accepted && button) button.disabled = false;
        }, 850);
    }

    function install() {
        renderZones();
        window.findEgg = enhancedFindEgg;
        window.renderExplorationZones = renderZones;
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", install, { once: true });
    } else {
        install();
    }
})();
