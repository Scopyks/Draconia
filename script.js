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
// LISTE DES DRAGONS
// ======================================================

const dragons = [

    {
        id: "flambyra",
        name: "Flambyra",
        element: "Feu",
        rarity: "Commun",
        icon: "🔥🐉"
    },

    {
        id: "aquaryn",
        name: "Aquaryn",
        element: "Eau",
        rarity: "Commun",
        icon: "💧🐉"
    },

    {
        id: "floreon",
        name: "Floréon",
        element: "Nature",
        rarity: "Commun",
        icon: "🌿🐉"
    },

    {
        id: "zephyr",
        name: "Zéphyr",
        element: "Air",
        rarity: "Commun",
        icon: "🌪️🐉"
    },

    {
        id: "voltaris",
        name: "Voltaris",
        element: "Foudre",
        rarity: "Peu commun",
        icon: "⚡🐉"
    },

    {
        id: "cryon",
        name: "Cryon",
        element: "Glace",
        rarity: "Peu commun",
        icon: "❄️🐉"
    },

    {
        id: "terragon",
        name: "Terragon",
        element: "Terre",
        rarity: "Rare",
        icon: "🪨🐉"
    },

    {
        id: "noctyra",
        name: "Noctyra",
        element: "Ombre",
        rarity: "Rare",
        icon: "🌑🐉"
    },

    {
        id: "solarys",
        name: "Solarys",
        element: "Lumière",
        rarity: "Épique",
        icon: "☀️🐉"
    },

    {
        id: "astreon",
        name: "Astréon",
        element: "Cosmique",
        rarity: "Légendaire",
        icon: "🌌🐉"
    }

];


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

    return Object.values(
        inventory
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
            player.food;

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


    const resourceNames = {

        apple: "🍎 Pomme",
        berry: "🍓 Baie",
        herb: "🌿 Herbe",
        mushroom: "🍄 Champignon",
        insect: "🐛 Insecte",
        vegetable: "🥕 Légume"

    };


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


    // ==================================================
    // CHANCE DE TROUVER UN ŒUF
    // ==================================================

    const eggChance =
        Math.random();


    if (eggChance >= 0.60) {

        showEggMessage(
            "🌿 Tu explores les environs... mais tu ne trouves rien cette fois."
        );


        return;

    }


    // ==================================================
    // CHOIX DE LA RARETÉ
    // ==================================================

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


    // ==================================================
    // INFLUENCE DE LA MÉTÉO
    // ==================================================

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


    // ==================================================
    // CHOIX DU DRAGON
    // ==================================================

    const dragon =
        boostedDragons[
            Math.floor(
                Math.random() *
                boostedDragons.length
            )
        ];


    // ==================================================
    // NOUVEAU DRAGON
    // ==================================================

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

    }


    // ==================================================
    // DRAGON DÉJÀ DÉCOUVERT
    // ==================================================

    else {

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
                >
                    🍖 Nourrir
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
// NOURRIR UN DRAGON
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


    if (player.food <= 0) {

        alert(
            "🍖 Tu n'as plus de nourriture !"
        );

        return;

    }


    player.food -= 1;


    dragon.hunger =
        Math.min(
            100,
            dragon.hunger + 15
        );


    dragon.happiness =
        Math.min(
            100,
            dragon.happiness + 3
        );


    saveOwnedDragons(
        owned
    );


    renderOwnedDragons();

    updatePlayerDisplay();

    savePlayer();

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