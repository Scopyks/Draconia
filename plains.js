// ======================================================
// DRACONIA - PLAINES
// Extrait de l'ancien script principal, ordre de chargement conservé.
// ======================================================

// ======================================================
// PLAINES : DÉMARRAGE 🌾
// ======================================================

function startPlainsGame() {
    updatePlainsDisplay();

    if (
        plainsGrowthStartTime &&
        !plainsPlants.every(
            plant => plant.ready
        )
    ) {
        startPlainsGrowthTimer();
    }
}


// ======================================================
// PLAINES : CHOISIR UN OUTIL
// ======================================================

function selectPlainsTool(tool) {
    if (
        tool !== "watering" &&
        tool !== "scythe"
    ) {
        return;
    }

    plainsSelectedTool = tool;

    updatePlainsDisplay();

    const message =
        document.getElementById(
            "plains-tool-message"
        );

    if (!message) {
        return;
    }

    if (tool === "watering") {
        message.textContent =
            "🚿 Arrosoir en main. Touche les plantations pour les arroser.";
    } else {
        message.textContent =
            "🌾 Faux en main. Touche les plantations prêtes pour les récolter.";
    }
}


// ======================================================
// PLAINES : TOUCHER UNE PLANTATION
// ======================================================

function interactWithPlant(index) {
    if (
        currentGatheringGame !==
        "plains"
    ) {
        return;
    }

    const plant =
        plainsPlants[index];

    if (!plant) {
        return;
    }

    if (
        plainsSelectedTool ===
        "watering"
    ) {
        waterPlant(index);
        return;
    }

    if (
        plainsSelectedTool ===
        "scythe"
    ) {
        harvestPlant(index);
        return;
    }

    const message =
        document.getElementById(
            "plains-tool-message"
        );

    if (message) {
        message.textContent =
            "👆 Choisis d'abord l'arrosoir ou la faux.";
    }
}


// ======================================================
// PLAINES : ARROSER UNE PLANTATION
// ======================================================

function waterPlant(index) {
    const plant =
        plainsPlants[index];

    if (!plant) {
        return;
    }

    if (plant.ready) {
        const message =
            document.getElementById(
                "plains-tool-message"
            );

        if (message) {
            message.textContent =
                "🌾 Cette plantation est déjà prête. Utilise la faux.";
        }

        return;
    }

    if (plant.watered) {
        const message =
            document.getElementById(
                "plains-tool-message"
            );

        if (message) {
            message.textContent =
                "💧 Cette plantation est déjà arrosée.";
        }

        return;
    }

    plant.watered = true;

    const message =
        document.getElementById(
            "plains-tool-message"
        );

    if (message) {
        message.textContent =
            "💧 Plantation arrosée !";
    }

    updatePlainsDisplay();

    const allWatered =
        plainsPlants.every(
            currentPlant =>
                currentPlant.watered
        );

    if (
        allWatered &&
        !plainsGrowthStartTime
    ) {
        beginPlainsGrowth();
    }
}


// ======================================================
// PLAINES : COMMENCER LA POUSSE
// ======================================================

function beginPlainsGrowth() {
    plainsGrowthStartTime =
        Date.now();

    const growthMessage =
        document.getElementById(
            "plants-growth-message"
        );

    if (growthMessage) {
        growthMessage.textContent =
            "🌱 Toutes les plantations sont arrosées. Elles commencent à pousser !";
    }

    startPlainsGrowthTimer();
    updatePlainsDisplay();
}


// ======================================================
// PLAINES : MINUTEUR DE POUSSE
// ======================================================

function startPlainsGrowthTimer() {
    if (plainsGrowthInterval) {
        clearInterval(
            plainsGrowthInterval
        );
    }

    updatePlainsGrowthProgress();

    plainsGrowthInterval =
        setInterval(
            updatePlainsGrowthProgress,
            250
        );
}


// ======================================================
// PLAINES : METTRE À JOUR LA BARRE
// ======================================================

function updatePlainsGrowthProgress() {
    if (!plainsGrowthStartTime) {
        updatePlainsDisplay();
        return;
    }

    const elapsed =
        Date.now() -
        plainsGrowthStartTime;

    const progress =
        Math.min(
            elapsed /
            PLAINS_GROWTH_TIME,
            1
        );

    const remainingMs =
        Math.max(
            PLAINS_GROWTH_TIME -
            elapsed,
            0
        );

    const remainingSeconds =
        Math.ceil(
            remainingMs / 1000
        );

    const fill =
        document.getElementById(
            "plains-growth-fill"
        );

    const timer =
        document.getElementById(
            "plains-growth-timer"
        );

    if (fill) {
        fill.style.width =
            `${progress * 100}%`;
    }

    if (timer) {
        timer.textContent =
            progress >= 1
                ? "Prêt !"
                : `${remainingSeconds}s`;
    }

    if (progress >= 1) {
        if (plainsGrowthInterval) {
            clearInterval(
                plainsGrowthInterval
            );

            plainsGrowthInterval =
                null;
        }

        plainsPlants =
            plainsPlants.map(
                plant => ({
                    ...plant,
                    ready: true
                })
            );

        plainsGrowthStartTime =
            null;

        const growthMessage =
            document.getElementById(
                "plants-growth-message"
            );

        if (growthMessage) {
            growthMessage.textContent =
                "🌾 Les plantations sont prêtes ! Prends la faux et récolte-les.";
        }

        updatePlainsDisplay();
    }
}


// ======================================================
// PLAINES : RÉCOLTER UNE PLANTATION
// ======================================================

function harvestPlant(index) {
    const plant =
        plainsPlants[index];

    if (!plant) {
        return;
    }

    if (!plant.ready) {
        const message =
            document.getElementById(
                "plains-tool-message"
            );

        if (message) {
            if (!plant.watered) {
                message.textContent =
                    "🌱 Cette plantation doit d'abord être arrosée.";
            } else {
                message.textContent =
                    "⏳ Cette plantation n'est pas encore prête.";
            }
        }

        return;
    }

    const possibleResources = [
        "vegetable",
        "herb"
    ];

    const resource =
        possibleResources[
            Math.floor(
                Math.random() *
                possibleResources.length
            )
        ];

    const amount =
        Math.random() < 0.75
            ? 1
            : 2;

    addResource(
        resource,
        amount
    );

    addPlayerXP(2);

    plainsPlants[index] = {
        watered: false,
        ready: false
    };

    const message =
        document.getElementById(
            "plains-game-message"
        );

    if (message) {
        message.textContent =
            `🌾 Récolte réussie : +${amount} ${resourceNames[resource]} !`;
    }

    updatePlainsDisplay();

    const allHarvested =
        plainsPlants.every(
            plant =>
                !plant.watered &&
                !plant.ready
        );

    if (allHarvested) {
        plainsSelectedTool =
            null;

        const toolMessage =
            document.getElementById(
                "plains-tool-message"
            );

        if (toolMessage) {
            toolMessage.textContent =
                "🌱 Une nouvelle culture est prête à être arrosée.";
        }

        const growthMessage =
            document.getElementById(
                "plants-growth-message"
            );

        if (growthMessage) {
            growthMessage.textContent =
                "Choisis l'arrosoir puis touche chaque plantation.";
        }

        updatePlainsDisplay();
    }
}


// ======================================================
// PLAINES : AFFICHAGE
// ======================================================

function updatePlainsDisplay() {
    const wateringButton =
        document.getElementById(
            "plains-watering-tool"
        );

    const scytheButton =
        document.getElementById(
            "plains-scythe-tool"
        );

    if (wateringButton) {
        wateringButton.classList.toggle(
            "selected",
            plainsSelectedTool ===
            "watering"
        );
    }

    if (scytheButton) {
        scytheButton.classList.toggle(
            "selected",
            plainsSelectedTool ===
            "scythe"
        );
    }

    const plantButtons =
        document.querySelectorAll(
            ".plant-button"
        );

    plantButtons.forEach(
        (button, index) => {
            const plant =
                plainsPlants[index];

            if (!plant) {
                return;
            }

            button.classList.remove(
                "watered",
                "growing",
                "ready"
            );

            if (plant.ready) {
                button.classList.add(
                    "ready"
                );

                button.textContent =
                    "🌾";

                return;
            }

            if (
                plant.watered &&
                plainsGrowthStartTime
            ) {
                button.classList.add(
                    "growing"
                );

                button.textContent =
                    "🌿";

                return;
            }

            if (plant.watered) {
                button.classList.add(
                    "watered"
                );

                button.textContent =
                    "💧🌱";

                return;
            }

            button.textContent =
                "🌱";
        }
    );

    const fill =
        document.getElementById(
            "plains-growth-fill"
        );

    const timer =
        document.getElementById(
            "plains-growth-timer"
        );

    if (
        !plainsGrowthStartTime
    ) {
        const allReady =
            plainsPlants.every(
                plant => plant.ready
            );

        if (fill) {
            fill.style.width =
                allReady
                    ? "100%"
                    : "0%";
        }

        if (timer) {
            timer.textContent =
                allReady
                    ? "Prêt !"
                    : "60s";
        }
    }
}


