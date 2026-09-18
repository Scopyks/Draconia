// DRACONIA - BESOINS EN TEMPS RÉEL, Y COMPRIS HORS LIGNE
(function(){
const HOUR=60*60*1000;
const rates={hunger:2,happiness:1,cleanliness:1,energy:1};
function sync(now=Date.now()){
    let changed=false;
    ownedDragons.forEach(d=>{
        const valid=Number.isFinite(d.needsUpdatedAt)&&d.needsUpdatedAt>=0;
        if(!valid){d.needsUpdatedAt=now;changed=true;}
        if(d.needsUpdatedAt>now)return; // Ne pas pénaliser un recul de l'horloge.
        const elapsed=(now-d.needsUpdatedAt)/HOUR;
        for(const key of Object.keys(rates)){
            const fallback=key==="cleanliness"?75:100;
            let value=Number.isFinite(d[key])?Math.max(0,Math.min(100,d[key])):fallback;
            let hours=elapsed,restCompleted=false;
            if(key==="energy"&&Number.isFinite(d.restUntil)){
                if(d.restUntil<=now){
                    // Restaurer au moment où le repos s'est terminé, puis compter l'absence.
                    value=100;
                    restCompleted=true;
                    hours=Math.max(0,(now-d.restUntil)/HOUR);
                    delete d.restStart;delete d.restUntil;delete d.restStartEnergy;
                    changed=true;
                }else hours=0;
            }
            // Valeur précise sauvegardée : les petites sessions ne perdent pas les fractions.
            const preciseKey="needsExact_"+key;
            if(Number.isFinite(d[preciseKey])&&Math.round(d[preciseKey])===value&&!restCompleted){
                value=d[preciseKey];
            }
            const exact=Math.max(0,Math.min(100,value-rates[key]*hours));
            if(d[key]!==Math.round(exact)||d[preciseKey]!==exact)changed=true;
            d[key]=Math.round(exact);d[preciseKey]=exact;
        }
        if(d.needsUpdatedAt!==now){d.needsUpdatedAt=now;changed=true;}
    });
    if(changed)saveOwnedDragons();
    return changed;
}
window.syncDragonNeeds=sync;
const render=renderOwnedDragons;
renderOwnedDragons=function(){sync();return render();};
for(const name of ["feedDragon","openWashDragon","playWithDragon","restDragon","completeDragonMiniGame"]){
    const action=window[name];
    if(typeof action==="function")window[name]=function(...args){sync();return action.apply(this,args);};
}
const finish=finishDragonRest;
finishDragonRest=function(d){
    sync();
    if(d&&d.restUntil)finish(d);
};
const discover=discoverDragon;
discoverDragon=function(dragon){
    sync();
    const result=discover(dragon);
    sync(); // Un nouveau dragon commence maintenant, jamais à la date de la collection.
    return result;
};
function refresh(){if(sync())renderOwnedDragons();}
document.addEventListener("DOMContentLoaded",refresh,{once:true});
document.addEventListener("visibilitychange",()=>{if(!document.hidden)refresh();});
window.addEventListener("focus",refresh);
setInterval(refresh,60000);
})();
