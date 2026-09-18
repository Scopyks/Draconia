const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const data=new Map(),message={};let now=100000,renders=0;
const c={Date:{now:()=>now},DraconiaConfig:{storage:{activeEgg:'egg',ownedDragons:'owned',discoveredDragons:'dex'}},
 DraconiaStorage:{getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)},
 dragons:[{id:'fire',name:'Flamio',element:'Feu',rarity:'Commun'}],
 document:{readyState:'loading',addEventListener(){},getElementById:()=>message},
 renderDragonDex(){},setInterval(){},clearInterval(){}};
c.window=c;vm.createContext(c);
vm.runInContext(fs.readFileSync('dragons.js','utf8'),c);
vm.runInContext('renderOwnedDragons=function(){};renderDragonDex=function(){};window.owned=()=>ownedDragons;',c);
let source=fs.readFileSync('eggs.js','utf8');
source=source.replace('function start(){','render=function(){};window.hatchTest=hatchEgg;\nfunction start(){');
vm.runInContext(source,c);
const egg=()=>data.set('egg',JSON.stringify({dragonId:'fire',startedAt:0,hatchAt:now}));
egg();c.hatchTest();assert.equal(c.owned().length,1);const dragon=c.owned()[0];assert.equal(dragon.xp,0);assert.equal(dragon.level,1);
dragon.xp=80;dragon.hunger=43;dragon.cleanliness=22;dragon.restUntil=now+1000;
egg();c.hatchTest();assert.equal(c.owned().length,1);assert.equal(dragon.xp,5);assert.equal(dragon.level,2);
assert.equal(dragon.hunger,43);assert.equal(dragon.cleanliness,22);assert.equal(dragon.restUntil,now+1000);
assert(message.textContent.includes('+25 XP'));assert(message.textContent.includes('Niveau 2'));
c.hatchTest();assert.equal(dragon.xp,5,'double clic sans double récompense');
assert.equal(JSON.parse(data.get('owned'))[0].xp,5,'progression sauvegardée');
data.set('egg',JSON.stringify({dragonId:'fire',hatchAt:now+1000}));c.hatchTest();assert.equal(dragon.xp,5,'pas de récompense anticipée');
now+=1000;c.hatchTest();assert.equal(dragon.xp,30);
for(const [rarity,reward] of [['Commun',25],['Peu commun',25],['Rare',25],['Épique',35],['Légendaire',50]]){
 c.dragons[0].rarity=rarity;dragon.xp=80;dragon.level=1;
 egg();c.hatchTest();assert.equal(dragon.xp,80+reward-100);assert.equal(dragon.level,2);
 assert(message.textContent.includes('+'+reward+' XP'));
 c.hatchTest();assert.equal(dragon.xp,80+reward-100);
 assert.equal(JSON.parse(data.get('owned'))[0].xp,80+reward-100);
}
console.log('Œufs : nouveau dragon, doublon +25 XP, niveau, sauvegarde, soins conservés et double clic OK');
