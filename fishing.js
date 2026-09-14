// ======================================================
// DRACONIA - MINI-JEU DE PÊCHE 🎣
// ======================================================

/*
 * Ce fichier est chargé après script.js.
 * Il remplace uniquement le démarrage du mini-jeu de pêche
 * afin que chaque tentative ait une vitesse différente.
 */

function startFishingGame() {
    stopFishingGame();

    fishingActive = true;

    // La flèche peut commencer à gauche ou à droite.
    fishingArrowDirection =
        Math.random() < 0.5
            ? 1
            : -1;

    fishingArrowPosition =
        fishingArrowDirection === 1
            ? 0
            : 100;

    // Vitesse différente à chaque tentative.
    // Certaines manches sont lentes, d'autres nettement plus rapides.
    const fishingSpeed =
        1.05 +
        Math.random() * 2.15;

    // Position et largeur de la zone verte également aléatoires.
    fishingGreenWidth =
        14 +
        Math.random() * 16;

    fishingGreenStart =
        4 +
        Math.random() *
        (92 - fishingGreenWidth);

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
                    fishingSpeed *
                    fishingArrowDirection;

                if (
                    fishingArrowPosition >= 100
                ) {
                    fishingArrowPosition = 100;
                    fishingArrowDirection = -1;
                }

                if (
                    fishingArrowPosition <= 0
                ) {
                    fishingArrowPosition = 0;
                    fishingArrowDirection = 1;
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
            "🎣 Arrête la flèche dans la zone verte ! Sur le gris, le poisson s'échappe.";
    }

    const message =
        document.getElementById(
            "fishing-game-message"
        );

    if (message) {
        message.textContent = "";
    }
}
