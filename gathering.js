// ======================================================
// DRACONIA - GESTION DES MINI-JEUX
// Extrait de l'ancien script principal, ordre de chargement conservé.
// ======================================================

// MINI-JEUX DE RÉCOLTE 🎮
// ======================================================

let currentGatheringGame = null;


// ======================================================
// FORÊT 🌲
// ======================================================

let forestMushrooms = [
    true,
    true,
    true,
    true,
    true,
    true,
    true
];

let forestMushroomTimers = [
    null,
    null,
    null,
    null,
    null,
    null,
    null
];

let forestDropCounter = 0;
let forestTreeShakeCooldown = false;


// ======================================================
// PÊCHE 🎣
// ======================================================

let fishingArrowPosition = 0;
let fishingArrowDirection = 1;
let fishingInterval = null;
let fishingActive = false;
let fishingGreenStart = 30;
let fishingGreenWidth = 25;


// ======================================================
// PLAINES 🌾
// ======================================================

const PLAINS_GROWTH_TIME = 60000;

let plainsSelectedTool = null;

let plainsPlants = [
    {
        watered: false,
        ready: false
    },
    {
        watered: false,
        ready: false
    },
    {
        watered: false,
        ready: false
    },
    {
        watered: false,
        ready: false
    }
];

let plainsGrowthStartTime = null;
let plainsGrowthInterval = null;


// ======================================================
// CHASSE 🏹
// ======================================================

let huntingDuckVisible = false;
let huntingDuckTimer = null;
let huntingDuckHideTimer = null;


// ======================================================
// OUVRIR UN MINI-JEU
// ======================================================

function openGatheringGame(gameName) {
    const gameWindow =
        document.getElementById(
            "gathering-game"
        );

    if (!gameWindow) {
        return;
    }

    currentGatheringGame =
        gameName;

    gameWindow.style.display =
        "block";

    const miniGames =
        document.querySelectorAll(
            ".mini-game"
        );

    miniGames.forEach(
        game => {
            game.style.display =
                "none";
        }
    );

    const selectedGame =
        document.getElementById(
            `${gameName}-game`
        );

    if (selectedGame) {
        selectedGame.style.display =
            "block";
    }

    document.body.style.overflow =
        "hidden";

    if (gameName === "forest") {
        renderForestMushrooms();
    }

    if (gameName === "plains") {
        startPlainsGame();
    }

    if (gameName === "fishing") {
        startFishingGame();
    }

    if (gameName === "hunting") {
        startHuntingGame();
    }
}


// ======================================================
// FERMER LE MINI-JEU
// ======================================================

function closeGatheringGame() {
    const gameWindow =
        document.getElementById(
            "gathering-game"
        );

    if (gameWindow) {
        gameWindow.style.display =
            "none";
    }

    document.body.style.overflow =
        "";

    if (
        currentGatheringGame ===
        "fishing"
    ) {
        stopFishingGame();
    }

    if (
        currentGatheringGame ===
        "hunting"
    ) {
        stopHuntingGame();
    }

    clearForestDrops();

    currentGatheringGame = null;
}


