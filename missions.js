// ======================================================
// DRACONIA - MISSIONS QUOTIDIENNES 📋
// ======================================================

(function initDailyMissionsSystem() {
    const STORAGE_KEY = "draconiaDailyMissionsV1";
    const DAILY_COUNT = 3;
    const ALL_BONUS = 30;

    const missionPool = [
        { id: "gather", icon: "🌿", title: "Cueilleur", text: "Récolte 5 ressources", target: 5, reward: 15, event: "resource" },
        { id: "fish", icon: "🎣", title: "Pêcheur", text: "Pêche 3 poissons", target: 3, reward: 20, event: "fish" },
        { id: "cook", icon: "🍲", title: "Chef dragon", text: "Prépare 2 plats", target: 2, reward: 20, event: "cook" },
        { id: "feed", icon: "🐉", title: "Bon gardien", text: "Nourris un dragon 2 fois", target: 2, reward: 20, event: "feed" },
        { id: "play", icon: "🎮", title: "Compagnon de jeu", text: "Gagne 1 mini-jeu avec un dragon", target: 1, reward: 20, event: "play" },
        { id: "wash", icon: "🛁", title: "Dragon étincelant", text: "Lave complètement un dragon", target: 1, reward: 20, event: "wash" },
        { id: "resources10", icon: "🎒", title: "Sac bien rempli", text: "Récolte 10 ressources", target: 10, reward: 25, event: "resource" }
    ];

    let state = null;
    let hooksTimer = null;

    function today() {
        if (typeof getTodayDate === "function") return getTodayDate();
        return new Date().toISOString().slice(0, 10);
    }

    function pickMissions() {
        const pool = [...missionPool];
        const selected = [];

        while (selected.length < DAILY_COUNT && pool.length) {
            const index = Math.floor(Math.random() * pool.length);
            const mission = pool.splice(index, 1)[0];
            selected.push({ ...mission, progress: 0, claimed: false });
        }

        return selected;
    }

    function save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    function load() {
        try {
            state = JSON.parse(localStorage.getItem(STORAGE_KEY));
        } catch (error) {
            state = null;
        }

        if (!state || state.date !== today() || !Array.isArray(state.missions)) {
            state = {
                date: today(),
                missions: pickMissions(),
                bonusClaimed: false
            };
            save();
        }
    }

    function addCoins(amount) {
        player.coins += amount;
        savePlayer();
        updatePlayerDisplay();
    }

    function claimMission(index) {
        const mission = state.missions[index];
        if (!mission || mission.claimed || mission.progress < mission.target) return;

        mission.claimed = true;
        addCoins(mission.reward);
        save();
        render();
    }

    function claimBonus() {
        if (state.bonusClaimed || !state.missions.every(mission => mission.claimed)) return;

        state.bonusClaimed = true;
        addCoins(ALL_BONUS);
        save();
        render();
    }

    function record(event, amount = 1) {
        load();
        let changed = false;

        state.missions.forEach(mission => {
            if (mission.event !== event || mission.claimed) return;

            const next = Math.min(mission.target, mission.progress + amount);
            if (next !== mission.progress) {
                mission.progress = next;
                changed = true;
            }
        });

        if (changed) {
            save();
            render();
        }
    }

    function injectStyles() {
        if (document.getElementById("daily-missions-style")) return;

        const style = document.createElement("style");
        style.id = "daily-missions-style";
        style.textContent = `
            .daily-missions{margin:18px 0;padding:18px;border-radius:22px;background:linear-gradient(145deg,rgba(79,70,229,.12),rgba(168,85,247,.08));border:1px solid rgba(139,92,246,.22)}
            .daily-missions-head{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:14px}.daily-missions-head h2{margin:3px 0 0}.daily-missions-head span{font-size:12px;opacity:.7;text-align:right}
            .daily-mission{padding:14px;margin-top:10px;border-radius:16px;background:rgba(255,255,255,.72);box-shadow:0 5px 16px rgba(0,0,0,.05)}
            .daily-mission-top{display:flex;gap:10px;align-items:center}.daily-mission-icon{font-size:28px}.daily-mission-info{flex:1}.daily-mission-info strong,.daily-mission-info small{display:block}.daily-mission-info small{margin-top:2px;opacity:.7}
            .daily-mission-reward{font-weight:800;white-space:nowrap}.daily-mission-bar{height:9px;background:rgba(0,0,0,.09);border-radius:999px;overflow:hidden;margin:11px 0 7px}.daily-mission-fill{height:100%;background:linear-gradient(90deg,#7c3aed,#a855f7);border-radius:999px;transition:width .25s ease}
            .daily-mission-bottom{display:flex;justify-content:space-between;align-items:center;font-size:12px}.daily-mission button,.daily-bonus button{border:0;border-radius:10px;padding:8px 11px;font-weight:800;cursor:pointer}.daily-mission button{background:#7c3aed;color:white}.daily-mission button:disabled{opacity:.45;cursor:default}
            .daily-bonus{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:14px;padding:12px;border-radius:14px;background:rgba(250,204,21,.14)}.daily-bonus button{background:#f59e0b;color:#fff}.daily-bonus button:disabled{opacity:.5}
            @media(max-width:520px){.daily-missions{padding:14px}.daily-missions-head{align-items:flex-start}.daily-mission-top{align-items:flex-start}.daily-mission-reward{font-size:13px}}
        `;
        document.head.appendChild(style);
    }

    function ensurePanel() {
        let panel = document.getElementById("daily-missions");
        const profile = document.getElementById("profile-page");
        if (!profile) return null;

        if (panel) {
            if (panel.parentElement !== profile) profile.appendChild(panel);
            return panel;
        }

        panel = document.createElement("section");
        panel.id = "daily-missions";
        panel.className = "daily-missions";
        profile.appendChild(panel);
        return panel;
    }

    function render() {
        load();
        injectStyles();

        const panel = ensurePanel();
        if (!panel) return;

        const claimed = state.missions.filter(mission => mission.claimed).length;

        panel.innerHTML = `
            <div class="daily-missions-head">
                <div>
                    <p class="small-title">OBJECTIFS DU JOUR</p>
                    <h2>📋 Missions quotidiennes</h2>
                </div>
                <span>${claimed} / ${DAILY_COUNT} récompenses récupérées</span>
            </div>

            ${state.missions.map((mission, index) => {
                const complete = mission.progress >= mission.target;
                const percent = Math.min(100, Math.round((mission.progress / mission.target) * 100));

                return `
                    <div class="daily-mission">
                        <div class="daily-mission-top">
                            <div class="daily-mission-icon">${mission.icon}</div>
                            <div class="daily-mission-info">
                                <strong>${mission.title}</strong>
                                <small>${mission.text}</small>
                            </div>
                            <div class="daily-mission-reward">💰 ${mission.reward}</div>
                        </div>

                        <div class="daily-mission-bar">
                            <div class="daily-mission-fill" style="width:${percent}%"></div>
                        </div>

                        <div class="daily-mission-bottom">
                            <span>${mission.progress} / ${mission.target}</span>
                            <button ${complete && !mission.claimed ? "" : "disabled"} data-mission-claim="${index}">
                                ${mission.claimed ? "✅ Récupérée" : complete ? "🎁 Récupérer" : "En cours"}
                            </button>
                        </div>
                    </div>
                `;
            }).join("")}

            <div class="daily-bonus">
                <div>
                    <strong>🏆 Bonus du jour</strong><br>
                    <small>Termine et récupère les 3 missions</small>
                </div>
                <button id="daily-bonus-button" ${state.missions.every(mission => mission.claimed) && !state.bonusClaimed ? "" : "disabled"}>
                    ${state.bonusClaimed ? "✅ +30 💰" : "+30 💰"}
                </button>
            </div>
        `;

        panel.querySelectorAll("[data-mission-claim]").forEach(button => {
            button.addEventListener("click", () => claimMission(Number(button.dataset.missionClaim)));
        });

        const bonus = document.getElementById("daily-bonus-button");
        if (bonus) bonus.addEventListener("click", claimBonus);
    }

    function hookAddResource() {
        const current = window.addResource;
        if (typeof current !== "function" || current.__dailyMissionHook) return;

        const wrapped = function(resource, amount = 1) {
            const before = (typeof inventory !== "undefined" && inventory[resource]) || 0;
            const result = current.apply(this, arguments);
            const after = (typeof inventory !== "undefined" && inventory[resource]) || 0;
            const gained = Math.max(0, after - before);

            if (gained > 0) {
                record("resource", gained);
                if (resource === "fish") record("fish", gained);
            }

            return result;
        };

        wrapped.__dailyMissionHook = true;
        window.addResource = wrapped;
    }

    function hookCookRecipe() {
        const current = window.cookRecipe;
        if (typeof current !== "function" || current.__dailyMissionHook) return;

        const wrapped = function(recipeId) {
            const before = (typeof preparedMeals !== "undefined" && preparedMeals[recipeId]) || 0;
            const result = current.apply(this, arguments);
            const after = (typeof preparedMeals !== "undefined" && preparedMeals[recipeId]) || 0;

            if (after > before) record("cook", after - before);
            return result;
        };

        wrapped.__dailyMissionHook = true;
        window.cookRecipe = wrapped;
    }

    function hookFeedDragon() {
        if (typeof window.blockIfDragonResting !== "function") return;

        const current = window.feedDragon;
        if (typeof current !== "function" || current.__dailyMissionHook) return;

        const wrapped = function(dragonId) {
            const owned = typeof ownedDragons !== "undefined"
                ? ownedDragons.find(dragon => dragon.id === dragonId)
                : null;
            const before = owned ? Number(owned.hunger) || 0 : 0;
            const result = current.apply(this, arguments);
            const after = owned ? Number(owned.hunger) || 0 : before;

            if (after > before) record("feed", 1);
            return result;
        };

        wrapped.__dailyMissionHook = true;
        window.feedDragon = wrapped;
    }

    function hookDragonMiniGame() {
        const current = window.completeDragonMiniGame;
        if (typeof current !== "function" || current.__dailyMissionHook) return;

        const wrapped = function(success, message) {
            const game = document.getElementById("dragon-mini-game");
            const alreadyRewarded = game?.dataset.rewarded === "true";
            const result = current.apply(this, arguments);
            const nowRewarded = game?.dataset.rewarded === "true";

            if (success && !alreadyRewarded && nowRewarded) {
                record("play", 1);
            }

            return result;
        };

        wrapped.__dailyMissionHook = true;
        window.completeDragonMiniGame = wrapped;
    }

    function hookWashDragon() {
        const current = window.advanceWashStage;
        if (typeof current !== "function" || current.__dailyMissionHook) return;

        const wrapped = function() {
            const before = typeof washStage === "number" ? washStage : -1;
            const result = current.apply(this, arguments);
            const after = typeof washStage === "number" ? washStage : before;

            if (before === 2 && after === 3) {
                record("wash", 1);
            }

            return result;
        };

        wrapped.__dailyMissionHook = true;
        window.advanceWashStage = wrapped;
    }

    function installMissionHooks() {
        hookAddResource();
        hookCookRecipe();
        hookFeedDragon();
        hookDragonMiniGame();
        hookWashDragon();
    }

    window.draconiaMissionProgress = record;
    window.renderDailyMissions = render;

    function startMissions() {
        load();
        render();
        installMissionHooks();

        if (!hooksTimer) {
            hooksTimer = setInterval(installMissionHooks, 1000);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", startMissions, { once: true });
    } else {
        startMissions();
    }
})();
