const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const H=3600000;let now=100*H,saves=0;
const d={id:'a',hunger:100,happiness:100,energy:100,cleanliness:100};
const c={Date:{now:()=>now},ownedDragons:[d],saveOwnedDragons(){saves++;},renderOwnedDragons(){},
 finishDragonRest(x){x.energy=100;delete x.restUntil;},discoverDragon(x){c.ownedDragons.push({id:x.id,hunger:100,happiness:100,energy:100});},
 document:{addEventListener(){}},addEventListener(){},setInterval(){}};
c.window=c;vm.createContext(c);vm.runInContext(fs.readFileSync('dragonneeds.js','utf8'),c);
c.syncDragonNeeds();assert.equal(d.hunger,100,'migration sans pénalité inventée');
now+=48*H;c.syncDragonNeeds();assert.equal(d.hunger,4);assert.equal(d.energy,52);assert.equal(d.happiness,52);assert.equal(d.cleanliness,52);
c.syncDragonNeeds();assert.equal(d.hunger,4,'pas de double décompte');
d.hunger=100;for(let i=0;i<60;i++){now+=H/60;c.syncDragonNeeds();}assert.equal(d.hunger,98,'fractions conservées');
const reload=JSON.parse(JSON.stringify(d));c.ownedDragons=[reload];now+=H;c.syncDragonNeeds();assert.equal(reload.hunger,96,'rechargement hors ligne');
reload.energy=20;reload.restStart=now;reload.restStartEnergy=20;reload.restUntil=now+H/6;
now+=H/12;c.syncDragonNeeds();assert.equal(reload.energy,20,'repos sans déclin énergie');
now+=24*H;c.finishDragonRest(reload);assert.equal(reload.energy,76,'repos fini hors ligne puis déclin');assert.equal(reload.restUntil,undefined);
reload.hunger=100;c.syncDragonNeeds();assert.equal(reload.hunger,100,'soin respecté');
const previous=reload.hunger;now-=H;c.syncDragonNeeds();assert.equal(reload.hunger,previous,'recul horloge');
now+=1000*H;c.syncDragonNeeds();assert.equal(reload.hunger,0);assert.equal(reload.energy,0);
c.discoverDragon({id:'new'});assert.equal(c.ownedDragons[1].hunger,100);assert.equal(c.ownedDragons[1].needsUpdatedAt,now);
assert(saves>0);console.log('Besoins : migration, 48h, fractions, rechargement, repos hors ligne, soins et bornes OK');
