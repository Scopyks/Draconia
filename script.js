// ======================================================
// DRACONIA 🐉
// SCRIPT PRINCIPAL
// ======================================================


// ======================================================
// LISTE DES DRAGONS 🐉
// ======================================================

const dragons = [
    {
        id: "dragon-feu",
        name: "Flamio",
        element: "Feu",
        rarity: "Commun",
        icon: "🔥🐉"
    },
    {
        id: "dragon-eau",
        name: "Aquaria",
        element: "Eau",
        rarity: "Commun",
        icon: "💧🐉"
    },
    {
        id: "dragon-nature",
        name: "Floragon",
        element: "Nature",
        rarity: "Peu commun",
        icon: "🌿🐉"
    },
    {
        id: "dragon-air",
        name: "Aéris",
        element: "Air",
        rarity: "Peu commun",
        icon: "🌪️🐉"
    },
    {
        id: "dragon-foudre",
        name: "Voltix",
        element: "Foudre",
        rarity: "Rare",
        icon: "⚡🐉"
    },
    {
        id: "dragon-glace",
        name: "Givrax",
        element: "Glace",
        rarity: "Rare",
        icon: "❄️🐉"
    },
    {
        id: "dragon-terre",
        name: "Rocdor",
        element: "Terre",
        rarity: "Commun",
        icon: "🪨🐉"
    },
    {
        id: "dragon-ombre",
        name: "Noctis",
        element: "Ombre",
        rarity: "Épique",
        icon: "🌑🐉"
    },
    {
        id: "dragon-lumiere",
        name: "Solarys",
        element: "Lumière",
        rarity: "Épique",
        icon: "☀️🐉"
    },
    {
        id: "dragon-cosmique",
        name: "Cosmix",
        element: "Cosmique",
        rarity: "Légendaire",
        icon: "🌌🐉"
    }
];


// ======================================================
// DONNÉES DU JOUEUR
// ======================================================

let player = {
    coins: 100,
    food: 10,
    xp: 0,
    level: 1
};


// ======================================================
// INVENTAIRE DES RESSOURCES
// ======================================================

let inventory = {
    meat: 0,
    fish: 0,
    apple: 0,
    berry: 0,
    herb: 0,
    mushroom: 0,
    vegetable: 0,
    insect: 0
};

const INVENTORY_STORAGE_KEY =
    "draconiaInventory";


// ======================================================
// PLATS CUISINÉS 🍲
// ======================================================

let preparedMeals = {
    flame_stew: 0,
    deep_soup: 0,
    wild_salad: 0,
    berry_cloud: 0,
    electric_stew: 0,
    crystal_sorbet: 0,
    mountain_stew: 0,
    night_elixir: 0,
    solar_nectar: 0,
    cosmic_cake: 0
};

const MEALS_STORAGE_KEY =
    "draconiaPreparedMeals";


// ======================================================
// RECETTES 🍲
// ======================================================

const recipes = [
    {
        id: "flame_stew",
        name: "Ragoût flamboyant",
        icon: "🔥",
        element: "Feu",
        description:
            "Un plat épicé qui réchauffe les dragons de Feu.",
        ingredients: {
            meat: 1,
            herb: 1
        }
    },
    {
        id: "deep_soup",
        name: "Soupe des profondeurs",
        icon: "💧",
        element: "Eau",
        description:
            "Une soupe fraîche préparée avec les trésors du lac.",
        ingredients: {
            fish: 1,
            herb: 1
        }
    },
    {
        id: "wild_salad",
        name: "Salade sauvage",
        icon: "🌿",
        element: "Nature",
        description:
            "Un mélange de fruits et de plantes sauvages.",
        ingredients: {
            apple: 1,
            berry: 1,
            herb: 1
        }
    },
    {
        id: "berry_cloud",
        name: "Nuage de baies",
        icon: "🌪️",
        element: "Air",
        description:
            "Une préparation légère adorée par les dragons du ciel.",
        ingredients: {
            berry: 2,
            insect: 1
        }
    },
    {
        id: "electric_stew",
        name: "Ragoût électrique",
        icon: "⚡",
        element: "Foudre",
        description:
            "Un plat énergisant pour les dragons de Foudre.",
        ingredients: {
            fish: 1,
            mushroom: 1
        }
    },
    {
        id: "crystal_sorbet",
        name: "Sorbet cristallin",
        icon: "❄️",
        element: "Glace",
        description:
            "Un dessert fruité et glacé.",
        ingredients: {
            berry: 2,
            apple: 1
        }
    },
    {
        id: "mountain_stew",
        name: "Ragoût de montagne",
        icon: "🪨",
        element: "Terre",
        description:
            "Un plat copieux pour les dragons robustes.",
        ingredients: {
            meat: 1,
            vegetable: 1,
            mushroom: 1
        }
    },
    {
        id: "night_elixir",
        name: "Élixir nocturne",
        icon: "🌑",
        element: "Ombre",
        description:
            "Une mystérieuse préparation aux ingrédients sauvages.",
        ingredients: {
            mushroom: 2,
            insect: 1
        }
    },
    {
        id: "solar_nectar",
        name: "Nectar solaire",
        icon: "☀️",
        element: "Lumière",
        description:
            "Un nectar fruité rempli d'énergie.",
        ingredients: {
            apple: 2,
            berry: 1,
            herb: 1
        }
    },
    {
        id: "cosmic_cake",
        name: "Gâteau cosmique",
        icon: "🌌",
        element: "Cosmique",
        description:
            "Une recette exceptionnelle pour les dragons légendaires.",
        ingredients: {
            fish: 1,
            apple: 1,
            mushroom: 1,
            insect: 1
        }
    }
];


// ======================================================
// NOMS DES RESSOURCES
// ======================================================

const resourceNames = {
    meat: "🍖 Viande",
    fish: "🐟 Poisson",
    apple: "🍎 Pomme",
    berry: "🍓 Baie",
    herb: "🌿 Herbe",
    mushroom: "🍄 Champignon",
    vegetable: "🥕 Légume",
    insect: "🐛 Insecte"
};


// ======================================================
// MÉTÉO
// ======================================================

const WEATHER_STORAGE_KEY =
    "draconiaDailyWeatherV2";

const weatherTypes = [
    {
        id: "sunny",
        name: "Ensoleillé",
        icon: "☀️",
        minTemp: 18,
        maxTemp: 28
    },
    {
        id: "cloudy",
        name: "Nuageux",
        icon: "☁️",
        minTemp: 12,
        maxTemp: 21
    },
    {
        id: "rain",
        name: "Pluvieux",
        icon: "🌧️",
        minTemp: 8,
        maxTemp: 17
    },
    {
        id: "storm",
        name: "Orageux",
        icon: "⛈️",
        minTemp: 14,
        maxTemp: 22
    },
    {
        id: "snow",
        name: "Neigeux",
        icon: "🌨️",
        minTemp: -3,
        maxTemp: 5
    },
    {
        id: "fog",
        name: "Brouillard",
        icon: "🌫️",
        minTemp: 5,
        maxTemp: 14
    },
    {
        id: "wind",
        name: "Venteux",
        icon: "🌪️",
        minTemp: 10,
        maxTemp: 20
    }
];

let dailyWeather = null;


// ======================================================
// HEURE ET DATE DE FRANCE 🇫🇷
// ======================================================

function getFranceDateParts() {
    const parts = new Intl.DateTimeFormat(
        "fr-FR",
        {
            timeZone: "Europe/Paris",
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }
    ).formatToParts(new Date());

    const result = {};

    parts.forEach(part => {
        if (part.type !== "literal") {
            result[part.type] = part.value;
        }
    });

    return result;
}


function getFranceHour() {
    const parts = new Intl.DateTimeFormat(
        "fr-FR",
        {
            timeZone: "Europe/Paris",
            hour: "2-digit",
            hour12: false
        }
    ).formatToParts(new Date());

    const hourPart =
        parts.find(
            part => part.type === "hour"
        );

    return Number(hourPart.value);
}


function getTodayDate() {
    const parts = getFranceDateParts();

    return `${parts.year}-${parts.month}-${parts.day}`;
}


// ======================================================
// JOUR / NUIT
// ======================================================

function isNight() {
    const hour = getFranceHour();

    return hour >= 21 || hour < 6;
}


// ======================================================
// TEMPÉRATURE
// ======================================================

function generateTemperature(weather) {
    const min = weather.minTemp;
    const max = weather.maxTemp;

    return Math.floor(
        Math.random() *
        (max - min + 1)
    ) + min;
}


// ======================================================
// GÉNÉRATION DE LA MÉTÉO DU JOUR
// ======================================================

function generateDailyWeather() {
    const today = getTodayDate();

    const savedWeather =
        localStorage.getItem(
            WEATHER_STORAGE_KEY
        );

    if (savedWeather) {
        try {
            const parsed =
                JSON.parse(savedWeather);

            if (
                parsed &&
                parsed.date === today &&
                parsed.weather
            ) {
                const existingWeather =
                    weatherTypes.find(
                        weather =>
                            weather.id ===
                            parsed.weather
                    );

                if (existingWeather) {
                    dailyWeather = {
                        ...existingWeather,
                        temperature:
                            parsed.temperature
                    };

                    return;
                }
            }
        } catch (error) {
            console.log(
                "Ancienne météo ignorée."
            );
        }
    }

    const randomIndex =
        Math.floor(
            Math.random() *
            weatherTypes.length
        );

    const selectedWeather =
        weatherTypes[randomIndex];

    const temperature =
        generateTemperature(
            selectedWeather
        );

    dailyWeather = {
        ...selectedWeather,
        temperature
    };

    localStorage.setItem(
        WEATHER_STORAGE_KEY,
        JSON.stringify({
            date: today,
            weather: dailyWeather.id,
            temperature:
                dailyWeather.temperature
        })
    );
}


// ======================================================
// AFFICHAGE DE LA MÉTÉO
// ======================================================

function updateWeatherDisplay() {
    const weatherElement =
        document.getElementById(
            "weather"
        );

    const temperatureElement =
        document.getElementById(
            "temperature"
        );

    if (!weatherElement) {
        return;
    }

    if (!dailyWeather) {
        generateDailyWeather();
    }

    if (
        temperatureElement &&
        dailyWeather.temperature !== undefined
    ) {
        temperatureElement.textContent =
            `${dailyWeather.temperature}°`;
    }

    if (isNight()) {
        if (
            dailyWeather.id ===
            "sunny"
        ) {
            weatherElement.textContent =
                "🌙 Nuit claire";
        } else {
            weatherElement.textContent =
                `🌙 ${dailyWeather.icon} Nuit • ${dailyWeather.name}`;
        }

        return;
    }

    weatherElement.textContent =
        `${dailyWeather.icon} ${dailyWeather.name}`;
}


// ======================================================
// BONUS MÉTÉO
// ======================================================

function getWeatherBonus() {
    if (!dailyWeather) {
        return null;
    }

    switch (dailyWeather.id) {
        case "sunny":
            return "sun";

        case "rain":
            return "water";

        case "storm":
            return "lightning";

        case "snow":
            return "ice";

        case "fog":
            return "shadow";

        case "wind":
            return "air";

        case "cloudy":
            return "nature";

        default:
            return null;
    }
}


// ======================================================
// SAUVEGARDE DU JOUEUR
// ======================================================

function savePlayer() {
    localStorage.setItem(
        "draconiaPlayer",
        JSON.stringify(player)
    );
}


// ======================================================
// CHARGEMENT DU JOUEUR
// ======================================================

function loadPlayer() {
    const savedPlayer =
        localStorage.getItem(
            "draconiaPlayer"
        );

    if (!savedPlayer) {
        return;
    }

    try {
        const parsed =
            JSON.parse(savedPlayer);

        player = {
            ...player,
            ...parsed
        };
    } catch (error) {
        console.log(
            "Impossible de charger le joueur."
        );
    }
}


// ======================================================
// SAUVEGARDE DE L'INVENTAIRE
// ======================================================

function saveInventory() {
    localStorage.setItem(
        INVENTORY_STORAGE_KEY,
        JSON.stringify(inventory)
    );
}


// ======================================================
// CHARGEMENT DE L'INVENTAIRE
// ======================================================

function loadInventory() {
    const savedInventory =
        localStorage.getItem(
            INVENTORY_STORAGE_KEY
        );

    if (!savedInventory) {
        saveInventory();
        return;
    }

    try {
        const parsed =
            JSON.parse(savedInventory);

        inventory = {
            ...inventory,
            ...parsed
        };
    } catch (error) {
        console.log(
            "Impossible de charger l'inventaire."
        );
    }
}


// ======================================================
// SAUVEGARDE DES PLATS
// ======================================================

function savePreparedMeals() {
    localStorage.setItem(
        MEALS_STORAGE_KEY,
        JSON.stringify(preparedMeals)
    );
}


// ======================================================
// CHARGEMENT DES PLATS
// ======================================================

function loadPreparedMeals() {
    const savedMeals =
        localStorage.getItem(
            MEALS_STORAGE_KEY
        );

    if (!savedMeals) {
        savePreparedMeals();
        return;
    }

    try {
        const parsed =
            JSON.parse(savedMeals);

        preparedMeals = {
            ...preparedMeals,
            ...parsed
        };
    } catch (error) {
        console.log(
            "Impossible de charger les plats."
        );
    }
}


// ======================================================
// AJOUTER UNE RESSOURCE
// ======================================================

function addResource(
    resource,
    amount = 1
) {
    if (
        inventory[resource] === undefined
    ) {
        console.log(
            `Ressource inconnue : ${resource}`
        );

        return;
    }

    inventory[resource] += amount;

    saveInventory();
    updateInventoryDisplay();
}


// ======================================================
// RETIRER UNE RESSOURCE
// ======================================================

function removeResource(
    resource,
    amount = 1
) {
    if (
        inventory[resource] === undefined
    ) {
        return false;
    }

    if (
        inventory[resource] < amount
    ) {
        return false;
    }

    inventory[resource] -= amount;

    saveInventory();
    updateInventoryDisplay();

    return true;
}


// ======================================================
// COMPTER LES OBJETS DU SAC
// ======================================================

function getInventoryTotal() {
    return Object.values(
        inventory
    ).reduce(
        (total, amount) =>
            total + amount,
        0
    );
}


// ======================================================
// COMPTER LES PLATS CUISINÉS
// ======================================================

function getPreparedMealsTotal() {
    return Object.values(
        preparedMeals
    ).reduce(
        (total, amount) =>
            total + amount,
        0
    );
}


// ======================================================
// AFFICHAGE DU SAC
// ======================================================

function updateInventoryDisplay() {
    const resources = {
        meat: "resource-meat",
        fish: "resource-fish",
        apple: "resource-apple",
        berry: "resource-berry",
        herb: "resource-herb",
        mushroom: "resource-mushroom",
        vegetable: "resource-vegetable",
        insect: "resource-insect"
    };

    Object.entries(resources)
        .forEach(
            ([resource, elementId]) => {
                const element =
                    document.getElementById(
                        elementId
                    );

                if (element) {
                    element.textContent =
                        inventory[resource];
                }
            }
        );

    const totalElement =
        document.getElementById(
            "inventory-total"
        );

    if (totalElement) {
        totalElement.textContent =
            getInventoryTotal();
    }

    renderRecipes();
}


// ======================================================
// AFFICHAGE DES RESSOURCES DU JOUEUR
// ======================================================

function updatePlayerDisplay() {
    const coinsElement =
        document.getElementById(
            "coins"
        );

    const foodElement =
        document.getElementById(
            "food"
        );

    const xpElement =
        document.getElementById(
            "xp"
        );

    if (coinsElement) {
        coinsElement.textContent =
            player.coins;
    }

    if (foodElement) {
        foodElement.textContent =
            getPreparedMealsTotal();
    }

    if (xpElement) {
        xpElement.textContent =
            player.xp;
    }

    updateXPBar();
}


// ======================================================
// AJOUTER DE L'XP AU JOUEUR
// ======================================================

function addPlayerXP(amount) {
    player.xp += amount;

    let levelUp = false;

    while (
        player.xp >= 100
    ) {
        player.xp -= 100;
        player.level += 1;
        levelUp = true;
    }

    savePlayer();
    updatePlayerDisplay();

    return levelUp;
}


// ======================================================
// MESSAGE DE RÉCOLTE
// ======================================================

function showGatheringMessage(message) {
    const element =
        document.getElementById(
            "gathering-message"
        );

    if (!element) {
        return;
    }

    element.textContent =
        message;
}


// ======================================================
// MESSAGE DE CUISINE
// ======================================================

function showCookingMessage(message) {
    const element =
        document.getElementById(
            "cooking-message"
        );

    if (!element) {
        return;
    }

    element.textContent =
        message;
}


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


// ======================================================
// FORÊT : SECOUER L'ARBRE 🌲
// ======================================================

function shakeTree() {
    if (
        currentGatheringGame !==
        "forest"
    ) {
        return;
    }

    if (
        forestTreeShakeCooldown
    ) {
        return;
    }

    forestTreeShakeCooldown = true;

    setTimeout(
        function() {
            forestTreeShakeCooldown = false;
        },
        1000
    );

    const treeButton =
        document.getElementById(
            "forest-tree-button"
        );

    if (treeButton) {
        treeButton.classList.remove(
            "shake-tree"
        );

        void treeButton.offsetWidth;

        treeButton.classList.add(
            "shake-tree"
        );
    }

    const amount =
        Math.floor(
            Math.random() * 3
        );

    if (amount === 0) {
        const message =
            document.getElementById(
                "forest-tree-message"
            );

        if (message) {
            message.textContent =
                "🌳 Tu secoues l'arbre... rien ne tombe cette fois !";
        }

        addPlayerXP(1);

        return;
    }

    const possibleResources = [
        "apple",
        "berry",
        "herb",
        "insect"
    ];

    const fallenResources = [];

    for (
        let i = 0;
        i < amount;
        i++
    ) {
        const resource =
            possibleResources[
                Math.floor(
                    Math.random() *
                    possibleResources.length
                )
            ];

        fallenResources.push(
            resource
        );

        createFallingForestResource(
            resource
        );
    }

    const xpAmount = 1;

    const levelUp =
        addPlayerXP(
            xpAmount
        );

    const message =
        document.getElementById(
            "forest-tree-message"
        );

    const names =
        fallenResources
            .map(
                resource =>
                    resourceNames[
                        resource
                    ]
            )
            .join(" • ");

    if (message) {
        if (levelUp) {
            message.textContent =
                `🌳 ${names} tombent sur le sol ! Appuie dessus pour les ramasser. +${xpAmount} XP • Niveau ${player.level} !`;
        } else {
            message.textContent =
                `🌳 ${names} tombent sur le sol ! 👆 Appuie dessus pour les ramasser.`;
        }
    }
}


// ======================================================
// FORÊT : CRÉER UNE RESSOURCE AU SOL
// ======================================================

function createFallingForestResource(
    resource
) {
    const container =
        document.getElementById(
            "forest-dropped-resources"
        );

    if (!container) {
        return;
    }

    const resourceIcons = {
        apple: "🍎",
        berry: "🍓",
        herb: "🌿",
        insect: "🐛"
    };

    forestDropCounter += 1;

    const drop =
        document.createElement(
            "button"
        );

    drop.type = "button";
    drop.className =
        "forest-resource-drop falling";

    drop.textContent =
        resourceIcons[resource] || "✨";

    drop.setAttribute(
        "aria-label",
        `Ramasser ${resourceNames[resource]}`
    );

    const left =
        12 +
        Math.random() * 76;

    const top =
        68 +
        Math.random() * 22;

    drop.style.left =
        `${left}%`;

    drop.style.top =
        `${top}%`;

    drop.dataset.resource =
        resource;

    drop.dataset.dropId =
        forestDropCounter;

    drop.addEventListener(
        "click",
        function() {
            collectForestResource(
                drop
            );
        }
    );

    container.appendChild(
        drop
    );

    setTimeout(
        function() {
            drop.classList.remove(
                "falling"
            );
        },
        700
    );
}


// ======================================================
// FORÊT : RAMASSER UNE RESSOURCE
// ======================================================

function collectForestResource(
    dropElement
) {
    if (!dropElement) {
        return;
    }

    const resource =
        dropElement.dataset.resource;

    if (!resource) {
        return;
    }

    if (
        dropElement.dataset.collected ===
        "true"
    ) {
        return;
    }

    dropElement.dataset.collected =
        "true";

    addResource(
        resource,
        1
    );

    dropElement.classList.add(
        "collected"
    );

    const message =
        document.getElementById(
            "forest-game-message"
        );

    if (message) {
        message.textContent =
            `🎒 ${resourceNames[resource]} ajouté au sac !`;
    }

    setTimeout(
        function() {
            if (
                dropElement &&
                dropElement.parentNode
            ) {
                dropElement.remove();
            }
        },
        250
    );
}


// ======================================================
// FORÊT : VIDER LES RESSOURCES AU SOL
// ======================================================

function clearForestDrops() {
    const container =
        document.getElementById(
            "forest-dropped-resources"
        );

    if (container) {
        container.innerHTML = "";
    }
}


// ======================================================
// FORÊT : AFFICHER LES CHAMPIGNONS
// ======================================================

function renderForestMushrooms() {
    const mushroomButtons =
        document.querySelectorAll(
            ".forest-mushroom"
        );

    mushroomButtons.forEach(
        button => {
            const index =
                Number(
                    button.dataset
                        .mushroomIndex
                );

            if (
                forestMushrooms[index]
            ) {
                button.classList.remove(
                    "picked"
                );

                button.disabled =
                    false;
            } else {
                button.classList.add(
                    "picked"
                );

                button.disabled =
                    true;
            }
        }
    );
}


// ======================================================
// FORÊT : RAMASSER UN CHAMPIGNON
// ======================================================

function pickMushroom(index) {
    if (
        currentGatheringGame !==
        "forest"
    ) {
        return;
    }

    if (
        !forestMushrooms[index]
    ) {
        return;
    }

    forestMushrooms[index] =
        false;

    addResource(
        "mushroom",
        1
    );

    addPlayerXP(1);

    renderForestMushrooms();

    const message =
        document.getElementById(
            "forest-game-message"
        );

    if (message) {
        message.textContent =
            "🍄 Champignon ramassé ! Il repoussera dans 1 minute.";
    }

    if (
        forestMushroomTimers[index]
    ) {
        clearTimeout(
            forestMushroomTimers[
                index
            ]
        );
    }

    forestMushroomTimers[index] =
        setTimeout(
            function() {
                forestMushrooms[index] =
                    true;

                forestMushroomTimers[
                    index
                ] = null;

                renderForestMushrooms();

                if (
                    currentGatheringGame ===
                    "forest"
                ) {
                    const respawnMessage =
                        document.getElementById(
                            "forest-game-message"
                        );

                    if (
                        respawnMessage
                    ) {
                        respawnMessage.textContent =
                            "🍄 Un champignon vient de repousser !";
                    }
                }
            },
            60000
        );
}


// ======================================================
// PLAINES : DÉMARRAGE 🌾
// ======================================================

function startPlainsGame() {
    updatePlainsDisplay();

    if (
        plainsGrowthStartTime &&
        !plainsPlants.every(
            plant => plant.ready
        )
    ) {
        startPlainsGrowthTimer();
    }
}


// ======================================================
// PLAINES : CHOISIR UN OUTIL
// ======================================================

function selectPlainsTool(tool) {
    if (
        tool !== "watering" &&
        tool !== "scythe"
    ) {
        return;
    }

    plainsSelectedTool = tool;

    updatePlainsDisplay();

    const message =
        document.getElementById(
            "plains-tool-message"
        );

    if (!message) {
        return;
    }

    if (tool === "watering") {
        message.textContent =
            "🚿 Arrosoir en main. Touche les plantations pour les arroser.";
    } else {
        message.textContent =
            "🌾 Faux en main. Touche les plantations prêtes pour les récolter.";
    }
}


// ======================================================
// PLAINES : TOUCHER UNE PLANTATION
// ======================================================

function interactWithPlant(index) {
    if (
        currentGatheringGame !==
        "plains"
    ) {
        return;
    }

    const plant =
        plainsPlants[index];

    if (!plant) {
        return;
    }

    if (
        plainsSelectedTool ===
        "watering"
    ) {
        waterPlant(index);
        return;
    }

    if (
        plainsSelectedTool ===
        "scythe"
    ) {
        harvestPlant(index);
        return;
    }

    const message =
        document.getElementById(
            "plains-tool-message"
        );

    if (message) {
        message.textContent =
            "👆 Choisis d'abord l'arrosoir ou la faux.";
    }
}


// ======================================================
// PLAINES : ARROSER UNE PLANTATION
// ======================================================

function waterPlant(index) {
    const plant =
        plainsPlants[index];

    if (!plant) {
        return;
    }

    if (plant.ready) {
        const message =
            document.getElementById(
                "plains-tool-message"
            );

        if (message) {
            message.textContent =
                "🌾 Cette plantation est déjà prête. Utilise la faux.";
        }

        return;
    }

    if (plant.watered) {
        const message =
            document.getElementById(
                "plains-tool-message"
            );

        if (message) {
            message.textContent =
                "💧 Cette plantation est déjà arrosée.";
        }

        return;
    }

    plant.watered = true;

    const message =
        document.getElementById(
            "plains-tool-message"
        );

    if (message) {
        message.textContent =
            "💧 Plantation arrosée !";
    }

    updatePlainsDisplay();

    const allWatered =
        plainsPlants.every(
            currentPlant =>
                currentPlant.watered
        );

    if (
        allWatered &&
        !plainsGrowthStartTime
    ) {
        beginPlainsGrowth();
    }
}


// ======================================================
// PLAINES : COMMENCER LA POUSSE
// ======================================================

function beginPlainsGrowth() {
    plainsGrowthStartTime =
        Date.now();

    const growthMessage =
        document.getElementById(
            "plants-growth-message"
        );

    if (growthMessage) {
        growthMessage.textContent =
            "🌱 Toutes les plantations sont arrosées. Elles commencent à pousser !";
    }

    startPlainsGrowthTimer();
    updatePlainsDisplay();
}


// ======================================================
// PLAINES : MINUTEUR DE POUSSE
// ======================================================

function startPlainsGrowthTimer() {
    if (plainsGrowthInterval) {
        clearInterval(
            plainsGrowthInterval
        );
    }

    updatePlainsGrowthProgress();

    plainsGrowthInterval =
        setInterval(
            updatePlainsGrowthProgress,
            250
        );
}


// ======================================================
// PLAINES : METTRE À JOUR LA BARRE
// ======================================================

function updatePlainsGrowthProgress() {
    if (!plainsGrowthStartTime) {
        updatePlainsDisplay();
        return;
    }

    const elapsed =
        Date.now() -
        plainsGrowthStartTime;

    const progress =
        Math.min(
            elapsed /
            PLAINS_GROWTH_TIME,
            1
        );

    const remainingMs =
        Math.max(
            PLAINS_GROWTH_TIME -
            elapsed,
            0
        );

    const remainingSeconds =
        Math.ceil(
            remainingMs / 1000
        );

    const fill =
        document.getElementById(
            "plains-growth-fill"
        );

    const timer =
        document.getElementById(
            "plains-growth-timer"
        );

    if (fill) {
        fill.style.width =
            `${progress * 100}%`;
    }

    if (timer) {
        timer.textContent =
            progress >= 1
                ? "Prêt !"
                : `${remainingSeconds}s`;
    }

    if (progress >= 1) {
        if (plainsGrowthInterval) {
            clearInterval(
                plainsGrowthInterval
            );

            plainsGrowthInterval =
                null;
        }

        plainsPlants =
            plainsPlants.map(
                plant => ({
                    ...plant,
                    ready: true
                })
            );

        plainsGrowthStartTime =
            null;

        const growthMessage =
            document.getElementById(
                "plants-growth-message"
            );

        if (growthMessage) {
            growthMessage.textContent =
                "🌾 Les plantations sont prêtes ! Prends la faux et récolte-les.";
        }

        updatePlainsDisplay();
    }
}


// ======================================================
// PLAINES : RÉCOLTER UNE PLANTATION
// ======================================================

function harvestPlant(index) {
    const plant =
        plainsPlants[index];

    if (!plant) {
        return;
    }

    if (!plant.ready) {
        const message =
            document.getElementById(
                "plains-tool-message"
            );

        if (message) {
            if (!plant.watered) {
                message.textContent =
                    "🌱 Cette plantation doit d'abord être arrosée.";
            } else {
                message.textContent =
                    "⏳ Cette plantation n'est pas encore prête.";
            }
        }

        return;
    }

    const possibleResources = [
        "vegetable",
        "herb"
    ];

    const resource =
        possibleResources[
            Math.floor(
                Math.random() *
                possibleResources.length
            )
        ];

    const amount =
        Math.random() < 0.75
            ? 1
            : 2;

    addResource(
        resource,
        amount
    );

    addPlayerXP(2);

    plainsPlants[index] = {
        watered: false,
        ready: false
    };

    const message =
        document.getElementById(
            "plains-game-message"
        );

    if (message) {
        message.textContent =
            `🌾 Récolte réussie : +${amount} ${resourceNames[resource]} !`;
    }

    updatePlainsDisplay();

    const allHarvested =
        plainsPlants.every(
            plant =>
                !plant.watered &&
                !plant.ready
        );

    if (allHarvested) {
        plainsSelectedTool =
            null;

        const toolMessage =
            document.getElementById(
                "plains-tool-message"
            );

        if (toolMessage) {
            toolMessage.textContent =
                "🌱 Une nouvelle culture est prête à être arrosée.";
        }

        const growthMessage =
            document.getElementById(
                "plants-growth-message"
            );

        if (growthMessage) {
            growthMessage.textContent =
                "Choisis l'arrosoir puis touche chaque plantation.";
        }

        updatePlainsDisplay();
    }
}


// ======================================================
// PLAINES : AFFICHAGE
// ======================================================

function updatePlainsDisplay() {
    const wateringButton =
        document.getElementById(
            "plains-watering-tool"
        );

    const scytheButton =
        document.getElementById(
            "plains-scythe-tool"
        );

    if (wateringButton) {
        wateringButton.classList.toggle(
            "selected",
            plainsSelectedTool ===
            "watering"
        );
    }

    if (scytheButton) {
        scytheButton.classList.toggle(
            "selected",
            plainsSelectedTool ===
            "scythe"
        );
    }

    const plantButtons =
        document.querySelectorAll(
            ".plant-button"
        );

    plantButtons.forEach(
        (button, index) => {
            const plant =
                plainsPlants[index];

            if (!plant) {
                return;
            }

            button.classList.remove(
                "watered",
                "growing",
                "ready"
            );

            if (plant.ready) {
                button.classList.add(
                    "ready"
                );

                button.textContent =
                    "🌾";

                return;
            }

            if (
                plant.watered &&
                plainsGrowthStartTime
            ) {
                button.classList.add(
                    "growing"
                );

                button.textContent =
                    "🌿";

                return;
            }

            if (plant.watered) {
                button.classList.add(
                    "watered"
                );

                button.textContent =
                    "💧🌱";

                return;
            }

            button.textContent =
                "🌱";
        }
    );

    const fill =
        document.getElementById(
            "plains-growth-fill"
        );

    const timer =
        document.getElementById(
            "plains-growth-timer"
        );

    if (
        !plainsGrowthStartTime
    ) {
        const allReady =
            plainsPlants.every(
                plant => plant.ready
            );

        if (fill) {
            fill.style.width =
                allReady
                    ? "100%"
                    : "0%";
        }

        if (timer) {
            timer.textContent =
                allReady
                    ? "Prêt !"
                    : "60s";
        }
    }
}


// ======================================================
// PÊCHE : DÉMARRAGE 🎣
// ======================================================

function startFishingGame() {
    stopFishingGame();

    fishingArrowPosition =
        0;

    fishingArrowDirection =
        1;

    fishingActive =
        true;

    fishingGreenStart =
        20 +
        Math.random() * 45;

    fishingGreenWidth =
        18 +
        Math.random() * 15;

    const greenZone =
        document.getElementById(
            "fishing-green-zone"
        );

    if (greenZone) {
        greenZone.style.left =
            `${fishingGreenStart}%`;

        greenZone.style.width =
            `${fishingGreenWidth}%`;
    }

    updateFishingArrow();

    fishingInterval =
        setInterval(
            function() {
                fishingArrowPosition +=
                    1.8 *
                    fishingArrowDirection;

                if (
                    fishingArrowPosition >=
                    100
                ) {
                    fishingArrowPosition =
                        100;

                    fishingArrowDirection =
                        -1;
                }

                if (
                    fishingArrowPosition <=
                    0
                ) {
                    fishingArrowPosition =
                        0;

                    fishingArrowDirection =
                        1;
                }

                updateFishingArrow();
            },
            20
        );

    const status =
        document.getElementById(
            "fishing-status"
        );

    if (status) {
        status.textContent =
            "🎣 Appuie sur Attraper quand la flèche est dans la zone verte !";
    }

    const message =
        document.getElementById(
            "fishing-game-message"
        );

    if (message) {
        message.textContent =
            "";
    }
}


// ======================================================
// PÊCHE : AFFICHER LA FLÈCHE
// ======================================================

function updateFishingArrow() {
    const arrow =
        document.getElementById(
            "fishing-arrow"
        );

    if (arrow) {
        arrow.style.left =
            `${fishingArrowPosition}%`;
    }
}


// ======================================================
// PÊCHE : ATTRAPER
// ======================================================

function catchFish() {
    if (!fishingActive) {
        startFishingGame();
        return;
    }

    const greenEnd =
        fishingGreenStart +
        fishingGreenWidth;

    const success =
        fishingArrowPosition >=
            fishingGreenStart &&
        fishingArrowPosition <=
            greenEnd;

    const message =
        document.getElementById(
            "fishing-game-message"
        );

    if (success) {
        const amountRoll =
            Math.random();

        let amount = 1;

        if (amountRoll > 0.85) {
            amount = 3;
        } else if (
            amountRoll > 0.45
        ) {
            amount = 2;
        }

        addResource(
            "fish",
            amount
        );

        addPlayerXP(
            2 + amount
        );

        if (message) {
            message.textContent =
                `🐟 Bravo ! Tu attrapes ${amount} poisson${amount > 1 ? "s" : ""}.`;
        }
    } else {
        if (message) {
            message.textContent =
                "💨 Trop tôt ou trop tard... le poisson s'est échappé.";
        }
    }

    stopFishingGame();

    setTimeout(
        function() {
            if (
                currentGatheringGame ===
                "fishing"
            ) {
                startFishingGame();
            }
        },
        1200
    );
}


// ======================================================
// PÊCHE : ARRÊTER
// ======================================================

function stopFishingGame() {
    fishingActive =
        false;

    if (fishingInterval) {
        clearInterval(
            fishingInterval
        );

        fishingInterval =
            null;
    }
}


// ======================================================
// CHASSE : DÉMARRAGE 🏹
// ======================================================

function startHuntingGame() {
    stopHuntingGame();

    huntingDuckVisible =
        false;

    hideHuntingDuck();

    const status =
        document.getElementById(
            "hunting-status"
        );

    if (status) {
        status.textContent =
            "🌲 Observe bien... un canard peut apparaître à tout moment.";
    }

    scheduleNextDuckCheck();
}


// ======================================================
// CHASSE : PROCHAINE APPARITION
// ======================================================

function scheduleNextDuckCheck() {
    if (
        currentGatheringGame !==
        "hunting"
    ) {
        return;
    }

    huntingDuckTimer =
        setTimeout(
            function() {
                if (
                    currentGatheringGame !==
                    "hunting"
                ) {
                    return;
                }

                if (
                    !huntingDuckVisible &&
                    Math.random() < 0.2
                ) {
                    showHuntingDuck();
                }

                scheduleNextDuckCheck();
            },
            10000
        );
}


// ======================================================
// CHASSE : AFFICHER LE CANARD
// ======================================================

function showHuntingDuck() {
    const duck =
        document.getElementById(
            "hunting-duck"
        );

    const field =
        document.getElementById(
            "hunting-field"
        );

    if (
        !duck ||
        !field
    ) {
        return;
    }

    huntingDuckVisible =
        true;

    duck.style.display =
        "block";

    const maxX =
        Math.max(
            field.clientWidth - 80,
            20
        );

    const maxY =
        Math.max(
            field.clientHeight - 160,
            60
        );

    const x =
        10 +
        Math.random() *
        Math.max(
            maxX - 20,
            20
        );

    const y =
        30 +
        Math.random() *
        Math.max(
            maxY - 40,
            30
        );

    duck.style.left =
        `${x}px`;

    duck.style.top =
        `${y}px`;

    const status =
        document.getElementById(
            "hunting-status"
        );

    if (status) {
        status.textContent =
            "🦆 Un canard ! Utilise ton arc !";
    }

    if (huntingDuckHideTimer) {
        clearTimeout(
            huntingDuckHideTimer
        );
    }

    huntingDuckHideTimer =
        setTimeout(
            function() {
                if (
                    huntingDuckVisible
                ) {
                    hideHuntingDuck();

                    const escapedStatus =
                        document.getElementById(
                            "hunting-status"
                        );

                    if (
                        escapedStatus
                    ) {
                        escapedStatus.textContent =
                            "💨 Le canard s'est envolé...";
                    }
                }
            },
            4000
        );
}


// ======================================================
// CHASSE : CACHER LE CANARD
// ======================================================

function hideHuntingDuck() {
    const duck =
        document.getElementById(
            "hunting-duck"
        );

    huntingDuckVisible =
        false;

    if (duck) {
        duck.style.display =
            "none";
    }

    if (
        huntingDuckHideTimer
    ) {
        clearTimeout(
            huntingDuckHideTimer
        );

        huntingDuckHideTimer =
            null;
    }
}


// ======================================================
// CHASSE : TIRER
// ======================================================

function shootDuck() {
    const message =
        document.getElementById(
            "hunting-game-message"
        );

    if (
        !huntingDuckVisible
    ) {
        if (message) {
            message.textContent =
                "🏹 Aucun animal à viser pour le moment.";
        }

        return;
    }

    const hitChance =
        0.75;

    const success =
        Math.random() <
        hitChance;

    if (success) {
        const amount =
            Math.random() < 0.75
                ? 1
                : 2;

        addResource(
            "meat",
            amount
        );

        addPlayerXP(
            3
        );

        if (message) {
            message.textContent =
                `🎯 Réussi ! +${amount} ${resourceNames.meat}.`;
        }
    } else {
        if (message) {
            message.textContent =
                "💨 Raté ! Le canard s'enfuit.";
        }
    }

    hideHuntingDuck();

    const status =
        document.getElementById(
            "hunting-status"
        );

    if (status) {
        status.textContent =
            "🌲 Attends le prochain animal...";
    }
}


// ======================================================
// CHASSE : ARRÊTER
// ======================================================

function stopHuntingGame() {
    if (
        huntingDuckTimer
    ) {
        clearTimeout(
            huntingDuckTimer
        );

        huntingDuckTimer =
            null;
    }

    if (
        huntingDuckHideTimer
    ) {
        clearTimeout(
            huntingDuckHideTimer
        );

        huntingDuckHideTimer =
            null;
    }

    hideHuntingDuck();
}


// ======================================================
// DRAGONS DÉCOUVERTS
// ======================================================

let discoveredDragons = [];


// ======================================================
// DRAGONS POSSÉDÉS
// ======================================================

let ownedDragons = [];


// ======================================================
// CHARGER LES DRAGONS DÉCOUVERTS
// ======================================================

function loadDiscoveredDragons() {
    const saved =
        localStorage.getItem(
            "draconiaDiscoveredDragons"
        );

    if (!saved) {
        discoveredDragons = [];
        return;
    }

    try {
        discoveredDragons =
            JSON.parse(saved);
    } catch (error) {
        discoveredDragons = [];
    }
}


// ======================================================
// SAUVEGARDER LES DRAGONS DÉCOUVERTS
// ======================================================

function saveDiscoveredDragons() {
    localStorage.setItem(
        "draconiaDiscoveredDragons",
        JSON.stringify(
            discoveredDragons
        )
    );
}


// ======================================================
// CHARGER LES DRAGONS POSSÉDÉS
// ======================================================

function loadOwnedDragons() {
    const saved =
        localStorage.getItem(
            "draconiaOwnedDragons"
        );

    if (!saved) {
        ownedDragons = [];
        return;
    }

    try {
        ownedDragons =
            JSON.parse(saved);
    } catch (error) {
        ownedDragons = [];
    }
}


// ======================================================
// SAUVEGARDER LES DRAGONS POSSÉDÉS
// ======================================================

function saveOwnedDragons() {
    localStorage.setItem(
        "draconiaOwnedDragons",
        JSON.stringify(
            ownedDragons
        )
    );
}


// ======================================================
// TROUVER UN DRAGON
// ======================================================

function findEgg() {
    const button =
        document.getElementById(
            "egg-button"
        );

    const message =
        document.getElementById(
            "egg-message"
        );

    if (button) {
        button.disabled =
            true;
    }

    if (message) {
        message.textContent =
            "🔍 Exploration en cours...";
    }

    setTimeout(
        function() {
            const success =
                Math.random() <
                0.45;

            if (!success) {
                if (message) {
                    message.textContent =
                        "🌿 Tu explores les environs, mais aucun dragon ne se montre cette fois.";
                }

                if (button) {
                    button.disabled =
                        false;
                }

                addPlayerXP(2);

                return;
            }

            const selectedDragon =
                selectRandomDragon();

            discoverDragon(
                selectedDragon
            );

            if (message) {
                message.textContent =
                    `🥚 Incroyable ! Tu découvres ${selectedDragon.icon} ${selectedDragon.name}, dragon ${selectedDragon.element} !`;
            }

            if (button) {
                button.disabled =
                    false;
            }

            addPlayerXP(5);

            renderDragonDex();
            renderOwnedDragons();
        },
        900
    );
}


// ======================================================
// CHOISIR UN DRAGON
// ======================================================

function selectRandomDragon() {
    const rarityRoll =
        Math.random();

    let allowedRarities = [
        "Commun"
    ];

    if (rarityRoll > 0.97) {
        allowedRarities = [
            "Légendaire"
        ];
    } else if (
        rarityRoll > 0.88
    ) {
        allowedRarities = [
            "Épique"
        ];
    } else if (
        rarityRoll > 0.65
    ) {
        allowedRarities = [
            "Rare"
        ];
    } else if (
        rarityRoll > 0.35
    ) {
        allowedRarities = [
            "Peu commun"
        ];
    }

    const possible =
        dragons.filter(
            dragon =>
                allowedRarities.includes(
                    dragon.rarity
                )
        );

    return possible[
        Math.floor(
            Math.random() *
            possible.length
        )
    ];
}


// ======================================================
// DÉCOUVRIR UN DRAGON
// ======================================================

function discoverDragon(dragon) {
    if (!dragon) {
        return;
    }

    if (
        !discoveredDragons.includes(
            dragon.id
        )
    ) {
        discoveredDragons.push(
            dragon.id
        );

        saveDiscoveredDragons();
    }

    const alreadyOwned =
        ownedDragons.find(
            owned =>
                owned.id ===
                dragon.id
        );

    if (!alreadyOwned) {
        ownedDragons.push({
            id: dragon.id,
            level: 1,
            xp: 0,
            hunger: 100,
            happiness: 100,
            energy: 100
        });

        saveOwnedDragons();
    }
}


// ======================================================
// DRAGONDEX
// ======================================================

function renderDragonDex() {
    const list =
        document.getElementById(
            "dragon-list"
        );

    const count =
        document.getElementById(
            "dex-count"
        );

    if (count) {
        count.textContent =
            discoveredDragons.length;
    }

    if (!list) {
        return;
    }

    list.innerHTML = "";

    dragons.forEach(
        dragon => {
            const discovered =
                discoveredDragons.includes(
                    dragon.id
                );

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "dex-dragon";

            item.innerHTML = `
                <div class="dex-dragon-image">
                    ${
                        discovered
                            ? dragon.icon
                            : "❓"
                    }
                </div>

                <div class="dex-dragon-info">
                    <h3>
                        ${
                            discovered
                                ? dragon.name
                                : "Dragon inconnu"
                        }
                    </h3>

                    <p>
                        ${
                            discovered
                                ? `Élément : ${dragon.element}`
                                : "Continue à explorer Draconia."
                        }
                    </p>

                    <span>
                        ${
                            discovered
                                ? dragon.rarity
                                : "???"
                        }
                    </span>
                </div>

                <div class="dex-check">
                    ${
                        discovered
                            ? "✅"
                            : "🔒"
                    }
                </div>
            `;

            list.appendChild(
                item
            );
        }
    );
}


// ======================================================
// DRAGONS POSSÉDÉS
// ======================================================

function renderOwnedDragons() {
    const list =
        document.getElementById(
            "owned-dragons-list"
        );

    const empty =
        document.getElementById(
            "no-dragons"
        );

    const count =
        document.getElementById(
            "owned-dragons-count"
        );

    if (count) {
        count.textContent =
            ownedDragons.length;
    }

    if (!list) {
        return;
    }

    list.innerHTML = "";

    if (
        ownedDragons.length === 0
    ) {
        if (empty) {
            empty.style.display =
                "block";
        }

        return;
    }

    if (empty) {
        empty.style.display =
            "none";
    }

    ownedDragons.forEach(
        ownedDragon => {
            const dragon =
                dragons.find(
                    item =>
                        item.id ===
                        ownedDragon.id
                );

            if (!dragon) {
                return;
            }

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "owned-dragon-card";

            card.innerHTML = `
                <div class="owned-dragon-top">

                    <div class="owned-dragon-icon">
                        ${dragon.icon}
                    </div>

                    <div class="owned-dragon-info">

                        <p class="rarity">
                            ${dragon.rarity}
                        </p>

                        <h3>
                            ${dragon.name}
                        </h3>

                        <p>
                            Élément : ${dragon.element}
                        </p>

                        <span class="dragon-level">
                            Niveau ${ownedDragon.level}
                        </span>

                    </div>

                </div>

                <div class="dragon-xp-section">

                    <div class="dragon-xp-info">
                        <span>XP</span>
                        <b>
                            ${ownedDragon.xp} / 100
                        </b>
                    </div>

                    <div class="dragon-xp-bar">
                        <div
                            class="dragon-xp-fill"
                            style="width: ${ownedDragon.xp}%"
                        ></div>
                    </div>

                </div>

                <div class="dragon-care-stats">

                    <div class="dragon-care-stat">
                        <span>🍖</span>
                        <small>Faim</small>
                        <b>${ownedDragon.hunger}</b>
                    </div>

                    <div class="dragon-care-stat">
                        <span>❤️</span>
                        <small>Bonheur</small>
                        <b>${ownedDragon.happiness}</b>
                    </div>

                    <div class="dragon-care-stat">
                        <span>⚡</span>
                        <small>Énergie</small>
                        <b>${ownedDragon.energy}</b>
                    </div>

                </div>

                <div class="dragon-care-actions">

                    <button
                        onclick="feedDragon('${dragon.id}')"
                    >
                        🍲 Nourrir
                    </button>

                    <button
                        onclick="playWithDragon('${dragon.id}')"
                    >
                        🎾 Jouer
                    </button>

                    <button
                        onclick="restDragon('${dragon.id}')"
                    >
                        💤 Repos
                    </button>

                </div>
            `;

            list.appendChild(
                card
            );
        }
    );
}


// ======================================================
// NOURRIR UN DRAGON
// ======================================================

function feedDragon(dragonId) {
    const owned =
        ownedDragons.find(
            dragon =>
                dragon.id ===
                dragonId
        );

    const dragon =
        dragons.find(
            item =>
                item.id ===
                dragonId
        );

    if (
        !owned ||
        !dragon
    ) {
        return;
    }

    const matchingRecipe =
        recipes.find(
            recipe =>
                recipe.element ===
                dragon.element
        );

    if (!matchingRecipe) {
        alert(
            "Aucun plat adapté à ce dragon."
        );

        return;
    }

    if (
        !preparedMeals[
            matchingRecipe.id
        ] ||
        preparedMeals[
            matchingRecipe.id
        ] <= 0
    ) {
        alert(
            `Il te faut ${matchingRecipe.icon} ${matchingRecipe.name} pour nourrir ${dragon.name}.`
        );

        return;
    }

    preparedMeals[
        matchingRecipe.id
    ] -= 1;

    owned.hunger =
        Math.min(
            100,
            owned.hunger + 25
        );

    addDragonXP(
        owned,
        10
    );

    savePreparedMeals();
    saveOwnedDragons();

    updatePlayerDisplay();
    renderOwnedDragons();
}


// ======================================================
// JOUER AVEC UN DRAGON
// ======================================================

function playWithDragon(
    dragonId
) {
    const owned =
        ownedDragons.find(
            dragon =>
                dragon.id ===
                dragonId
        );

    if (!owned) {
        return;
    }

    if (
        owned.energy < 10
    ) {
        alert(
            "Ce dragon est trop fatigué."
        );

        return;
    }

    owned.energy =
        Math.max(
            0,
            owned.energy - 10
        );

    owned.happiness =
        Math.min(
            100,
            owned.happiness + 15
        );

    addDragonXP(
        owned,
        5
    );

    saveOwnedDragons();
    renderOwnedDragons();
}


// ======================================================
// REPOS DU DRAGON
// ======================================================

function restDragon(
    dragonId
) {
    const owned =
        ownedDragons.find(
            dragon =>
                dragon.id ===
                dragonId
        );

    if (!owned) {
        return;
    }

    owned.energy =
        Math.min(
            100,
            owned.energy + 25
        );

    saveOwnedDragons();
    renderOwnedDragons();
}


// ======================================================
// XP DU DRAGON
// ======================================================

function addDragonXP(
    dragon,
    amount
) {
    dragon.xp += amount;

    while (
        dragon.xp >= 100
    ) {
        dragon.xp -= 100;
        dragon.level += 1;
    }
}


// ======================================================
// RECETTES
// ======================================================

function renderRecipes() {
    const list =
        document.getElementById(
            "recipes-list"
        );

    if (!list) {
        return;
    }

    list.innerHTML = "";

    recipes.forEach(
        recipe => {
            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "recipe-card";

            const ingredientsText =
                Object.entries(
                    recipe.ingredients
                )
                    .map(
                        ([resource, amount]) =>
                            `${resourceNames[resource]} x${amount}`
                    )
                    .join(" • ");

            const canCook =
                Object.entries(
                    recipe.ingredients
                )
                    .every(
                        ([resource, amount]) =>
                            inventory[resource] >=
                            amount
                    );

            card.innerHTML = `
                <div class="recipe-icon">
                    ${recipe.icon}
                </div>

                <div class="recipe-info">

                    <h3>
                        ${recipe.name}
                    </h3>

                    <p>
                        ${recipe.description}
                    </p>

                    <small>
                        ${ingredientsText}
                    </small>

                </div>

                <button
                    ${
                        canCook
                            ? ""
                            : "disabled"
                    }
                    onclick="cookRecipe('${recipe.id}')"
                >
                    🍲 Cuisiner
                </button>
            `;

            list.appendChild(
                card
            );
        }
    );
}


// ======================================================
// CUISINER
// ======================================================

function cookRecipe(
    recipeId
) {
    const recipe =
        recipes.find(
            item =>
                item.id ===
                recipeId
        );

    if (!recipe) {
        return;
    }

    const canCook =
        Object.entries(
            recipe.ingredients
        )
            .every(
                ([resource, amount]) =>
                    inventory[resource] >=
                    amount
            );

    if (!canCook) {
        showCookingMessage(
            "❌ Il te manque des ingrédients."
        );

        return;
    }

    Object.entries(
        recipe.ingredients
    )
        .forEach(
            ([resource, amount]) => {
                inventory[
                    resource
                ] -= amount;
            }
        );

    preparedMeals[
        recipe.id
    ] += 1;

    saveInventory();
    savePreparedMeals();

    updateInventoryDisplay();
    updatePlayerDisplay();

    showCookingMessage(
        `${recipe.icon} ${recipe.name} préparé !`
    );
}


// ======================================================
// BARRE XP JOUEUR
// ======================================================

function updateXPBar() {
    const fill =
        document.getElementById(
            "xp-fill"
        );

    if (fill) {
        fill.style.width =
            `${player.xp}%`;
    }

    const levelInfo =
        document.querySelector(
            ".level-info span:first-child"
        );

    if (levelInfo) {
        levelInfo.textContent =
            `Niveau ${player.level}`;
    }
}


// ======================================================
// NAVIGATION
// ======================================================

function showPage(pageName) {
    const pages =
        document.querySelectorAll(
            ".page"
        );

    pages.forEach(
        page => {
            page.style.display =
                "none";

            page.classList.remove(
                "active-page"
            );
        }
    );

    const selectedPage =
        document.getElementById(
            `${pageName}-page`
        );

    if (selectedPage) {
        selectedPage.style.display =
            "block";

        selectedPage.classList.add(
            "active-page"
        );
    }

    const navButtons =
        document.querySelectorAll(
            ".bottom-nav button"
        );

    navButtons.forEach(
        button => {
            button.classList.remove(
                "active"
            );
        }
    );

    const activeButton =
        document.querySelector(
            `.bottom-nav button[data-page="${pageName}"]`
        );

    if (activeButton) {
        activeButton.classList.add(
            "active"
        );
    }

    if (pageName === "dragons") {
        renderOwnedDragons();
    }

    if (pageName === "dex") {
        renderDragonDex();
    }

    if (
        pageName === "inventory"
    ) {
        updateInventoryDisplay();
    }

    if (
        pageName === "cooking"
    ) {
        renderRecipes();
    }

    window.scrollTo(
        0,
        0
    );
}


// ======================================================
// INITIALISATION
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {
        loadPlayer();
        loadInventory();
        loadPreparedMeals();
        loadDiscoveredDragons();
        loadOwnedDragons();

        generateDailyWeather();

        updateWeatherDisplay();
        updatePlayerDisplay();
        updateInventoryDisplay();
        renderDragonDex();
        renderOwnedDragons();
        renderRecipes();
        updatePlainsDisplay();

        setInterval(
            updateWeatherDisplay,
            60000
        );
    }
);
