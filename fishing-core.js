// ======================================================
// DRACONIA - PÊCHE - LOGIQUE DE BASE
// Extrait de l'ancien script principal, ordre de chargement conservé.
// ======================================================

// ======================================================
// PÊCHE : DÉMARRAGE 🎣
// ======================================================

function startFishingGame() {
    stopFishingGame();

    fishingArrowPosition =
        0;

    fishingArrowDirection =
        1;

    fishingActive =
        true;

    fishingGreenStart =
        20 +
        Math.random() * 45;

    fishingGreenWidth =
        18 +
        Math.random() * 15;

    const greenZone =
        document.getElementById(
            "fishing-green-zone"
        );

    if (greenZone) {
        greenZone.style.left =
            `${fishingGreenStart}%`;

        greenZone.style.width =
            `${fishingGreenWidth}%`;
    }

    updateFishingArrow();

    fishingInterval =
        setInterval(
            function() {
                fishingArrowPosition +=
                    1.8 *
                    fishingArrowDirection;

                if (
                    fishingArrowPosition >=
                    100
                ) {
                    fishingArrowPosition =
                        100;

                    fishingArrowDirection =
                        -1;
                }

                if (
                    fishingArrowPosition <=
                    0
                ) {
                    fishingArrowPosition =
                        0;

                    fishingArrowDirection =
                        1;
                }

                updateFishingArrow();
            },
            20
        );

    const status =
        document.getElementById(
            "fishing-status"
        );

    if (status) {
        status.textContent =
            "🎣 Appuie sur Attraper quand la flèche est dans la zone verte !";
    }

    const message =
        document.getElementById(
            "fishing-game-message"
        );

    if (message) {
        message.textContent =
            "";
    }
}


// ======================================================
// PÊCHE : AFFICHER LA FLÈCHE
// ======================================================

function updateFishingArrow() {
    const arrow =
        document.getElementById(
            "fishing-arrow"
        );

    if (arrow) {
        arrow.style.left =
            `${fishingArrowPosition}%`;
    }
}


// ======================================================
// PÊCHE : ATTRAPER
// ======================================================

function catchFish() {
    if (!fishingActive) {
        startFishingGame();
        return;
    }

    const greenEnd =
        fishingGreenStart +
        fishingGreenWidth;

    const success =
        fishingArrowPosition >=
            fishingGreenStart &&
        fishingArrowPosition <=
            greenEnd;

    const message =
        document.getElementById(
            "fishing-game-message"
        );

    if (success) {
        const amountRoll =
            Math.random();

        let amount = 1;

        if (amountRoll > 0.85) {
            amount = 3;
        } else if (
            amountRoll > 0.45
        ) {
            amount = 2;
        }

        addResource(
            "fish",
            amount
        );

        addPlayerXP(
            2 + amount
        );

        if (message) {
            message.textContent =
                `🐟 Bravo ! Tu attrapes ${amount} poisson${amount > 1 ? "s" : ""}.`;
        }
    } else {
        if (message) {
            message.textContent =
                "💨 Trop tôt ou trop tard... le poisson s'est échappé.";
        }
    }

    stopFishingGame();

    setTimeout(
        function() {
            if (
                currentGatheringGame ===
                "fishing"
            ) {
                startFishingGame();
            }
        },
        1200
    );
}


// ======================================================
// PÊCHE : ARRÊTER
// ======================================================

function stopFishingGame() {
    fishingActive =
        false;

    if (fishingInterval) {
        clearInterval(
            fishingInterval
        );

        fishingInterval =
            null;
    }
}


