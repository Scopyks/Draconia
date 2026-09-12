// ===============================
// DRACONIA - SYSTÈME PRINCIPAL
// ===============================

let xp = 0;
let coins = 100;
let food = 10;

let hunger = 80;
let happiness = 70;
let cleanliness = 90;


// ===============================
// UTILITAIRES
// ===============================

function updateScreen() {
    document.getElementById("coins").textContent = coins;
    document.getElementById("food").textContent = food;

    document.getElementById("hunger").textContent = hunger + "%";
    document.getElementById("happiness").textContent = happiness + "%";
    document.getElementById("cleanliness").textContent = cleanliness + "%";

    document.getElementById("xp").textContent = xp;

    const xpFill = document.getElementById("xp-fill");
    xpFill.style.width = xp + "%";
}


// ===============================
// XP
// ===============================

function addXP(amount) {

    xp += amount;

    if (xp >= 100) {
        xp = 0;

        coins += 25;

        alert("🎉 Ton dragon est monté de niveau !\n\n💰 +25 pièces");
    }

    updateScreen();
}


// ===============================
// NOURRIR LE DRAGON
// ===============================

function feedDragon() {

    if (food <= 0) {
        alert("🥕 Tu n'as plus de nourriture !");
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


// ===============================
// LAVER LE DRAGON
// ===============================

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


// ===============================
// JOUER AVEC LE DRAGON
// ===============================

function playDragon() {

    happiness += 12;

    if (happiness > 100) {
        happiness = 100;
    }

    addXP(10);

    updateScreen();
}


// ===============================
// EXPLORATION / ŒUF
// ===============================

function findEgg() {

    const message = document.getElementById("egg-message");
    const button = document.getElementById("egg-button");

    button.disabled = true;

    message.textContent = "🔎 Exploration de Draconia...";

    setTimeout(() => {

        const chance = Math.random();

        if (chance < 0.35) {

            message.textContent =
                "🥚 Tu as trouvé un œuf mystérieux !";

            addXP(15);

        } else {

            message.textContent =
                "🌲 Rien cette fois... continue d'explorer !";

            addXP(3);
        }

        button.disabled = false;

    }, 1200);
}


// ===============================
// INITIALISATION
// ===============================

updateScreen();

console.log("🐉 Bienvenue dans Draconia !");