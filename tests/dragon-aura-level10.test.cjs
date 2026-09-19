const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const dragon={id:'dragon-feu',name:'Flamio',element:'Feu',icon:'🔥🐉'};
const context={ownedDragons:[{id:'dragon-feu',level:9}]};
vm.createContext(context);vm.runInContext(fs.readFileSync('dragonart.js','utf8'),context);
assert(context.dragonArtwork(dragon).includes('assets/flamio.webp'),'image normale avant le niveau 10');
context.ownedDragons[0].level=10;
assert(context.dragonArtwork(dragon).includes('assets/flamio-level-10-aura.png'),'image avec aura au niveau 10');
assert(context.dragonArtwork(dragon,'egg').includes('assets/flamio-egg.webp'),'l’œuf reste inchangé');
console.log('Aura Flamio : image normale niveaux 1-9 et variante transparente au niveau 10 OK');
