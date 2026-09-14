// ======================================================
// DRACONIA - FORÊT
// Extrait de l'ancien script principal, ordre de chargement conservé.
// ======================================================

// ======================================================
// FORÊT : CONTOUR CLIQUABLE DE L'ARBRE
// ======================================================

let forestTreeHitCanvas = null;
let forestTreeHitContext = null;

function getForestTreeHitContext(image) {
    if (!image || !image.complete || !image.naturalWidth) {
        return null;
    }

    if (!forestTreeHitCanvas) {
        forestTreeHitCanvas = document.createElement("canvas");
        forestTreeHitContext = forestTreeHitCanvas.getContext(
            "2d",
            { willReadFrequently: true }
        );
    }

    if (!forestTreeHitContext) {
        return null;
    }

    if (
        forestTreeHitCanvas.width !== image.naturalWidth ||
        forestTreeHitCanvas.height !== image.naturalHeight
    ) {
        forestTreeHitCanvas.width = image.naturalWidth;
        forestTreeHitCanvas.height = image.naturalHeight;
        forestTreeHitContext.clearRect(
            0,
            0,
            image.naturalWidth,
            image.naturalHeight
        );
        forestTreeHitContext.drawImage(image, 0, 0);
    }

    return forestTreeHitContext;
}

function isForestTreePixelVisible(event, image) {
    // Un clic clavier doit toujours rester accessible.
    if (!event || event.detail === 0) {
        return true;
    }

    const context = getForestTreeHitContext(image);
    if (!context) {
        return true;
    }

    const rect = image.getBoundingClientRect();
    if (!rect.width || !rect.height) {
        return false;
    }

    const pixelX = Math.floor(
        (event.clientX - rect.left) * image.naturalWidth / rect.width
    );
    const pixelY = Math.floor(
        (event.clientY - rect.top) * image.naturalHeight / rect.height
    );

    if (
        pixelX < 0 ||
        pixelY < 0 ||
        pixelX >= image.naturalWidth ||
        pixelY >= image.naturalHeight
    ) {
        return false;
    }

    // Tolérance d'environ 5 px à l'écran pour faciliter le toucher mobile.
    const radiusX = Math.max(
        1,
        Math.ceil(5 * image.naturalWidth / rect.width)
    );
    const radiusY = Math.max(
        1,
        Math.ceil(5 * image.naturalHeight / rect.height)
    );
    const startX = Math.max(0, pixelX - radiusX);
    const startY = Math.max(0, pixelY - radiusY);
    const width = Math.min(
        image.naturalWidth - startX,
        radiusX * 2 + 1
    );
    const height = Math.min(
        image.naturalHeight - startY,
        radiusY * 2 + 1
    );

    try {
        const pixels = context.getImageData(
            startX,
            startY,
            width,
            height
        ).data;

        for (let index = 3; index < pixels.length; index += 4) {
            if (pixels[index] > 32) {
                return true;
            }
        }
    } catch (error) {
        // Si le navigateur refuse la lecture du canvas, le jeu reste utilisable.
        return true;
    }

    return false;
}

function handleForestTreeClick(event) {
    const image = document.getElementById("forest-tree-image");

    if (isForestTreePixelVisible(event, image)) {
        shakeTree();
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

    if (
        forestTreeShakeCooldown
    ) {
        return;
    }

    forestTreeShakeCooldown = true;

    setTimeout(
        function() {
            forestTreeShakeCooldown = false;
        },
        1000
    );

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

    const amount =
        Math.floor(
            Math.random() * 3
        );

    if (amount === 0) {
        const message =
            document.getElementById(
                "forest-tree-message"
            );

        if (message) {
            message.textContent =
                "🌳 Tu secoues l'arbre... rien ne tombe cette fois !";
        }

        addPlayerXP(1);

        return;
    }

    const possibleResources = [
        "apple",
        "berry",
        "herb",
        "insect"
    ];

    const fallenResources = [];

    for (
        let i = 0;
        i < amount;
        i++
    ) {
        const resource =
            possibleResources[
                Math.floor(
                    Math.random() *
                    possibleResources.length
                )
            ];

        fallenResources.push(
            resource
        );

        createFallingForestResource(
            resource
        );
    }

    const xpAmount = 1;

    const levelUp =
        addPlayerXP(
            xpAmount
        );

    const message =
        document.getElementById(
            "forest-tree-message"
        );

    const names =
        fallenResources
            .map(
                resource =>
                    resourceNames[
                        resource
                    ]
            )
            .join(" • ");

    if (message) {
        if (levelUp) {
            message.textContent =
                `🌳 ${names} tombent sur le sol ! Appuie dessus pour les ramasser. +${xpAmount} XP • Niveau ${player.level} !`;
        } else {
            message.textContent =
                `🌳 ${names} tombent sur le sol ! 👆 Appuie dessus pour les ramasser.`;
        }
    }
}


// ======================================================
// FORÊT : CRÉER UNE RESSOURCE AU SOL
// ======================================================

function createFallingForestResource(
    resource
) {
    const container =
        document.getElementById(
            "forest-dropped-resources"
        );

    if (!container) {
        return;
    }

    const resourceIcons = {
        apple: "🍎",
        berry: "🍓",
        herb: "🌿",
        insect: "🐛"
    };

    forestDropCounter += 1;

    const drop =
        document.createElement(
            "button"
        );

    drop.type = "button";
    drop.className =
        "forest-resource-drop falling";

    drop.textContent =
        resourceIcons[resource] || "✨";

    drop.setAttribute(
        "aria-label",
        `Ramasser ${resourceNames[resource]}`
    );

    const left =
        12 +
        Math.random() * 76;

    const top =
        68 +
        Math.random() * 22;

    drop.style.left =
        `${left}%`;

    drop.style.top =
        `${top}%`;

    drop.dataset.resource =
        resource;

    drop.dataset.dropId =
        forestDropCounter;

    drop.addEventListener(
        "click",
        function() {
            collectForestResource(
                drop
            );
        }
    );

    container.appendChild(
        drop
    );

    setTimeout(
        function() {
            drop.classList.remove(
                "falling"
            );
        },
        700
    );
}


// ======================================================
// FORÊT : RAMASSER UNE RESSOURCE
// ======================================================

function collectForestResource(
    dropElement
) {
    if (!dropElement) {
        return;
    }

    const resource =
        dropElement.dataset.resource;

    if (!resource) {
        return;
    }

    if (
        dropElement.dataset.collected ===
        "true"
    ) {
        return;
    }

    dropElement.dataset.collected =
        "true";

    addResource(
        resource,
        1
    );

    dropElement.classList.add(
        "collected"
    );

    const message =
        document.getElementById(
            "forest-game-message"
        );

    if (message) {
        message.textContent =
            `🎒 ${resourceNames[resource]} ajouté au sac !`;
    }

    setTimeout(
        function() {
            if (
                dropElement &&
                dropElement.parentNode
            ) {
                dropElement.remove();
            }
        },
        250
    );
}


// ======================================================
// FORÊT : VIDER LES RESSOURCES AU SOL
// ======================================================

function clearForestDrops() {
    const container =
        document.getElementById(
            "forest-dropped-resources"
        );

    if (container) {
        container.innerHTML = "";
    }
}


// ======================================================
// FORÊT : AFFICHER LES CHAMPIGNONS
// ======================================================

function renderForestMushrooms() {
    const mushroomButtons =
        document.querySelectorAll(
            ".forest-mushroom"
        );

    mushroomButtons.forEach(
        button => {
            const index =
                Number(
                    button.dataset
                        .mushroomIndex
                );

            if (
                forestMushrooms[index]
            ) {
                button.classList.remove(
                    "picked"
                );

                button.disabled =
                    false;
            } else {
                button.classList.add(
                    "picked"
                );

                button.disabled =
                    true;
            }
        }
    );
}


// ======================================================
// FORÊT : RAMASSER UN CHAMPIGNON
// ======================================================

function pickMushroom(index) {
    if (
        currentGatheringGame !==
        "forest"
    ) {
        return;
    }

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

    addPlayerXP(1);

    renderForestMushrooms();

    const message =
        document.getElementById(
            "forest-game-message"
        );

    if (message) {
        message.textContent =
            "🍄 Champignon ramassé ! Il repoussera dans 1 minute.";
    }

    if (
        forestMushroomTimers[index]
    ) {
        clearTimeout(
            forestMushroomTimers[
                index
            ]
        );
    }

    forestMushroomTimers[index] =
        setTimeout(
            function() {
                forestMushrooms[index] =
                    true;

                forestMushroomTimers[
                    index
                ] = null;

                renderForestMushrooms();

                if (
                    currentGatheringGame ===
                    "forest"
                ) {
                    const respawnMessage =
                        document.getElementById(
                            "forest-game-message"
                        );

                    if (
                        respawnMessage
                    ) {
                        respawnMessage.textContent =
                            "🍄 Un champignon vient de repousser !";
                    }
                }
            },
            60000
        );
}


