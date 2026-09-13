// ======================================================
// DRACONIA 🐉
// SCRIPT PRINCIPAL
// ======================================================


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
// PLATS CUISINÉS
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
// RECETTES
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

            result[part.type] =
                part.value;

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

    const parts =
        getFranceDateParts();


    return `${parts.year}-${parts.month}-${parts.day}`;
}


// ======================================================
// JOUR / NUIT
// ======================================================

function isNight() {

    const hour =
        getFranceHour();


    return hour >= 21 || hour < 6;
}


// ======================================================
// TEMPÉRATURE
// ======================================================

function generateTemperature(weather) {

    const min =
        weather.minTemp;

    const max =
        weather.maxTemp;


    return Math.floor(
        Math.random() *
        (max - min + 1)
    ) + min;
}


// ======================================================
// GÉNÉRATION DE LA MÉTÉO DU JOUR
// ======================================================

function generateDailyWeather() {

    const today =
        getTodayDate();


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

        temperature:
            temperature

    };


    localStorage.setItem(

        WEATHER_STORAGE_KEY,

        JSON.stringify({

            date: today,

            weather:
                dailyWeather.id,

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
// COMPTER TOUS LES OBJETS DU SAC
// ======================================================

function getInventoryTotal() {

    const resourcesTotal =
        Object.values(
            inventory
        ).reduce(
            (total, amount) =>
                total + amount,
            0
        );


    const mealsTotal =
        Object.values(
            preparedMeals
        ).reduce(
            (total, amount) =>
                total + amount,
            0
        );


    return resourcesTotal + mealsTotal;

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


    const foodElement =
        document.getElementById(
            "food"
        );


    if (foodElement) {

        foodElement.textContent =
            getPreparedMealsTotal();

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
// RÉCOLTE DES RESSOURCES
// ======================================================

function gatherResources(location) {

    const resourcePools = {

        forest: [

            "apple",
            "berry",
            "herb",
            "mushroom",
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
// PÊCHE 🎣
// ======================================================

function goFishing() {

    const successChance =
        0.75;


    const success =
        Math.random() <
        successChance;


    if (!success) {

        const xpAmount = 1;

        const levelUp =
            addPlayerXP(
                xpAmount
            );


        if (levelUp) {

            showGatheringMessage(
                `🎣 Le poisson s'échappe... mais tu gagnes ${xpAmount} XP ! Niveau ${player.level} !`
            );

        } else {

            showGatheringMessage(
                "🎣 Le poisson s'échappe... Essaie encore ! +1 XP"
            );

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


    if (levelUp) {

        showGatheringMessage(
            `🎣 Belle pêche ! ${amount} × 🐟 Poisson ! +${xpAmount} XP • Niveau ${player.level} !`
        );

    } else {

        showGatheringMessage(
            `🎣 Belle pêche ! ${amount} × 🐟 Poisson ! +${xpAmount} XP`
        );

    }

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

        alert(
            `🍲 Tu n'as pas tous les ingrédients pour préparer ${recipe.name}.`
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

        alert(
            `🍲 ${recipe.name} est prêt ! +${xpAmount} XP • Niveau ${player.level} !`
        );

    } else {

        alert(
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
                    ${canCraft ? "" : "disabled"}
                >
                    ${canCraft ? "🍲 Cuisiner" : "🔒 Ingrédients manquants"}
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
// RECHERCHE D'UN DRAGON
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
                        bonusMap[bonus]
                            .includes(
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
// DRAGONDEX
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
            `🍲 ${dragon.name} a besoin de « ${recipe.name} » ! Va dans 🎒 Sac pour cuisiner ce plat.`
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