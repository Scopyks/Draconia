// ======================================================
// DRACONIA - MINI-JEU DE PÊCHE 🎣
// ======================================================

/*
 * Ce fichier est chargé après script.js.
 * Il améliore uniquement le mini-jeu de pêche.
 */

function prepareFishingInterface() {
    const bar =
        document.getElementById(
            "fishing-bar"
        );

    const arrow =
        document.getElementById(
            "fishing-arrow"
        );

    const button =
        document.getElementById(
            "fishing-catch-button"
        );

    if (bar) {
        bar.style.position = "relative";
        bar.style.height = "48px";
        bar.style.background = "#5f6472";
        bar.style.border = "3px solid #ffffff";
        bar.style.borderRadius = "18px";
        bar.style.overflow = "hidden";
        bar.style.boxShadow =
            "0 6px 18px rgba(0, 0, 0, 0.35)";
    }

    if (arrow) {
        // La flèche était vide dans le HTML : on lui donne enfin un symbole visible.
        arrow.textContent = "▼";
        arrow.style.position = "absolute";
        arrow.style.top = "50%";
        arrow.style.width = "38px";
        arrow.style.height = "38px";
        arrow.style.display = "flex";
        arrow.style.alignItems = "center";
        arrow.style.justifyContent = "center";
        arrow.style.transform =
            "translate(-50%, -50%)";
        arrow.style.fontSize = "30px";
        arrow.style.fontWeight = "900";
        arrow.style.color = "#ffffff";
        arrow.style.textShadow =
            "0 2px 5px rgba(0, 0, 0, 0.85)";
        arrow.style.zIndex = "5";
        arrow.style.pointerEvents = "none";
    }

    if (button) {
        button.textContent =
            "🎣 ATTRAPER LE POISSON !";

        button.style.width = "100%";
        button.style.minHeight = "64px";
        button.style.marginTop = "18px";
        button.style.border = "none";
        button.style.borderRadius = "18px";
        button.style.background =
            "linear-gradient(180deg, #8b6cff 0%, #6746e8 100%)";
        button.style.color = "#ffffff";
        button.style.fontSize = "18px";
        button.style.fontWeight = "800";
        button.style.letterSpacing = "0.4px";
        button.style.boxShadow =
            "0 8px 20px rgba(103, 70, 232, 0.35)";
        button.style.touchAction = "manipulation";
    }
}


function startFishingGame() {
    stopFishingGame();

    prepareFishingInterface();

    fishingActive = true;

    // La flèche peut commencer à gauche ou à droite.
    fishingArrowDirection =
        Math.random() < 0.5
            ? 1
            : -1;

    fishingArrowPosition =
        fishingArrowDirection === 1
            ? 3
            : 97;

    // Vitesse différente à chaque tentative.
    // Certaines manches sont lentes, d'autres beaucoup plus rapides.
    const fishingSpeed =
        0.9 +
        Math.random() * 2.5;

    // Position et largeur de la zone verte aléatoires.
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

        greenZone.style.top = "0";
        greenZone.style.bottom = "0";
        greenZone.style.position = "absolute";
        greenZone.style.background = "#45c76f";
        greenZone.style.borderRadius = "14px";
        greenZone.style.boxShadow =
            "inset 0 0 0 2px rgba(255, 255, 255, 0.22)";
    }

    updateFishingArrow();

    fishingInterval =
        setInterval(
            function() {
                fishingArrowPosition +=
                    fishingSpeed *
                    fishingArrowDirection;

                if (
                    fishingArrowPosition >= 97
                ) {
                    fishingArrowPosition = 97;
                    fishingArrowDirection = -1;
                }

                if (
                    fishingArrowPosition <= 3
                ) {
                    fishingArrowPosition = 3;
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
            "🎯 Appuie sur le gros bouton quand la flèche blanche est dans la zone verte. Sur le gris, le poisson s'échappe !";
    }

    const message =
        document.getElementById(
            "fishing-game-message"
        );

    if (message) {
        message.textContent = "";
        message.style.marginTop = "14px";
        message.style.textAlign = "center";
        message.style.fontWeight = "700";
    }
}


// Prépare aussi l'affichage dès le chargement de la page.
prepareFishingInterface();
