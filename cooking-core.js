// ======================================================
// DRACONIA - CUISINE - LOGIQUE DE BASE
// Extrait de l'ancien script principal, ordre de chargement conservé.
// ======================================================

// ======================================================
// RECETTES
// ======================================================

function renderRecipes() {
    const list =
        document.getElementById(
            "recipes-list"
        );

    if (!list) {
        return;
    }

    list.innerHTML = "";

    recipes.forEach(
        recipe => {
            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "recipe-card";

            const ingredientsText =
                Object.entries(
                    recipe.ingredients
                )
                    .map(
                        ([resource, amount]) =>
                            `${resourceNames[resource]} x${amount}`
                    )
                    .join(" • ");

            const canCook =
                Object.entries(
                    recipe.ingredients
                )
                    .every(
                        ([resource, amount]) =>
                            inventory[resource] >=
                            amount
                    );

            card.innerHTML = `
                <div class="recipe-icon">
                    ${recipe.icon}
                </div>

                <div class="recipe-info">

                    <h3>
                        ${recipe.name}
                    </h3>

                    <p>
                        ${recipe.description}
                    </p>

                    <small>
                        ${ingredientsText}
                    </small>

                </div>

                <button
                    ${
                        canCook
                            ? ""
                            : "disabled"
                    }
                    onclick="cookRecipe('${recipe.id}')"
                >
                    🍲 Cuisiner
                </button>
            `;

            list.appendChild(
                card
            );
        }
    );
}


// ======================================================
// CUISINER
// ======================================================

function cookRecipe(
    recipeId
) {
    const recipe =
        recipes.find(
            item =>
                item.id ===
                recipeId
        );

    if (!recipe) {
        return;
    }

    const canCook =
        Object.entries(
            recipe.ingredients
        )
            .every(
                ([resource, amount]) =>
                    inventory[resource] >=
                    amount
            );

    if (!canCook) {
        showCookingMessage(
            "❌ Il te manque des ingrédients."
        );

        return;
    }

    Object.entries(
        recipe.ingredients
    )
        .forEach(
            ([resource, amount]) => {
                inventory[
                    resource
                ] -= amount;
            }
        );

    preparedMeals[
        recipe.id
    ] += 1;

    saveInventory();
    savePreparedMeals();

    updateInventoryDisplay();
    updatePlayerDisplay();

    showCookingMessage(
        `${recipe.icon} ${recipe.name} préparé !`
    );
}


