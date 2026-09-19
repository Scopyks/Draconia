// DRACONIA - FICHE DÉTAILLÉE ET HUMEUR DES DRAGONS
(function(){
let selectedDragonId=null;
const clamp=value=>Math.max(0,Math.min(100,Math.round(Number(value)||0)));
function stateFor(owned){
    const values={hunger:clamp(owned.hunger),happiness:clamp(owned.happiness),energy:clamp(owned.energy),cleanliness:clamp(owned.cleanliness)};
    const urgent=Object.entries(values).sort((a,b)=>a[1]-b[1])[0];
    const average=Object.values(values).reduce((sum,value)=>sum+value,0)/4;
    if(urgent[1]<15)return {icon:"😢",label:"En détresse",urgent:urgent[0],level:"critical",values};
    if(urgent[1]<40)return {icon:"😟",label:"Préoccupé",urgent:urgent[0],level:"low",values};
    if(average>=80)return {icon:"😊",label:"En pleine forme",urgent:null,level:"great",values};
    if(average>=60)return {icon:"🙂",label:"Bien",urgent:null,level:"good",values};
    return {icon:"😐",label:"Calme",urgent:null,level:"normal",values};
}
function dialogue(dragon,mood){
    if(mood.urgent==="hunger")return mood.level==="critical"?"J'ai vraiment très faim… Peux-tu me préparer mon plat préféré ?":"Mon ventre commence à gargouiller.";
    if(mood.urgent==="happiness")return mood.level==="critical"?"Je me sens seul… Reste un peu avec moi.":"J'aimerais beaucoup jouer avec toi.";
    if(mood.urgent==="energy")return mood.level==="critical"?"Je n'arrive plus à garder les yeux ouverts…":"Je crois qu'une petite sieste me ferait du bien.";
    if(mood.urgent==="cleanliness")return mood.level==="critical"?"Mes écailles me gênent… J'ai besoin d'un bon bain.":"Mes écailles auraient bien besoin d'être nettoyées.";
    if(mood.level==="great")return "Je suis en pleine forme ! Qu'est-ce qu'on fait aujourd'hui ?";
    return "Je suis content de te voir. Passons un peu de temps ensemble !";
}
function ensureOverlay(){
    let overlay=document.getElementById("dragon-profile-overlay");
    if(!overlay){
        overlay=document.createElement("section");overlay.id="dragon-profile-overlay";overlay.className="dragon-profile-overlay";
        overlay.setAttribute("role","dialog");overlay.setAttribute("aria-modal","true");overlay.setAttribute("aria-label","Fiche du dragon");
        overlay.onclick=event=>{if(event.target===overlay)closeDragonProfile();};
        document.body.appendChild(overlay);
    }
    return overlay;
}
function stat(icon,label,value,kind){
    return `<div class="dragon-profile-stat"><div><span>${icon} ${label}</span><strong>${value}%</strong></div><div class="dragon-profile-bar"><i class="${kind}" style="width:${value}%"></i></div></div>`;
}
function openDragonProfile(id){
    if(typeof window.syncDragonNeeds==="function")window.syncDragonNeeds();
    const owned=ownedDragons.find(item=>item.id===id),dragon=dragons.find(item=>item.id===id);
    if(!owned||!dragon)return;
    selectedDragonId=id;
    const mood=stateFor(owned),resting=typeof isDragonResting==="function"&&isDragonResting(owned),tired=owned.energy<25;
    const overlay=ensureOverlay();
    overlay.innerHTML=`<article class="dragon-profile-card">
        <header><div><small>${dragon.rarity} • ${dragon.element}</small><h2>${dragon.name}</h2><span>${mood.icon} ${mood.label}</span></div><button class="dragon-profile-close" aria-label="Fermer" onclick="closeDragonProfile()">✕</button></header>
        <div class="dragon-profile-dialogue"><p>${dialogue(dragon,mood)}</p></div>
        <div class="dragon-profile-art">${dragonArtwork(dragon)}</div>
        <div class="dragon-profile-level"><span>Niveau ${owned.level}</span><span>${owned.xp} / 100 XP</span></div>
        <div class="dragon-profile-xp"><i style="width:${clamp(owned.xp)}%"></i></div>
        <div class="dragon-profile-stats">
            ${stat("🍖","Faim",mood.values.hunger,"hunger")}
            ${stat("❤️","Bonheur",mood.values.happiness,"happiness")}
            ${stat("⚡","Énergie",mood.values.energy,"energy")}
            ${stat("🫧","Propreté",mood.values.cleanliness,"cleanliness")}
        </div>
        <div class="dragon-profile-actions">
            <button onclick="dragonProfileAction('feed')" ${owned.hunger>=100||resting?"disabled":""}>🍲 Nourrir</button>
            <button onclick="dragonProfileAction('wash')" ${tired||resting?"disabled":""}>🛁 Laver</button>
            <button onclick="dragonProfileAction('play')" ${tired||resting?"disabled":""}>🎮 Jouer</button>
            <button onclick="dragonProfileAction('rest')" ${owned.energy>=100||resting?"disabled":""}>💤 ${resting?"En repos":"Repos"}</button>
        </div>
        ${resting?'<p class="dragon-profile-note">💤 Ce dragon récupère actuellement son énergie.</p>':tired?'<p class="dragon-profile-note">Il doit retrouver au moins 25 % d’énergie avant de jouer ou d’être lavé.</p>':""}
    </article>`;
    overlay.classList.add("visible");document.body.classList.add("dragon-profile-open");
    overlay.querySelector(".dragon-profile-close")?.focus();
}
function closeDragonProfile(){
    const overlay=document.getElementById("dragon-profile-overlay");if(overlay)overlay.classList.remove("visible");
    document.body.classList.remove("dragon-profile-open");selectedDragonId=null;
}
function action(type){
    const id=selectedDragonId;if(!id)return;
    if(type==="feed"){feedDragon(id);openDragonProfile(id);return;}
    if(type==="rest"){restDragon(id);openDragonProfile(id);return;}
    closeDragonProfile();
    if(type==="wash")openWashDragon(id);
    if(type==="play")playWithDragon(id);
}
function eventElement(event){
    let target=event.target;
    if(target&&target.nodeType===3)target=target.parentElement;
    return target&&typeof target.closest==="function"?target:null;
}
function bindCardInteractions(){
    const list=document.getElementById("owned-dragons-list");
    if(!list||list.dataset.dragonProfileBound==="1")return;
    list.dataset.dragonProfileBound="1";
    list.addEventListener("click",event=>{
        const target=eventElement(event);if(!target||target.closest("button"))return;
        const card=target.closest(".owned-dragon-card");
        if(!card||!list.contains(card)||!card.dataset.dragonId)return;
        openDragonProfile(card.dataset.dragonId);
    });
    list.addEventListener("keydown",event=>{
        if(event.key!=="Enter"&&event.key!==" ")return;
        const target=eventElement(event),card=target&&target.closest(".owned-dragon-card");
        if(!card||!list.contains(card)||!card.dataset.dragonId)return;
        event.preventDefault();openDragonProfile(card.dataset.dragonId);
    });
}
function decorateCards(){
    bindCardInteractions();
    document.querySelectorAll("#owned-dragons-list .owned-dragon-card").forEach((card,index)=>{
        const owned=ownedDragons[index];
        if(!card.dataset.dragonId&&owned)card.dataset.dragonId=owned.id;
        if(!card.dataset.dragonId)return;
        card.tabIndex=0;card.setAttribute("role","button");
        card.setAttribute("aria-label","Ouvrir la fiche du dragon");
    });
}
function styles(){
    if(document.getElementById("dragon-profile-styles"))return;
    const style=document.createElement("style");style.id="dragon-profile-styles";style.textContent=`
    body.dragon-profile-open{overflow:hidden}
    #owned-dragons-list .owned-dragon-card{cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent;transition:transform .18s ease,border-color .18s ease}
    #owned-dragons-list .owned-dragon-card:hover{transform:translateY(-2px);border-color:#8b5cf6}
    #owned-dragons-list .owned-dragon-card:focus-visible{outline:3px solid #8b5cf6;outline-offset:3px}
    #owned-dragons-list .dragon-care-stats,#owned-dragons-list .dragon-care-actions,#owned-dragons-list .dragon-rest-panel,#owned-dragons-list .dragon-tired-warning{display:none!important}
    .dragon-profile-overlay{display:none;position:fixed;inset:0;z-index:1450;padding:18px;background:rgba(7,8,20,.82);overflow:auto}
    .dragon-profile-overlay.visible{display:flex;align-items:center;justify-content:center}
    .dragon-profile-card{width:min(100%,520px);max-height:calc(100vh - 36px);overflow:auto;padding:18px;border:1px solid #393d61;border-radius:26px;background:#17192c;color:#fff;box-shadow:0 24px 70px rgba(0,0,0,.5)}
    .dragon-profile-card header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
    .dragon-profile-card header small{color:#aaaed1}.dragon-profile-card h2{font-size:25px;margin:2px 0 5px}.dragon-profile-card header span{font-size:13px;color:#d7d8ed}
    .dragon-profile-close{width:42px;height:42px;flex:0 0 auto;border:1px solid #3c4065;border-radius:50%;background:#242743;color:#fff;font-size:18px}
    .dragon-profile-dialogue{position:relative;margin:18px auto 8px;max-width:390px;padding:12px 16px;border:2px solid #44496f;border-radius:18px;background:#fff;color:#202136;text-align:center;font-weight:700;line-height:1.4}
    .dragon-profile-dialogue:after{content:"";position:absolute;left:50%;bottom:-9px;width:14px;height:14px;background:#fff;border-right:2px solid #44496f;border-bottom:2px solid #44496f;transform:translateX(-50%) rotate(45deg)}
    .dragon-profile-art{height:230px;display:flex;align-items:center;justify-content:center}.dragon-profile-art .dragon-art{width:100%;height:100%;object-fit:contain}
    .dragon-profile-level{display:flex;justify-content:space-between;font-size:13px;font-weight:800}.dragon-profile-xp,.dragon-profile-bar{height:10px;margin-top:7px;border-radius:999px;background:#292c49;overflow:hidden}
    .dragon-profile-xp i,.dragon-profile-bar i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#8b5cf6,#d946ef)}
    .dragon-profile-stats{display:grid;gap:11px;margin:18px 0}.dragon-profile-stat>div:first-child{display:flex;justify-content:space-between;font-size:13px}
    .dragon-profile-bar i.hunger{background:linear-gradient(90deg,#f97316,#fbbf24)}.dragon-profile-bar i.happiness{background:linear-gradient(90deg,#ec4899,#fb7185)}.dragon-profile-bar i.energy{background:linear-gradient(90deg,#eab308,#fde047)}.dragon-profile-bar i.cleanliness{background:linear-gradient(90deg,#3b82f6,#67e8f9)}
    .dragon-profile-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.dragon-profile-actions button{min-height:48px;border:1px solid #454a71;border-radius:14px;background:#292d4b;color:#fff;font-weight:900;font-size:14px}.dragon-profile-actions button:disabled{opacity:.38}
    .dragon-profile-note{margin:12px 0 0;color:#c9cbe3;font-size:12px;text-align:center}
    @media(max-height:720px){.dragon-profile-art{height:160px}.dragon-profile-card{padding:14px}.dragon-profile-dialogue{margin-top:10px}.dragon-profile-stats{margin:12px 0}}
    `;document.head.appendChild(style);
}
const render=renderOwnedDragons;
renderOwnedDragons=function(){const result=render();decorateCards();if(selectedDragonId)openDragonProfile(selectedDragonId);return result;};
window.openDragonProfile=openDragonProfile;window.closeDragonProfile=closeDragonProfile;window.dragonProfileAction=action;
window.draconiaDragonMood=stateFor;window.draconiaDragonDialogue=dialogue;
document.addEventListener("keydown",event=>{if(event.key==="Escape")closeDragonProfile();});
styles();setTimeout(()=>{decorateCards();},0);
document.addEventListener("DOMContentLoaded",decorateCards,{once:true});
document.addEventListener("visibilitychange",()=>{if(!document.hidden)decorateCards();});
})();
