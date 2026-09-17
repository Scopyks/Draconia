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
    capture:(title,text,choices,callback)=>{screen={title,text,choices,callback};}
});
const before=JSON.stringify(c.ownedDragons);
const hooks='renderZones=function(){};adventurePanel=capture;window.testFlow={find,pickDragon};';
vm.runInContext(read('exploration.js').replace('function install(){',hooks+'\nfunction install(){'),c);
const choose=i=>{const s=screen;s.callback(s.choices[i],i);};
const startPuzzle=()=>{c.Math.random=()=>.1;c.testFlow.find();choose(0);assert(screen.title.includes('énigme'));};
startPuzzle();const old=screen;
const wrong=screen.choices.findIndex(x=>!x.success);choose(wrong);assert(screen.title.includes('raté'));
old.callback(old.choices.find(x=>x.success),0);assert.equal(c.player.coins,0,'ancienne réponse ne récompense pas');
choose(0);assert(screen.text.includes('20 %'));choose(0);assert.equal(eggs,0,'rentrer ne cherche pas œuf');
startPuzzle();choose(screen.choices.findIndex(x=>x.success));assert.equal(c.player.coins,14);
choose(0);assert(screen.text.includes('40 %'));choose(1);assert.equal(timers.length,1);
timers.shift()();assert.equal(eggs,1);assert.equal(button.disabled,true,'incubation garde bouton bloqué');
c.testFlow.find();assert.equal(timers.length,0);eggActive=false;
c.Math.random=()=>.1;c.testFlow.find();choose(1);assert(message.textContent.includes('éboulement'));
assert.equal(resources,0);assert.equal(JSON.stringify(c.ownedDragons),before,'aucun compagnon');
// Taux de rareté inchangés même avec bonus joueur/météo extrêmes.
c.draconiaPlayerPerks=()=>({rarityBonus:100,explorationBonus:100});c.getWeatherBonus=()=> 'nature';
for(const [roll,rarity] of [[.1,'Commun'],[.7,'Peu commun'],[.9,'Rare'],[.98,'Épique'],[.999,'Légendaire']]){
    c.Math.random=()=>roll;assert.equal(c.testFlow.pickDragon().rarity,rarity);
}
// Événement standard et double récompense.
c.Math.random=()=>.3;c.testFlow.find();choose(0);assert(!screen.title.includes('énigme'));
const eventScreen=screen;choose(0);assert.equal(resources,1);
eventScreen.callback(eventScreen.choices[0],0);assert.equal(resources,1);
choose(0);choose(0);
console.log('Parcours, énigmes, échecs, double récompense, incubation et taux exacts : OK');
