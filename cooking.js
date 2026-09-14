// ======================================================
// DRACONIA - MARMITE AMÉLIORÉE 🍲
// ======================================================

let cookingAnimationTimer = null;

function injectCookingUpgradeStyles() {
    if (document.getElementById("draconia-cooking-upgrade-styles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "draconia-cooking-upgrade-styles";
    style.textContent = `
        #cooking-page .inventory-section {
            overflow: visible;
        }

        .cooking-hero {
            position: relative;
            overflow: hidden;
            margin-bottom: 16px;
            padding: 20px 16px 18px;
            border: 1px solid #343756;
            border-radius: 22px;
            background:
                radial-gradient(circle at 50% 20%, rgba(121, 92, 255, .22), transparent 42%),
                linear-gradient(180deg, #20223c, #17182c);
            text-align: center;
        }

        .cooking-hero::before,
        .cooking-hero::after {
            content: "✨";
            position: absolute;
            font-size: 20px;
            opacity: .65;
            animation: cooking-sparkle 2.2s infinite ease-in-out;
        }

        .cooking-hero::before {
            top: 28px;
            left: 18%;
        }

        .cooking-hero::after {
            top: 48px;
            right: 18%;
            animation-delay: .8s;
        }

        .cooking-cauldron-wrap {
            position: relative;
            width: 145px;
            height: 130px;
            margin: 0 auto 10px;
        }

        .cooking-steam {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 52px;
            pointer-events: none;
        }

        .cooking-steam span {
            position: absolute;
            bottom: 0;
            font-size: 23px;
            opacity: 0;
            animation: cooking-steam-rise 2.4s infinite ease-out;
        }

        .cooking-steam span:nth-child(1) { left: 27%; }
        .cooking-steam span:nth-child(2) { left: 47%; animation-delay: .7s; }
        .cooking-steam span:nth-child(3) { left: 64%; animation-delay: 1.25s; }

        .cooking-cauldron {
            position: absolute;
            left: 50%;
            bottom: 0;
            transform: translateX(-50%);
            font-size: 82px;
            line-height: 1;
            filter: drop-shadow(0 10px 10px rgba(0, 0, 0, .35));
            transform-origin: 50% 80%;
        }

        .cooking-cauldron.cooking {
            animation: cooking-cauldron-bubble .48s ease-in-out 4;
        }

        .cooking-hero h3 {
            margin-bottom: 6px;
            font-size: 19px;
        }

        .cooking-hero p {
            color: #aeb2d2;
            font-size: 13px;
            line-height: 1.45;
        }

        .cooking-summary {
            display: flex;
            justify-content: center;
            gap: 8px;
            flex-wrap: wrap;
            margin-top: 14px;
        }

        .cooking-summary span {
            padding: 8px 11px;
            border: 1px solid #343756;
            border-radius: 999px;
            background: #252742;
            color: #dfe1ff;
            font-size: 12px;
            font-weight: 700;
        }

        #recipes-list.cooking-recipes-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 12px;
        }

        #recipes-list .recipe-card {
            display: grid;
            grid-template-columns: 58px minmax(0, 1fr);
            gap: 12px;
            align-items: start;
            padding: 14px;
            border: 1px solid #30334f;
            border-radius: 18px;
            background: #1c1e34;
            transition: transform .15s ease, border-color .15s ease, opacity .15s ease;
        }

        #recipes-list .recipe-card.can-cook {
            border-color: #4b4f78;
        }

        #recipes-list .recipe-card:active {
            transform: scale(.99);
        }

        #recipes-list .recipe-icon {
            width: 58px;
            height: 58px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 16px;
            background: #292c49;
            font-size: 32px;
        }

        #recipes-list .recipe-info {
            min-width: 0;
        }

        #recipes-list .recipe-title-line {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            margin-bottom: 4px;
        }

        #recipes-list .recipe-title-line h3 {
            margin: 0;
            font-size: 15px;
        }

        #recipes-list .recipe-element {
            flex: 0 0 auto;
            padding: 4px 7px;
            border-radius: 999px;
            background: #2a2d49;
            color: #c9ccef;
            font-size: 10px;
            font-weight: 800;
        }

        #recipes-list .recipe-description {
            margin: 0 0 9px;
            color: #9296b8;
            font-size: 12px;
            line-height: 1.4;
        }

        #recipes-list .recipe-ingredients {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-bottom: 10px;
        }

        #recipes-list .recipe-ingredient {
            padding: 6px 8px;
            border-radius: 10px;
            background: #252842;
            color: #c8cbea;
            font-size: 11px;
            font-weight: 700;
        }

        #recipes-list .recipe-ingredient.ok {
            outline: 1px solid rgba(88, 200, 128, .35);
        }

        #recipes-list .recipe-ingredient.missing {
            color: #ffb5b5;
            outline: 1px solid rgba(255, 105, 105, .35);
        }

        #recipes-list .recipe-bottom {
            grid-column: 1 / -1;
            display: grid;
            grid-template-columns: auto minmax(0, 1fr);
            gap: 10px;
            align-items: center;
        }

        #recipes-list .prepared-count {
            color: #aeb2d2;
            font-size: 11px;
            white-space: nowrap;
        }

        #recipes-list .recipe-cook-button {
            width: 100%;
            min-height: 44px;
            border: 0;
            border-radius: 13px;
            padding: 10px 12px;
            background: #795cff;
            color: #fff;
            font-size: 13px;
            font-weight: 800;
            touch-action: manipulation;
        }

        #recipes-list .recipe-cook-button:active:not(:disabled) {
            transform: scale(.98);
        }

        #recipes-list .recipe-cook-button:disabled {
            background: #32354f;
            color: #8589a8;
            cursor: not-allowed;
        }

        #cooking-message.cooking-success {
            color: #bff5cf;
            font-weight: 700;
        }

        #cooking-message.cooking-error {
            color: #ffbaba;
            font-weight: 700;
        }

        @keyframes cooking-steam-rise {
            0% { transform: translateY(12px) scale(.8); opacity: 0; }
            30% { opacity: .7; }
            100% { transform: translateY(-34px) scale(1.2); opacity: 0; }
        }

        @keyframes cooking-cauldron-bubble {
            0%, 100% { transform: translateX(-50%) rotate(0deg) scale(1); }
            25% { transform: translateX(-50%) rotate(-3deg) scale(1.04); }
            75% { transform: translateX(-50%) rotate(3deg) scale(1.04); }
        }

        @keyframes cooking-sparkle {
            0%, 100% { transform: scale(.8) rotate(0deg); opacity: .25; }
            50% { transform: scale(1.15) rotate(12deg); opacity: .8; }
        }
    `;

    document.head.appendChild(style);
}

function enhanceCookingPage() {
    const page = document.getElementById("cooking-page");
    if (!page) return;

    injectCookingUpgradeStyles();

    const preview = page.querySelector(".cooking-preview");
    if (preview && !preview.classList.contains("cooking-hero")) {
        preview.className = "cooking-hero";
        preview.innerHTML = `
            <div class="cooking-cauldron-wrap">
                <div class="cooking-steam" aria-hidden="true">
                    <span>☁️</span>
                    <span>☁️</span>
                    <span>☁️</span>
                </div>
                <div id="cooking-cauldron" class="cooking-cauldron" aria-hidden="true">🍲</div>
            </div>
            <h3>La grande marmite</h3>
            <p>Choisis un plat. Les ingrédients disponibles sont indiqués en vert, et ceux qui manquent en rouge.</p>
            <div class="cooking-summary">
                <span id="cooking-ready-count">🍽️ 0 plat préparé</span>
                <span id="cooking-cookable-count">🔥 0 recette disponible</span>
            </div>
        `;
    }

    const list = document.getElementById("recipes-list");
    list?.classList.add("cooking-recipes-grid");
}

function updateCookingSummary() {
    const ready = Object.values(preparedMeals || {}).reduce(
        (total, amount) => total + (Number(amount) || 0),
        0
    );

    const cookable = recipes.filter(recipe =>
        Object.entries(recipe.ingredients).every(
            ([resource, amount]) => (inventory[resource] || 0) >= amount
        )
    ).length;

    const readyElement = document.getElementById("cooking-ready-count");
    const cookableElement = document.getElementById("cooking-cookable-count");

    if (readyElement) {
        readyElement.textContent = `🍽️ ${ready} plat${ready > 1 ? "s" : ""} préparé${ready > 1 ? "s" : ""}`;
    }

    if (cookableElement) {
        cookableElement.textContent = `🔥 ${cookable} recette${cookable > 1 ? "s" : ""} disponible${cookable > 1 ? "s" : ""}`;
    }
}

function animateCookingCauldron() {
    const cauldron = document.getElementById("cooking-cauldron");
    if (!cauldron) return;

    cauldron.classList.remove("cooking");
    void cauldron.offsetWidth;
    cauldron.classList.add("cooking");

    if (cookingAnimationTimer) {
        clearTimeout(cookingAnimationTimer);
    }

    cookingAnimationTimer = setTimeout(() => {
        cauldron.classList.remove("cooking");
    }, 2100);
}

function renderRecipes() {
    enhanceCookingPage();

    const list = document.getElementById("recipes-list");
    if (!list) return;

    list.innerHTML = "";

    recipes.forEach(recipe => {
        const canCook = Object.entries(recipe.ingredients).every(
            ([resource, amount]) => (inventory[resource] || 0) >= amount
        );

        const preparedCount = Number(preparedMeals[recipe.id]) || 0;
        const card = document.createElement("div");
        card.className = `recipe-card ${canCook ? "can-cook" : "missing-ingredients"}`;

        const ingredientsHtml = Object.entries(recipe.ingredients)
            .map(([resource, amount]) => {
                const owned = inventory[resource] || 0;
                const enough = owned >= amount;
                return `
                    <span class="recipe-ingredient ${enough ? "ok" : "missing"}">
                        ${resourceNames[resource]} ${owned}/${amount}
                    </span>
                `;
            })
            .join("");

        card.innerHTML = `
            <div class="recipe-icon">${recipe.icon}</div>

            <div class="recipe-info">
                <div class="recipe-title-line">
                    <h3>${recipe.name}</h3>
                    <span class="recipe-element">${recipe.element}</span>
                </div>
                <p class="recipe-description">${recipe.description}</p>
                <div class="recipe-ingredients">${ingredientsHtml}</div>
            </div>

            <div class="recipe-bottom">
                <span class="prepared-count">🎒 Préparé : ${preparedCount}</span>
                <button
                    class="recipe-cook-button"
                    ${canCook ? "" : "disabled"}
                    onclick="cookRecipe('${recipe.id}')"
                >
                    ${canCook ? "🍲 Cuisiner" : "🔒 Ingrédients manquants"}
                </button>
            </div>
        `;

        list.appendChild(card);
    });

    updateCookingSummary();
}

function cookRecipe(recipeId) {
    const recipe = recipes.find(item => item.id === recipeId);
    if (!recipe) return;

    const missingIngredients = Object.entries(recipe.ingredients)
        .filter(([resource, amount]) => (inventory[resource] || 0) < amount);

    if (missingIngredients.length > 0) {
        const names = missingIngredients
            .map(([resource, amount]) => {
                const owned = inventory[resource] || 0;
                return `${resourceNames[resource]} (${owned}/${amount})`;
            })
            .join(" • ");

        const message = document.getElementById("cooking-message");
        if (message) {
            message.classList.remove("cooking-success");
            message.classList.add("cooking-error");
        }

        showCookingMessage(`❌ Il te manque : ${names}.`);
        return;
    }

    Object.entries(recipe.ingredients).forEach(([resource, amount]) => {
        inventory[resource] -= amount;
    });

    preparedMeals[recipe.id] = (preparedMeals[recipe.id] || 0) + 1;

    saveInventory();
    savePreparedMeals();
    updateInventoryDisplay();
    updatePlayerDisplay();

    const message = document.getElementById("cooking-message");
    if (message) {
        message.classList.remove("cooking-error");
        message.classList.add("cooking-success");
    }

    animateCookingCauldron();
    showCookingMessage(`${recipe.icon} ${recipe.name} est prêt ! 🍽️`);
    renderRecipes();
}

injectCookingUpgradeStyles();
enhanceCookingPage();

setTimeout(() => {
    enhanceCookingPage();
    renderRecipes();
}, 0);
