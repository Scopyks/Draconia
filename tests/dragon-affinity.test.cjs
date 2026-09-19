const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
let now=1_000_000;
const owned={id:'dragon-feu',affinity:10,affinityUpdatedAt:now,affinityCooldowns:{}};
const c={ownedDragons:[owned],saveOwnedDragons(){},renderOwnedDragons(){},discoverDragon(){},feedDragon(){},advanceWashStage(){},completeDragonMiniGame(){},
 document:{hidden:false,getElementById(){return null},addEventListener(){}},Date:{now:()=>now}};
c.window=c;vm.createContext(c);vm.runInContext(fs.readFileSync('dragonaffinity.js','utf8'),c);
assert.equal(c.getDragonAffinityState(owned).level,1);
let reward=c.addDragonAffinity('dragon-feu','play');assert.equal(reward.gained,8);assert.equal(reward.favorite,true);assert.equal(owned.affinity,18);
reward=c.addDragonAffinity('dragon-feu','play');assert.equal(reward.gained,0);assert.equal(reward.cooldown,true);
now+=20*60*1000;reward=c.addDragonAffinity('dragon-feu','feed');assert.equal(reward.gained,5);assert.equal(owned.affinity,23);assert.equal(reward.state.level,2);
assert.equal(c.getDragonAffinityPreference('dragon-eau').action,'wash');
assert(c.getDragonAffinityDialogue(owned).includes('reconnaître'));
now+=3*24*60*60*1000;c.ensureDragonAffinityData(now);assert.equal(owned.affinity,21,'baisse légère après deux jours de grâce');
const source=fs.readFileSync('dragonaffinity.js','utf8');assert(!source.includes('quête'));assert(source.includes('CARE_COOLDOWN'));
console.log('Affinité : préférences, bonus, paliers, délai anti-répétition et baisse légère OK');
