// ======================================================
// DRACONIA - DRAGONS
// Extrait de l'ancien script principal, ordre de chargement conservé.
// ======================================================

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
        DraconiaStorage.getItem(
            DraconiaConfig.storage.discoveredDragons
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
    DraconiaStorage.setItem(
        DraconiaConfig.storage.discoveredDragons,
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
        DraconiaStorage.getItem(
            DraconiaConfig.storage.ownedDragons
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
    DraconiaStorage.setItem(
        DraconiaConfig.storage.ownedDragons,
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


