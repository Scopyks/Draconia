const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const c={Math:Object.create(Math)};c.window=c;vm.createContext(c);vm.runInContext(read('explorationrules.js'),c);
const rules=c.DraconiaExplorationRules;
const counts={};
for(let i=0;i<1000;i++){const rarity=rules.pickRarity(()=>(i+.5)/1000);counts[rarity]=(counts[rarity]||0)+1;}
assert.deepEqual(counts,{Commun:600,'Peu commun':270,Rare:100,'Épique':27,'Légendaire':3});
for(const zone of ['forest','lake','mountain','ruins']){
    const puzzle=rules.puzzle(zone,()=>.1);
    assert.equal(puzzle.choices.filter(x=>x.success).length,1);
    assert(puzzle.choices.filter(x=>!x.success).every(x=>!x.reward));
}
const timers=[],button={},message={};let screen,eggActive=false,resources=0,eggs=0;
Object.assign(c,{
    DraconiaConfig:{storage:{explorationZone:'zone'}},DraconiaStorage:{getItem:()=>null,setItem(){}},
    document:{readyState:'loading',addEventListener(){},getElementById:id=>id==='egg-button'?button:id==='egg-message'?message:null},
    setTimeout:fn=>timers.push(fn),addResource:()=>resources++,addPlayerXP(){},
    player:{coins:0},savePlayer(){},updatePlayerDisplay(){},
    ownedDragons:[{energy:60,xp:9}],
    dragons:rules.rates.map((r,i)=>({id:'d'+i,element:'Nature',rarity:r.rarity})),
    draconiaHasActiveEgg:()=>eggActive,
    draconiaReceiveEgg:d=>{eggs++;eggActive=true;return true;},
    capture:e=>{screen=e;}
});

const before=JSON.stringify(c.ownedDragons);
const hooks='renderZones=function(){};displayEvent=capture;window.testFlow={find,pickDragon,chooseEvent};';
const source=read('exploration.js');
assert(!source.includes('Choisis ton chemin'));
assert(!source.includes('Chercher un nid ou rentrer'));
vm.runInContext(source.replace('function install(){',hooks+'\nfunction install(){'),c);
const tick=()=>timers.shift()();
const rolls=(...values)=>c.Math.random=()=>values.length>1?values.shift():values[0];
rolls(.95);c.testFlow.find();c.testFlow.find();assert.equal(timers.length,1);tick();
assert(message.textContent.includes('sans trouvaille'));assert.equal(button.disabled,false);assert.equal(screen,undefined);
rolls(.6,.1);c.testFlow.find();tick();assert(screen.puzzle);
const old=screen;c.testFlow.chooseEvent(screen,screen.choices.find(x=>!x.success));
assert(message.textContent.startsWith('❌'));assert.equal(c.player.coins,0);
c.testFlow.chooseEvent(old,old.choices.find(x=>x.success));assert.equal(c.player.coins,0);tick();
rolls(.6,.1);c.testFlow.find();tick();c.testFlow.chooseEvent(screen,screen.choices.find(x=>x.success));
assert.equal(c.player.coins,14);c.testFlow.chooseEvent(screen,screen.choices.find(x=>x.success));assert.equal(c.player.coins,14);tick();
rolls(.6,.9,.1);c.testFlow.find();tick();assert(!screen.puzzle);
c.testFlow.chooseEvent(screen,screen.choices[0]);assert.equal(resources,1);tick();
rolls(.1);c.testFlow.find();tick();assert.equal(eggs,1);assert.equal(button.disabled,true);
c.testFlow.find();assert.equal(timers.length,0);eggActive=false;
assert.equal(JSON.stringify(c.ownedDragons),before,'aucun compagnon');
c.draconiaPlayerPerks=()=>({rarityBonus:100,explorationBonus:100});c.getWeatherBonus=()=> 'nature';
for(const [roll,rarity] of [[.1,'Commun'],[.7,'Peu commun'],[.9,'Rare'],[.98,'Épique'],[.999,'Légendaire']]){
 rolls(roll);assert.equal(c.testFlow.pickDragon().rarity,rarity);
}
rolls(.95);c.testFlow.find();tick();assert(message.textContent.includes('sans trouvaille'));
console.log('Exploration directe, événements ponctuels, décision unique, double clic, incubation et raretés : OK');
