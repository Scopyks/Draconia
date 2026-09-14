// ======================================================
// DRACONIA - DRAGONDEX AMELIORE
// ======================================================

(function initImprovedDragonDex() {
    const zonesByElement = {
        Feu: "⛰️ Montagnes ardentes",
        Eau: "🌊 Lac brumeux",
        Nature: "🌲 Forêt ancienne",
        Air: "🌲 Forêt ancienne / 🌊 Lac brumeux",
        Foudre: "⛰️ Montagnes ardentes",
        Glace: "🌊 Lac brumeux",
        Terre: "🌲 Forêt ancienne / ⛰️ Montagnes ardentes",
        Ombre: "🏛️ Ruines célestes",
        Lumière: "🏛️ Ruines célestes",
        Cosmique: "🏛️ Ruines célestes"
    };

    const rarityClass = {
        "Commun": "common",
        "Peu commun": "uncommon",
        "Rare": "rare",
        "Épique": "epic",
        "Légendaire": "legendary"
    };

    let currentFilter = "all";

    function isDiscovered(dragon) {
        if (typeof discoveredDragons === "undefined" || !Array.isArray(discoveredDragons)) return false;
        return discoveredDragons.some(item => {
            if (typeof item === "string") return item === dragon.id;
            return item && item.id === dragon.id;
        });
    }

    function isOwned(dragon) {
        if (typeof ownedDragons === "undefined" || !Array.isArray(ownedDragons)) return false;
        return ownedDragons.some(item => item && item.id === dragon.id);
    }

    function ownedData(dragon) {
        if (typeof ownedDragons === "undefined" || !Array.isArray(ownedDragons)) return null;
        return ownedDragons.find(item => item && item.id === dragon.id) || null;
    }

    function injectStyles() {
        if (document.getElementById("improved-dragondex-styles")) return;
        const style = document.createElement("style");
        style.id = "improved-dragondex-styles";
        style.textContent = `
            .dex-dashboard{margin:0 0 16px;padding:15px;border-radius:20px;background:linear-gradient(135deg,rgba(124,58,237,.12),rgba(59,130,246,.08));border:1px solid rgba(124,58,237,.18)}
            .dex-dashboard-top{display:flex;justify-content:space-between;gap:12px;align-items:center}.dex-dashboard strong{font-size:18px}.dex-dashboard small{display:block;margin-top:3px;opacity:.7}.dex-progress{height:10px;margin-top:11px;border-radius:999px;overflow:hidden;background:rgba(0,0,0,.08)}.dex-progress-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,#7c3aed,#3b82f6)}
            .dex-filters{display:flex;gap:7px;margin:0 0 14px;overflow:auto;padding-bottom:3px}.dex-filter{white-space:nowrap;border:0;border-radius:999px;padding:9px 12px;font-weight:800;background:rgba(0,0,0,.07);cursor:pointer}.dex-filter.active{background:#7c3aed;color:white}
            #dragon-list.dex-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.dex-card{position:relative;padding:14px;border-radius:19px;background:linear-gradient(145deg,#241b4f,#162447);color:#f8f7ff;border:1px solid rgba(167,139,250,.28);box-shadow:0 9px 24px rgba(20,16,55,.22),inset 0 1px 0 rgba(255,255,255,.06);overflow:hidden}.dex-card::before{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 18% 0%,rgba(139,92,246,.22),transparent 43%),radial-gradient(circle at 100% 100%,rgba(59,130,246,.14),transparent 45%)}.dex-card>*{position:relative}.dex-card.unknown{background:linear-gradient(145deg,#29263f,#1b2236);color:#dedbea;filter:none;border-color:rgba(148,163,184,.22)}.dex-card-icon{font-size:42px;text-align:center;margin:3px 0 8px}.dex-card.unknown .dex-card-icon{filter:grayscale(1);opacity:.5}.dex-card h3{margin:0 0 4px;font-size:16px;color:#fff}.dex-meta{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0}.dex-badge{font-size:10px;font-weight:900;padding:5px 7px;border-radius:999px;background:rgba(255,255,255,.11);color:#f5f3ff}.dex-badge.owned{background:rgba(34,197,94,.18);color:#86efac}.dex-rarity-common{background:rgba(148,163,184,.2)}.dex-rarity-uncommon{background:rgba(34,197,94,.2);color:#86efac}.dex-rarity-rare{background:rgba(59,130,246,.24);color:#93c5fd}.dex-rarity-epic{background:rgba(168,85,247,.25);color:#d8b4fe}.dex-rarity-legendary{background:rgba(245,158,11,.24);color:#fcd34d}.dex-hint{margin-top:8px;padding:8px;border-radius:11px;background:rgba(139,92,246,.14);border:1px solid rgba(167,139,250,.12);font-size:11px;line-height:1.4;color:#e9e5ff}.dex-level{margin-top:8px;font-size:11px;font-weight:800;color:#ddd6fe}.dex-number{position:absolute;right:10px;top:9px;font-size:10px;color:#c4b5fd;opacity:.72;font-weight:900}@media(max-width:390px){#dragon-list.dex-grid{grid-template-columns:1fr}.dex-card{padding:13px}}
        `;
        document.head.appendChild(style);
    }

    function ensureDashboard() {
        const list = document.getElementById("dragon-list");
        if (!list || typeof dragons === "undefined") return;

        let dashboard = document.getElementById("dex-dashboard");
        if (!dashboard) {
            dashboard = document.createElement("div");
            dashboard.id = "dex-dashboard";
            dashboard.className = "dex-dashboard";
            list.insertAdjacentElement("beforebegin", dashboard);
        }

        let filters = document.getElementById("dex-filters");
        if (!filters) {
            filters = document.createElement("div");
            filters.id = "dex-filters";
            filters.className = "dex-filters";
            list.insertAdjacentElement("beforebegin", filters);
        }

        const discovered = dragons.filter(isDiscovered).length;
        const owned = dragons.filter(isOwned).length;
        const percent = dragons.length ? Math.round(discovered / dragons.length * 100) : 0;

        dashboard.innerHTML = `<div class="dex-dashboard-top"><div><strong>📖 Collection ${discovered}/${dragons.length}</strong><small>${owned} dragon${owned > 1 ? "s" : ""} dans ton refuge</small></div><strong>${percent}%</strong></div><div class="dex-progress"><div class="dex-progress-fill" style="width:${percent}%"></div></div>`;

        filters.innerHTML = [
            ["all", "Tous"],
            ["found", "✅ Découverts"],
            ["missing", "❓ À trouver"]
        ].map(([id, label]) => `<button class="dex-filter ${currentFilter === id ? "active" : ""}" data-dex-filter="${id}">${label}</button>`).join("");

        filters.querySelectorAll("[data-dex-filter]").forEach(button => {
            button.addEventListener("click", function() {
                currentFilter = button.dataset.dexFilter;
                renderImprovedDragonDex();
            });
        });
    }

    function renderImprovedDragonDex() {
        injectStyles();
        const list = document.getElementById("dragon-list");
        if (!list || typeof dragons === "undefined") return;

        ensureDashboard();
        list.className = "dragon-list dex-grid";

        const visible = dragons.filter(dragon => {
            const found = isDiscovered(dragon);
            if (currentFilter === "found") return found;
            if (currentFilter === "missing") return !found;
            return true;
        });

        list.innerHTML = visible.map(dragon => {
            const found = isDiscovered(dragon);
            const owned = isOwned(dragon);
            const data = ownedData(dragon);
            const rarity = rarityClass[dragon.rarity] || "common";
            const number = dragons.indexOf(dragon) + 1;

            if (!found) {
                return `<article class="dex-card unknown"><span class="dex-number">#${String(number).padStart(2,"0")}</span><div class="dex-card-icon">❔🐉</div><h3>Dragon inconnu</h3><div class="dex-meta"><span class="dex-badge">${dragon.rarity}</span></div><div class="dex-hint">🗺️ Indice : cherche du côté de <strong>${zonesByElement[dragon.element]}</strong>.</div></article>`;
            }

            return `<article class="dex-card"><span class="dex-number">#${String(number).padStart(2,"0")}</span><div class="dex-card-icon">${dragon.icon}</div><h3>${dragon.name}</h3><div class="dex-meta"><span class="dex-badge">${dragon.element}</span><span class="dex-badge dex-rarity-${rarity}">${dragon.rarity}</span>${owned ? `<span class="dex-badge owned">🏠 Dans le refuge</span>` : ""}</div><div class="dex-hint">🗺️ Zone favorable : <strong>${zonesByElement[dragon.element]}</strong></div>${data ? `<div class="dex-level">⭐ Niveau ${Number(data.level) || 1}</div>` : `<div class="dex-level">🥚 Découvert, mais pas encore dans le refuge</div>`}</article>`;
        }).join("");

        if (!visible.length) list.innerHTML = `<div class="dex-card"><strong>Aucun dragon dans ce filtre.</strong></div>`;
    }

    function install() {
        window.renderDragonDex = renderImprovedDragonDex;
        window.renderImprovedDragonDex = renderImprovedDragonDex;
        renderImprovedDragonDex();
        setTimeout(renderImprovedDragonDex, 700);
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install, { once: true });
    else install();
})();
