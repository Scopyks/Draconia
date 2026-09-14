// ======================================================
// DRACONIA - MINI-JEU DE PÊCHE 🎣
// ======================================================
function injectFishingUpgradeStyles(){if(document.getElementById("draconia-fishing-upgrade-styles"))return;const style=document.createElement("style");style.id="draconia-fishing-upgrade-styles";style.textContent=`#fishing-game{text-align:center}#fishing-game .fishing-bar{position:relative;width:100%;max-width:520px;height:34px;margin:22px auto 18px;overflow:visible;border:2px solid rgba(255,255,255,.16);border-radius:999px;background:linear-gradient(180deg,#4b4f5d,#353944);box-shadow:inset 0 3px 8px rgba(0,0,0,.28),0 8px 20px rgba(0,0,0,.12)}#fishing-game .fishing-green-zone{position:absolute;top:3px;bottom:3px;border-radius:999px;background:linear-gradient(180deg,#5ee785,#27b65a);box-shadow:0 0 12px rgba(72,220,116,.55),inset 0 1px 0 rgba(255,255,255,.35)}#fishing-game .fishing-arrow{position:absolute;top:50%;width:4px;height:48px;transform:translate(-50%,-50%);border-radius:999px;background:#fff;box-shadow:0 0 0 2px rgba(20,24,35,.55),0 0 14px rgba(255,255,255,.85);z-index:5;pointer-events:none}#fishing-game .fishing-arrow:before{content:"▼";position:absolute;left:50%;top:-20px;transform:translateX(-50%);font-size:22px;color:#fff}#fishing-game .fishing-arrow:after{content:"▲";position:absolute;left:50%;bottom:-20px;transform:translateX(-50%);font-size:22px;color:#fff}#fishing-catch-button{display:block;width:min(100%,360px);min-height:58px;margin:22px auto 8px;padding:14px 22px;border:0;border-radius:18px;background:linear-gradient(180deg,#38bdf8,#0ea5e9);color:#fff;font-size:18px;font-weight:900;box-shadow:0 8px 0 #087eae,0 14px 24px rgba(14,165,233,.28)}#fishing-catch-button:disabled{opacity:.5}#fishing-status{min-height:42px;line-height:1.45}#fishing-game-message{min-height:28px;margin-top:14px;font-weight:800}`;document.head.appendChild(style)}
function startFishingGame(){injectFishingUpgradeStyles();stopFishingGame();fishingActive=true;const b=document.getElementById("fishing-catch-button");if(b){b.disabled=false;b.textContent="🐟 ATTRAPER !"}fishingArrowDirection=Math.random()<.5?1:-1;fishingArrowPosition=fishingArrowDirection===1?0:100;const speed=1.05+Math.random()*2.15;fishingGreenWidth=14+Math.random()*16;fishingGreenStart=4+Math.random()*(92-fishingGreenWidth);const g=document.getElementById("fishing-green-zone");if(g){g.style.left=`${fishingGreenStart}%`;g.style.width=`${fishingGreenWidth}%`}updateFishingArrow();fishingInterval=setInterval(()=>{fishingArrowPosition+=speed*fishingArrowDirection;if(fishingArrowPosition>=100){fishingArrowPosition=100;fishingArrowDirection=-1}if(fishingArrowPosition<=0){fishingArrowPosition=0;fishingArrowDirection=1}updateFishingArrow()},20);const s=document.getElementById("fishing-status");if(s)s.textContent="🎣 Appuie sur ATTRAPER quand la flèche blanche est dans la zone verte !";const m=document.getElementById("fishing-game-message");if(m)m.textContent=""}
injectFishingUpgradeStyles();

// Fonctions du mini-jeu regroupées ici : une seule implémentation officielle.

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
