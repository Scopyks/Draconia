// ======================================================
// DRACONIA - OEUFS ET ECLOSION 🥚✨
// ======================================================
(function initDragonEggs(){
const STORAGE_KEY=DraconiaConfig.storage.activeEgg;
const hatchTimes={"Commun":30000,"Peu commun":45000,"Rare":60000,"Épique":90000,"Légendaire":120000};let timer=null;
function loadEgg(){try{return JSON.parse(DraconiaStorage.getItem(STORAGE_KEY))}catch(e){return null}}
function saveEgg(e){if(!e)DraconiaStorage.removeItem(STORAGE_KEY);else DraconiaStorage.setItem(STORAGE_KEY,JSON.stringify(e))}
function formatTime(ms){const t=Math.max(0,Math.ceil(ms/1000));return `${Math.floor(t/60)}:${String(t%60).padStart(2,"0")}`}
function getDragon(id){return typeof dragons!=="undefined"?dragons.find(d=>d.id===id)||null:null}
function injectStyles(){if(document.getElementById("draconia-eggs-style"))return;const s=document.createElement("style");s.id="draconia-eggs-style";s.textContent=`.dragon-egg-panel{margin:14px 0;padding:14px;border-radius:18px;background:linear-gradient(145deg,rgba(250,204,21,.11),rgba(168,85,247,.09));border:1px solid rgba(168,85,247,.18);text-align:center}.dragon-egg-panel.empty{opacity:.76}.dragon-egg-big{font-size:54px;line-height:1;margin-bottom:8px}.dragon-egg-big .dragon-art{width:min(100%,210px);height:180px;object-fit:contain;margin:auto}.dragon-egg-panel h3{margin:4px 0 6px}.dragon-egg-panel p{margin:4px 0;font-size:12px;line-height:1.45}.dragon-egg-progress{height:10px;margin:10px 0;border-radius:999px;background:rgba(0,0,0,.09);overflow:hidden}.dragon-egg-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,#a855f7,#f59e0b);transition:width .8s linear}.dragon-egg-hatch{margin-top:10px;border:0;border-radius:12px;padding:10px 14px;background:#7c3aed;color:white;font-weight:900}.dragon-egg-hatch:disabled{opacity:.45}.dragon-egg-ready{font-weight:900;color:#7c3aed}`;document.head.appendChild(s)}
function ensurePanel(){const card=document.querySelector(".egg-card");if(!card)return null;let p=document.getElementById("dragon-egg-panel");if(!p){p=document.createElement("div");p.id="dragon-egg-panel";p.className="dragon-egg-panel";const b=document.getElementById("egg-button");if(b)b.insertAdjacentElement("afterend",p);else card.appendChild(p)}return p}
function render(){injectStyles();const p=ensurePanel();if(!p)return;const egg=loadEgg(),b=document.getElementById("egg-button");if(!egg){p.className="dragon-egg-panel empty";p.innerHTML=`<div class="dragon-egg-big">🥚</div><h3>Aucun œuf en incubation</h3><p>Explore une zone pour tenter de trouver un œuf de dragon.</p>`;if(b)b.disabled=false;return}const d=getDragon(egg.dragonId);if(!d){saveEgg(null);render();return}const rem=Math.max(0,egg.hatchAt-Date.now()),dur=Math.max(1,egg.hatchAt-egg.startedAt),pc=Math.min(100,Math.round((dur-rem)/dur*100)),ready=rem<=0;const stage=ready?"hatching":rem<=dur/2?"cracked":"egg";p.className="dragon-egg-panel";p.innerHTML=`<div class="dragon-egg-big">${dragonArtworks[d.id]?dragonArtwork(d,stage):ready?"✨🥚✨":"🥚"}</div><h3>Œuf ${d.element}</h3><p>${d.rarity} • Trouvé dans ${egg.zoneName||"Draconia"}</p><div class="dragon-egg-progress"><div class="dragon-egg-fill" style="width:${pc}%"></div></div><p class="${ready?"dragon-egg-ready":""}">${ready?"✨ L'œuf est prêt à éclore !":`⏳ Éclosion dans ${formatTime(rem)}`}</p><button class="dragon-egg-hatch" id="dragon-egg-hatch-button" ${ready?"":"disabled"}>🐣 Faire éclore</button>`;if(b)b.disabled=true;const hb=document.getElementById("dragon-egg-hatch-button");if(hb)hb.onclick=hatchEgg}
function receiveEgg(d,zone){if(!d||loadEgg())return false;const perks=typeof window.draconiaPlayerPerks==="function"?window.draconiaPlayerPerks():{hatchMultiplier:1};const duration=Math.round((hatchTimes[d.rarity]||60000)*(perks.hatchMultiplier||1)),startedAt=Date.now();saveEgg({dragonId:d.id,zoneName:zone||"Draconia",startedAt,hatchAt:startedAt+duration});render();return true}
function hatchEgg(){
    const egg=loadEgg();if(!egg||Date.now()<egg.hatchAt)return;
    const d=getDragon(egg.dragonId);if(!d){saveEgg(null);render();return}
    const owned=typeof ownedDragons!=="undefined"?ownedDragons.find(x=>x.id===d.id):null;
    const previousLevel=owned?owned.level:0;
    // Consommer avant la récompense protège des doubles clics.
    saveEgg(null);
    if(typeof discoverDragon==="function")discoverDragon(d);
    render();
    if(typeof renderOwnedDragons==="function")renderOwnedDragons();
    if(typeof renderDragonDex==="function")renderDragonDex();
    const m=document.getElementById("egg-message");
    if(m)m.textContent=owned
        ?`✨ Œuf en double : ${d.name} gagne +25 XP !${owned.level>previousLevel?` Niveau ${owned.level} atteint !`:""}`
        :`🐣 ${d.name} vient d'éclore ! Il rejoint maintenant tes dragons.`;
}
function start(){render();if(timer)clearInterval(timer);timer=setInterval(render,1000)}
window.draconiaReceiveEgg=receiveEgg;window.draconiaHasActiveEgg=()=>Boolean(loadEgg());window.renderDragonEgg=render;if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();
