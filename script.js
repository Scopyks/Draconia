// ==========================================
// 🐉 DRACONIA
// SYSTÈME DES DRAGONS + COLLECTION
// ==========================================

let xp = 0;
let coins = 100;
let food = 10;

let hunger = 80;
let happiness = 70;
let cleanliness = 90;


// ==========================================
// 🐲 LES 10 DRAGONS
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
// 💾 COLLECTION SAUVEGARDÉE
// ==========================================

let discoveredDragons =
    JSON.parse(localStorage.getItem("draconiaDragons")) || [];


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
// 🐲 TROUVER UN DRAGON
// ==========================================

function discoverDragon() {

    const rarity = chooseRarity();

    const possibleDragons =
        dragons.filter(
            dragon => dragon.rarity === rarity
        );

    const dragon =
        possibleDragons[
            Math.floor(
                Math.random() * possibleDragons.length
            )
        ];

    const alreadyOwned =
        discoveredDragons.includes(dragon.name);

    if (alreadyOwned) {

        return {
            dragon: dragon,
            duplicate: true
        };
    }

    discoveredDragons.push(dragon.name);

    // 💾 Sauvegarde
    localStorage.setItem(
        "draconiaDragons",
        JSON.stringify(discoveredDragons)
    );

    return {
        dragon: dragon,
        duplicate: false
    };
}


// ==========================================
// 🔎 EXPLORER
// ==========================================

function findEgg() {

    const message =
        document.getElementById("egg-message");

    const button =
        document.getElementById("egg-button");

    button.disabled = true;

    message.textContent =
        "🔎 Tu explores Draconia...";

    setTimeout(() => {

        const foundEgg =
            Math.random() < 0.35;

        if (!foundEgg) {

            message.textContent =
                "🌲 Rien trouvé cette fois...";

            addXP(3);

            button.disabled = false;

            return;
        }

        message.textContent =
            "🥚 Œuf mystérieux trouvé !";

        setTimeout(() => {

            const result =
                discoverDragon();

            const dragon =
                result.dragon;

            // 🐲 NOUVEAU DRAGON
            if (!result.duplicate) {

                message.innerHTML =
                    `🎉 NOUVEAU DRAGON !<br><br>
                    ${dragon.emoji}<br>
                    <b>${dragon.name}</b><br>
                    ${dragon.element} • ${dragon.rarity}`;

                showDragon(dragon);

                addXP(20);

            }

            // 🔁 DOUBLON
            else {

                message.innerHTML =
                    `🔁 Doublon !<br><br>
                    ${dragon.emoji}<br>
                    <b>${dragon.name}</b><br>
                    ⭐ +25 XP`;

                addXP(25);
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

    const dragonImage =
        document.querySelector(".dragon-image");

    const rarity =
        document.querySelector(".rarity");

    const element =
        document.querySelector(
            ".dragon-info > p:not(.rarity)"
        );

    dragonName.textContent =
        dragon.name;

    dragonImage.textContent =
        dragon.emoji;

    rarity.textContent =
        dragon.rarity.toUpperCase();

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
            "🎉 Niveau supérieur !\n\n💰 +25 pièces"
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

    hunger = Math.min(
        100,
        hunger + 10
    );

    happiness = Math.min(
        100,
        happiness + 3
    );

    addXP(5);
}


// ==========================================
// 🧼 LAVER
// ==========================================

function washDragon() {

    cleanliness = Math.min(
        100,
        cleanliness + 15
    );

    happiness = Math.min(
        100,
        happiness + 2
    );

    addXP(5);
}


// ==========================================
// 🎮 JOUER
// ==========================================

function playDragon() {

    happiness = Math.min(
        100,
        happiness + 12
    );

    addXP(10);
}


// ==========================================
// 🔄 ACTUALISER L'ÉCRAN
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
    "🐉 Draconia est prêt !"
);