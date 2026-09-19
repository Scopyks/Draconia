const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const c={ownedDragons:[],dragons:[],renderOwnedDragons(){},feedDragon(){},restDragon(){},openWashDragon(){},playWithDragon(){},finishDragonRest(){},
 document:{getElementById(){return null},createElement(){return {set textContent(v){this._text=v}}},head:{appendChild(){}},body:{appendChild(){},classList:{add(){},remove(){}}},addEventListener(){},querySelectorAll(){return[]}},
 setTimeout(){},isDragonResting(){return false}};c.window=c;vm.createContext(c);vm.runInContext(fs.readFileSync('dragonprofile.js','utf8'),c);
const mood=c.draconiaDragonMood;
let m=mood({hunger:100,happiness:100,energy:100,cleanliness:100});assert.equal(m.label,'En pleine forme');assert.equal(m.urgent,null);
m=mood({hunger:39,happiness:90,energy:90,cleanliness:90});assert.equal(m.label,'Préoccupé');assert.equal(m.urgent,'hunger');assert(c.draconiaDragonDialogue({},m).includes('gargouiller'));
m=mood({hunger:90,happiness:90,energy:12,cleanliness:90});assert.equal(m.label,'En détresse');assert.equal(m.urgent,'energy');assert(c.draconiaDragonDialogue({},m).includes('yeux'));
m=mood({hunger:90,happiness:5,energy:90,cleanliness:90});assert(c.draconiaDragonDialogue({},m).includes('seul'));
m=mood({hunger:90,happiness:90,energy:90,cleanliness:5});assert(c.draconiaDragonDialogue({},m).includes('bain'));
m=mood({hunger:-20,happiness:900,energy:'x',cleanliness:45});assert.equal(m.values.hunger,0);assert.equal(m.values.happiness,100);assert.equal(m.values.energy,0);
const source=fs.readFileSync('dragonprofile.js','utf8');assert(source.includes('Nourrir'));assert(source.includes('Laver'));assert(source.includes('Jouer'));assert(source.includes('Repos'));
assert(source.includes('dragonArtwork(dragon)'));assert(!source.includes('background-image'));
assert(source.includes('list.addEventListener("click"'),'ouverture déléguée compatible avec les cartes recréées');
assert(source.includes('touch-action:manipulation'),'toucher iPhone explicite');
assert(source.includes('dragon-profile-rest-time'),'compte à rebours de repos dans la fiche');
assert(source.includes('getDragonRestProgress(owned)'),'progression du repos dans la fiche');
assert(source.includes('setInterval(updateProfileRestTimer,1000)'),'actualisation du repos chaque seconde');
assert(source.includes('dragon-profile-affinity'),'barre d’affinité dans la fiche');
assert(source.includes('getDragonAffinityPreference'),'préférences du dragon affichées');
assert(source.includes('getDragonTitleState'),'titre relié à la fiche du dragon');
assert(source.includes('dragon-profile-title unlocked'),'titre débloqué affiché dans la fiche');
const careSource=fs.readFileSync('dragoncare.js','utf8');assert(careSource.includes('card.dataset.dragonId = ownedDragon.id'));
assert(careSource.includes('dragon-unlocked-title'),'titre débloqué affiché dans la collection');
console.log('Fiche dragon : humeurs, actions, ouverture tactile, repos, affinité et titres OK');
