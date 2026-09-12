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
    level: 1,

    hunger: 80,
    happiness: 70,
    cleanliness: 90
};


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

// Nouvelle clé volontairement différente.
// Cela évite qu'une ancienne météo enregistrée bloque
// la nouvelle version du jeu.

const WEATHER_STORAGE_KEY = "draconiaDailyWeatherV2";


const weatherTypes = [

    {
        id: "sunny",
        name: "Ensoleillé",
        icon: "☀️"
    },

    {
        id: "cloudy",
        name: "Nuageux",
        icon: "☁️"
    },

    {
        id: "rain",
        name: "Pluvieux",
        icon: "🌧️"
    },

    {
        id: "storm",
        name: "Orageux",
        icon: "⛈️"
    },

    {
        id: "snow",
        name: "Neigeux",
        icon: "🌨️"
    },

    {
        id: "fog",
        name: "Brouillard",
        icon: "🌫️"
    },

    {
        id: "wind",
        name: "Venteux",
        icon: "🌪️"
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


    const hourPart = parts.find(
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
// GÉNÉRATION DE LA MÉTÉO DU JOUR
// ======================================================

function generateDailyWeather() {

    const today = getTodayDate();

    const savedWeather =
        localStorage.getItem(WEATHER_STORAGE_KEY);


    // On essaie de récupérer la météo du jour.
    if (savedWeather) {

        try {

            const parsed = JSON.parse(savedWeather);

            if (
                parsed &&
                parsed.date === today &&
                parsed.weather
            ) {

                const existingWeather =
                    weatherTypes.find(
                        weather =>
                            weather.id === parsed.weather
                    );


                if (existingWeather) {

                    dailyWeather = existingWeather;

                    return;

                }

            }

        } catch (error) {

            console.log(
                "Ancienne météo ignorée."
            );

        }

    }


    // Nouvelle météo aléatoire.
    const randomIndex =
        Math.floor(
            Math.random() * weatherTypes.length
        );


    dailyWeather =
        weatherTypes[randomIndex];


    localStorage.setItem(
        WEATHER_STORAGE_KEY,
        JSON.stringify({
            date: today,
            weather: dailyWeather.id
        })
    );

}


// ======================================================
// AFFICHAGE DE LA MÉTÉO
// ======================================================

function updateWeatherDisplay() {

    const weatherElement =
        document.getElementById("weather");


    if (!weatherElement) {
        return;
    }


    if (!dailyWeather) {
        generateDailyWeather();
    }


    // ==============================================
    // NUIT
    // ==============================================

    if (isNight()) {

        // IMPORTANT :
        // Si la météo du jour est ensoleillée,
        // on ne montre PAS le soleil pendant la nuit.

        if (dailyWeather.id === "sunny") {

            weatherElement.textContent =
                "🌙 Nuit claire";

        } else {

            weatherElement.textContent =
                `🌙 ${dailyWeather.icon} Nuit • ${dailyWeather.name}`;

        }

        return;
    }


    // ==============================================
    // JOUR
    // ==============================================

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
        localStorage.getItem("draconiaPlayer");


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
// AFFICHAGE DES RESSOURCES
// ======================================================

function updatePlayerDisplay() {

    const coinsElement =
        document.getElementById("coins");

    const foodElement =
        document.getElementById("food");

    const xpElement =
        document.getElementById("xp");


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
// BARRE D'XP
// ======================================================

function updateXPBar() {

    const xpFill =
        document.getElementById("xp-fill");


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
// DRAGON DÉCOUVERT
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
// CHOIX DE RARETÉ
// ======================================================

function chooseRarity() {

    const random =
        Math.random();


    if (random < 0.55) {

        return "Commun";

    }


    if (random < 0.80) {

        return "Peu commun";

    }


    if (random < 0.94) {

        return "Rare";

    }


    if (random < 0.99) {

        return "Épique";

    }


    return "Légendaire";

}


// ======================================================
// RECHERCHE D'UN DRAGON
// ======================================================

function findEgg() {

    const messageHome =
        document.getElementById(
            "egg-message"
        );


    const messagePage =
        document.getElementById(
            "egg-message-page"
        );


    const messageElements = [
        messageHome,
        messagePage
    ];


    const discovered =
        getDiscoveredDragons();


    const rarity =
        chooseRarity();


    let possibleDragons =
        dragons.filter(
            dragon =>
                dragon.rarity === rarity
        );


    // Si aucune correspondance,
    // on utilise tous les dragons.
    if (possibleDragons.length === 0) {

        possibleDragons =
            dragons;

    }


    // Bonus météo.
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


            if (matching.length > 0) {

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


    // XP
    let xpGain = 10;


    // Dragon déjà découvert
    if (discovered.includes(dragon.id)) {

        xpGain = 5;

        showEggMessage(
            `🔁 Tu as retrouvé ${dragon.name} ! +5 XP`
        );

    } else {

        discovered.push(dragon.id);

        saveDiscoveredDragons(
            discovered
        );


        showEggMessage(
            `🎉 Nouveau dragon : ${dragon.name} ! +10 XP`
        );

    }


    player.xp += xpGain;


    if (player.xp >= 100) {

        player.level += 1;

        player.xp -= 100;

        showEggMessage(
            `🎉 Niveau supérieur ! Tu es maintenant niveau ${player.level}.`
        );

    }


    displayDragon(dragon);

    updateDragonDex();

    updatePlayerDisplay();

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
// AFFICHAGE DU DRAGON
// ======================================================

function displayDragon(dragon) {

    const image =
        document.getElementById(
            "dragon-image"
        );

    const name =
        document.getElementById(
            "dragon-name"
        );

    const rarity =
        document.getElementById(
            "dragon-rarity"
        );

    const element =
        document.getElementById(
            "dragon-element"
        );


    if (image) {

        image.textContent =
            dragon.icon;

    }


    if (name) {

        name.textContent =
            dragon.name;

    }


    if (rarity) {

        rarity.textContent =
            dragon.rarity.toUpperCase();

    }


    if (element) {

        element.textContent =
            `${dragon.element} • Dragon découvert !`;

    }

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
        "eggs",
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

}


// ======================================================
// NOURRIR LE DRAGON
// ======================================================

function feedDragon() {

    if (player.food <= 0) {

        alert(
            "🥕 Tu n'as plus de nourriture !"
        );

        return;

    }


    player.food -= 1;

    player.hunger =
        Math.min(
            100,
            player.hunger + 15
        );

    player.happiness =
        Math.min(
            100,
            player.happiness + 3
        );


    updateCareDisplay();

    updatePlayerDisplay();

    savePlayer();

}


// ======================================================
// LAVER LE DRAGON
// ======================================================

function washDragon() {

    player.cleanliness =
        Math.min(
            100,
            player.cleanliness + 20
        );


    player.happiness =
        Math.min(
            100,
            player.happiness + 5
        );


    updateCareDisplay();

    savePlayer();

}


// ======================================================
// JOUER AVEC LE DRAGON
// ======================================================

function playDragon() {

    player.happiness =
        Math.min(
            100,
            player.happiness + 15
        );


    player.hunger =
        Math.max(
            0,
            player.hunger - 5
        );


    updateCareDisplay();

    savePlayer();

}


// ======================================================
// AFFICHAGE DES SOINS
// ======================================================

function updateCareDisplay() {

    const hunger =
        document.getElementById(
            "hunger"
        );

    const happiness =
        document.getElementById(
            "happiness"
        );

    const cleanliness =
        document.getElementById(
            "cleanliness"
        );


    if (hunger) {

        hunger.textContent =
            `${player.hunger}%`;

    }


    if (happiness) {

        happiness.textContent =
            `${player.happiness}%`;

    }


    if (cleanliness) {

        cleanliness.textContent =
            `${player.cleanliness}%`;

    }

}


// ======================================================
// INITIALISATION
// ======================================================

function initGame() {

    loadPlayer();

    generateDailyWeather();

    updateWeatherDisplay();

    updatePlayerDisplay();

    updateCareDisplay();

    updateDragonDex();

}


// ======================================================
// MISE À JOUR DE LA MÉTÉO
// ======================================================

// Vérification régulière de l'heure française.
// Cela permet de passer automatiquement de jour à nuit
// sans devoir recharger la page.

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