// DRACONIA - TITRES DÉBLOQUÉS AU NIVEAU 5
(function(){
const TITLE_UNLOCK_LEVEL=5;
const titles=Object.freeze({
    "dragon-feu":"Pourfendeur des Flammes",
    "dragon-eau":"Pourfendeur des Marées",
    "dragon-nature":"Dieu des Mille Forêts",
    "dragon-air":"Prince des Quatre Vents",
    "dragon-foudre":"Pourfendeur des Foudres",
    "dragon-glace":"Chasseur des Démons de Glace",
    "dragon-terre":"Démon des Sables",
    "dragon-ombre":"Vengeur des Ombres",
    "dragon-lumiere":"Héritier des Six Voies",
    "dragon-cosmique":"Maître de l’Infini"
});
function getTitle(dragonId){return titles[dragonId]||"";}
function isUnlocked(owned){return Boolean(owned&&Number(owned.level)>=TITLE_UNLOCK_LEVEL&&getTitle(owned.id));}
function stateFor(owned){
    return {title:owned?getTitle(owned.id):"",unlocked:isUnlocked(owned),unlockLevel:TITLE_UNLOCK_LEVEL};
}
window.draconiaDragonTitles=titles;
window.getDragonTitle=getTitle;
window.isDragonTitleUnlocked=isUnlocked;
window.getDragonTitleState=stateFor;
})();
