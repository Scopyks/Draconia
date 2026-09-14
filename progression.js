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

    function getDragonRank(level) {
        if (level >= 20) return { name: "Légende", icon: "👑" };
        if (level >= 15) return { name: "Vétéran", icon: "🥇" };
        if (level >= 10) return { name: "Gardien", icon: "🥈" };
        if (level >= 5) return { name: "Apprenti", icon: "🥉" };
        return { name: "Jeune dragon", icon: "🌱" };
    }

    function getNextMilestone(level) {
        const levels = Object.keys(MILESTONES)
            .map(Number)
            .sort((a, b) => a - b);

        const next = levels.find(milestoneLevel => milestoneLevel > level);
        return next ? { level: next, ...MILESTONES[next] } : null;
    }

    function getLevelReward(level) {
        const milestone = MILESTONES[level];
        return LEVEL_COIN_REWARD + (milestone ? milestone.bonus : 0);
    }

    function injectProgressionStyles() {
        if (document.getElementById("dragon-progression-styles")) return;

        const style = document.createElement("style");
        style.id = "dragon-progression-styles";
        style.textContent = `
            .dragon-progression-panel {
                margin-top: 12px;
                padding: 12px 13px;
                border: 1px solid #343756;
                border-radius: 15px;
                background: linear-gradient(145deg, rgba(121,92,255,.12), rgba(255,255,255,.025));
            }

            .dragon-progression-top {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
                margin-bottom: 7px;
            }

            .dragon-progression-rank {
                font-size: 13px;
                font-weight: 800;
            }

            .dragon-progression-reward {
                font-size: 12px;
                color: #f5d77a;
                font-weight: 800;
                text-align: right;
            }

            .dragon-progression-next {
                font-size: 11px;
                line-height: 1.4;
                color: #aeb2d2;
            }

            .dragon-level-toast {
                position: fixed;
                left: 50%;
                bottom: 92px;
                z-index: 1800;
                width: min(calc(100% - 32px), 420px);
                transform: translateX(-50%);
                padding: 14px 16px;
                border: 1px solid rgba(255,255,255,.13);
                border-radius: 17px;
                background: #1c1e34;
                color: #fff;
                box-shadow: 0 14px 35px rgba(0,0,0,.35);
                text-align: center;
                font-size: 13px;
                line-height: 1.45;
                animation: dragon-level-toast-in .22s ease-out;
            }

            .dragon-level-toast strong {
                display: block;
                margin-bottom: 3px;
                font-size: 15px;
            }

            @keyframes dragon-level-toast-in {
                from { opacity: 0; transform: translate(-50%, 12px) scale(.97); }
                to { opacity: 1; transform: translate(-50%, 0) scale(1); }
            }
        `;

        document.head.appendChild(style);
    }

    function showLevelToast(dragon, level, reward) {
        document.querySelector(".dragon-level-toast")?.remove();

        const milestone = MILESTONES[level];
        const toast = document.createElement("div");
        toast.className = "dragon-level-toast";

        toast.innerHTML = `
            <strong>⭐ ${dragon ? dragon.name : "Ton dragon"} passe niveau ${level} !</strong>
            💰 +${reward} pièces${milestone ? ` • ${milestone.icon} Rang ${milestone.title} débloqué !` : ""}
        `;

        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3200);
    }

    function rewardDragonLevelUp(dragonData, oldLevel, newLevel) {
        if (!dragonData || newLevel <= oldLevel) return;

        const dragon = typeof dragons !== "undefined"
            ? dragons.find(item => item.id === dragonData.id)
            : null;

        for (let level = oldLevel + 1; level <= newLevel; level += 1) {
            const reward = getLevelReward(level);

            if (typeof player !== "undefined") {
                player.coins = (Number(player.coins) || 0) + reward;
            }

            showLevelToast(dragon, level, reward);
        }

        if (typeof savePlayer === "function") savePlayer();
        if (typeof updatePlayerDisplay === "function") updatePlayerDisplay();
    }

    function decorateDragonProgressionCards() {
        const cards = document.querySelectorAll(".owned-dragon-card");

        cards.forEach(card => {
            const restButton = card.querySelector(".dragon-care-actions button:last-child");
            const match = restButton
                ?.getAttribute("onclick")
                ?.match(/restDragon\('([^']+)'\)/);

            if (!match) return;

            const dragonId = match[1];
            const owned = typeof ownedDragons !== "undefined"
                ? ownedDragons.find(dragon => dragon.id === dragonId)
                : null;

            if (!owned) return;

            const level = Math.max(1, Number(owned.level) || 1);
            const rank = getDragonRank(level);
            const nextMilestone = getNextMilestone(level);
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
                    <span class="dragon-progression-reward">Prochain niveau : +${nextReward} 💰</span>
                </div>
                <div class="dragon-progression-next">
                    ${nextMilestone
                        ? `🎯 Prochain palier : niveau ${nextMilestone.level} • ${nextMilestone.icon} ${nextMilestone.title} • bonus +${nextMilestone.bonus} 💰`
                        : "👑 Rang maximum de progression atteint pour le prototype."}
                </div>
            `;
        });
    }

    injectProgressionStyles();

    if (typeof addDragonXP === "function") {
        const originalAddDragonXP = addDragonXP;

        addDragonXP = function(dragon, amount) {
            const oldLevel = Math.max(1, Number(dragon?.level) || 1);
            const result = originalAddDragonXP.apply(this, arguments);
            const newLevel = Math.max(1, Number(dragon?.level) || oldLevel);

            if (newLevel > oldLevel) {
                rewardDragonLevelUp(dragon, oldLevel, newLevel);
            }

            return result;
        };
    }

    if (typeof renderOwnedDragons === "function") {
        const originalRenderOwnedDragons = renderOwnedDragons;

        renderOwnedDragons = function() {
            const result = originalRenderOwnedDragons.apply(this, arguments);
            decorateDragonProgressionCards();
            return result;
        };
    }

    setTimeout(function() {
        if (typeof renderOwnedDragons === "function") renderOwnedDragons();
        else decorateDragonProgressionCards();
    }, 0);
})();
