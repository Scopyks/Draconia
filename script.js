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
        description: "Un plat épicé qui réchauffe les dragons de Feu.",
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
        description: "Une soupe fraîche préparée avec les trésors du lac.",
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
        description: "Un mélange de fruits et de plantes sauvages.",
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
        description: "Une préparation légère adorée par les dragons du ciel.",
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
        description: "Un plat énergisant pour les dragons de Foudre.",
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
        description: "Un dessert fruité et glacé.",
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
        description: "Un plat copieux pour les dragons robustes.",
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
        description: "Une mystérieuse préparation aux ingrédients sauvages.",
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
        description: "Un nectar fruité rempli d'énergie.",
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
        description: "Une recette exceptionnelle pour les dragons légendaires.",
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
// ======================================================
// MINI-JEUX DE RÉCOLTE 🎮
// ======================================================
// ======================================================

// ======================================================
// ÉTAT GÉNÉRAL DES MINI-JEUX
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

let plainsWatered = false;
let plainsGrowing = false;
let plainsReady = false;
let plainsGrowthTimer = null;

let plainsPlants = [
    true,
    true,
    true,
    true
];

// ======================================================
// CHASSE 🏹
// ======================================================

let huntingInterval = null;
let huntingDuckVisible = false;
let huntingDuckTimeout = null;

// ======================================================
// OUVRIR UN MINI-JEU
// ======================================================

function openGatheringGame(game) {
    closeGatheringGame();

    currentGatheringGame = game;

    const gameElement =
        document.getElementById(
            `${game}-game`
        );

    if (!gameElement) {
        console.log(
            `Mini-jeu introuvable : ${game}`
        );

        return;
    }

    gameElement.style.display =
        "block";

    if (game === "forest") {
        startForestGame();
    }

    if (game === "plains") {
        startPlainsGame();
    }

    if (game === "fishing") {
        startFishingGame();
    }

    if (game === "hunting") {
        startHuntingGame();
    }
}

// ======================================================
// FERMER UN MINI-JEU
// ======================================================

function closeGatheringGame() {
    const games = [
        "forest",
        "plains",
        "fishing",
        "hunting"
    ];

    games.forEach(game => {
        const element =
            document.getElementById(
                `${game}-game`
            );

        if (element) {
            element.style.display =
                "none";
        }
    });

    stopFishingGame();
    stopHuntingGame();

    currentGatheringGame = null;
}

// ======================================================
// FORÊT : DÉMARRAGE 🌲
// ======================================================

function startForestGame() {
    renderForestMushrooms();

    const message =
        document.getElementById(
            "forest-tree-message"
        );

    if (message) {
        message.textContent =
            "🌲 Secoue l'arbre pour faire tomber des ressources !";
    }

    const gameMessage =
        document.getElementById(
            "forest-game-message"
        );

    if (gameMessage) {
        gameMessage.textContent =
            "";
    }
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

    const possibleResources = [
        "apple",
        "berry",
        "herb",
        "insect"
    ];

    const resource =
        possibleResources[
            Math.floor(
                Math.random() *
                possibleResources.length
            )
        ];

    const amount =
        Math.floor(
            Math.random() * 3
        ) + 1;

    addResource(
        resource,
        amount
    );

    const xpAmount = 2;

    const levelUp =
        addPlayerXP(
            xpAmount
        );

    const message =
        document.getElementById(
            "forest-tree-message"
        );

    if (message) {
        if (levelUp) {
            message.textContent =
                `🌳 L'arbre tremble ! ${amount} × ${resourceNames[resource]} tombent ! +${xpAmount} XP • Niveau ${player.level} !`;
        } else {
            message.textContent =
                `🌳 L'arbre tremble ! ${amount} × ${resourceNames[resource]} tombent ! +${xpAmount} XP`;
        }
    }
}

// ======================================================
// FORÊT : AFFICHER LES CHAMPIGNONS 🍄
// ======================================================

function renderForestMushrooms() {
    const container =
        document.getElementById(
            "forest-mushrooms"
        );

    if (!container) {
        return;
    }

    const buttons =
        container.querySelectorAll(
            "button"
        );

    buttons.forEach(
        (button, index) => {
            if (
                forestMushrooms[index]
            ) {
                button.style.display =
                    "block";

                button.disabled =
                    false;

                button.textContent =
                    "🍄";
            } else {
                button.style.display =
                    "none";
            }
        }
    );
}

// ======================================================
// FORÊT : CUEILLIR UN CHAMPIGNON 🍄
// ======================================================

function pickMushroom(index) {
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

    const xpAmount = 2;

    addPlayerXP(
        xpAmount
    );

    renderForestMushrooms();

    const message =
        document.getElementById(
            "forest-game-message"
        );

    if (message) {
        message.textContent =
            `🍄 Tu ramasses un champignon ! +1 🍄 • +${xpAmount} XP`;
    }

    forestMushroomTimers[index] =
        setTimeout(
            () => {
                forestMushrooms[index] =
                    true;

                renderForestMushrooms();

                const respawnMessage =
                    document.getElementById(
                        "forest-game-message"
                    );

                if (
                    respawnMessage &&
                    currentGatheringGame ===
                        "forest"
                ) {
                    respawnMessage.textContent =
                        `🍄 Un champignon a repoussé !`;
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

    const message =
        document.getElementById(
            "watering-message"
        );

    if (message) {
        if (plainsReady) {
            message.textContent =
                "🌾 Les plantations sont prêtes à être récoltées !";
        } else if (plainsGrowing) {
            message.textContent =
                "🌱 Les plantations poussent... encore un peu de patience !";
        } else {
            message.textContent =
                "💧 Arrose les plantations pour commencer leur croissance.";
        }
    }
}

// ======================================================
// PLAINES : ARROSER 💧
// ======================================================

function waterPlants() {
    if (
        plainsGrowing ||
        plainsReady
    ) {
        return;
    }

    plainsWatered = true;
    plainsGrowing = true;

    const button =
        document.getElementById(
            "watering-button"
        );

    if (button) {
        button.disabled =
            true;

        button.textContent =
            "💧 Plantation arrosée";
    }

    const message =
        document.getElementById(
            "watering-message"
        );

    if (message) {
        message.textContent =
            "💧 C'est arrosé ! Les plantes vont pousser pendant 1 minute.";
    }

    const growthMessage =
        document.getElementById(
            "plants-growth-message"
        );

    if (growthMessage) {
        growthMessage.textContent =
            "🌱 Croissance en cours... 1 minute restante.";
    }

    plainsGrowthTimer =
        setTimeout(
            () => {
                plainsGrowing =
                    false;

                plainsReady =
                    true;

                plainsWatered =
                    true;

                updatePlainsDisplay();

                const readyMessage =
                    document.getElementById(
                        "plants-growth-message"
                    );

                if (readyMessage) {
                    readyMessage.textContent =
                        "🌾 Les plantes ont poussé ! Tu peux maintenant les récolter.";
                }
            },
            60000
        );
}

// ======================================================
// PLAINES : AFFICHAGE 🌾
// ======================================================

function updatePlainsDisplay() {
    const plantsGrid =
        document.getElementById(
            "plants-grid"
        );

    if (plantsGrid) {
        const buttons =
            plantsGrid.querySelectorAll(
                "button"
            );

        buttons.forEach(
            (button, index) => {
                if (
                    !plainsPlants[index]
                ) {
                    button.style.display =
                        "none";

                    return;
                }

                button.style.display =
                    "block";

                button.disabled =
                    !plainsReady;

                if (plainsReady) {
                    button.textContent =
                        "🌾 Récolter";
                } else if (
                    plainsGrowing
                ) {
                    button.textContent =
                        "🌱";
                } else {
                    button.textContent =
                        "🌱";
                }
            }
        );
    }

    const wateringButton =
        document.getElementById(
            "watering-button"
        );

    if (wateringButton) {
        wateringButton.disabled =
            plainsGrowing ||
            plainsReady;

        if (plainsReady) {
            wateringButton.textContent =
                "🌾 Prêt !";
        } else if (
            plainsGrowing
        ) {
            wateringButton.textContent =
                "🌱 Ça pousse...";
        } else {
            wateringButton.textContent =
                "💧 Arroser";
        }
    }
}

// ======================================================
// PLAINES : RÉCOLTER 🌾
// ======================================================

function harvestPlant(index) {
    if (
        !plainsReady ||
        !plainsPlants[index]
    ) {
        return;
    }

    plainsPlants[index] =
        false;

    const possibleResources = [
        "vegetable",
        "herb",
        "berry",
        "apple"
    ];

    const resource =
        possibleResources[
            Math.floor(
                Math.random() *
                possibleResources.length
            )
        ];

    const amount =
        Math.floor(
            Math.random() * 2
        ) + 1;

    addResource(
        resource,
        amount
    );

    const xpAmount = 3;

    const levelUp =
        addPlayerXP(
            xpAmount
        );

    updatePlainsDisplay();

    const message =
        document.getElementById(
            "plains-game-message"
        );

    if (message) {
        if (levelUp) {
            message.textContent =
                `🌾 Récolte réussie ! ${amount} × ${resourceNames[resource]} ! +${xpAmount} XP • Niveau ${player.level} !`;
        } else {
            message.textContent =
                `🌾 Récolte réussie ! ${amount} × ${resourceNames[resource]} ! +${xpAmount} XP`;
        }
    }

    const allHarvested =
        plainsPlants.every(
            plant => !plant
        );

    if (allHarvested) {
        setTimeout(
            () => {
                plainsPlants = [
                    true,
                    true,
                    true,
                    true
                ];

                plainsWatered =
                    false;

                plainsReady =
                    false;

                updatePlainsDisplay();

                const wateringMessage =
                    document.getElementById(
                        "watering-message"
                    );

                if (wateringMessage) {
                    wateringMessage.textContent =
                        "🌱 Les nouvelles plantations sont prêtes à être arrosées.";
                }

                const growthMessage =
                    document.getElementById(
                        "plants-growth-message"
                    );

                if (growthMessage) {
                    growthMessage.textContent =
                        "";
                }
            },
            1000
        );
    }
}

// ======================================================
// PÊCHE : DÉMARRAGE 🎣
// ======================================================

function startFishingGame() {
    stopFishingGame();

    fishingActive = true;

    fishingArrowPosition = 0;
    fishingArrowDirection = 1;

    fishingGreenStart =
        Math.floor(
            Math.random() * 55
        ) + 20;

    fishingGreenWidth =
        Math.floor(
            Math.random() * 16
        ) + 20;

    const status =
        document.getElementById(
            "fishing-status"
        );

    if (status) {
        status.textContent =
            "🎣 Attends le bon moment puis appuie sur Attraper !";
    }

    updateFishingBar();

    fishingInterval =
        setInterval(
            moveFishingArrow,
            30
        );
}

// ======================================================
// PÊCHE : ARRÊTER 🎣
// ======================================================

function stopFishingGame() {
    fishingActive = false;

    if (fishingInterval) {
        clearInterval(
            fishingInterval
        );

        fishingInterval =
            null;
    }
}

// ======================================================
// PÊCHE : DÉPLACER LA FLÈCHE 🎣
// ======================================================

function moveFishingArrow() {
    if (!fishingActive) {
        return;
    }

    fishingArrowPosition +=
        fishingArrowDirection *
        1.2;

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

    updateFishingBar();
}

// ======================================================
// PÊCHE : AFFICHAGE DE LA BARRE 🎣
// ======================================================

function updateFishingBar() {
    const arrow =
        document.getElementById(
            "fishing-arrow"
        );

    const greenZone =
        document.getElementById(
            "fishing-green-zone"
        );

    if (arrow) {
        arrow.style.left =
            `${fishingArrowPosition}%`;
    }

    if (greenZone) {
        greenZone.style.left =
            `${fishingGreenStart}%`;

        greenZone.style.width =
            `${fishingGreenWidth}%`;
    }
}

// ======================================================
// PÊCHE : ATTRAPER LE POISSON 🎣
// ======================================================

function catchFish() {
    if (!fishingActive) {
        return;
    }

    const success =
        fishingArrowPosition >=
            fishingGreenStart &&
        fishingArrowPosition <=
            fishingGreenStart +
                fishingGreenWidth;

    stopFishingGame();

    const status =
        document.getElementById(
            "fishing-status"
        );

    const message =
        document.getElementById(
            "fishing-game-message"
        );

    if (!success) {
        addPlayerXP(1);

        if (status) {
            status.textContent =
                "💨 Trop tard ! Le poisson s'échappe !";
        }

        if (message) {
            message.textContent =
                "🐟 Le poisson a filé ! +1 XP";
        }

        return;
    }

    const amount =
        Math.floor(
            Math.random() * 3
        ) + 1;

    addResource(
        "fish",
        amount
    );

    const xpAmount = 3;

    const levelUp =
        addPlayerXP(
            xpAmount
        );

    if (status) {
        status.textContent =
            "🎉 Parfait ! Tu as attrapé le poisson !";
    }

    if (message) {
        if (levelUp) {
            message.textContent =
                `🎣 Super pêche ! ${amount} × 🐟 Poisson ! +${xpAmount} XP • Niveau ${player.level} !`;
        } else {
            message.textContent =
                `🎣 Super pêche ! ${amount} × 🐟 Poisson ! +${xpAmount} XP`;
        }
    }

    setTimeout(
        () => {
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
// CHASSE : DÉMARRAGE 🏹
// ======================================================

function startHuntingGame() {
    stopHuntingGame();

    huntingDuckVisible =
        false;

    const duck =
        document.getElementById(
            "hunting-duck"
        );

    if (duck) {
        duck.style.display =
            "none";
    }

    const status =
        document.getElementById(
            "hunting-status"
        );

    if (status) {
        status.textContent =
            "🏹 Attends qu'un canard apparaisse...";
    }

    huntingInterval =
        setInterval(
            huntingDuckAttempt,
            10000
        );

    huntingDuckAttempt();
}

// ======================================================
// CHASSE : ARRÊTER 🏹
// ======================================================

function stopHuntingGame() {
    if (huntingInterval) {
        clearInterval(
            huntingInterval
        );

        huntingInterval =
            null;
    }

    if (huntingDuckTimeout) {
        clearTimeout(
            huntingDuckTimeout
        );

        huntingDuckTimeout =
            null;
    }

    huntingDuckVisible =
        false;
}

// ======================================================
// CHASSE : APPARITION DU CANARD 🦆
// ======================================================

function huntingDuckAttempt() {
    if (
        currentGatheringGame !==
        "hunting"
    ) {
        return;
    }

    if (huntingDuckVisible) {
        return;
    }

    const appears =
        Math.random() < 0.20;

    if (!appears) {
        const status =
            document.getElementById(
                "hunting-status"
            );

        if (status) {
            status.textContent =
                "🏹 Rien pour le moment... Observe bien !";
        }

        return;
    }

    const duck =
        document.getElementById(
            "hunting-duck"
        );

    const field =
        document.getElementById(
            "hunting-field"
        );

    if (!duck || !field) {
        return;
    }

    huntingDuckVisible =
        true;

    duck.style.display =
        "block";

    const maxLeft =
        Math.max(
            10,
            field.clientWidth - 70
        );

    const maxTop =
        Math.max(
            10,
            field.clientHeight - 70
        );

    duck.style.left =
        `${Math.floor(Math.random() * maxLeft)}px`;

    duck.style.top =
        `${Math.floor(Math.random() * maxTop)}px`;

    const status =
        document.getElementById(
            "hunting-status"
        );

    if (status) {
        status.textContent =
            "🦆 UN CANARD ! Vite, tire avec ton arc !";
    }

    huntingDuckTimeout =
        setTimeout(
            () => {
                if (
                    huntingDuckVisible
                ) {
                    huntingDuckVisible =
                        false;

                    duck.style.display =
                        "none";

                    if (status) {
                        status.textContent =
                            "💨 Le canard s'est échappé !";
                    }
                }
            },
            3500
        );
}

// ======================================================
// CHASSE : TIRER 🏹
// ======================================================

function shootDuck() {
    if (
        !huntingDuckVisible
    ) {
        const message =
            document.getElementById(
                "hunting-game-message"
            );

        if (message) {
            message.textContent =
                "🏹 Pas de canard en vue !";
        }

        return;
    }

    const duck =
        document.getElementById(
            "hunting-duck"
        );

    huntingDuckVisible =
        false;

    if (huntingDuckTimeout) {
        clearTimeout(
            huntingDuckTimeout
        );

        huntingDuckTimeout =
            null;
    }

    if (duck) {
        duck.style.display =
            "none";
    }

    const hitChance =
        0.65;

    const hit =
        Math.random() <
        hitChance;

    const status =
        document.getElementById(
            "hunting-status"
        );

    const message =
        document.getElementById(
            "hunting-game-message"
        );

    if (!hit) {
        addPlayerXP(1);

        if (status) {
            status.textContent =
                "💨 Raté ! Le canard s'enfuit.";
        }

        if (message) {
            message.textContent =
                "🏹 Raté ! +1 XP";
        }

        return;
    }

    const amount =
        Math.floor(
            Math.random() * 3
        ) + 1;

    addResource(
        "meat",
        amount
    );

    const xpAmount = 3;

    const levelUp =
        addPlayerXP(
            xpAmount
        );

    if (status) {
        status.textContent =
            "🎯 Touché !";
    }

    if (message) {
        if (levelUp) {
            message.textContent =
                `🏹 Chasse réussie ! ${amount} × 🍖 Viande ! +${xpAmount} XP • Niveau ${player.level} !`;
        } else {
            message.textContent =
                `🏹 Chasse réussie ! ${amount} × 🍖 Viande ! +${xpAmount} XP`;
        }
    }
}

// ======================================================
// ANCIEN SYSTÈME DE RÉCOLTE
// Conservé pour éviter de casser d'anciens boutons.
// ======================================================

function gatherResources(location) {
    const resourcePools = {
        forest: [
            "apple",
            "berry",
            "herb",
            "insect"
        ],
        plains: [
            "vegetable",
            "herb",
            "berry",
            "apple"
        ]
    };

    const pool =
        resourcePools[location];

    if (!pool) {
        console.log(
            `Zone inconnue : ${location}`
        );

        return;
    }

    const resource =
        pool[
            Math.floor(
                Math.random() *
                pool.length
            )
        ];

    const amount =
        Math.floor(
            Math.random() * 2
        ) + 1;

    addResource(
        resource,
        amount
    );

    const xpAmount = 2;

    const levelUp =
        addPlayerXP(
            xpAmount
        );

    const resourceName =
        resourceNames[resource] ||
        resource;

    if (levelUp) {
        showGatheringMessage(
            `✨ Tu trouves ${amount} × ${resourceName} ! +${xpAmount} XP • Niveau ${player.level} !`
        );
    } else {
        showGatheringMessage(
            `🌿 Tu trouves ${amount} × ${resourceName} ! +${xpAmount} XP`
        );
    }
}

// ======================================================
// ANCIENNE PÊCHE
// Conservée comme sécurité.
// ======================================================

function goFishing() {
    openGatheringGame(
        "fishing"
    );
}

// ======================================================
// ANCIENNE CHASSE
// Conservée comme sécurité.
// ======================================================

function goHunting() {
    openGatheringGame(
        "hunting"
    );
}

// ======================================================
// BARRE D'XP DU JOUEUR
// ======================================================

function updateXPBar() {
    const xpFill =
        document.getElementById(
            "xp-fill"
        );

    if (!xpFill) {
        return;
    }

    const percentage =
        Math.min(
            player.xp,
            100
        );

    xpFill.style.width =
        `${percentage}%`;
}

// ======================================================
// VÉRIFIER LES INGRÉDIENTS D'UNE RECETTE
// ======================================================

function canCraftRecipe(recipe) {
    return Object.entries(
        recipe.ingredients
    ).every(
        ([resource, amount]) =>
            inventory[resource] >= amount
    );
}

// ======================================================
// INGRÉDIENTS MANQUANTS
// ======================================================

function getMissingIngredients(recipe) {
    return Object.entries(
        recipe.ingredients
    )
        .filter(
            ([resource, amount]) =>
                (inventory[resource] || 0) < amount
        )
        .map(
            ([resource, amount]) => {
                const current =
                    inventory[resource] || 0;

                return `${resourceNames[resource]} ${current}/${amount}`;
            }
        );
}

// ======================================================
// TEXTE DES INGRÉDIENTS
// ======================================================

function getRecipeIngredientsText(recipe) {
    return Object.entries(
        recipe.ingredients
    )
        .map(
            ([resource, amount]) =>
                `${amount} × ${resourceNames[resource]}`
        )
        .join(" • ");
}

// ======================================================
// CUISINER UNE RECETTE 🍲
// ======================================================

function cookRecipe(recipeId) {
    const recipe =
        recipes.find(
            currentRecipe =>
                currentRecipe.id ===
                recipeId
        );

    if (!recipe) {
        return;
    }

    if (
        !canCraftRecipe(recipe)
    ) {
        const missing =
            getMissingIngredients(
                recipe
            );

        showCookingMessage(
            `❌ Il te manque : ${missing.join(" • ")}`
        );

        return;
    }

    Object.entries(
        recipe.ingredients
    )
        .forEach(
            ([resource, amount]) => {
                inventory[resource] -= amount;
            }
        );

    preparedMeals[recipe.id] =
        (preparedMeals[recipe.id] || 0) + 1;

    saveInventory();
    savePreparedMeals();

    const xpAmount = 4;

    const levelUp =
        addPlayerXP(
            xpAmount
        );

    updateInventoryDisplay();
    updatePlayerDisplay();

    if (levelUp) {
        showCookingMessage(
            `✨ ${recipe.icon} ${recipe.name} est prêt ! +${xpAmount} XP • Niveau ${player.level} !`
        );
    } else {
        showCookingMessage(
            `🍲 ${recipe.icon} ${recipe.name} est prêt ! +${xpAmount} XP`
        );
    }
}

// ======================================================
// AFFICHAGE DES RECETTES 🍲
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

    recipes.forEach(recipe => {
        const card =
            document.createElement(
                "div"
            );

        card.className =
            "inventory-item";

        const canCraft =
            canCraftRecipe(
                recipe
            );

        const mealCount =
            preparedMeals[recipe.id] || 0;

        const ingredientsText =
            getRecipeIngredientsText(
                recipe
            );

        const buttonText =
            canCraft
                ? "🍲 Cuisiner"
                : "🥕 Voir les ingrédients";

        card.innerHTML = `
            <div class="inventory-item-icon">
                ${recipe.icon}
            </div>

            <div class="inventory-item-info">
                <h4>
                    ${recipe.name}
                </h4>

                <p>
                    ${recipe.description}
                </p>

                <p>
                    🐉 Dragons ${recipe.element}
                </p>

                <p>
                    🥕 ${ingredientsText}
                </p>

                <button
                    class="gather-button"
                    onclick="cookRecipe('${recipe.id}')"
                >
                    ${buttonText}
                </button>
            </div>

            <b class="inventory-item-count">
                ${mealCount}
            </b>
        `;

        list.appendChild(card);
    });
}

// ======================================================
// DRAGONS DÉCOUVERTS
// ======================================================

function getDiscoveredDragons() {
    const saved =
        localStorage.getItem(
            "draconiaDiscoveredDragons"
        );

    if (!saved) {
        return [];
    }

    try {
        return JSON.parse(saved);
    } catch (error) {
        return [];
    }
}

function saveDiscoveredDragons(list) {
    localStorage.setItem(
        "draconiaDiscoveredDragons",
        JSON.stringify(list)
    );
}

// ======================================================
// DRAGONS POSSÉDÉS
// ======================================================

function getOwnedDragons() {
    const saved =
        localStorage.getItem(
            "draconiaOwnedDragons"
        );

    if (!saved) {
        return [];
    }

    try {
        return JSON.parse(saved);
    } catch (error) {
        return [];
    }
}

function saveOwnedDragons(list) {
    localStorage.setItem(
        "draconiaOwnedDragons",
        JSON.stringify(list)
    );
}

// ======================================================
// CRÉATION D'UN DRAGON POSSÉDÉ
// ======================================================

function createOwnedDragon(dragon) {
    return {
        id: dragon.id,
        name: dragon.name,
        element: dragon.element,
        rarity: dragon.rarity,
        icon: dragon.icon,
        level: 1,
        xp: 0,
        hunger: 80,
        happiness: 70,
        cleanliness: 90
    };
}

// ======================================================
// RÉCUPÉRER UN DRAGON
// ======================================================

function getOwnedDragon(dragonId) {
    const ownedDragons =
        getOwnedDragons();

    return ownedDragons.find(
        dragon =>
            dragon.id === dragonId
    );
}

// ======================================================
// XP D'UN DRAGON
// ======================================================

function addDragonXP(
    dragon,
    amount
) {
    dragon.xp += amount;

    let levelUp = false;

    while (
        dragon.xp >= 100
    ) {
        dragon.xp -= 100;
        dragon.level += 1;
        levelUp = true;
    }

    return levelUp;
}

// ======================================================
// CHANCE DE RARETÉ
// ======================================================

function chooseRarity() {
    const random =
        Math.random() * 100;

    if (random < 55) {
        return "Commun";
    }

    if (random < 80) {
        return "Peu commun";
    }

    if (random < 93) {
        return "Rare";
    }

    if (random < 99) {
        return "Épique";
    }

    return "Légendaire";
}

// ======================================================
// RECHERCHE D'UN DRAGON 🐉
// ======================================================

function findEgg() {
    const discovered =
        getDiscoveredDragons();

    const owned =
        getOwnedDragons();

    const eggChance =
        Math.random();

    if (eggChance >= 0.60) {
        showEggMessage(
            "🌿 Tu explores les environs... mais tu ne trouves rien cette fois."
        );

        return;
    }

    const rarity =
        chooseRarity();

    let possibleDragons =
        dragons.filter(
            dragon =>
                dragon.rarity ===
                rarity
        );

    if (
        possibleDragons.length ===
        0
    ) {
        possibleDragons =
            dragons;
    }

    const bonus =
        getWeatherBonus();

    let boostedDragons =
        possibleDragons;

    if (bonus) {
        const bonusMap = {
            fire: ["Feu"],
            water: ["Eau"],
            nature: ["Nature"],
            air: ["Air"],
            lightning: ["Foudre"],
            ice: ["Glace"],
            shadow: ["Ombre"],
            sun: ["Lumière"]
        };

        if (bonusMap[bonus]) {
            const matching =
                possibleDragons.filter(
                    dragon =>
                        bonusMap[bonus].includes(
                            dragon.element
                        )
                );

            if (
                matching.length > 0
            ) {
                boostedDragons =
                    Math.random() < 0.65
                        ? matching
                        : possibleDragons;
            }
        }
    }

    const dragon =
        boostedDragons[
            Math.floor(
                Math.random() *
                boostedDragons.length
            )
        ];

    if (!dragon) {
        showEggMessage(
            "🌿 Tu explores Draconia... mais aucun dragon n'est apparu."
        );

        return;
    }

    if (
        !discovered.includes(
            dragon.id
        )
    ) {
        discovered.push(
            dragon.id
        );

        saveDiscoveredDragons(
            discovered
        );

        const newDragon =
            createOwnedDragon(
                dragon
            );

        owned.push(
            newDragon
        );

        saveOwnedDragons(
            owned
        );

        player.xp += 10;

        if (player.xp >= 100) {
            player.level += 1;
            player.xp -= 100;

            showEggMessage(
                `🎉 ${dragon.name} rejoint ton refuge ! Tu passes niveau ${player.level} !`
            );
        } else {
            showEggMessage(
                `🎉 Un œuf ! Tu découvres ${dragon.name} ! +10 XP`
            );
        }
    } else {
        const ownedDragon =
            owned.find(
                currentDragon =>
                    currentDragon.id ===
                    dragon.id
            );

        if (ownedDragon) {
            const levelUp =
                addDragonXP(
                    ownedDragon,
                    5
                );

            saveOwnedDragons(
                owned
            );

            player.xp += 5;

            if (levelUp) {
                showEggMessage(
                    `🔁 Doublon ! ${dragon.name} gagne 5 XP et passe niveau ${ownedDragon.level} !`
                );
            } else {
                showEggMessage(
                    `🔁 Tu trouves un œuf... c'est ${dragon.name} ! +5 XP pour ton dragon.`
                );
            }
        }
    }

    updatePlayerDisplay();
    renderOwnedDragons();
    updateDragonDex();
    savePlayer();
}

// ======================================================
// MESSAGE APRÈS EXPLORATION
// ======================================================

function showEggMessage(message) {
    const elements = [
        document.getElementById(
            "egg-message"
        ),
        document.getElementById(
            "egg-message-page"
        )
    ];

    elements.forEach(element => {
        if (element) {
            element.textContent =
                message;
        }
    });
}

// ======================================================
// AFFICHAGE DES DRAGONS POSSÉDÉS
// ======================================================

function renderOwnedDragons() {
    const list =
        document.getElementById(
            "owned-dragons-list"
        );

    const emptyMessage =
        document.getElementById(
            "no-dragons"
        );

    const counter =
        document.getElementById(
            "owned-dragons-count"
        );

    if (!list) {
        return;
    }

    const owned =
        getOwnedDragons();

    if (counter) {
        counter.textContent =
            owned.length;
    }

    list.innerHTML = "";

    if (owned.length === 0) {
        if (emptyMessage) {
            emptyMessage.style.display =
                "block";
        }

        return;
    }

    if (emptyMessage) {
        emptyMessage.style.display =
            "none";
    }

    owned.forEach(dragon => {
        const card =
            document.createElement(
                "article"
            );

        card.className =
            "owned-dragon-card";

        const xpPercentage =
            Math.min(
                dragon.xp,
                100
            );

        const compatibleRecipe =
            recipes.find(
                recipe =>
                    recipe.element ===
                    dragon.element
            );

        const compatibleMealCount =
            compatibleRecipe
                ? preparedMeals[
                    compatibleRecipe.id
                ] || 0
                : 0;

        card.innerHTML = `
            <div class="owned-dragon-top">
                <div class="owned-dragon-icon">
                    ${dragon.icon}
                </div>

                <div class="owned-dragon-info">
                    <p class="rarity">
                        ${dragon.rarity.toUpperCase()}
                    </p>

                    <h3>
                        ${dragon.name}
                    </h3>

                    <p>
                        ${dragon.element}
                    </p>
                </div>

                <div class="dragon-level">
                    <span>
                        Niveau
                    </span>

                    <strong>
                        ${dragon.level}
                    </strong>
                </div>
            </div>

            <div class="dragon-xp-section">
                <div class="dragon-xp-info">
                    <span>
                        ⭐ XP
                    </span>

                    <span>
                        ${dragon.xp} / 100
                    </span>
                </div>

                <div class="dragon-xp-bar">
                    <div
                        class="dragon-xp-fill"
                        style="width: ${xpPercentage}%"
                    ></div>
                </div>
            </div>

            <div class="dragon-care-stats">
                <div class="dragon-care-stat">
                    <span>
                        🍖
                    </span>

                    <small>
                        Faim
                    </small>

                    <strong>
                        ${dragon.hunger}%
                    </strong>
                </div>

                <div class="dragon-care-stat">
                    <span>
                        😊
                    </span>

                    <small>
                        Bonheur
                    </small>

                    <strong>
                        ${dragon.happiness}%
                    </strong>
                </div>

                <div class="dragon-care-stat">
                    <span>
                        🧼
                    </span>

                    <small>
                        Propreté
                    </small>

                    <strong>
                        ${dragon.cleanliness}%
                    </strong>
                </div>
            </div>

            <div class="dragon-care-actions">
                <button
                    onclick="feedDragon('${dragon.id}')"
                    ${compatibleMealCount > 0 ? "" : "disabled"}
                >
                    🍲 Nourrir
                </button>

                <button
                    onclick="washDragon('${dragon.id}')"
                >
                    🧼 Laver
                </button>

                <button
                    onclick="playDragon('${dragon.id}')"
                >
                    🎮 Jouer
                </button>
            </div>
        `;

        list.appendChild(card);
    });
}

// ======================================================
// DRAGONDEX 📖
// ======================================================

function updateDragonDex() {
    const list =
        document.getElementById(
            "dragon-list"
        );

    const counter =
        document.getElementById(
            "dex-count"
        );

    if (!list) {
        return;
    }

    const discovered =
        getDiscoveredDragons();

    if (counter) {
        counter.textContent =
            discovered.length;
    }

    list.innerHTML = "";

    dragons.forEach(dragon => {
        const isDiscovered =
            discovered.includes(
                dragon.id
            );

        const item =
            document.createElement(
                "div"
            );

        item.className =
            "dragon-dex-item";

        if (!isDiscovered) {
            item.innerHTML = `
                <div class="dex-dragon-icon">
                    ❓
                </div>

                <div>
                    <strong>
                        Dragon inconnu
                    </strong>

                    <p>
                        ???
                    </p>
                </div>
            `;
        } else {
            item.innerHTML = `
                <div class="dex-dragon-icon">
                    ${dragon.icon}
                </div>

                <div>
                    <strong>
                        ${dragon.name}
                    </strong>

                    <p>
                        ${dragon.element} • ${dragon.rarity}
                    </p>
                </div>
            `;
        }

        list.appendChild(item);
    });
}

// ======================================================
// NAVIGATION
// ======================================================

function showPage(page) {
    const pages = [
        "home",
        "dragons",
        "dex",
        "inventory",
        "cooking",
        "profile"
    ];

    pages.forEach(pageName => {
        const pageElement =
            document.getElementById(
                `${pageName}-page`
            );

        if (pageElement) {
            pageElement.style.display =
                pageName === page
                    ? "block"
                    : "none";
        }

        const navElement =
            document.getElementById(
                `nav-${pageName}`
            );

        if (navElement) {
            navElement.classList.toggle(
                "active",
                pageName === page
            );
        }
    });

    if (page === "dex") {
        updateDragonDex();
    }

    if (page === "dragons") {
        renderOwnedDragons();
    }

    if (page === "inventory") {
        updateInventoryDisplay();
    }

    if (page === "cooking") {
        renderRecipes();
    }
}

// ======================================================
// NOURRIR UN DRAGON 🍲
// ======================================================

function feedDragon(dragonId) {
    const owned =
        getOwnedDragons();

    const dragon =
        owned.find(
            currentDragon =>
                currentDragon.id ===
                dragonId
        );

    if (!dragon) {
        return;
    }

    const recipe =
        recipes.find(
            currentRecipe =>
                currentRecipe.element ===
                dragon.element
        );

    if (!recipe) {
        alert(
            "🍲 Aucun plat adapté à ce dragon."
        );

        return;
    }

    const mealCount =
        preparedMeals[recipe.id] || 0;

    if (mealCount <= 0) {
        alert(
            `🍲 ${dragon.name} a besoin de « ${recipe.name} » ! Va dans 🍲 Marmite pour préparer ce plat.`
        );

        return;
    }

    preparedMeals[recipe.id] -= 1;

    dragon.hunger =
        Math.min(
            100,
            dragon.hunger + 25
        );

    dragon.happiness =
        Math.min(
            100,
            dragon.happiness + 10
        );

    const levelUp =
        addDragonXP(
            dragon,
            8
        );

    savePreparedMeals();

    saveOwnedDragons(
        owned
    );

    updateInventoryDisplay();
    updatePlayerDisplay();
    renderOwnedDragons();

    if (levelUp) {
        alert(
            `🍲 ${dragon.name} adore son ${recipe.name} ! ⭐ Il passe niveau ${dragon.level} !`
        );
    } else {
        alert(
            `🍲 ${dragon.name} mange son ${recipe.name} avec plaisir ! ❤️`
        );
    }
}

// ======================================================
// LAVER UN DRAGON
// ======================================================

function washDragon(dragonId) {
    const owned =
        getOwnedDragons();

    const dragon =
        owned.find(
            currentDragon =>
                currentDragon.id ===
                dragonId
        );

    if (!dragon) {
        return;
    }

    dragon.cleanliness =
        Math.min(
            100,
            dragon.cleanliness + 20
        );

    dragon.happiness =
        Math.min(
            100,
            dragon.happiness + 5
        );

    saveOwnedDragons(
        owned
    );

    renderOwnedDragons();
}

// ======================================================
// JOUER AVEC UN DRAGON
// ======================================================

function playDragon(dragonId) {
    const owned =
        getOwnedDragons();

    const dragon =
        owned.find(
            currentDragon =>
                currentDragon.id ===
                dragonId
        );

    if (!dragon) {
        return;
    }

    dragon.happiness =
        Math.min(
            100,
            dragon.happiness + 15
        );

    dragon.hunger =
        Math.max(
            0,
            dragon.hunger - 5
        );

    saveOwnedDragons(
        owned
    );

    renderOwnedDragons();
}

// ======================================================
// INITIALISATION
// ======================================================

function initGame() {
    loadPlayer();
    loadInventory();
    loadPreparedMeals();

    generateDailyWeather();

    updateWeatherDisplay();
    updatePlayerDisplay();
    updateInventoryDisplay();
    updateDragonDex();
    renderOwnedDragons();
}

// ======================================================
// MISE À JOUR DE LA MÉTÉO
// ======================================================

setInterval(
    updateWeatherDisplay,
    30000
);

// ======================================================
// LANCEMENT DU JEU
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    initGame
);