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

    const rarityOrder = ["Commun", "Peu commun", "Rare", "Épique", "Légendaire"];
    const rarityIcons = {
        "Commun": "⚪",
        "Peu commun": "🟢",
        "Rare": "🔵",
        "Épique": "🟣",
        "Légendaire": "🟡"
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
            .dex-dashboard{margin:0 0 16px;padding:16px;border-radius:22px;background:linear-gradient(145deg,#241b4f,#162447);color:#f8f7ff;border:1px solid rgba(167,139,250,.28);box-shadow:0 10px 26px rgba(20,16,55,.18);position:relative;overflow:hidden}.dex-dashboard::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 15% 0%,rgba(139,92,246,.24),transparent 40%),radial-gradient(circle at 100% 100%,rgba(59,130,246,.18),transparent 45%);pointer-events:none}.dex-dashboard>*{position:relative}.dex-dashboard-top{display:flex;justify-content:space-between;gap:12px;align-items:center}.dex-dashboard strong{font-size:18px}.dex-dashboard small{display:block;margin-top:3px;color:#ddd6fe}.dex-dashboard-percent{font-size:20px;font-weight:900;color:#c4b5fd}.dex-progress{height:11px;margin-top:12px;border-radius:999px;overflow:hidden;background:rgba(255,255,255,.1);box-shadow:inset 0 1px 3px rgba(0,0,0,.25)}.dex-progress-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,#8b5cf6,#3b82f6,#22d3ee)}.dex-rarity-summary{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px;margin-top:12px}.dex-rarity-stat{padding:8px 5px;border-radius:12px;background:rgba(255,255,255,.07);text-align:center;font-size:10px}.dex-rarity-stat strong{display:block;font-size:12px;margin-top:2px}.dex-filters{display:flex;gap:7px;margin:0 0 14px;overflow:auto;padding-bottom:3px}.dex-filter{white-space:nowrap;border:1px solid rgba(124,58,237,.12);border-radius:999px;padding:9px 12px;font-weight:800;background:rgba(124,58,237,.08);cursor:pointer}.dex-filter.active{background:#7c3aed;color:white;box-shadow:0 6px 16px rgba(124,58,237,.22)}
            #dragon-list.dex-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.dex-card{position:relative;padding:14px;border-radius:19px;background:linear-gradient(145deg,#241b4f,#162447);color:#f8f7ff;border:1px solid rgba(167,139,250,.28);box-shadow:0 9px 24px rgba(20,16,55,.22),inset 0 1px 0 rgba(255,255,255,.06);overflow:hidden}.dex-card::before{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 18% 0%,rgba(139,92,246,.22),transparent 43%),radial-gradient(circle at 100% 100%,rgba(59,130,246,.14),transparent 45%)}.dex-card>*{position:relative}.dex-card.unknown{background:linear-gradient(145deg,#29263f,#1b2236);color:#dedbea;filter:none;border-color:rgba(148,163,184,.22)}.dex-card-header{display:flex;align-items:center;gap:10px;margin-bottom:8px}.dex-card-icon{font-size:42px;line-height:1;min-width:52px;text-align:center}.dex-card.unknown .dex-card-icon{filter:grayscale(1);opacity:.5}.dex-card-title{min-width:0;flex:1}.dex-card h3{margin:0 0 3px;font-size:16px;color:#fff}.dex-card-sub{font-size:10px;color:#c4b5fd}.dex-status{display:inline-flex;align-items:center;gap:4px;margin-top:5px;font-size:10px;font-weight:900;padding:5px 7px;border-radius:999px;background:rgba(255,255,255,.08)}.dex-status.owned{background:rgba(34,197,94,.18);color:#86efac}.dex-status.found{background:rgba(59,130,246,.2);color:#bfdbfe}.dex-status.missing{background:rgba(148,163,184,.14);color:#cbd5e1}.dex-meta{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0}.dex-badge{font-size:10px;font-weight:900;padding:5px 7px;border-radius:999px;background:rgba(255,255,255,.11);color:#f5f3ff}.dex-rarity-common{background:rgba(148,163,184,.2)}.dex-rarity-uncommon{background:rgba(34,197,94,.2);color:#86efac}.dex-rarity-rare{background:rgba(59,130,246,.24);color:#93c5fd}.dex-rarity-epic{background:rgba(168,85,247,.25);color:#d8b4fe}.dex-rarity-legendary{background:rgba(245,158,11,.24);color:#fcd34d}.dex-info-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:8px}.dex-info-box{padding:8px;border-radius:11px;background:rgba(255,255,255,.06);font-size:10px;line-height:1.4}.dex-info-box strong{display:block;margin-top:2px;color:#fff}.dex-hint{margin-top:8px;padding:8px;border-radius:11px;background:rgba(139,92,246,.14);border:1px solid rgba(167,139,250,.12);font-size:11px;line-height:1.4;color:#e9e5ff}.dex-number{position:absolute;right:10px;top:9px;font-size:10px;color:#c4b5fd;opacity:.72;font-weight:900}@media(max-width:520px){.dex-rarity-summary{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:390px){#dragon-list.dex-grid{grid-template-columns:1fr}.dex-card{padding:13px}.dex-info-grid{grid-template-columns:1fr}}
        `;
        document.head.appendChild(style);
    }

    function getRarityStats() {
        return rarityOrder.map(rarity => {
            const all = dragons.filter(dragon => dragon.rarity === rarity);
            const found = all.filter(isDiscovered);
            return { rarity, total: all.length, found: found.length };
        });
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
        const rarityStats = getRarityStats();

        dashboard.innerHTML = `<div class="dex-dashboard-top"><div><strong>📖 DragonDex ${discovered}/${dragons.length}</strong><small>${owned} dragon${owned > 1 ? "s" : ""} dans ton refuge • ${dragons.length - discovered} encore à découvrir</small></div><div class="dex-dashboard-percent">${percent}%</div></div><div class="dex-progress"><div class="dex-progress-fill" style="width:${percent}%"></div></div><div class="dex-rarity-summary">${rarityStats.map(stat => `<div class="dex-rarity-stat"><span>${rarityIcons[stat.rarity]} ${stat.rarity}</span><strong>${stat.found}/${stat.total}</strong></div>`).join("")}</div>`;

        filters.innerHTML = [
            ["all", `Tous (${dragons.length})`],
            ["found", `✅ Découverts (${discovered})`],
            ["missing", `❓ À trouver (${dragons.length - discovered})`]
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
                return `<article class="dex-card unknown"><span class="dex-number">#${String(number).padStart(2,"0")}</span><div class="dex-card-header"><div class="dex-card-icon">❔🐉</div><div class="dex-card-title"><h3>Dragon inconnu</h3><div class="dex-card-sub">Entrée non découverte</div><span class="dex-status missing">🔒 À découvrir</span></div></div><div class="dex-meta"><span class="dex-badge dex-rarity-${rarity}">${rarityIcons[dragon.rarity]} ${dragon.rarity}</span></div><div class="dex-hint">🗺️ Indice : cherche du côté de <strong>${zonesByElement[dragon.element]}</strong>.</div></article>`;
            }

            const status = owned ? `<span class="dex-status owned">🏠 Dans le refuge</span>` : `<span class="dex-status found">📖 Découvert</span>`;
            const level = data ? Number(data.level) || 1 : null;

            return `<article class="dex-card"><span class="dex-number">#${String(number).padStart(2,"0")}</span><div class="dex-card-header"><div class="dex-card-icon">${dragon.icon}</div><div class="dex-card-title"><h3>${dragon.name}</h3><div class="dex-card-sub">Dragon de ${dragon.element}</div>${status}</div></div><div class="dex-meta"><span class="dex-badge">${dragon.element}</span><span class="dex-badge dex-rarity-${rarity}">${rarityIcons[dragon.rarity]} ${dragon.rarity}</span></div><div class="dex-info-grid"><div class="dex-info-box">⭐ Niveau<strong>${level !== null ? level : "—"}</strong></div><div class="dex-info-box">📍 Habitat<strong>${zonesByElement[dragon.element]}</strong></div></div>${owned ? `<div class="dex-hint">✨ Ce dragon fait partie de ton refuge.</div>` : `<div class="dex-hint">🥚 Dragon découvert. Fais éclore son œuf pour l'ajouter à ton refuge.</div>`}</article>`;
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
