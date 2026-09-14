// ======================================================
// DRACONIA - CHASSE - LOGIQUE DE BASE
// Extrait de l'ancien script principal, ordre de chargement conservé.
// ======================================================

// ======================================================
// CHASSE : DÉMARRAGE 🏹
// ======================================================

function startHuntingGame() {
    stopHuntingGame();

    huntingDuckVisible =
        false;

    hideHuntingDuck();

    const status =
        document.getElementById(
            "hunting-status"
        );

    if (status) {
        status.textContent =
            "🌲 Observe bien... un canard peut apparaître à tout moment.";
    }

    scheduleNextDuckCheck();
}


// ======================================================
// CHASSE : PROCHAINE APPARITION
// ======================================================

function scheduleNextDuckCheck() {
    if (
        currentGatheringGame !==
        "hunting"
    ) {
        return;
    }

    huntingDuckTimer =
        setTimeout(
            function() {
                if (
                    currentGatheringGame !==
                    "hunting"
                ) {
                    return;
                }

                if (
                    !huntingDuckVisible &&
                    Math.random() < 0.2
                ) {
                    showHuntingDuck();
                }

                scheduleNextDuckCheck();
            },
            10000
        );
}


// ======================================================
// CHASSE : AFFICHER LE CANARD
// ======================================================

function showHuntingDuck() {
    const duck =
        document.getElementById(
            "hunting-duck"
        );

    const field =
        document.getElementById(
            "hunting-field"
        );

    if (
        !duck ||
        !field
    ) {
        return;
    }

    huntingDuckVisible =
        true;

    duck.style.display =
        "block";

    const maxX =
        Math.max(
            field.clientWidth - 80,
            20
        );

    const maxY =
        Math.max(
            field.clientHeight - 160,
            60
        );

    const x =
        10 +
        Math.random() *
        Math.max(
            maxX - 20,
            20
        );

    const y =
        30 +
        Math.random() *
        Math.max(
            maxY - 40,
            30
        );

    duck.style.left =
        `${x}px`;

    duck.style.top =
        `${y}px`;

    const status =
        document.getElementById(
            "hunting-status"
        );

    if (status) {
        status.textContent =
            "🦆 Un canard ! Utilise ton arc !";
    }

    if (huntingDuckHideTimer) {
        clearTimeout(
            huntingDuckHideTimer
        );
    }

    huntingDuckHideTimer =
        setTimeout(
            function() {
                if (
                    huntingDuckVisible
                ) {
                    hideHuntingDuck();

                    const escapedStatus =
                        document.getElementById(
                            "hunting-status"
                        );

                    if (
                        escapedStatus
                    ) {
                        escapedStatus.textContent =
                            "💨 Le canard s'est envolé...";
                    }
                }
            },
            4000
        );
}


// ======================================================
// CHASSE : CACHER LE CANARD
// ======================================================

function hideHuntingDuck() {
    const duck =
        document.getElementById(
            "hunting-duck"
        );

    huntingDuckVisible =
        false;

    if (duck) {
        duck.style.display =
            "none";
    }

    if (
        huntingDuckHideTimer
    ) {
        clearTimeout(
            huntingDuckHideTimer
        );

        huntingDuckHideTimer =
            null;
    }
}


// ======================================================
// CHASSE : TIRER
// ======================================================

function shootDuck() {
    const message =
        document.getElementById(
            "hunting-game-message"
        );

    if (
        !huntingDuckVisible
    ) {
        if (message) {
            message.textContent =
                "🏹 Aucun animal à viser pour le moment.";
        }

        return;
    }

    const hitChance =
        0.75;

    const success =
        Math.random() <
        hitChance;

    if (success) {
        const amount =
            Math.random() < 0.75
                ? 1
                : 2;

        addResource(
            "meat",
            amount
        );

        addPlayerXP(
            3
        );

        if (message) {
            message.textContent =
                `🎯 Réussi ! +${amount} ${resourceNames.meat}.`;
        }
    } else {
        if (message) {
            message.textContent =
                "💨 Raté ! Le canard s'enfuit.";
        }
    }

    hideHuntingDuck();

    const status =
        document.getElementById(
            "hunting-status"
        );

    if (status) {
        status.textContent =
            "🌲 Attends le prochain animal...";
    }
}


// ======================================================
// CHASSE : ARRÊTER
// ======================================================

function stopHuntingGame() {
    if (
        huntingDuckTimer
    ) {
        clearTimeout(
            huntingDuckTimer
        );

        huntingDuckTimer =
            null;
    }

    if (
        huntingDuckHideTimer
    ) {
        clearTimeout(
            huntingDuckHideTimer
        );

        huntingDuckHideTimer =
            null;
    }

    hideHuntingDuck();
}


