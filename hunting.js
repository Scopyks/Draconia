// ======================================================
// DRACONIA - MINI-JEU DE CHASSE 🏹
// ======================================================

/*
 * Ce fichier est chargé après script.js.
 * Il transforme la chasse en mini-jeu de réflexe :
 * le joueur doit toucher directement le canard avant qu'il disparaisse.
 */

let huntingSpawnTimer = null;
let huntingEscapeTimer = null;
let huntingDuckCaught = false;

function startHuntingGame() {
    stopHuntingGame();

    huntingDuckVisible = false;
    huntingDuckCaught = false;

    const duck = document.getElementById("hunting-duck");
    const bow = document.getElementById("hunting-bow");
    const status = document.getElementById("hunting-status");
    const message = document.getElementById("hunting-game-message");

    if (duck) {
        duck.style.display = "none";
        duck.style.position = "absolute";
        duck.style.fontSize = "54px";
        duck.style.cursor = "pointer";
        duck.style.userSelect = "none";
        duck.style.webkitUserSelect = "none";
        duck.style.touchAction = "manipulation";
        duck.style.zIndex = "20";
        duck.style.filter = "drop-shadow(0 5px 5px rgba(0, 0, 0, 0.45))";
        duck.onclick = catchHuntingDuck;
    }

    // L'ancien bouton Tirer n'est plus utile :
    // il faut maintenant toucher directement le canard.
    if (bow) bow.style.display = "none";

    if (status) {
        status.textContent = "👀 Observe bien la zone... touche le canard dès qu'il apparaît !";
    }

    if (message) message.textContent = "";

    scheduleHuntingDuck();
}

function scheduleHuntingDuck() {
    if (currentGatheringGame !== "hunting") return;

    if (huntingSpawnTimer) clearTimeout(huntingSpawnTimer);

    // Le canard revient après environ 5 à 11 secondes.
    // Le délai change à chaque fois pour éviter de pouvoir prévoir son apparition.
    const delay = 5000 + Math.random() * 6000;

    huntingSpawnTimer = setTimeout(function() {
        if (currentGatheringGame === "hunting") showHuntingDuck();
    }, delay);
}

function showHuntingDuck() {
    const duck = document.getElementById("hunting-duck");
    const field = document.getElementById("hunting-field");
    const status = document.getElementById("hunting-status");

    if (!duck || !field) return;

    huntingDuckVisible = true;
    huntingDuckCaught = false;

    const duckSize = 70;
    const maxX = Math.max(field.clientWidth - duckSize, 20);
    const maxY = Math.max(field.clientHeight - duckSize, 50);
    const x = 10 + Math.random() * Math.max(maxX - 20, 10);
    const y = 10 + Math.random() * Math.max(maxY - 20, 10);

    duck.style.left = `${x}px`;
    duck.style.top = `${y}px`;
    duck.style.display = "block";
    duck.style.transform = "scale(1)";

    if (status) status.textContent = "🦆 VITE ! Touche le canard !";

    // Difficulté augmentée : le canard reste visible entre 0,45 et 0,75 seconde.
    // Le temps varie à chaque apparition pour garder le mini-jeu imprévisible.
    const visibleTime = 450 + Math.random() * 300;

    huntingEscapeTimer = setTimeout(function() {
        if (huntingDuckVisible && !huntingDuckCaught) {
            huntingDuckVisible = false;
            duck.style.display = "none";

            if (status) {
                status.textContent = "💨 Trop tard ! Le canard s'est envolé...";
            }

            const message = document.getElementById("hunting-game-message");
            if (message) {
                message.textContent = "Aucune viande récoltée cette fois.";
            }

            scheduleHuntingDuck();
        }
    }, visibleTime);
}

function catchHuntingDuck(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    if (!huntingDuckVisible || huntingDuckCaught) return;

    huntingDuckCaught = true;
    huntingDuckVisible = false;

    if (huntingEscapeTimer) {
        clearTimeout(huntingEscapeTimer);
        huntingEscapeTimer = null;
    }

    const duck = document.getElementById("hunting-duck");
    const status = document.getElementById("hunting-status");
    const message = document.getElementById("hunting-game-message");

    if (duck) {
        duck.style.transform = "scale(0.75)";
        setTimeout(function() {
            duck.style.display = "none";
            duck.style.transform = "scale(1)";
        }, 120);
    }

    addResource("meat", 1);
    addPlayerXP(3);

    if (status) status.textContent = "🎯 Bien joué ! Canard attrapé !";
    if (message) message.textContent = "🍖 +1 viande ajoutée dans ton sac !";

    scheduleHuntingDuck();
}

function stopHuntingGame() {
    huntingDuckVisible = false;
    huntingDuckCaught = false;

    if (huntingSpawnTimer) {
        clearTimeout(huntingSpawnTimer);
        huntingSpawnTimer = null;
    }

    if (huntingEscapeTimer) {
        clearTimeout(huntingEscapeTimer);
        huntingEscapeTimer = null;
    }

    // Nettoie aussi les anciens minuteurs du script principal.
    if (huntingDuckTimer) {
        clearTimeout(huntingDuckTimer);
        huntingDuckTimer = null;
    }

    if (huntingDuckHideTimer) {
        clearTimeout(huntingDuckHideTimer);
        huntingDuckHideTimer = null;
    }

    const duck = document.getElementById("hunting-duck");
    if (duck) duck.style.display = "none";
}
