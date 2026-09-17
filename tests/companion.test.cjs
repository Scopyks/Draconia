const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const data = new Map([['companion', 'dragon-feu']]);
const logs = [];
const harvests = [];
let saves = 0;
const context = {
    DraconiaConfig: { storage: { explorationCompanion: 'companion', explorationZone: 'zone' } },
    DraconiaStorage: { getItem: k => data.get(k), setItem: (k,v) => data.set(k,v) },
    ownedDragons: [{ id: 'dragon-feu', energy: 30, happiness: 99, xp: 0 }],
    dragons: [{ id: 'dragon-feu', name: 'Flamio', element: 'Feu', rarity: 'Commun' }],
    saveOwnedDragons: () => saves++, renderOwnedDragons() {},
    addDragonXP: (d,n) => d.xp += n,
    draconiaAdventureLog: (...args) => logs.push(args),
    addResource: (resource, amount) => harvests.push({resource, amount}),
    Date, Math, console
};
context.window = context;
vm.createContext(context);
const read = p => fs.readFileSync(path.join(__dirname, '..', p), 'utf8');
vm.runInContext(read('companion.js'), context);
const api = context.draconiaCompanion;
let trip = api.depart();
assert(trip.ok); assert.equal(context.ownedDragons[0].energy, 25);
assert.equal(trip.companion.name, 'Flamio');
assert(api.choice({title:'Un passage instable'}, trip.companion));
assert.equal(api.choice({title:'Une lueur sous l\'eau'}, trip.companion), null);
api.finish(trip.companion, 'Montagnes ardentes');
assert.equal(context.ownedDragons[0].happiness, 100);
assert.equal(context.ownedDragons[0].xp, 2); assert.equal(logs.length, 1);
api.finish(trip.companion, 'Montagnes ardentes');
assert.equal(context.ownedDragons[0].xp, 2, 'retour compté une fois');
for (const element of ['Feu','Eau','Nature','Air','Foudre','Glace','Terre','Ombre','Lumière','Cosmique']) {
    const companion = {id:'dragon-feu',name:'Dragon',element};
    const zone = {name:'Zone adaptée',elements:[element]};
    const beforeHarvest = harvests.length;
    const summary = api.finish(companion,zone);
    assert(summary.includes('Récolte de compagnon'));
    assert.equal(harvests.length,beforeHarvest+1);
    assert.equal(harvests.at(-1).amount,1);
    api.finish(companion,zone);
    assert.equal(harvests.length,beforeHarvest+1,'bonus unique');
    const event = api.adventure(companion,zone);
    assert.equal(event.choices.length,2);
    assert(event.choices.every(c => c.reward && c.companionAction));
    assert.equal(api.adventure(companion,{name:'Autre',elements:[]}),null);
}
const offZone = {id:'dragon-feu',name:'Flamio',element:'Feu'};
const beforeHarvest = harvests.length;
api.finish(offZone,{name:'Lac',elements:['Eau']});
assert.equal(harvests.length,beforeHarvest,'pas de bonus hors affinité');
assert.equal(api.depart().ok, true); // 25 au départ est autorisé.
assert.equal(context.ownedDragons[0].energy, 20);
const before = saves;
assert.equal(api.depart().ok, false); assert.equal(saves, before);
context.ownedDragons[0].energy = 100;
context.ownedDragons[0].restUntil = Date.now() + 10000;
assert.equal(api.depart().ok, false);
delete context.ownedDragons[0].restUntil;
const elements = {Feu:'Un passage instable', Eau:"Une lueur sous l'eau", Nature:'Une petite créature perdue', Air:'Des traces mystérieuses', Foudre:'Un ancien brasier', Glace:"L'île aux herbes", Terre:'Des traces mystérieuses', Ombre:'Une faille scintillante', Lumière:'Une inscription ancienne', Cosmique:'Une faille scintillante'};
for (const [element,title] of Object.entries(elements)) assert(api.choice({title}, {element,name:'Dragon'}), element);
// Ancienne sauvegarde : aucun compagnon sélectionné, départ solo inchangé.
data.delete('companion'); vm.runInContext(read('companion.js'), context);
assert.equal(context.draconiaCompanion.depart().companion, null);

// Tests du flux d'exploration, UI remplacée par des doubles ciblés.
const button = {}, message = {};
const panel = {querySelector: () => null, querySelectorAll: () => [], appendChild() {}, remove() {}};
const pending = [];
let departures = 0, finishes = 0, rewards = 0, eggActive = false;
context.document = {
    readyState:'loading', addEventListener() {},
    getElementById: id => id === 'egg-button' ? button : id === 'egg-message' ? message : null,
    createElement: () => ({})
};
context.setTimeout = fn => pending.push(fn);
context.draconiaHasActiveEgg = () => eggActive;
context.draconiaCompanion = {
    depart: () => {departures++; return {ok:true,companion:{id:'dragon-feu'}};},
    finish: () => {finishes++; return '';}, choice: () => null, adventure: () => null, affinity: () => false
};
context.addResource = () => rewards++;
const instrumentation = 'renderZones=function(){}; eventPanel=function(){return testPanel;}; window.testExploration={find,chooseEvent,showRandomEvent,finishTrip};';
context.testPanel = panel;
vm.runInContext(read('exploration.js').replace('function install(){', instrumentation + '\nfunction install(){'), context);
const flow = context.testExploration;
context.Math = Object.create(Math); context.Math.random = () => .95;
flow.find(); flow.find(); assert.equal(departures, 1, 'double départ bloqué');
pending.shift()(); assert.equal(finishes, 1, 'sortie vide terminée');
eggActive = true; flow.find(); assert.equal(departures, 1, 'incubation bloque avant coût');
eggActive = false;
context.Math.random = () => .6;
flow.find(); pending.shift()();
assert.equal(finishes, 1, 'événement attend un choix');
const event = {icon:'🌿'};
const choice = {result:'Trouvé', reward:{resource:'herb',amount:1}};
flow.chooseEvent(event,choice,0); flow.chooseEvent(event,choice,0);
assert.equal(rewards, 1, 'choix récompensé une seule fois');
assert.equal(finishes, 2, 'compagnon récompensé une seule fois');
pending.shift()(); // ferme l'événement précédent.
context.draconiaCompanion.affinity = () => true;
context.draconiaCompanion.adventure = () => ({icon:'🐉',title:'Piste',text:'Passage',choices:[choice]});
const rolls = [.95,.2,.2];
context.Math.random = () => rolls.shift() ?? .2;
flow.find(); pending.shift()();
assert.equal(finishes,2,'sortie vide remplacée par aventure, retour différé');
flow.chooseEvent(event,choice,0); assert.equal(finishes,3);
pending.shift()();
context.Math.random = () => .1;
context.draconiaReceiveEgg = () => true;
flow.find(); pending.shift()();
assert.equal(finishes,4,'retour compagnon également lors de découverte œuf');
console.log('10 éléments, solo, fatigue, repos, récompenses, incubation et doubles clics : OK');
