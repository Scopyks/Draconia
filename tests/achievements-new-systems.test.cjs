const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const ownedDragons=Array.from({length:10},(_,index)=>({
  id:`dragon-${index}`,level:index<3?5:1,affinity:index<5?85:10,
  hunger:index<5?90:70,happiness:90,energy:90,cleanliness:90
}));
const host={innerHTML:""};
const storage={};
const context={
  ownedDragons,player:{level:6,coins:0},preparedMeals:{},inventory:{},
  DraconiaConfig:{storage:{achievements:"achievements"}},
  DraconiaStorage:{getItem:key=>storage[key]||null,setItem:(key,value)=>{storage[key]=value}},
  savePlayer(){},updatePlayerDisplay(){},setTimeout(fn){fn()},setInterval(){},
  document:{readyState:"complete",getElementById(id){if(id==='profile-page')return {};if(id==='achievements')return host;return null},createElement(){return {id:"",className:"",innerHTML:"",classList:{add(){},remove(){}}}},head:{appendChild(){}},body:{appendChild(){}},addEventListener(){}}
};
context.window=context;vm.createContext(context);vm.runInContext(fs.readFileSync('achievements.js','utf8'),context);
assert(host.innerHTML.includes('Trio titré'));
assert(host.innerHTML.includes('Panthéon de Draconia'));
assert(host.innerHTML.includes('Premier éveil'));
assert(host.innerHTML.includes('Refuge légendaire'));
assert(host.innerHTML.includes('Âmes liées'));
assert(host.innerHTML.includes('Cercle de confiance'));
assert(host.innerHTML.includes('Liens éternels'));
assert(host.innerHTML.includes('Refuge rayonnant'));
const saved=JSON.parse(storage.achievements);
assert(saved.unlocked.titles3,'trois titres débloquent le succès');
assert(saved.unlocked.bond1&&saved.unlocked.bond5,'les paliers d’affinité utilisent le niveau maximal 5');
assert(saved.unlocked.care5,'cinq dragons en bonne santé débloquent le succès');
assert(!saved.unlocked.titles10&&!saved.unlocked.all10&&!saved.unlocked.bond10,'les objectifs longs restent verrouillés');
console.log('Succès : titres, niveau 10, affinité 5 et besoins élevés OK');
