// ======================================================
// DRACONIA - PROGRESSION DES DRAGONS 🐉⭐
// ======================================================

(function initDragonProgression() {
    const LEVEL_COIN_REWARD = 15;
    const MILESTONES = {
        5: { title: "Apprenti", bonus: 50, icon: "🥉" },
        10: { title: "Gardien", bonus: 100, icon: "🥈" },
        15: { title: "Vétéran", bonus: 150, icon: "🥇" },
        20: { title: "Légende", bonus: 250, icon: "👑" }
    };

    let installed = false;

    function getRank(level) {
        if (level >= 20) return { name: "Légende", icon: "👑" };
        if (level >= 15) return { name: "Vétéran", icon: "🥇" };
        if (level >= 10) return { name: "Gardien", icon: "🥈" };
        if (level >= 5) return { name: "Apprenti", icon: "🥉" };
        return { name: "Jeune dragon", icon: "🌱" };
    }

    function getNextMilestone(level) {
        const next = [5, 10, 15, 20].find(value => value > level);
        return next ? { level: next, ...MILESTONES[next] } : null;
    }

    function getLevelReward(level) {
        return LEVEL_COIN_REWARD + (MILESTONES[level]?.bonus || 0);
    }

    function injectStyles() {
        if (document.getElementById("dragon-progression-styles")) return;
        const style = document.createElement("style");
        style.id = "dragon-progression-styles";
        style.textContent = `
            .dragon-progression-panel{margin-top:12px;padding:12px 13px;border:1px solid #343756;border-radius:15px;background:linear-gradient(145deg,rgba(121,92,255,.12),rgba(255,255,255,.025))}
            .dragon-progression-top{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:7px}
            .dragon-progression-rank{font-size:13px;font-weight:800}.dragon-progression-reward{font-size:12px;color:#f5d77a;font-weight:800;text-align:right}.dragon-progression-next{font-size:11px;line-height:1.4;color:#aeb2d2}
            .dragon-level-toast{position:fixed;left:50%;bottom:92px;z-index:1800;width:min(calc(100% - 32px),420px);transform:translateX(-50%);padding:14px 16px;border:1px solid rgba(255,255,255,.13);border-radius:17px;background:#1c1e34;color:#fff;box-shadow:0 14px 35px rgba(0,0,0,.35);text-align:center;font-size:13px;line-height:1.45}
            .dragon-level-toast strong{display:block;margin-bottom:3px;font-size:15px}
        `;
        document.head.appendChild(style);
    }

    function showToast(dragon, level, reward) {
        document.querySelector(".dragon-level-toast")?.remove();
        const milestone = MILESTONES[level];
        const toast = document.createElement("div");
        toast.className = "dragon-level-toast";
        toast.innerHTML = `<strong>⭐ ${dragon?.name || "Ton dragon"} passe niveau ${level} !</strong>💰 +${reward} pièces${milestone ? ` • ${milestone.icon} Rang ${milestone.title} débloqué !` : ""}`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3200);
    }

    function rewardLevels(dragonData, oldLevel, newLevel) {
        if (!dragonData || newLevel <= oldLevel) return;
        const dragon = dragons.find(item => item.id === dragonData.id);

        for (let level = oldLevel + 1; level <= newLevel; level += 1) {
            const reward = getLevelReward(level);
            player.coins = (Number(player.coins) || 0) + reward;
            showToast(dragon, level, reward);
        }

        savePlayer();
        updatePlayerDisplay();
    }

    function decorateCards() {
        document.querySelectorAll(".owned-dragon-card").forEach(card => {
            const restButton = card.querySelector(".dragon-care-actions button:last-child");
            const match = restButton?.getAttribute("onclick")?.match(/restDragon\('([^']+)'\)/);
            if (!match) return;

            const owned = ownedDragons.find(dragon => dragon.id === match[1]);
            if (!owned) return;

            const level = Math.max(1, Number(owned.level) || 1);
            const rank = getRank(level);
            const next = getNextMilestone(level);
            const nextReward = getLevelReward(level + 1);

            let panel = card.querySelector(".dragon-progression-panel");
            if (!panel) {
                panel = document.createElement("div");
                panel.className = "dragon-progression-panel";
                const actions = card.querySelector(".dragon-care-actions");
                if (actions) actions.insertAdjacentElement("beforebegin", panel);
                else card.appendChild(panel);
            }

            panel.innerHTML = `
                <div class="dragon-progression-top">
                    <span class="dragon-progression-rank">${rank.icon} ${rank.name}</span>
                    <span class="dragon-progression-reward">Niveau suivant : +${nextReward} 💰</span>
                </div>
                <div class="dragon-progression-next">
                    ${next ? `🎯 Palier niv. ${next.level} : ${next.icon} ${next.title} • bonus +${next.bonus} 💰` : "👑 Tous les paliers du prototype sont débloqués."}
                </div>`;
        });
    }

    function install() {
        if (installed) return true;
        if (typeof addDragonXP !== "function" || typeof renderOwnedDragons !== "function") return false;
        if (typeof blockIfDragonResting !== "function") return false;

        installed = true;
        injectStyles();

        const originalAddDragonXP = addDragonXP;
        addDragonXP = function(dragon, amount) {
            const oldLevel = Math.max(1, Number(dragon?.level) || 1);
            const result = originalAddDragonXP.apply(this, arguments);
            const newLevel = Math.max(1, Number(dragon?.level) || oldLevel);
            if (newLevel > oldLevel) rewardLevels(dragon, oldLevel, newLevel);
            return result;
        };

        const originalRenderOwnedDragons = renderOwnedDragons;
        renderOwnedDragons = function() {
            const result = originalRenderOwnedDragons.apply(this, arguments);
            decorateCards();
            return result;
        };

        renderOwnedDragons();
        return true;
    }

    if (!install()) {
        const timer = setInterval(function() {
            if (install()) clearInterval(timer);
        }, 250);

        setTimeout(() => clearInterval(timer), 15000);
    }
})();
