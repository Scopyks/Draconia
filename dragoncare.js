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

function startTicTacToe(host) {
    host.innerHTML = "<p class='dragon-game-subtitle'>Aligne 3 🔥 avant ton dragon.</p>";
    const board = document.createElement("div"); board.className = "game-board"; board.style.gridTemplateColumns = "repeat(3,1fr)";
    const state = Array(9).fill("");
    const win = s => [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]].some(a => a.every(i => state[i] === s));
    for (let i=0;i<9;i++) {
        const b=makeButton(""); board.appendChild(b);
        b.onclick=()=>{
            if(state[i] || host.dataset.rewarded==="true") return;
            state[i]="🔥"; b.textContent="🔥";
            if(win("🔥")){ completeDragonMiniGame(true,"🔥 Gagné ! Ton dragon s'est bien amusé."); disableAll(board); return; }
            const free=state.map((v,j)=>v?null:j).filter(v=>v!==null);
            if(!free.length){ completeDragonMiniGame(false,"Égalité ! Tu peux fermer et rejouer."); return; }
            const ai=free[Math.floor(Math.random()*free.length)]; state[ai]="🐉"; board.children[ai].textContent="🐉";
            if(win("🐉")){ completeDragonMiniGame(false,"🐉 Ton dragon gagne cette manche !"); disableAll(board); }
        };
    }
    host.appendChild(board);
}

function startMemoryGame(host) {
    host.innerHTML="<p class='dragon-game-subtitle'>Retrouve les 3 paires aquatiques.</p>";
    const vals=["🐟","🐚","💧","🐟","🐚","💧"].sort(()=>Math.random()-.5); let first=null, lock=false, found=0;
    const board=document.createElement("div"); board.className="game-board"; board.style.gridTemplateColumns="repeat(3,1fr)";
    vals.forEach((v,i)=>{ const b=makeButton("❓","game-cell memory-card"); b.onclick=()=>{ if(lock||b.dataset.done||b===first)return; b.textContent=v; b.classList.add("revealed"); if(!first){first=b;return;} if(first.textContent===v){first.dataset.done=b.dataset.done="1";found++;first=null;if(found===3)completeDragonMiniGame(true,"💧 Toutes les paires sont retrouvées !");}else{lock=true;setTimeout(()=>{first.textContent=b.textContent="❓";first.classList.remove("revealed");b.classList.remove("revealed");first=null;lock=false;},650);} }; board.appendChild(b); });
    host.appendChild(board);
}

function startSequenceGame(host) {
    const symbols=["🌿","🍃","🌸","🌱"]; const seq=Array.from({length:5},()=>symbols[Math.floor(Math.random()*symbols.length)]); let step=0;
    host.innerHTML=`<p class='dragon-game-subtitle'>Reproduis cette suite : <b>${seq.join(" ")}</b></p>`;
    const board=document.createElement("div"); board.className="game-board"; board.style.gridTemplateColumns="repeat(4,1fr)";
    symbols.forEach(s=>{const b=makeButton(s);b.onclick=()=>{if(s===seq[step]){step++;if(step===seq.length)completeDragonMiniGame(true,"🌿 Suite parfaite !");}else{step=0;document.getElementById("dragon-game-message").textContent="🍃 Raté, recommence depuis le début.";}};board.appendChild(b);});host.appendChild(board);
}

function startCloudGame(host) {
    host.innerHTML="<p class='dragon-game-subtitle'>Attrape 6 nuages avant la fin du temps.</p><div id='cloud-target' class='reaction-pad cloud-target'>☁️</div>"; let hits=0; const target=document.getElementById("cloud-target");
    const move=()=>{target.style.transform=`translate(${Math.floor(Math.random()*90-45)}px,${Math.floor(Math.random()*45-22)}px)`;}; target.onclick=()=>{hits++;move();document.getElementById("dragon-game-message").textContent=`☁️ ${hits}/6`;if(hits>=6){clearTimeout(timer);completeDragonMiniGame(true,"🌪️ Tous les nuages sont attrapés !");target.onclick=null;}}; move(); const timer=setTimeout(()=>{if(hits<6)completeDragonMiniGame(false,"💨 Trop tard, les nuages se sont envolés.");target.onclick=null;},7000); dragonGameCleanup=()=>clearTimeout(timer);
}

function startReactionGame(host) {
    host.innerHTML="<p class='dragon-game-subtitle'>N'appuie que lorsque l'éclair apparaît !</p><button id='reaction-pad' class='reaction-pad'>⏳</button>"; const pad=document.getElementById("reaction-pad"); let ready=false,finished=false;
    const timer=setTimeout(()=>{ready=true;pad.classList.add("ready");pad.textContent="⚡";},1200+Math.random()*2200); pad.onclick=()=>{if(finished)return;if(!ready){finished=true;clearTimeout(timer);pad.textContent="💥";completeDragonMiniGame(false,"Trop tôt ! L'éclair n'était pas encore là.");}else{finished=true;pad.textContent="⚡✅";completeDragonMiniGame(true,"⚡ Réflexe parfait !");}}; dragonGameCleanup=()=>clearTimeout(timer);
}

function startNumberGame(host) {
    const nums=[1,2,3,4,5].sort(()=>Math.random()-.5);let next=1;host.innerHTML="<p class='dragon-game-subtitle'>Touche les cristaux dans l'ordre de 1 à 5.</p>";const board=document.createElement("div");board.className="game-board";board.style.gridTemplateColumns="repeat(3,1fr)";nums.forEach(n=>{const b=makeButton(`❄️ ${n}`);b.onclick=()=>{if(n!==next){document.getElementById("dragon-game-message").textContent="🧊 Mauvais cristal !";return;}b.disabled=true;next++;if(next===6)completeDragonMiniGame(true,"❄️ Les cristaux sont parfaitement ordonnés !");};board.appendChild(b);});host.appendChild(board);
}

function startRpsGame(host) {
    host.innerHTML="<p class='dragon-game-subtitle'>Bats ton dragon au duel : pierre, feuille ou ciseaux.</p>";const choices=[["🪨","pierre"],["📄","feuille"],["✂️","ciseaux"]];const board=document.createElement("div");board.className="game-board";board.style.gridTemplateColumns="repeat(3,1fr)";const beats={pierre:"ciseaux",feuille:"pierre",ciseaux:"feuille"};choices.forEach(([icon,key])=>{const b=makeButton(icon);b.onclick=()=>{const d=choices[Math.floor(Math.random()*3)][1];if(key===d){document.getElementById("dragon-game-message").textContent=`Égalité ! Le dragon choisit ${d}. Rejoue.`;}else if(beats[key]===d){completeDragonMiniGame(true,`🪨 Gagné ! Le dragon avait choisi ${d}.`);disableAll(board);}else{document.getElementById("dragon-game-message").textContent=`Perdu ! Le dragon choisit ${d}. Essaie encore.`;}};board.appendChild(b);});host.appendChild(board);
}

function startShadowGame(host) {
    let round=0;host.innerHTML="<p class='dragon-game-subtitle'>Trouve l'ombre cachée 3 fois.</p>";const board=document.createElement("div");board.className="game-board";board.style.gridTemplateColumns="repeat(3,1fr)";host.appendChild(board);const draw=()=>{board.innerHTML="";const target=Math.floor(Math.random()*9);for(let i=0;i<9;i++){const b=makeButton(i===target?"🌑":"🌘");b.onclick=()=>{if(i===target){round++;if(round===3){completeDragonMiniGame(true,"🌑 Toutes les ombres sont trouvées !");disableAll(board);}else draw();}else document.getElementById("dragon-game-message").textContent="🌘 Ce n'était pas la bonne ombre.";};board.appendChild(b);}};draw();
}

function startLightGame(host) {
    let score=0;host.innerHTML="<p class='dragon-game-subtitle'>Touche uniquement la case lumineuse, 5 fois.</p>";const board=document.createElement("div");board.className="game-board";board.style.gridTemplateColumns="repeat(3,1fr)";host.appendChild(board);const draw=()=>{board.innerHTML="";const target=Math.floor(Math.random()*9);for(let i=0;i<9;i++){const b=makeButton(i===target?"☀️":"·",`game-cell ${i===target?"light-cell active":""}`);b.onclick=()=>{if(i!==target){document.getElementById("dragon-game-message").textContent="✨ Cherche la lumière !";return;}score++;if(score>=5){completeDragonMiniGame(true,"☀️ Tous les rayons sont capturés !");disableAll(board);}else draw();};board.appendChild(b);}};draw();
}

function startStarsGame(host) {
    const order=[1,2,3,4,5,6];const shuffled=[...order].sort(()=>Math.random()-.5);let next=1;host.innerHTML="<p class='dragon-game-subtitle'>Relie la constellation en touchant les étoiles de 1 à 6.</p>";const board=document.createElement("div");board.className="game-board";board.style.gridTemplateColumns="repeat(3,1fr)";shuffled.forEach(n=>{const b=makeButton(`⭐ ${n}`,"game-cell star-cell");b.onclick=()=>{if(n!==next){document.getElementById("dragon-game-message").textContent="🌌 Mauvaise étoile, suis les numéros.";return;}b.disabled=true;b.textContent="✨";next++;if(next===7)completeDragonMiniGame(true,"🌌 Constellation terminée !");};board.appendChild(b);});host.appendChild(board);
}

function disableAll(container) {
    container.querySelectorAll("button").forEach(button => button.disabled = true);
}

(function initDragonCare() {
    injectDragonCareStyles();
    ensureDragonCareData();
    renderOwnedDragons();
})();
