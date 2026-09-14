// ======================================================
// DRACONIA - INTERFACE ET INITIALISATION
// Extrait de l'ancien script principal, ordre de chargement conservé.
// ======================================================

// ======================================================
// BARRE XP JOUEUR
// ======================================================

function updateXPBar() {
    const fill =
        document.getElementById(
            "xp-fill"
        );

    if (fill) {
        fill.style.width =
            `${player.xp}%`;
    }

    const levelInfo =
        document.querySelector(
            ".level-info span:first-child"
        );

    if (levelInfo) {
        levelInfo.textContent =
            `Niveau ${player.level}`;
    }
}


// ======================================================
// NAVIGATION
// ======================================================

function showPage(pageName) {
    const pages =
        document.querySelectorAll(
            ".page"
        );

    pages.forEach(
        page => {
            page.style.display =
                "none";

            page.classList.remove(
                "active-page"
            );
        }
    );

    const selectedPage =
        document.getElementById(
            `${pageName}-page`
        );

    if (selectedPage) {
        selectedPage.style.display =
            "block";

        selectedPage.classList.add(
            "active-page"
        );
    }

    const navButtons =
        document.querySelectorAll(
            ".bottom-nav button"
        );

    navButtons.forEach(
        button => {
            button.classList.remove(
                "active"
            );
        }
    );

    const activeButton =
        document.querySelector(
            `.bottom-nav button[data-page="${pageName}"]`
        );

    if (activeButton) {
        activeButton.classList.add(
            "active"
        );
    }

    if (pageName === "dragons") {
        renderOwnedDragons();
    }

    if (pageName === "dex") {
        renderDragonDex();
    }

    if (
        pageName === "inventory"
    ) {
        updateInventoryDisplay();
    }

    if (
        pageName === "cooking"
    ) {
        renderRecipes();
    }

    window.scrollTo(
        0,
        0
    );
}


// ======================================================
// INITIALISATION
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {
        loadPlayer();
        loadInventory();
        loadPreparedMeals();
        loadDiscoveredDragons();
        loadOwnedDragons();

        generateDailyWeather();

        updateWeatherDisplay();
        updatePlayerDisplay();
        updateInventoryDisplay();
        renderDragonDex();
        renderOwnedDragons();
        renderRecipes();
        updatePlainsDisplay();

        setInterval(
            updateWeatherDisplay,
            60000
        );
    }
);

