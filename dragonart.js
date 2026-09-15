// Illustrations du dragon de feu. Les autres dragons gardent leur icône actuelle.
const flamioArtwork = Object.freeze({
    egg: "assets/flamio-egg.webp",
    cracked: "assets/flamio-egg-cracked.webp",
    hatching: "assets/flamio-hatching.webp",
    dragon: "assets/flamio.webp"
});

function dragonArtwork(dragon, stage = "dragon") {
    if (!dragon || dragon.id !== "dragon-feu") return dragon ? dragon.icon : "🥚";
    const labels = {
        egg: "Œuf de feu",
        cracked: "Œuf de feu fissuré",
        hatching: "Flamio sort de son œuf",
        dragon: "Flamio, dragon de feu"
    };
    const src = flamioArtwork[stage] || flamioArtwork.dragon;
    return `<img class="dragon-art dragon-art-${stage}" src="${src}" alt="${labels[stage] || labels.dragon}" draggable="false">`;
}
