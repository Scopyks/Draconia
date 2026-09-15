// Illustrations par dragon. Les dragons sans visuel gardent leur icône actuelle.
const flamioArtwork = Object.freeze({
    egg: "assets/flamio-egg.webp",
    cracked: "assets/flamio-egg-cracked.webp",
    hatching: "assets/flamio-hatching.webp",
    dragon: "assets/flamio.webp"
});
const natureArtwork = Object.freeze({
    egg: "assets/nature-egg.webp",
    cracked: "assets/nature-egg-cracked.webp",
    hatching: "assets/nature-hatching.webp",
    dragon: "assets/dragon-nature-senju-v2.webp"
});

const dragonArtworks = Object.freeze({
    "dragon-feu": flamioArtwork,
    "dragon-nature": natureArtwork
});

function dragonArtwork(dragon, stage = "dragon") {
    const artwork = dragon && dragonArtworks[dragon.id];
    if (!artwork) return dragon ? dragon.icon : "🥚";
    const labels = {
        egg: `Œuf de ${dragon.element}`,
        cracked: `Œuf de ${dragon.element} fissuré`,
        hatching: `${dragon.name} sort de son œuf`,
        dragon: `${dragon.name}, dragon de ${dragon.element}`
    };
    return `<img class="dragon-art dragon-art-${stage}" src="${artwork[stage] || artwork.dragon}" alt="${labels[stage] || labels.dragon}" draggable="false">`;
}
