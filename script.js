// ==========================================
// 🐉 DRACONIA - SYSTÈME DES DRAGONS
// ==========================================

let xp = 0;
let coins = 100;
let food = 10;

let hunger = 80;
let happiness = 70;
let cleanliness = 90;


// ==========================================
// 🐲 LISTE DES DRAGONS
// ==========================================

const dragons = [
    {
        name: "Flambyra",
        element: "Feu",
        rarity: "Commun",
        emoji: "🔥🐉"
    },
    {
        name: "Aquaryn",
        element: "Eau",
        rarity: "Commun",
        emoji: "💧🐉"
    },
    {
        name: "Floréon",
        element: "Nature",
        rarity: "Commun",
        emoji: "🌿🐉"
    },
    {
        name: "Zéphyr",
        element: "Air",
        rarity: "Commun",
        emoji: "🌪️🐉"
    },
    {
        name: "Voltaris",
        element: "Foudre",
        rarity: "Peu commun",
        emoji: "⚡🐉"
    },
    {
        name: "Cryon",
        element: "Glace",
        rarity: "Peu commun",
        emoji: "❄️🐉"
    },
    {
        name: "Terragon",
        element: "Terre",
        rarity: "Rare",
        emoji: "🪨🐉"
    },
    {
        name: "Noctyra",
        element: "Ombre",
        rarity: "Rare",
        emoji: "🌑🐉"
    },
    {
        name: "Solarys",
        element: "Lumière",
        rarity: "Épique",
        emoji: "☀️🐉"
    },
    {
        name: "Astréon",
        element: "Cosmique",
        rarity: "Légendaire",
        emoji: "🌌🐉"
    }
];


// ==========================================
// 📖 DRAGONS DÉCOUVERTS
// ==========================================

let discoveredDragons = [];


// ==========================================
// 🎲 CHOISIR UNE RARETÉ
// ==========================================

function chooseRarity() {

    const chance = Math.random();

    if (chance < 0.02) {
        return "Légendaire";
    }

    if (chance < 0.07) {
        return "Épique";
    }

    if (chance < 0.20) {
        return "Rare";
    }

    if (chance < 0.45) {
        return "Peu commun";
    }

    return "Commun";
}


// ==========================================
// 🐲 FAIRE APPARAÎTRE UN DRAGON
// ==========================================

function discoverDragon() {

    const rarity = chooseRarity();

    const possibleDragons = dragons.filter(
        dragon => dragon.rarity === rarity
    );

    const dragon =
        possibleDragons[
            Math.floor(Math.random() * possibleDragons.length)
        ];

    const alreadyOwned =
        discoveredDragons.includes(dragon.name);

    if (alreadyOwned) {

        // Doublon = XP
        addXP(25);

        return {
            dragon: dragon,
            duplicate: true
        };
    }

    discoveredDragons.push(dragon.name);

    return {
        dragon: dragon,
        duplicate: false
    };
}


// ==========================================
// 🔎 EXPLORATION
// ==========================================

function findEgg() {

    const message =
        document.getElementById("egg-message");

    const button =
        document.getElementById("egg-button");

    button.disabled = true;

    message.textContent =
        "🔎 Tu explores les terres de Draconia...";

    setTimeout(() => {

        const foundEgg =
            Math.random() < 0.35;

        if (!foundEgg) {

            message.textContent =
                "🌲 Rien cette fois... continue ton exploration !";

            addXP(3);

            button.disabled = false;

            return;
        }


        // 🥚 ŒUF TROUVÉ

        message.textContent =
            "🥚 Un œuf mystérieux vient d'être découvert !";

        setTimeout(() => {

            const result =
                discoverDragon();

            const dragon =
                result.dragon;


            if (result.duplicate) {

                message.innerHTML =
                    `🐉 Doublon : <b>${dragon.name}</b> !<br>
                    ⭐ +25 XP`;

            } else {

                message.innerHTML =
                    `🎉 NOUVEAU DRAGON !<br>
                    ${dragon.emoji}<br>
                    <b>${dragon.name}</b><br>
                    ${dragon.element} • ${dragon.rarity}`;

                showDragon(dragon);

                addXP(20);
            }

            button.disabled = false;

        }, 1200);

    }, 1200);
}


// ==========================================
// 🐉 AFFICHER LE DRAGON
// ==========================================

function showDragon(dragon) {

    const dragonName =
        document.getElementById("dragon-name");

    dragonName.textContent =
        dragon.name;

    const dragonImage =
        document.querySelector(".dragon-image");

    dragonImage.textContent =
        dragon.emoji;

    const rarity =
        document.querySelector(".rarity");

    rarity.textContent =
        dragon.rarity.toUpperCase();

    const element =
        document.querySelector(".dragon-info > p:not(.rarity)");

    element.textContent =
        "🐉 Dragon de " + dragon.element;
}


// ==========================================
// ⭐ XP
// ==========================================

function addXP(amount) {

    xp += amount;

    if (xp >= 100) {

        xp -= 100;

        coins += 25;

        alert(
            "🎉 Ton dragon gagne un niveau !\n\n💰 +25 pièces"
        );
    }

    updateScreen();
}


// ==========================================
// 🍖 NOURRIR
// ==========================================

function feedDragon() {

    if (food <= 0) {

        alert(
            "🥕 Tu n'as plus de nourriture !"
        );

        return;
    }

    food--;

    hunger += 10;

    if (hunger > 100) {
        hunger = 100;
    }

    happiness += 3;

    if (happiness > 100) {
        happiness = 100;
    }

    addXP(5);

    updateScreen();
}


// ==========================================
// 🧼 LAVER
// ==========================================

function washDragon() {

    cleanliness += 15;

    if (cleanliness > 100) {
        cleanliness = 100;
    }

    happiness += 2;

    if (happiness > 100) {
        happiness = 100;
    }

    addXP(5);

    updateScreen();
}


// ==========================================
// 🎮 JOUER
// ==========================================

function playDragon() {

    happiness += 12;

    if (happiness > 100) {
        happiness = 100;
    }

    addXP(10);

    updateScreen();
}


// ==========================================
// 🔄 METTRE À JOUR L'ÉCRAN
// ==========================================

function updateScreen() {

    document.getElementById("coins").textContent =
        coins;

    document.getElementById("food").textContent =
        food;

    document.getElementById("hunger").textContent =
        hunger + "%";

    document.getElementById("happiness").textContent =
        happiness + "%";

    document.getElementById("cleanliness").textContent =
        cleanliness + "%";

    document.getElementById("xp").textContent =
        xp;

    document.getElementById("xp-fill").style.width =
        xp + "%";
}


// ==========================================
// 🚀 DÉMARRAGE
// ==========================================

updateScreen();

console.log(
    "🐉 Draconia est lancé !"
);