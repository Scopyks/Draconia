(function(){
const KEY=DraconiaConfig.storage.achievements;
const list=[
{id:"d1",icon:"🥚",title:"Première éclosion",text:"Possède ton premier dragon",reward:25,type:"owned",target:1},
{id:"d3",icon:"🐉",title:"Petit refuge",text:"Possède 3 dragons",reward:40,type:"owned",target:3},
{id:"d5",icon:"🐲",title:"Gardien de dragons",text:"Possède 5 dragons",reward:60,type:"owned",target:5},
{id:"d10",icon:"👑",title:"Maître du DragonDex",text:"Possède les 10 dragons",reward:120,type:"owned",target:10},
{id:"dl5",icon:"⭐",title:"Apprenti dresseur",text:"Fais atteindre le niveau 5 à un dragon",reward:50,type:"dragonLevel",target:5},
{id:"titles3",icon:"🏅",title:"Trio titré",text:"Débloque le titre de 3 dragons",reward:75,type:"titles",target:3},
{id:"titles10",icon:"🎖️",title:"Panthéon de Draconia",text:"Débloque le titre des 10 dragons",reward:200,type:"titles",target:10},
{id:"dl10",icon:"✨",title:"Premier éveil",text:"Fais atteindre le niveau 10 à un dragon",reward:100,type:"dragonLevel",target:10},
{id:"all10",icon:"🌠",title:"Refuge légendaire",text:"Fais atteindre le niveau 10 aux 10 dragons",reward:350,type:"dragonsAtLevel",level:10,target:10},
{id:"bond1",icon:"💞",title:"Âmes liées",text:"Atteins le niveau d’affinité 5 avec un dragon",reward:75,type:"maxAffinity",target:1},
{id:"bond5",icon:"💖",title:"Cercle de confiance",text:"Atteins le niveau d’affinité 5 avec 5 dragons",reward:150,type:"maxAffinity",target:5},
{id:"bond10",icon:"💗",title:"Liens éternels",text:"Atteins le niveau d’affinité 5 avec les 10 dragons",reward:350,type:"maxAffinity",target:10},
{id:"care5",icon:"🌈",title:"Refuge rayonnant",text:"Garde 5 dragons avec tous leurs besoins à 80 % ou plus",reward:100,type:"healthyDragons",target:5},
{id:"pl5",icon:"🌟",title:"Aventurier confirmé",text:"Atteins le niveau joueur 5",reward:50,type:"playerLevel",target:5},
{id:"meal5",icon:"🍲",title:"Chef de Draconia",text:"Possède 5 plats préparés",reward:35,type:"meals",target:5},
{id:"bag20",icon:"🎒",title:"Sac bien rempli",text:"Possède 20 ressources",reward:35,type:"inventory",target:20},
{id:"coin250",icon:"💰",title:"Trésorier",text:"Possède 250 pièces",reward:50,type:"coins",target:250}
];
let state={unlocked:{}};
try{state=JSON.parse(DraconiaStorage.getItem(KEY))||state}catch(e){}
if(!state.unlocked)state.unlocked={};

function sum(o){return o?Object.values(o).reduce((a,v)=>a+(Number(v)||0),0):0}
function getOwned(){return typeof ownedDragons!=="undefined"&&Array.isArray(ownedDragons)?ownedDragons:[]}
function getPlayer(){return typeof player!=="undefined"&&player?player:null}
function getMeals(){return typeof preparedMeals!=="undefined"&&preparedMeals?preparedMeals:null}
function getInventory(){return typeof inventory!=="undefined"&&inventory?inventory:null}
function progress(a){
const owned=getOwned(),p=getPlayer();
const currentDragons=owned.filter(d=>String(d.id||"").startsWith("dragon-"));
if(a.type==="owned")return owned.length;
if(a.type==="dragonLevel")return owned.length?Math.max(...owned.map(d=>Number(d.level)||1)):0;
if(a.type==="titles")return currentDragons.filter(d=>Number(d.level)>=5).length;
if(a.type==="dragonsAtLevel")return currentDragons.filter(d=>Number(d.level)>=Number(a.level||1)).length;
if(a.type==="maxAffinity")return currentDragons.filter(d=>Number(d.affinity)>=85).length;
if(a.type==="healthyDragons")return currentDragons.filter(d=>["hunger","happiness","energy","cleanliness"].every(key=>Number(d[key])>=80)).length;
if(a.type==="playerLevel")return p?Number(p.level)||1:0;
if(a.type==="meals")return sum(getMeals());
if(a.type==="inventory")return sum(getInventory());
if(a.type==="coins")return p?Number(p.coins)||0:0;
return 0;
}
function styles(){if(document.getElementById("achievements-style"))return;const s=document.createElement("style");s.id="achievements-style";s.textContent=`.achievements{margin:18px 0;padding:16px;border-radius:22px;background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.2)}.achievements h2{margin:3px 0 12px}.achievement{padding:12px;margin-top:9px;border-radius:15px;background:rgba(255,255,255,.72)}.achievement.done{background:rgba(250,204,21,.14)}.achievement-top{display:flex;gap:10px;align-items:center}.achievement-icon{font-size:26px}.achievement-info{flex:1}.achievement-info strong,.achievement-info small{display:block}.achievement-info small{opacity:.7;margin-top:2px}.achievement-reward{font-size:12px;font-weight:900}.achievement-bar{height:8px;background:rgba(0,0,0,.08);border-radius:999px;overflow:hidden;margin:9px 0 5px}.achievement-fill{height:100%;background:linear-gradient(90deg,#f59e0b,#facc15)}.achievement-bottom{display:flex;justify-content:space-between;font-size:11px;opacity:.72}.achievement-toast{position:fixed;top:16px;left:50%;z-index:3200;width:min(calc(100% - 28px),420px);transform:translate(-50%,-20px);opacity:0;padding:14px;border-radius:18px;background:linear-gradient(135deg,#92400e,#f59e0b);color:#fff;box-shadow:0 14px 30px rgba(0,0,0,.25);transition:.25s;pointer-events:none}.achievement-toast.show{transform:translate(-50%,0);opacity:1}.achievement-toast strong,.achievement-toast span,.achievement-toast small{display:block}.achievement-toast span{font-weight:900;margin:2px 0}`;document.head.appendChild(s)}
function toast(a){styles();let t=document.getElementById("achievement-toast");if(!t){t=document.createElement("div");t.id="achievement-toast";t.className="achievement-toast";document.body.appendChild(t)}t.innerHTML=`<strong>🏆 Succès débloqué !</strong><span>${a.icon} ${a.title}</span><small>💰 +${a.reward} pièces</small>`;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),3500)}
function panel(){const p=document.getElementById("profile-page");if(!p)return null;let x=document.getElementById("achievements");if(!x){x=document.createElement("section");x.id="achievements";x.className="achievements";p.appendChild(x)}return x}
function render(){styles();const p=panel();if(!p)return;const done=list.filter(a=>state.unlocked[a.id]).length;p.innerHTML=`<p class="small-title">PROGRESSION PERMANENTE</p><h2>🏆 Succès <small>${done}/${list.length}</small></h2>`+list.map(a=>{const raw=progress(a),v=Math.min(a.target,raw),ok=!!state.unlocked[a.id],pc=ok?100:Math.round(v/a.target*100);return `<div class="achievement ${ok?"done":""}"><div class="achievement-top"><div class="achievement-icon">${a.icon}</div><div class="achievement-info"><strong>${a.title}</strong><small>${a.text}</small></div><div class="achievement-reward">${ok?"✅":`💰 ${a.reward}`}</div></div><div class="achievement-bar"><div class="achievement-fill" style="width:${pc}%"></div></div><div class="achievement-bottom"><span>${ok?"Terminé":`${v} / ${a.target}`}</span><span>${ok?"Récompense reçue":"En progression"}</span></div></div>`}).join("")}
function reward(a){const p=getPlayer();if(!p)return false;p.coins=(Number(p.coins)||0)+a.reward;if(typeof savePlayer==="function")savePlayer();if(typeof updatePlayerDisplay==="function")updatePlayerDisplay();return true}
function check(){let delay=0,changed=false;list.forEach(a=>{if(state.unlocked[a.id]||progress(a)<a.target)return;if(!reward(a))return;state.unlocked[a.id]=Date.now();changed=true;setTimeout(()=>toast(a),delay);delay+=3700});if(changed)DraconiaStorage.setItem(KEY,JSON.stringify(state));render()}
function start(){render();setTimeout(check,500);setInterval(check,2000);window.renderAchievements=render;window.checkDraconiaAchievements=check}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();
