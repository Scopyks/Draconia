const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname,'../exploration.js'),'utf8');
assert(!source.includes('draconiaCompanion'));
const index = fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
assert(!index.includes('src="companion.js'));
const button = {}, message = {}, timers = [];
let incubation = false, rewards = 0, eggs = 0;
const dragons = [{id:'dragon-feu',name:'Flamio',element:'Feu',rarity:'Commun'}];
const panel = {querySelector:()=>null,querySelectorAll:()=>[],appendChild(){},remove(){}};
const context = {
    DraconiaConfig:{storage:{explorationZone:'zone'}},
    DraconiaStorage:{getItem:()=>null,setItem(){}}, dragons,
    ownedDragons:[{id:'dragon-feu',energy:40,xp:15,happiness:50}],
    document:{readyState:'loading',addEventListener(){},createElement:()=>({}),getElementById:id=>id==='egg-button'?button:id==='egg-message'?message:id==='exploration-event'?panel:null},
    setTimeout:fn=>timers.push(fn),Math:Object.create(Math),
    draconiaHasActiveEgg:()=>incubation,
    draconiaReceiveEgg:()=>{eggs++;return true;},
    addResource:()=>rewards++, testPanel:panel
};
context.window=context;
vm.createContext(context);
vm.runInContext(source.replace('function install(){','renderZones=function(){};eventPanel=function(){return testPanel;};window.testFlow={find,chooseEvent};\nfunction install(){'),context);
const before=JSON.stringify(context.ownedDragons);
context.Math.random=()=>.95;
context.testFlow.find();context.testFlow.find();assert.equal(timers.length,1);
timers.shift()();assert.equal(button.disabled,false);
incubation=true;context.testFlow.find();assert.equal(timers.length,0);
incubation=false;context.Math.random=()=>.6;
context.testFlow.find();timers.shift()();
const choice={result:'Trouvé',reward:{resource:'herb',amount:2}};
context.testFlow.chooseEvent({icon:'🌿'},choice,0);
context.testFlow.chooseEvent({icon:'🌿'},choice,0);
assert.equal(rewards,1);timers.shift()();
context.Math.random=()=>.1;context.testFlow.find();timers.shift()();assert.equal(eggs,1);
assert.equal(JSON.stringify(context.ownedDragons),before,'aucune modification des dragons');
console.log('Solo : sorties, événements, œufs, incubation, double clic et dragons inchangés : OK');
