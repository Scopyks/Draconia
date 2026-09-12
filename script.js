// ==========================================
// DRACONIA - SCRIPT PRINCIPAL
// ==========================================


// ==========================================
// DONNÉES DU JEU
// ==========================================

let xp = 0;
let coins = 100;
let food = 10;

let hunger = 80;
let happiness = 70;
let cleanliness = 90;


// ==========================================
// LISTE DES DRAGONS
// ==========================================

const dragons = [

    {
        id: 1,
        name: "Flambyra",
        element: "Feu",
        rarity: "Commun",
        emoji: "🔥🐉"
    },

    {
        id: 2,
        name: "Aquaryn",
        element: "Eau",
        rarity: "Commun",
        emoji: "💧🐉"
    },

    {
        id: 3,
        name: "Floréon",
        element: "Nature",
        rarity: "Commun",
        emoji: "🌿🐉"
    },

    {
        id: 4,
        name: "Zéphyr",
        element: "Air",
        rarity: "Commun",
        emoji: "🌪️🐉"
    },

    {
        id: 5,
        name: "Voltaris",
        element: "Foudre",
        rarity: "Peu commun",
        emoji: "⚡🐉"
    },

    {
        id: 6,
        name: "Cryon",
        element: "Glace",
        rarity: "Peu commun",
        emoji: "❄️🐉"
    },

    {
        id: 7,
        name: "Terragon",
        element: "Terre",
        rarity: "Rare",
        emoji: "🪨🐉"
    },

    {
        id: 8,
        name: "Noctyra",
        element: "Ombre",
        rarity: "Rare",
        emoji: "🌑🐉"
    },

    {
        id: 9,
        name: "Solarys",
        element: "Lumière",
        rarity: "Épique",
        emoji: "☀️🐉"
    },

    {
        id: 10,
        name: "Astréon",
        element: "Cosmique",
        rarity: "Légendaire",
        emoji: "🌌🐉"
    }

];


// ==========================================
// DRAGONS DÉJÀ DÉCOUVERTS
// ==========================================

let discoveredDragons =
    JSON.parse(
        localStorage.getItem("draconiaDragons")
    ) || [];


// ==========================================
// NAVIGATION ENTRE LES PAGES
// ==========================================

function showPage(page) {

    const pages = [
        "home-page",
        "egg-page",
        "dex-page",
        "inventory-page",
        "profile-page"
    ];

    // Cacher toutes les pages

    pages.forEach(function(pageId) {

        const element =
            document.getElementById(pageId);

        if (element) {
            element.style.display = "none";
        }

    });


    // Afficher la page demandée

    let selectedPage = null;

    if (page === "home") {
        selectedPage =
            document.getElementById("home-page");
    }

    if (page === "eggs") {
        selectedPage =
            document.getElementById("egg-page");
    }

    if (page === "dex") {
        selectedPage =
            document.getElementById("dex-page");
    }

    if (page === "inventory") {
        selectedPage =
            document.getElementById("inventory-page");
    }

    if (page === "profile") {
        selectedPage =
            document.getElementById("profile-page");
    }


    if (selectedPage) {
        selectedPage.style.display = "block";
    }


    // Réinitialiser les boutons

    const navButtons = document.querySelectorAll(
        ".bottom-nav button"
    );

    navButtons.forEach(function(button) {
        button.classList.remove("active");
    });


    // Activer le bon bouton

    if (page === "home") {
        document
            .getElementById("nav-home")
            .classList.add("active");
    }

    if (page === "eggs") {
        document
            .getElementById("nav-eggs")
            .classList.add("active");
    }

    if (page === "dex") {
        document
            .getElementById("nav-dex")
            .classList.add("active");
    }

    if (page === "inventory") {
        document
            .getElementById("nav-inventory")
            .classList.add("active");
    }

    if (page === "profile") {
        document
            .getElementById("nav-profile")
            .classList.add("active");
    }


    // Mettre à jour le DragonDex

    if (page === "dex") {
        updateDragonDex();
    }

}


// ==========================================
// CHOISIR UNE RARETÉ
// ==========================================

function chooseRarity() {

    const random = Math.random();

    if (random < 0.02) {
        return "Légendaire";
    }

    if (random < 0.07) {
        return "Épique";
    }

    if (random < 0.20) {
        return "Rare";
    }

    if (random < 0.45) {
        return "Peu commun";
    }

    return "Commun";
}


// ==========================================
// TROUVER UN DRAGON
// ==========================================

function discoverDragon() {

    const rarity = chooseRarity();


    // Dragons correspondant à la rareté

    const possibleDragons =
        dragons.filter(function(dragon) {

            return dragon.rarity === rarity;

        });


    if (possibleDragons.length === 0) {
        return null;
    }


    // Choisir un dragon au hasard

    const dragon =
        possibleDragons[
            Math.floor(
                Math.random() *
                possibleDragons.length
            )
        ];


    return dragon;

}


// ==========================================
// EXPLORER
// ==========================================

function findEgg() {

    const button =
        document.getElementById("egg-button");

    const messages = [
        document.getElementById("egg-message"),
        document.getElementById("egg-message-page")
    ];


    // Désactiver le bouton pendant la recherche

    if (button) {
        button.disabled = true;
        button.textContent = "🔎 Recherche...";
    }


    messages.forEach(function(message) {

        if (message) {
            message.textContent =
                "🌲 Tu explores Draconia...";
        }

    });


    setTimeout(function() {

        // 35% de chance de trouver un œuf

        const foundEgg =
            Math.random() < 0.35;


        if (!foundEgg) {

            messages.forEach(function(message) {

                if (message) {
                    message.textContent =
                        "😔 Aucun œuf trouvé cette fois...";
                }

            });


            addXP(3);

            resetExploreButton();

            return;
        }


        // Trouver un dragon

        const dragon =
            discoverDragon();


        if (!dragon) {

            resetExploreButton();

            return;
        }


        // Vérifier si le dragon est déjà découvert

        const alreadyDiscovered =
            discoveredDragons.includes(dragon.id);


        if (alreadyDiscovered) {

            messages.forEach(function(message) {

                if (message) {
                    message.textContent =
                        "🥚 Tu as trouvé " +
                        dragon.emoji +
                        " " +
                        dragon.name +
                        " !\n" +
                        "✨ Mais tu possèdes déjà ce dragon.";
                }

            });


            // Doublon = XP

            addXP(25);

        } else {

            // Nouveau dragon

            discoveredDragons.push(dragon.id);

            localStorage.setItem(
                "draconiaDragons",
                JSON.stringify(discoveredDragons)
            );


            messages.forEach(function(message) {

                if (message) {
                    message.textContent =
                        "🎉 NOUVEAU DRAGON ! " +
                        dragon.emoji +
                        " " +
                        dragon.name;
                }

            });


            showDragon(dragon);

            addXP(20);

        }


        updateDragonDex();

        resetExploreButton();

    }, 1200);

}


// ==========================================
// RÉACTIVER LE BOUTON EXPLORER
// ==========================================

function resetExploreButton() {

    const button =
        document.getElementById("egg-button");

    if (button) {

        button.disabled = false;

        button.textContent =
            "🔍 Explorer";

    }

}


// ==========================================
// AFFICHER LE DRAGON
// ==========================================

function showDragon(dragon) {

    const name =
        document.getElementById("dragon-name");

    const image =
        document.getElementById("dragon-image");

    const rarity =
        document.getElementById("dragon-rarity");

    const element =
        document.getElementById("dragon-element");


    if (name) {
        name.textContent = dragon.name;
    }

    if (image) {
        image.textContent = dragon.emoji;
    }

    if (rarity) {
        rarity.textContent =
            dragon.rarity.toUpperCase();
    }

    if (element) {
        element.textContent =
            "Élément : " + dragon.element;
    }

}


// ==========================================
// DRAGONDEX
// ==========================================

function updateDragonDex() {

    const list =
        document.getElementById("dragon-list");

    const counter =
        document.getElementById("dex-count");


    if (!list) {
        return;
    }


    list.innerHTML = "";


    dragons.forEach(function(dragon) {

        const discovered =
            discoveredDragons.includes(dragon.id);


        const card =
            document.createElement("div");


        card.className =
            "dex-dragon";


        if (discovered) {

            card.innerHTML = `

                <div class="dex-dragon-image">
                    ${dragon.emoji}
                </div>

                <div class="dex-dragon-info">

                    <h3>
                        ${dragon.name}
                    </h3>

                    <p>
                        ${dragon.element}
                    </p>

                    <span>
                        ${dragon.rarity}
                    </span>

                </div>

                <div class="dex-check">
                    ✅
                </div>

            `;

        } else {

            card.innerHTML = `

                <div class="dex-dragon-image">
                    ❓
                </div>

                <div class="dex-dragon-info">

                    <h3>
                        ???
                    </h3>

                    <p>
                        Dragon inconnu
                    </p>

                    <span>
                        🔒 À découvrir
                    </span>

                </div>

            `;

        }


        list.appendChild(card);

    });


    if (counter) {

        counter.textContent =
            discoveredDragons.length;

    }

}


// ==========================================
// AJOUTER DE L'XP
// ==========================================

function addXP(amount) {

    xp += amount;


    if (xp >= 100) {

        xp -= 100;

        alert(
            "🎉 Bravo ! Tu viens de passer un niveau !"
        );

    }


    updateScreen();

}


// ==========================================
// NOURRIR LE DRAGON
// ==========================================

function feedDragon() {

    if (food <= 0) {

        alert(
            "🥕 Tu n'as plus de nourriture !"
        );

        return;
    }


    food--;

    hunger += 15;


    if (hunger > 100) {
        hunger = 100;
    }


    happiness += 5;


    if (happiness > 100) {
        happiness = 100;
    }


    addXP(5);

    updateScreen();

}


// ==========================================
// LAVER LE DRAGON
// ==========================================

function washDragon() {

    cleanliness += 20;


    if (cleanliness > 100) {
        cleanliness = 100;
    }


    happiness += 5;


    if (happiness > 100) {
        happiness = 100;
    }


    addXP(5);

    updateScreen();

}


// ==========================================
// JOUER AVEC LE DRAGON
// ==========================================

function playDragon() {

    happiness += 15;


    if (happiness > 100) {
        happiness = 100;
    }


    hunger -= 5;


    if (hunger < 0) {
        hunger = 0;
    }


    addXP(10);

    updateScreen();

}


// ==========================================
// METTRE À JOUR L'ÉCRAN
// ==========================================

function updateScreen() {

    const xpElement =
        document.getElementById("xp");

    const coinsElement =
        document.getElementById("coins");

    const foodElement =
        document.getElementById("food");

    const hungerElement =
        document.getElementById("hunger");

    const happinessElement =
        document.getElementById("happiness");

    const cleanlinessElement =
        document.getElementById("cleanliness");

    const xpFill =
        document.getElementById("xp-fill");


    if (xpElement) {
        xpElement.textContent = xp;
    }

    if (coinsElement) {
        coinsElement.textContent = coins;
    }

    if (foodElement) {
        foodElement.textContent = food;
    }

    if (hungerElement) {
        hungerElement.textContent =
            hunger + "%";
    }

    if (happinessElement) {
        happinessElement.textContent =
            happiness + "%";
    }

    if (cleanlinessElement) {
        cleanlinessElement.textContent =
            cleanliness + "%";
    }

    if (xpFill) {
        xpFill.style.width =
            xp + "%";
    }

}


// ==========================================
// SAUVEGARDE AUTOMATIQUE
// ==========================================

function saveGame() {

    const gameData = {

        xp: xp,

        coins: coins,

        food: food,

        hunger: hunger,

        happiness: happiness,

        cleanliness: cleanliness,

        discoveredDragons:
            discoveredDragons

    };


    localStorage.setItem(
        "draconiaSave",
        JSON.stringify(gameData)
    );

}


// ==========================================
// CHARGER LA SAUVEGARDE
// ==========================================

function loadGame() {

    const saved =
        localStorage.getItem(
            "draconiaSave"
        );


    if (!saved) {
        return;
    }


    const gameData =
        JSON.parse(saved);


    xp =
        gameData.xp ?? 0;

    coins =
        gameData.coins ?? 100;

    food =
        gameData.food ?? 10;

    hunger =
        gameData.hunger ?? 80;

    happiness =
        gameData.happiness ?? 70;

    cleanliness =
        gameData.cleanliness ?? 90;


    if (
        gameData.discoveredDragons
    ) {

        discoveredDragons =
            gameData.discoveredDragons;

    }

}


// ==========================================
// SAUVEGARDE RÉGULIÈRE
// ==========================================

setInterval(
    saveGame,
    5000
);


// ==========================================
// DÉMARRAGE DU JEU
// ==========================================

loadGame();

updateScreen();

updateDragonDex();

showPage("home");