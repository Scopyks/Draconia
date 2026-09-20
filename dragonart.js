// Illustrations par dragon. Les dragons sans visuel gardent leur icône actuelle.
const flamioArtwork = Object.freeze({
    egg: "assets/flamio-egg.webp",
    cracked: "assets/flamio-egg-cracked.webp",
    hatching: "assets/flamio-hatching.webp",
    dragon: "assets/flamio.webp",
    level10: "assets/flamio-level-10-aura.webp"
});
const natureArtwork = Object.freeze({
    egg: "assets/nature-egg.webp",
    cracked: "assets/nature-egg-cracked.webp",
    hatching: "assets/nature-hatching.webp",
    dragon: "assets/dragon-nature-senju-v2.webp"
});
const lightningArtwork = Object.freeze({
    egg: "assets/lightning-egg.webp",
    cracked: "assets/lightning-egg-cracked.webp",
    hatching: "assets/lightning-hatching.webp",
    dragon: "assets/lightning-dragon.webp",
    level10: "assets/lightning-level-10-aura.webp"
});
const lightArtwork = Object.freeze({
    egg: "assets/light-egg.webp",
    cracked: "assets/light-egg-cracked.webp",
    hatching: "assets/light-hatching.webp",
    dragon: "assets/light-dragon.webp",
    level10: "assets/light-level-10-aura.webp"
});
const waterArtwork = Object.freeze({
    egg: "assets/water-egg.webp",
    cracked: "assets/water-egg-cracked.webp",
    hatching: "assets/water-hatching.webp",
    dragon: "assets/water-dragon.webp",
    level10: "assets/aquaria-level-10-aura.webp"
});
const earthArtwork = Object.freeze({
    egg: "assets/earth-egg.webp",
    cracked: "assets/earth-egg-cracked.webp",
    hatching: "assets/earth-hatching.webp",
    dragon: "assets/earth-dragon.webp"
});
const shadowArtwork = Object.freeze({
    egg: "assets/shadow-egg.webp",
    cracked: "assets/shadow-egg-cracked.webp",
    hatching: "assets/shadow-hatching.webp",
    dragon: "assets/shadow-dragon.webp",
    level10: "assets/noctis-level-10-aura.webp"
});
const cosmicArtwork = Object.freeze({
    egg: "assets/cosmic-egg.webp",
    cracked: "assets/cosmic-egg-cracked.webp",
    hatching: "assets/cosmic-hatching.webp",
    dragon: "assets/cosmic-dragon.webp"
});
const airArtwork = Object.freeze({
    egg: "assets/air-egg.webp",
    cracked: "assets/air-egg-cracked.webp",
    hatching: "assets/air-hatching.webp",
    dragon: "assets/air-dragon.webp",
    level10: "assets/zephyr-level-10-aura.webp"
});

const iceArtwork = Object.freeze({
    egg: "assets/ice-egg.webp",
    cracked: "assets/ice-egg-cracked.webp",
    hatching: "assets/ice-hatching.webp",
    dragon: "assets/ice-dragon.webp",
    level10: "assets/ice-level-10-aura.webp"
});

const dragonArtworks = Object.freeze({
    "dragon-feu": flamioArtwork,
    "dragon-nature": natureArtwork,
    "dragon-foudre": lightningArtwork,
    "dragon-lumiere": lightArtwork,
    "dragon-eau": waterArtwork,
    "dragon-terre": earthArtwork,
    "dragon-ombre": shadowArtwork,
    "dragon-cosmique": cosmicArtwork,
    "dragon-air": airArtwork,
    "dragon-glace": iceArtwork
});

function dragonArtwork(dragon, stage = "dragon") {
    const artwork = dragon && dragonArtworks[dragon.id];
    if (!artwork) return dragon ? dragon.icon : "🥚";
    const owned = stage === "dragon" && typeof ownedDragons !== "undefined" && Array.isArray(ownedDragons)
        ? ownedDragons.find(item => item && item.id === dragon.id)
        : null;
    const source = owned && Number(owned.level) >= 10 && artwork.level10
        ? artwork.level10
        : artwork[stage] || artwork.dragon;
    const mirrored = dragon.id === "dragon-terre" && stage === "dragon"
        ? ' style="transform:scaleX(-1)"'
        : "";
    const labels = {
        egg: `Œuf de ${dragon.element}`,
        cracked: `Œuf de ${dragon.element} fissuré`,
        hatching: `${dragon.name} sort de son œuf`,
        dragon: `${dragon.name}, dragon de ${dragon.element}`
    };
    return `<img class="dragon-art dragon-art-${stage}" src="${source}" alt="${labels[stage] || labels.dragon}" draggable="false"${mirrored}>`;
}
