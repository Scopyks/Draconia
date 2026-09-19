// DRACONIA - AFFINITÉ INDIVIDUELLE DES DRAGONS
(function(){
const DEFAULT_AFFINITY=10,MAX_AFFINITY=100,DAY=24*60*60*1000,CARE_COOLDOWN=20*60*1000;
const preferences={
    "dragon-feu":"play","dragon-eau":"wash","dragon-nature":"feed","dragon-air":"play",
    "dragon-foudre":"play","dragon-glace":"wash","dragon-terre":"feed","dragon-ombre":"play",
    "dragon-lumiere":"feed","dragon-cosmique":"wash"
};
const actionLabels={feed:"être nourri",wash:"prendre un bain",play:"jouer"};
const levels=[
    {min:0,level:1,label:"Nouvelle rencontre"},{min:20,level:2,label:"Confiance naissante"},
    {min:40,level:3,label:"Complices"},{min:65,level:4,label:"Lien puissant"},
    {min:85,level:5,label:"Âmes liées"}
];
const clamp=value=>Math.max(0,Math.min(MAX_AFFINITY,Math.round(Number(value)||0)));
function ensureDragon(owned,now=Date.now()){
    let changed=false;
    if(!Number.isFinite(owned.affinity)){owned.affinity=DEFAULT_AFFINITY;changed=true;}
    owned.affinity=clamp(owned.affinity);
    if(!Number.isFinite(owned.affinityUpdatedAt)){owned.affinityUpdatedAt=now;changed=true;}
    if(!owned.affinityCooldowns||typeof owned.affinityCooldowns!=="object"){owned.affinityCooldowns={};changed=true;}
    const elapsedDays=Math.floor(Math.max(0,now-owned.affinityUpdatedAt)/DAY);
    const decayDays=Math.max(0,elapsedDays-1);
    if(decayDays>0){
        const next=clamp(owned.affinity-decayDays);
        if(next!==owned.affinity){owned.affinity=next;changed=true;}
        owned.affinityUpdatedAt+=decayDays*DAY;
    }
    return changed;
}
function ensureAll(now=Date.now()){
    let changed=false;ownedDragons.forEach(owned=>{if(ensureDragon(owned,now))changed=true;});
    if(changed&&typeof saveOwnedDragons==="function")saveOwnedDragons();
    return changed;
}
function stateFor(owned){
    if(!owned)return {value:0,level:1,label:levels[0].label,nextAt:20};
    ensureDragon(owned);
    const value=clamp(owned.affinity);
    const state=[...levels].reverse().find(item=>value>=item.min)||levels[0];
    const next=levels.find(item=>item.min>value);
    return {value,level:state.level,label:state.label,nextAt:next?next.min:null};
}
function preferenceFor(dragonId){
    const action=preferences[dragonId]||"play";
    return {action,label:actionLabels[action]};
}
function grant(dragonId,action,now=Date.now()){
    const owned=ownedDragons.find(item=>item.id===dragonId);if(!owned)return {gained:0};
    ensureDragon(owned,now);
    const last=Number(owned.affinityCooldowns[action])||0;
    if(last>0&&now-last<CARE_COOLDOWN)return {gained:0,cooldown:true,state:stateFor(owned)};
    const before=stateFor(owned),favorite=preferenceFor(dragonId).action===action;
    const gained=favorite?8:5;
    owned.affinity=clamp(owned.affinity+gained);owned.affinityCooldowns[action]=now;owned.affinityUpdatedAt=now;
    const after=stateFor(owned);
    if(typeof saveOwnedDragons==="function")saveOwnedDragons();
    return {gained:owned.affinity-before.value,favorite,levelUp:after.level>before.level,state:after};
}
function dialogue(owned){
    const state=stateFor(owned);
    return [
        "J'apprends encore à te connaître, mais je me sens bien ici.",
        "Je commence à reconnaître tes pas quand tu approches.",
        "Je suis toujours heureux de te retrouver !",
        "Notre lien devient vraiment puissant.",
        "Je te fais entièrement confiance. Rien ne pourra briser notre lien."
    ][state.level-1];
}
function rewardText(reward){
    if(!reward||!reward.gained)return "";
    return ` 💞 +${reward.gained} affinité${reward.favorite?" · soin préféré":""}${reward.levelUp?` · ${reward.state.label}`:""}`;
}
if(typeof feedDragon==="function"){
    const feed=feedDragon;feedDragon=function(dragonId){
        const owned=ownedDragons.find(item=>item.id===dragonId),before=owned?owned.hunger:null;
        const result=feed(dragonId);
        if(owned&&owned.hunger>before)grant(dragonId,"feed");
        return result;
    };
}
if(typeof advanceWashStage==="function"){
    const advance=advanceWashStage;advanceWashStage=function(){
        const dragonId=typeof activeCareDragonId==="string"?activeCareDragonId:null;
        const owned=ownedDragons.find(item=>item.id===dragonId),eligible=Boolean(owned&&washStage===2&&owned.cleanliness<100);
        const result=advance();
        if(eligible&&owned.cleanliness===100){
            const instruction=document.getElementById("wash-instruction"),reward=grant(dragonId,"wash");
            if(instruction)instruction.textContent+=rewardText(reward);
        }
        return result;
    };
}
if(typeof completeDragonMiniGame==="function"){
    const complete=completeDragonMiniGame;completeDragonMiniGame=function(success,message){
        const host=document.getElementById("dragon-mini-game"),wasRewarded=host?.dataset.rewarded;
        const dragonId=typeof activeCareDragonId==="string"?activeCareDragonId:null;
        const result=complete(success,message);
        if(success&&dragonId&&wasRewarded!=="true"&&host?.dataset.rewarded==="true"){
            const notice=document.getElementById("dragon-game-message"),reward=grant(dragonId,"play");
            if(notice)notice.textContent+=rewardText(reward);
        }
        return result;
    };
}
if(typeof discoverDragon==="function"){
    const discover=discoverDragon;discoverDragon=function(dragon){const result=discover(dragon);ensureAll();return result;};
}
if(typeof renderOwnedDragons==="function"){
    const render=renderOwnedDragons;renderOwnedDragons=function(){ensureAll();return render();};
}
window.ensureDragonAffinityData=ensureAll;
window.getDragonAffinityState=stateFor;
window.getDragonAffinityPreference=preferenceFor;
window.getDragonAffinityDialogue=dialogue;
window.addDragonAffinity=grant;
ensureAll();
document.addEventListener("visibilitychange",()=>{if(!document.hidden)ensureAll();});
})();
