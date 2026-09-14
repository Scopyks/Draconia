// ======================================================
// DRACONIA - DONNÉES, MÉTÉO ET ÉTAT
// Extrait de l'ancien script principal, ordre de chargement conservé.
// ======================================================

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
    DraconiaConfig.storage.inventory;


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
    DraconiaConfig.storage.preparedMeals;


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
    DraconiaConfig.storage.weather;

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
        DraconiaStorage.getItem(
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

    DraconiaStorage.setItem(
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
    DraconiaStorage.setItem(
        DraconiaConfig.storage.player,
        JSON.stringify(player)
    );
}


// ======================================================
// CHARGEMENT DU JOUEUR
// ======================================================

function loadPlayer() {
    const savedPlayer =
        DraconiaStorage.getItem(
            DraconiaConfig.storage.player
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
    DraconiaStorage.setItem(
        INVENTORY_STORAGE_KEY,
        JSON.stringify(inventory)
    );
}


// ======================================================
// CHARGEMENT DE L'INVENTAIRE
// ======================================================

function loadInventory() {
    const savedInventory =
        DraconiaStorage.getItem(
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
    DraconiaStorage.setItem(
        MEALS_STORAGE_KEY,
        JSON.stringify(preparedMeals)
    );
}


// ======================================================
// CHARGEMENT DES PLATS
// ======================================================

function loadPreparedMeals() {
    const savedMeals =
        DraconiaStorage.getItem(
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
