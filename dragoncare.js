// ======================================================
// DRACONIA - SOINS ET MINI-JEUX DES DRAGONS 🐉
// ======================================================

const DRAGON_CLEANLINESS_DEFAULT = 75;
let activeCareDragonId = null;
let washStage = 0;
let washCoverage = new Set();
let washPointerDown = false;
let dragonGameCleanup = null;

const dragonMiniGames = {
    "dragon-feu": { name: "Morpion des flammes", icon: "🔥", type: "tictactoe" },
    "dragon-eau": { name: "Mémoire des profondeurs", icon: "💧", type: "memory" },
    "dragon-nature": { name: "Suite de la forêt", icon: "🌿", type: "sequence" },
    "dragon-air": { name: "Nuages rapides", icon: "☁️", type: "clouds" },
    "dragon-foudre": { name: "Réflexe éclair", icon: "⚡", type: "reaction" },
    "dragon-glace": { name: "Cristaux gelés", icon: "❄️", type: "numbers" },
    "dragon-terre": { name: "Duel de rochers", icon: "🪨", type: "rps" },
    "dragon-ombre": { name: "Chasse aux ombres", icon: "🌑", type: "shadow" },
    "dragon-lumiere": { name: "Rayons solaires", icon: "☀️", type: "light" },
    "dragon-cosmique": { name: "Constellation", icon: "🌌", type: "stars" }
};

function ensureDragonCareData() {
    let changed = false;
    ownedDragons.forEach(owned => {
        if (typeof owned.cleanliness !== "number") {
            owned.cleanliness = DRAGON_CLEANLINESS_DEFAULT;
            changed = true;
        }
    });
    if (changed) saveOwnedDragons();
}

function injectDragonCareStyles() {
    if (document.getElementById("dragon-care-extra-styles")) return;
    const style = document.createElement("style");
    style.id = "dragon-care-extra-styles";
    style.textContent = `
        .dragon-care-actions { display:grid !important; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; }
        .dragon-care-actions button { min-height:46px; }
        .dragon-care-overlay { position:fixed; inset:0; z-index:1200; background:#0f1020; color:#fff; overflow:auto; padding:18px 16px 40px; }
        .dragon-care-shell { width:100%; max-width:600px; margin:0 auto; }
        .dragon-care-top { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:14px; }
        .dragon-care-top h2 { font-size:21px; }
        .dragon-care-close { width:42px; height:42px; border:1px solid #343756; border-radius:50%; background:#22243c; color:#fff; font-size:19px; }
        .wash-card,.dragon-game-card { background:#191a30; border:1px solid #292b48; border-radius:22px; padding:18px; text-align:center; }
        .wash-dragon-zone { position:relative; width:100%; height:330px; margin:14px 0; border-radius:24px; border:2px solid #343756; background:linear-gradient(180deg,#314766,#1c2840); overflow:hidden; touch-action:none; user-select:none; }
        .wash-dragon-icon { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:116px; pointer-events:none; }
        .wash-water-effect { position:absolute; inset:0; pointer-events:none; opacity:0; background:radial-gradient(circle at 50% 50%,rgba(90,190,255,.32),transparent 55%); transition:opacity .2s; }
        .wash-foam { position:absolute; inset:0; pointer-events:none; opacity:0; font-size:28px; display:flex; align-items:center; justify-content:center; letter-spacing:12px; line-height:2; transition:opacity .2s; }
        .wash-foam.visible { opacity:1; }
        .wash-water-effect.visible { opacity:1; }
        .wash-tools { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin:14px 0; }
        .wash-tool { border:2px solid #343756; background:#22243c; color:#fff; border-radius:16px; padding:14px 8px; font-size:16px; font-weight:bold; }
        .wash-tool.active { border-color:#7da9ff; box-shadow:0 0 0 3px rgba(125,169,255,.18); }
        .wash-progress { height:12px; border-radius:20px; background:#292b48; overflow:hidden; margin-top:10px; }
        .wash-progress-fill { height:100%; width:0; background:linear-gradient(90deg,#5ba7ff,#8ed8ff); transition:width .15s; }
        .wash-instruction { color:#c5c8e5; min-height:44px; line-height:1.4; }
        .dragon-game-title { margin-bottom:6px; }
        .dragon-game-subtitle { color:#9da0bd; margin-bottom:16px; font-size:13px; }
        .game-board { display:grid; gap:8px; margin:14px auto; max-width:380px; }
        .game-cell { min-height:72px; border:1px solid #3a3e61; border-radius:14px; background:#242743; color:#fff; font-size:28px; font-weight:bold; }
        .game-cell:disabled { opacity:.75; }
        .game-message { min-height:46px; color:#d9dcff; margin-top:12px; line-height:1.4; }
        .game-action { width:100%; border:0; border-radius:15px; padding:14px; background:#795cff; color:#fff; font-size:16px; font-weight:bold; margin-top:10px; }
        .memory-card.revealed { background:#38406a; }
        .reaction-pad { min-height:190px; display:flex; align-items:center; justify-content:center; border-radius:22px; background:#2b2e49; font-size:52px; margin:18px 0; }
        .reaction-pad.ready { background:#f4d03f; color:#17182c; box-shadow:0 0 28px rgba(244,208,63,.5); }
        .cloud-target { font-size:48px; min-height:80px; }
        .light-cell.active { background:#ffe66d; color:#222; box-shadow:0 0 18px rgba(255,230,109,.55); }
        .star-cell { min-height:68px; }
        .dragon-care-stat.cleanliness span { filter:drop-shadow(0 0 5px rgba(100,190,255,.4)); }
    `;
    document.head.appendChild(style);
}

function renderOwnedDragons() {
    ensureDragonCareData();
    const list = document.getElementById("owned-dragons-list");
    const empty = document.getElementById("no-dragons");
    const count = document.getElementById("owned-dragons-count");
    if (count) count.textContent = ownedDragons.length;
    if (!list) return;
    list.innerHTML = "";
    if (ownedDragons.length === 0) {
        if (empty) empty.style.display = "block";
        return;
    }
    if (empty) empty.style.display = "none";

    ownedDragons.forEach(ownedDragon => {
        const dragon = dragons.find(item => item.id === ownedDragon.id);
        if (!dragon) return;
        const clean = Math.max(0, Math.min(100, ownedDragon.cleanliness));
        const card = document.createElement("div");
        card.className = "owned-dragon-card";
        card.dataset.dragonId = ownedDragon.id;
        card.innerHTML = `
            <div class="owned-dragon-top">
                <div class="owned-dragon-icon">${dragonArtwork(dragon)}</div>
                <div class="owned-dragon-info">
                    <p class="rarity">${dragon.rarity}</p>
                    <h3>${dragon.name}</h3>
                    <p>Élément : ${dragon.element}</p>
                    <span class="dragon-level">Niveau ${ownedDragon.level}</span>
                </div>
            </div>
            <div class="dragon-xp-section">
                <div class="dragon-xp-info"><span>XP</span><b>${ownedDragon.xp} / 100</b></div>
                <div class="dragon-xp-bar"><div class="dragon-xp-fill" style="width:${ownedDragon.xp}%"></div></div>
            </div>
            <div class="dragon-care-stats">
                <div class="dragon-care-stat"><span>🍖</span><small>Faim</small><b>${ownedDragon.hunger}</b></div>
                <div class="dragon-care-stat"><span>❤️</span><small>Bonheur</small><b>${ownedDragon.happiness}</b></div>
                <div class="dragon-care-stat"><span>⚡</span><small>Énergie</small><b>${ownedDragon.energy}</b></div>
                <div class="dragon-care-stat cleanliness"><span>🫧</span><small>Propreté</small><b>${clean}</b></div>
            </div>
            <div class="dragon-care-actions">
                <button onclick="feedDragon('${dragon.id}')" ${ownedDragon.hunger >= 100 ? "disabled" : ""}>🍲 ${ownedDragon.hunger >= 100 ? "Rassasié" : "Nourrir"}</button>
                <button onclick="openWashDragon('${dragon.id}')">🛁 Laver</button>
                <button onclick="playWithDragon('${dragon.id}')">🎮 Jouer</button>
                <button onclick="restDragon('${dragon.id}')">💤 Repos</button>
            </div>
        `;
        list.appendChild(card);
    });
}

function feedDragon(dragonId) {
    const owned = ownedDragons.find(dragon => dragon.id === dragonId);
    const dragon = dragons.find(item => item.id === dragonId);
    if (!owned || !dragon) return;

    if (owned.hunger >= 100) {
        alert(`${dragon.name} est déjà rassasié à 100 %.`);
        return;
    }

    const matchingRecipe = recipes.find(recipe => recipe.element === dragon.element);
    if (!matchingRecipe) {
        alert("Aucun plat adapté à ce dragon.");
        return;
    }
    if (!preparedMeals[matchingRecipe.id] || preparedMeals[matchingRecipe.id] <= 0) {
        alert(`Il te faut ${matchingRecipe.icon} ${matchingRecipe.name} pour nourrir ${dragon.name}.`);
        return;
    }

    preparedMeals[matchingRecipe.id] -= 1;
    owned.hunger = Math.min(100, owned.hunger + 25);
    addDragonXP(owned, 10);
    savePreparedMeals();
    saveOwnedDragons();
    updatePlayerDisplay();
    renderOwnedDragons();
}

function createCareOverlay() {
    let overlay = document.getElementById("dragon-care-overlay");
    if (!overlay) {
        overlay = document.createElement("section");
        overlay.id = "dragon-care-overlay";
        overlay.className = "dragon-care-overlay";
        overlay.style.display = "none";
        document.body.appendChild(overlay);
    }
    return overlay;
}

function closeDragonCareOverlay() {
    const overlay = document.getElementById("dragon-care-overlay");
    if (overlay) {
        overlay.style.display = "none";
        overlay.innerHTML = "";
    }
    washPointerDown = false;
    washCoverage.clear();
    if (dragonGameCleanup) {
        dragonGameCleanup();
        dragonGameCleanup = null;
    }
    activeCareDragonId = null;
}

function openWashDragon(dragonId) {
    ensureDragonCareData();
    const owned = ownedDragons.find(d => d.id === dragonId);
    const dragon = dragons.find(d => d.id === dragonId);
    if (!owned || !dragon) return;

    activeCareDragonId = dragonId;
    washStage = 0;
    washCoverage = new Set();
    const overlay = createCareOverlay();
    overlay.style.display = "block";
    overlay.innerHTML = `
        <div class="dragon-care-shell">
            <div class="dragon-care-top">
                <div><p class="small-title">SOIN DU DRAGON</p><h2>🛁 Laver ${dragon.name}</h2></div>
                <button class="dragon-care-close" onclick="closeDragonCareOverlay()">✕</button>
            </div>
            <div class="wash-card">
                <p id="wash-instruction" class="wash-instruction">💧 Étape 1 : touche l'eau, puis passe ton doigt sur tout le dragon.</p>
                <div id="wash-dragon-zone" class="wash-dragon-zone">
                    <div id="wash-water-effect" class="wash-water-effect"></div>
                    <div class="wash-dragon-icon">${dragonArtwork(dragon)}</div>
                    <div id="wash-foam" class="wash-foam">🫧 🫧 🫧<br>🫧 🫧 🫧<br>🫧 🫧 🫧</div>
                </div>
                <div class="wash-tools">
                    <button id="wash-water-tool" class="wash-tool active" onclick="selectWashTool('water')">💧 Eau</button>
                    <button id="wash-soap-tool" class="wash-tool" onclick="selectWashTool('soap')">🫧 Mousse</button>
                </div>
                <div class="wash-progress"><div id="wash-progress-fill" class="wash-progress-fill"></div></div>
                <p id="wash-progress-text" class="game-message">0 % couvert</p>
            </div>
        </div>
    `;

    const zone = document.getElementById("wash-dragon-zone");
    zone.addEventListener("pointerdown", event => {
        washPointerDown = true;
        zone.setPointerCapture?.(event.pointerId);
        registerWashTouch(event);
    });
    zone.addEventListener("pointermove", event => {
        if (washPointerDown) registerWashTouch(event);
    });
    zone.addEventListener("pointerup", () => { washPointerDown = false; });
    zone.addEventListener("pointercancel", () => { washPointerDown = false; });
}

function selectWashTool(tool) {
    const water = document.getElementById("wash-water-tool");
    const soap = document.getElementById("wash-soap-tool");
    const instruction = document.getElementById("wash-instruction");

    if (washStage === 0 && tool !== "water") {
        if (instruction) instruction.textContent = "💧 Commence d'abord par mouiller le dragon avec l'eau.";
        return;
    }
    if (washStage === 1 && tool !== "soap") {
        if (instruction) instruction.textContent = "🫧 Maintenant, utilise la mousse sur tout le dragon.";
        return;
    }
    if (washStage === 2 && tool !== "water") {
        if (instruction) instruction.textContent = "💧 Termine en rinçant toute la mousse avec l'eau.";
        return;
    }

    water?.classList.toggle("active", tool === "water");
    soap?.classList.toggle("active", tool === "soap");
}

function getCurrentWashTool() {
    return document.getElementById("wash-soap-tool")?.classList.contains("active") ? "soap" : "water";
}

function registerWashTouch(event) {
    const zone = document.getElementById("wash-dragon-zone");
    if (!zone) return;
    const expected = washStage === 1 ? "soap" : "water";
    if (getCurrentWashTool() !== expected) return;

    const rect = zone.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width - 1, event.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height - 1, event.clientY - rect.top));
    const col = Math.floor((x / rect.width) * 5);
    const row = Math.floor((y / rect.height) * 6);
    washCoverage.add(`${col}-${row}`);

    const percent = Math.min(100, Math.round((washCoverage.size / 22) * 100));
    const fill = document.getElementById("wash-progress-fill");
    const text = document.getElementById("wash-progress-text");
    if (fill) fill.style.width = `${percent}%`;
    if (text) text.textContent = `${percent} % couvert`;

    document.getElementById("wash-water-effect")?.classList.toggle("visible", expected === "water");
    if (washStage === 1) document.getElementById("wash-foam")?.classList.add("visible");

    if (percent >= 80) advanceWashStage();
}

function advanceWashStage() {
    const instruction = document.getElementById("wash-instruction");
    const fill = document.getElementById("wash-progress-fill");
    const text = document.getElementById("wash-progress-text");
    washCoverage.clear();
    if (fill) fill.style.width = "0%";
    if (text) text.textContent = "0 % couvert";

    if (washStage === 0) {
        washStage = 1;
        selectWashTool("soap");
        document.getElementById("wash-water-effect")?.classList.remove("visible");
        if (instruction) instruction.textContent = "🫧 Étape 2 : passe maintenant la mousse sur tout le dragon.";
        return;
    }
    if (washStage === 1) {
        washStage = 2;
        selectWashTool("water");
        if (instruction) instruction.textContent = "💧 Étape 3 : rince tout le dragon pour enlever la mousse.";
        return;
    }

    const owned = ownedDragons.find(d => d.id === activeCareDragonId);
    const dragon = dragons.find(d => d.id === activeCareDragonId);
    if (owned) {
        owned.cleanliness = 100;
        addDragonXP(owned, 5);
        saveOwnedDragons();
    }
    document.getElementById("wash-foam")?.classList.remove("visible");
    document.getElementById("wash-water-effect")?.classList.add("visible");
    if (fill) fill.style.width = "100%";
    if (text) text.textContent = "✨ Propreté : 100 %";
    if (instruction) instruction.textContent = `✨ ${dragon ? dragon.name : "Ton dragon"} est tout propre !`;
    washStage = 3;
    setTimeout(() => {
        renderOwnedDragons();
    }, 300);
}

function playWithDragon(dragonId) {
    const owned = ownedDragons.find(d => d.id === dragonId);
    const dragon = dragons.find(d => d.id === dragonId);
    if (!owned || !dragon) return;
    if (owned.energy < 10) {
        alert("Ce dragon est trop fatigué.");
        return;
    }
    openDragonMiniGame(dragonId);
}

function openDragonMiniGame(dragonId) {
    closeDragonCareOverlay();
    const dragon = dragons.find(d => d.id === dragonId);
    const config = dragonMiniGames[dragonId];
    if (!dragon || !config) return;
    activeCareDragonId = dragonId;
    const overlay = createCareOverlay();
    overlay.style.display = "block";
    overlay.innerHTML = `
        <div class="dragon-care-shell">
            <div class="dragon-care-top">
                <div><p class="small-title">JEU AVEC ${dragon.name.toUpperCase()}</p><h2>${config.icon} ${config.name}</h2></div>
                <button class="dragon-care-close" onclick="closeDragonCareOverlay()">✕</button>
            </div>
            <div class="dragon-game-card">
                <div class="owned-dragon-icon" style="font-size:72px;margin-bottom:8px">${dragonArtwork(dragon)}</div>
                <div id="dragon-mini-game"></div>
                <p id="dragon-game-message" class="game-message"></p>
            </div>
        </div>
    `;
    startConfiguredMiniGame(config.type);
}

function completeDragonMiniGame(success, message) {
    const msg = document.getElementById("dragon-game-message");
    if (msg) msg.textContent = message;
    if (!success) return;
    const owned = ownedDragons.find(d => d.id === activeCareDragonId);
    if (!owned || document.getElementById("dragon-mini-game")?.dataset.rewarded === "true") return;
    const game = document.getElementById("dragon-mini-game");
    if (game) game.dataset.rewarded = "true";
    owned.energy = Math.max(0, owned.energy - 10);
    owned.happiness = Math.min(100, owned.happiness + 15);
    owned.cleanliness = Math.max(0, (owned.cleanliness ?? DRAGON_CLEANLINESS_DEFAULT) - 5);
    addDragonXP(owned, 5);
    saveOwnedDragons();
    renderOwnedDragons();
}

function startConfiguredMiniGame(type) {
    if (dragonGameCleanup) dragonGameCleanup();
    dragonGameCleanup = null;
    const host = document.getElementById("dragon-mini-game");
    if (!host) return;
    host.dataset.rewarded = "false";
    const message = document.getElementById("dragon-game-message");
    if (message) message.textContent = "";
    const starters = {
        tictactoe: startTicTacToe,
        memory: startMemoryGame,
        sequence: startSequenceGame,
        clouds: startCloudGame,
        reaction: startReactionGame,
        numbers: startNumberGame,
        rps: startRpsGame,
        shadow: startShadowGame,
        light: startLightGame,
        stars: startStarsGame
    };
    (starters[type] || startTicTacToe)(host);
}

function makeButton(text, className = "game-cell") {
    const button = document.createElement("button");
    button.className = className;
    button.textContent = text;
    return button;
}

// Chaque partie possède ses propres délais et un état terminal unique.
function createMiniGameSession(host, rules, seconds = 0) {
    let finished = false, mistakes = 0;
    const timers = new Set();
    host.innerHTML = "<p class='dragon-game-subtitle'></p>";
    host.firstElementChild.textContent = rules;
    const status = document.createElement("p");
    status.className = "dragon-game-subtitle";
    host.appendChild(status);
    const deadline = seconds ? Date.now() + seconds * 1000 : 0;
    const cancel = () => { finished = true; timers.forEach(clearTimeout); timers.clear(); };
    dragonGameCleanup = cancel;
    const finish = (success, message) => {
        if (finished) return;
        cancel();
        disableAll(host);
        completeDragonMiniGame(success, message);
        const retry = makeButton("Rejouer", "game-action");
        retry.onclick = () => {
            const owned = ownedDragons.find(d => d.id === activeCareDragonId);
            if (!owned || owned.energy < 10) {
                completeDragonMiniGame(false, "Ce dragon est trop fatigué : offre-lui du repos.");
                retry.disabled = true;
                return;
            }
            startConfiguredMiniGame(dragonMiniGames[activeCareDragonId].type);
        };
        host.appendChild(retry);
    };
    const later = (callback, delay) => {
        const timer = setTimeout(() => {
            timers.delete(timer);
            if (!finished) callback();
        }, delay);
        timers.add(timer);
        return timer;
    };
    const tick = () => {
        const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
        status.textContent = "⏳ " + remaining + " s • Erreurs : " + mistakes;
        if (!remaining) finish(false, "Temps écoulé ! Tu peux réessayer.");
        else later(tick, 200);
    };
    if (seconds) tick();
    return {
        get finished() { return finished; },
        finish, later,
        mistake(limit = 3) {
            if (finished) return;
            mistakes++;
            if (!seconds) status.textContent = "Erreurs : " + mistakes + "/" + limit;
            if (mistakes >= limit) finish(false, "Trop d'erreurs ! Observe bien avant de réessayer.");
            else {
                const msg = document.getElementById("dragon-game-message");
                if (msg) msg.textContent = "Erreur " + mistakes + "/" + limit + " : concentre-toi !";
            }
        },
        progress(text) { if (!finished) document.getElementById("dragon-game-message").textContent = text; }
    };
}

function shuffleMiniGame(values) {
    const result = [...values];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

function miniGameBoard(host, columns = 3) {
    const board = document.createElement("div");
    board.className = "game-board";
    board.style.gridTemplateColumns = "repeat(" + columns + ",1fr)";
    host.appendChild(board);
    return board;
}

function chooseDragonMove(state) {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (const symbol of ["🐉", "🔥"]) {
        for (const line of lines) {
            const free = line.filter(i => !state[i]);
            if (free.length === 1 && line.filter(i => state[i] === symbol).length === 2) return free[0];
        }
    }
    if (!state[4]) return 4;
    const corners = shuffleMiniGame([0,2,6,8]).filter(i => !state[i]);
    return corners[0] ?? shuffleMiniGame(state.map((v,i) => v ? null : i).filter(i => i !== null))[0];
}

function startTicTacToe(host) {
    const session = createMiniGameSession(host, "Aligne 3 🔥. Le dragon peut gagner et bloquer tes lignes ; une égalité compte comme une réussite.");
    const board = miniGameBoard(host);
    const state = Array(9).fill("");
    const win = s => [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]].some(a => a.every(i => state[i] === s));
    const outcome = () => {
        if (win("🔥")) { session.finish(true, "🔥 Tu as battu ton dragon !"); return true; }
        if (win("🐉")) { session.finish(false, "🐉 Ton dragon gagne cette manche !"); return true; }
        if (state.every(Boolean)) { session.finish(true, "Belle égalité : ton dragon s'est bien amusé !"); return true; }
        return false;
    };
    for (let i=0; i<9; i++) {
        const b = makeButton("");
        b.onclick = () => {
            if (session.finished || state[i]) return;
            state[i] = b.textContent = "🔥";
            if (outcome()) return;
            const ai = chooseDragonMove(state);
            state[ai] = board.children[ai].textContent = "🐉";
            outcome();
        };
        board.appendChild(b);
    }
}

function startMemoryGame(host) {
    const session = createMiniGameSession(host, "Retrouve 4 paires en 40 s. Maximum 7 mauvaises paires.", 40);
    const values = shuffleMiniGame(["🐟","🐚","💧","🪸","🐟","🐚","💧","🪸"]);
    const board = miniGameBoard(host, 4);
    let first = null, locked = false, found = 0;
    values.forEach(value => {
        const b = makeButton("❓", "game-cell memory-card");
        b.onclick = () => {
            if (session.finished || locked || b.dataset.done || b === first) return;
            b.textContent = value;
            b.classList.add("revealed");
            if (!first) { first = b; return; }
            const previous = first;
            first = null;
            if (previous.textContent === value) {
                previous.dataset.done = b.dataset.done = "1";
                found++;
                session.progress("Paires : " + found + "/4");
                if (found === 4) session.finish(true, "💧 Toutes les paires sont retrouvées !");
            } else {
                session.mistake(7);
                locked = true;
                session.later(() => {
                    previous.textContent = b.textContent = "❓";
                    previous.classList.remove("revealed");
                    b.classList.remove("revealed");
                    locked = false;
                }, 700);
            }
        };
        board.appendChild(b);
    });
}

function startSequenceGame(host) {
    const session = createMiniGameSession(host, "Mémorise la suite durant 3 s, puis reproduis-la. Deux manches : 4 puis 5 symboles. Maximum 3 erreurs.");
    const symbols = ["🌿","🍃","🌸","🌱"];
    const preview = document.createElement("p");
    host.appendChild(preview);
    const board = miniGameBoard(host, 4);
    let sequence = [], step = 0, round = 0, observing = true;
    const show = () => {
        observing = true;
        step = 0;
        sequence = Array.from({length: 4 + round}, () => symbols[Math.floor(Math.random() * 4)]);
        preview.textContent = sequence.join(" ");
        disableAll(board);
        session.later(() => {
            observing = false;
            preview.textContent = "À toi ! Manche " + (round + 1) + "/2";
            Array.from(board.children).forEach(b => b.disabled = false);
        }, 3000);
    };
    symbols.forEach(symbol => {
        const b = makeButton(symbol);
        b.onclick = () => {
            if (session.finished || observing) return;
            if (symbol !== sequence[step]) {
                session.mistake();
                step = 0;
                session.progress("Reprends cette suite depuis le début.");
                return;
            }
            step++;
            session.progress("Suite : " + step + "/" + sequence.length);
            if (step === sequence.length) {
                if (++round === 2) session.finish(true, "🌿 Les deux suites sont mémorisées !");
                else show();
            }
        };
        board.appendChild(b);
    });
    show();
}

function startCloudGame(host) {
    const session = createMiniGameSession(host, "Attrape 8 nuages en 12 s. Chaque nuage change de case toutes les 900 ms. Maximum 3 erreurs.", 12);
    const board = miniGameBoard(host);
    let target = -1, hits = 0, generation = 0;
    const draw = () => {
        const current = ++generation;
        const choices = Array.from({length:9}, (_,i) => i).filter(i => i !== target);
        target = choices[Math.floor(Math.random() * choices.length)];
        board.innerHTML = "";
        for (let i=0;i<9;i++) {
            const b = makeButton(i === target ? "☁️" : "·");
            b.onclick = () => {
                if (session.finished || current !== generation) return;
                if (i !== target) { session.mistake(); return; }
                if (++hits === 8) session.finish(true, "🌪️ Les huit nuages sont capturés !");
                else { session.progress("Nuages : " + hits + "/8"); draw(); }
            };
            board.appendChild(b);
        }
        session.later(() => { if (current === generation) draw(); }, 900);
    };
    draw();
}

function startReactionGame(host) {
    const session = createMiniGameSession(host, "Réagis à 3 éclairs en moins de 900 ms chacun. Appuyer avant le signal termine la partie.");
    const pad = makeButton("⏳", "reaction-pad");
    host.appendChild(pad);
    let ready = false, round = 0, signalAt = 0, generation = 0;
    const prepare = () => {
        const current = ++generation;
        ready = false;
        pad.classList.remove("ready");
        pad.textContent = "⏳";
        session.later(() => {
            ready = true;
            signalAt = Date.now();
            pad.classList.add("ready");
            pad.textContent = "⚡";
            session.later(() => {
                if (ready && current === generation) session.finish(false, "Éclair manqué : réagis en moins de 900 ms.");
            }, 900);
        }, 1000 + Math.random() * 2200);
    };
    pad.onclick = () => {
        if (session.finished) return;
        if (!ready) { session.finish(false, "Trop tôt ! Attends l'éclair."); return; }
        if (Date.now() - signalAt >= 900) { session.finish(false, "Trop tard !"); return; }
        ready = false;
        if (++round === 3) session.finish(true, "⚡ Trois éclairs, trois bons réflexes !");
        else { session.progress("Éclairs : " + round + "/3"); prepare(); }
    };
    prepare();
}

function startOrderedDragonGame(host, stars) {
    const count = stars ? 8 : 9;
    const session = createMiniGameSession(host, stars
        ? "Mémorise 8 étoiles pendant 4 s, puis touche-les dans l'ordre. Maximum 3 erreurs."
        : "Touche les 9 cristaux dans l'ordre en 18 s. Maximum 3 erreurs.", stars ? 0 : 18);
    const board = miniGameBoard(host);
    let next = 1, observing = stars;
    shuffleMiniGame(Array.from({length:count}, (_,i) => i+1)).forEach(n => {
        const b = makeButton((stars ? "⭐ " : "❄️ ") + n, stars ? "game-cell star-cell" : "game-cell");
        b.disabled = stars;
        b.onclick = () => {
            if (session.finished || observing || b.disabled) return;
            if (n !== next) { session.mistake(); return; }
            b.disabled = true;
            b.textContent = "✨";
            next++;
            session.progress((stars ? "Étoiles : " : "Cristaux : ") + (next-1) + "/" + count);
            if (next > count) session.finish(true, stars ? "🌌 Constellation mémorisée !" : "❄️ Cristaux ordonnés !");
        };
        board.appendChild(b);
    });
    if (stars) session.later(() => {
        observing = false;
        Array.from(board.children).forEach(b => { b.textContent = "⭐"; b.disabled = false; });
        session.progress("À toi ! Les numéros sont maintenant cachés.");
    }, 4000);
}
function startNumberGame(host) { startOrderedDragonGame(host, false); }
function startStarsGame(host) { startOrderedDragonGame(host, true); }

function startRpsGame(host) {
    const session = createMiniGameSession(host, "Duel au meilleur des 5 : remporte 3 manches avant le dragon. Les égalités ne comptent pas.");
    const choices = [["🪨","pierre"],["📄","feuille"],["✂️","ciseaux"]];
    const beats = {pierre:"ciseaux", feuille:"pierre", ciseaux:"feuille"};
    const board = miniGameBoard(host);
    let wins = 0, losses = 0;
    choices.forEach(([icon,key]) => {
        const b = makeButton(icon);
        b.onclick = () => {
            if (session.finished) return;
            const dragon = choices[Math.floor(Math.random()*3)][1];
            if (key !== dragon) {
                if (beats[key] === dragon) wins++; else losses++;
            }
            session.progress("Dragon : " + dragon + " • Toi " + wins + " – " + losses + " Dragon");
            if (wins === 3) session.finish(true, "🪨 Duel remporté !");
            else if (losses === 3) session.finish(false, "Le dragon remporte le duel !");
        };
        board.appendChild(b);
    });
}

function startShadowGame(host) {
    const session = createMiniGameSession(host, "Observe l'ombre 🌑 durant 1 s, puis retrouve sa case cachée. 4 manches, maximum 3 erreurs.");
    const board = miniGameBoard(host);
    let round = 0, target = 0, observing = true;
    const draw = () => {
        observing = true;
        target = Math.floor(Math.random()*9);
        board.innerHTML = "";
        for (let i=0;i<9;i++) {
            const b = makeButton(i === target ? "🌑" : "🌘");
            b.disabled = true;
            b.onclick = () => {
                if (session.finished || observing) return;
                if (i !== target) { b.disabled = true; session.mistake(); return; }
                if (++round === 4) session.finish(true, "🌑 Les quatre ombres sont retrouvées !");
                else { session.progress("Ombres : " + round + "/4"); draw(); }
            };
            board.appendChild(b);
        }
        session.later(() => {
            observing = false;
            Array.from(board.children).forEach(b => { b.textContent = "🌘"; b.disabled = false; });
        }, 1000);
    };
    draw();
}

function startLightGame(host) {
    const session = createMiniGameSession(host, "Capture 8 rayons en 15 s. La lumière change de case toutes les 1,2 s. Maximum 3 erreurs.", 15);
    const board = miniGameBoard(host);
    let score = 0, generation = 0, previous = -1;
    const draw = () => {
        const current = ++generation;
        const choices = Array.from({length:9}, (_,i) => i).filter(i => i !== previous);
        const target = choices[Math.floor(Math.random()*choices.length)];
        previous = target;
        board.innerHTML = "";
        for (let i=0;i<9;i++) {
            const b = makeButton(i === target ? "☀️" : "·", i === target ? "game-cell light-cell active" : "game-cell");
            b.onclick = () => {
                if (session.finished || current !== generation) return;
                if (i !== target) { session.mistake(); return; }
                if (++score === 8) session.finish(true, "☀️ Tous les rayons sont capturés !");
                else { session.progress("Rayons : " + score + "/8"); draw(); }
            };
            board.appendChild(b);
        }
        session.later(() => { if (current === generation) draw(); }, 1200);
    };
    draw();
}

function disableAll(container) {
    container.querySelectorAll("button").forEach(button => button.disabled = true);
}

(function initDragonCare() {
    injectDragonCareStyles();
    ensureDragonCareData();
    renderOwnedDragons();
})();
