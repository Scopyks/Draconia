// ======================================================
// DRACONIA - REPOS DES DRAGONS 💤
// ======================================================

const DRAGON_MAX_REST_DURATION = 10 * 60 * 1000;
const DRAGON_TIRED_THRESHOLD = 25;
const dragonRestIntervals = new Map();

function isDragonResting(ownedDragon) {
    return Boolean(
        ownedDragon &&
        ownedDragon.restUntil &&
        ownedDragon.restUntil > Date.now()
    );
}

function isDragonTooTired(ownedDragon) {
    return Boolean(
        ownedDragon &&
        ownedDragon.energy < DRAGON_TIRED_THRESHOLD
    );
}

function getDragonRestDurationFromEnergy(energy) {
    const safeEnergy = Math.max(
        0,
        Math.min(100, Number(energy) || 0)
    );

    const missingEnergy = 100 - safeEnergy;

    return Math.round(
        DRAGON_MAX_REST_DURATION *
        (missingEnergy / 100)
    );
}

function getDragonRestProgress(ownedDragon) {
    if (!ownedDragon || !ownedDragon.restStart || !ownedDragon.restUntil) {
        return 0;
    }

    const duration = ownedDragon.restUntil - ownedDragon.restStart;
    if (duration <= 0) return 100;

    const elapsed = Date.now() - ownedDragon.restStart;
    return Math.max(0, Math.min(100, (elapsed / duration) * 100));
}

function getDragonRestRemaining(ownedDragon) {
    if (!ownedDragon || !ownedDragon.restUntil) return 0;
    return Math.max(0, ownedDragon.restUntil - Date.now());
}

function formatDragonRestTime(ms) {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
}

function finishDragonRest(ownedDragon) {
    if (!ownedDragon) return;

    ownedDragon.energy = 100;
    delete ownedDragon.restStart;
    delete ownedDragon.restUntil;
    delete ownedDragon.restStartEnergy;
}

function updateRestingDragonEnergy(ownedDragon) {
    if (!ownedDragon || !isDragonResting(ownedDragon)) return;

    const startEnergy = Number.isFinite(ownedDragon.restStartEnergy)
        ? ownedDragon.restStartEnergy
        : ownedDragon.energy;

    const progress = getDragonRestProgress(ownedDragon) / 100;

    ownedDragon.energy = Math.min(
        100,
        Math.round(
            startEnergy +
            (100 - startEnergy) * progress
        )
    );
}

function syncDragonRestStates() {
    let changed = false;

    ownedDragons.forEach(ownedDragon => {
        if (!ownedDragon.restUntil) return;

        if (ownedDragon.restUntil <= Date.now()) {
            finishDragonRest(ownedDragon);
            changed = true;
            return;
        }

        updateRestingDragonEnergy(ownedDragon);
    });

    if (changed) {
        saveOwnedDragons();
    }
}

function blockIfDragonResting(dragonId) {
    const ownedDragon =
        ownedDragons.find(
            dragon => dragon.id === dragonId
        );

    if (!isDragonResting(ownedDragon)) {
        return false;
    }

    const dragon =
        dragons.find(
            item => item.id === dragonId
        );

    const remaining =
        formatDragonRestTime(
            getDragonRestRemaining(ownedDragon)
        );

    alert(
        `${dragon ? dragon.name : "Ce dragon"} se repose encore pendant ${remaining}.`
    );

    return true;
}

function blockIfDragonTooTired(dragonId, actionLabel) {
    const ownedDragon =
        ownedDragons.find(
            dragon => dragon.id === dragonId
        );

    if (!isDragonTooTired(ownedDragon)) {
        return false;
    }

    const dragon =
        dragons.find(
            item => item.id === dragonId
        );

    alert(
        `${dragon ? dragon.name : "Ce dragon"} est trop fatigué pour ${actionLabel}. Il lui faut au moins ${DRAGON_TIRED_THRESHOLD} % d'énergie.`
    );

    return true;
}

function injectDragonRestStyles() {
    if (
        document.getElementById(
            "dragon-rest-styles"
        )
    ) {
        return;
    }

    const style =
        document.createElement("style");

    style.id = "dragon-rest-styles";

    style.textContent = `
        .dragon-rest-panel {
            margin-top: 12px;
            padding: 12px;
            border-radius: 14px;
            background: #20233a;
            border: 1px solid #323652;
        }

        .dragon-rest-info {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            margin-bottom: 8px;
            font-size: 13px;
        }

        .dragon-rest-bar {
            width: 100%;
            height: 11px;
            overflow: hidden;
            border-radius: 999px;
            background: #30344f;
        }

        .dragon-rest-fill {
            height: 100%;
            width: 0%;
            border-radius: inherit;
            background: linear-gradient(90deg, #7b86ff, #b58cff);
            transition: width .5s linear;
        }

        .dragon-resting-card {
            opacity: .92;
        }

        .dragon-resting-card .dragon-care-actions button:disabled,
        .dragon-too-tired-card .dragon-care-actions button:disabled {
            opacity: .45;
            cursor: not-allowed;
        }

        .dragon-tired-warning {
            margin-top: 10px;
            color: #f0c98b;
            font-size: 12px;
            text-align: center;
        }
    `;

    document.head.appendChild(style);
}

function decorateDragonRestCards() {
    const cards =
        document.querySelectorAll(
            ".owned-dragon-card"
        );

    cards.forEach(card => {
        const buttons =
            card.querySelectorAll(
                ".dragon-care-actions button"
            );

        if (buttons.length < 4) {
            return;
        }

        const feedButton = buttons[0];
        const washButton = buttons[1];
        const playButton = buttons[2];
        const restButton = buttons[3];

        const match =
            restButton
                .getAttribute("onclick")
                ?.match(
                    /restDragon\('([^']+)'\)/
                );

        if (!match) {
            return;
        }

        const dragonId = match[1];

        const ownedDragon =
            ownedDragons.find(
                dragon =>
                    dragon.id === dragonId
            );

        if (!ownedDragon) {
            return;
        }

        let panel =
            card.querySelector(
                ".dragon-rest-panel"
            );

        let tiredWarning =
            card.querySelector(
                ".dragon-tired-warning"
            );

        if (!isDragonResting(ownedDragon)) {
            card.classList.remove(
                "dragon-resting-card"
            );

            const tooTired =
                isDragonTooTired(ownedDragon);

            card.classList.toggle(
                "dragon-too-tired-card",
                tooTired
            );

            washButton.disabled = tooTired;
            playButton.disabled = tooTired;
            restButton.disabled = false;
            restButton.textContent =
                "💤 Repos";

            if (ownedDragon.hunger < 100) {
                feedButton.disabled = false;
            }

            panel?.remove();

            if (tooTired) {
                if (!tiredWarning) {
                    tiredWarning =
                        document.createElement(
                            "p"
                        );
                    tiredWarning.className =
                        "dragon-tired-warning";
                    card.appendChild(
                        tiredWarning
                    );
                }

                tiredWarning.textContent =
                    `😴 Trop fatigué : lavage et jeux disponibles à partir de ${DRAGON_TIRED_THRESHOLD} % d'énergie.`;
            } else {
                tiredWarning?.remove();
            }

            return;
        }

        updateRestingDragonEnergy(
            ownedDragon
        );

        card.classList.add(
            "dragon-resting-card"
        );
        card.classList.remove(
            "dragon-too-tired-card"
        );
        tiredWarning?.remove();

        feedButton.disabled = true;
        washButton.disabled = true;
        playButton.disabled = true;
        restButton.disabled = true;
        restButton.textContent =
            "💤 En repos...";

        if (!panel) {
            panel =
                document.createElement(
                    "div"
                );

            panel.className =
                "dragon-rest-panel";

            card.appendChild(panel);
        }

        const progress =
            getDragonRestProgress(
                ownedDragon
            );

        const remaining =
            formatDragonRestTime(
                getDragonRestRemaining(
                    ownedDragon
                )
            );

        panel.innerHTML = `
            <div class="dragon-rest-info">
                <span>💤 Repos en cours</span>
                <strong>${remaining}</strong>
            </div>
            <div class="dragon-rest-bar">
                <div
                    class="dragon-rest-fill"
                    style="width:${progress}%"
                ></div>
            </div>
        `;
    });
}

const originalRenderOwnedDragonsForRest =
    renderOwnedDragons;

renderOwnedDragons = function() {
    syncDragonRestStates();
    originalRenderOwnedDragonsForRest();
    decorateDragonRestCards();
};

function startDragonRestTimer() {
    if (
        dragonRestIntervals.has("main")
    ) {
        return;
    }

    const interval =
        setInterval(
            function() {
                let finished = false;

                ownedDragons.forEach(
                    ownedDragon => {
                        if (
                            ownedDragon.restUntil &&
                            ownedDragon.restUntil <=
                                Date.now()
                        ) {
                            finishDragonRest(
                                ownedDragon
                            );
                            finished = true;
                        } else if (
                            isDragonResting(
                                ownedDragon
                            )
                        ) {
                            updateRestingDragonEnergy(
                                ownedDragon
                            );
                        }
                    }
                );

                if (finished) {
                    saveOwnedDragons();
                    renderOwnedDragons();
                    return;
                }

                decorateDragonRestCards();
            },
            1000
        );

    dragonRestIntervals.set(
        "main",
        interval
    );
}

const originalFeedDragonForRest =
    feedDragon;

feedDragon = function(dragonId) {
    if (
        blockIfDragonResting(
            dragonId
        )
    ) {
        return;
    }

    return originalFeedDragonForRest(
        dragonId
    );
};

const originalOpenWashDragonForRest =
    openWashDragon;

openWashDragon = function(dragonId) {
    if (
        blockIfDragonResting(
            dragonId
        ) ||
        blockIfDragonTooTired(
            dragonId,
            "être lavé"
        )
    ) {
        return;
    }

    return originalOpenWashDragonForRest(
        dragonId
    );
};

const originalPlayWithDragonForRest =
    playWithDragon;

playWithDragon = function(dragonId) {
    if (
        blockIfDragonResting(
            dragonId
        ) ||
        blockIfDragonTooTired(
            dragonId,
            "jouer"
        )
    ) {
        return;
    }

    return originalPlayWithDragonForRest(
        dragonId
    );
};

restDragon = function(dragonId) {
    const ownedDragon =
        ownedDragons.find(
            dragon =>
                dragon.id === dragonId
        );

    const dragon =
        dragons.find(
            item =>
                item.id === dragonId
        );

    if (!ownedDragon) {
        return;
    }

    if (
        isDragonResting(
            ownedDragon
        )
    ) {
        blockIfDragonResting(
            dragonId
        );
        return;
    }

    if (ownedDragon.energy >= 100) {
        alert(
            `${dragon ? dragon.name : "Ce dragon"} a déjà toute son énergie.`
        );
        return;
    }

    const restDuration =
        getDragonRestDurationFromEnergy(
            ownedDragon.energy
        );

    ownedDragon.restStart =
        Date.now();

    ownedDragon.restUntil =
        ownedDragon.restStart +
        restDuration;

    ownedDragon.restStartEnergy =
        ownedDragon.energy;

    saveOwnedDragons();
    renderOwnedDragons();
};

injectDragonRestStyles();
syncDragonRestStates();
startDragonRestTimer();

setTimeout(
    function() {
        renderOwnedDragons();
    },
    0
);
