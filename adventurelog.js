// DRACONIA - JOURNAL D'AVENTURE 📜
(function(){
const KEY="draconiaAdventureLogV1";
const MAX=25;
function load(){try{const x=JSON.parse(localStorage.getItem(KEY)||"[]");return Array.isArray(x)?x:[]}catch(e){return[]}}
function save(items){localStorage.setItem(KEY,JSON.stringify(items.slice(0,MAX)))}
function stamp(){return new Date().toLocaleString("fr-FR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}
function add(text,icon="📜",type="general"){
 if(!text)return;
 const items=load();items.unshift({text:String(text),icon,type,date:stamp(),ts:Date.now()});save(items);render();
}
function styles(){if(document.getElementById("draconia-adventure-log-styles"))return;const s=document.createElement("style");s.id="draconia-adventure-log-styles";s.textContent=`
.draconia-log{margin:16px 0;padding:15px;border:1px solid rgba(167,139,250,.25);border-radius:18px;background:linear-gradient(145deg,#241b4f,#162447);color:#f8f7ff;text-align:left;box-shadow:0 10px 24px rgba(8,12,35,.18)}
.draconia-log-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}.draconia-log-head h3{margin:0;font-size:17px}.draconia-log-clear{border:0;border-radius:10px;padding:7px 9px;background:rgba(255,255,255,.09);color:#ddd6fe;font-size:11px;font-weight:800}.draconia-log-list{display:grid;gap:8px;max-height:330px;overflow:auto}.draconia-log-item{display:grid;grid-template-columns:34px 1fr;gap:9px;padding:10px;border-radius:13px;background:rgba(255,255,255,.065)}.draconia-log-icon{font-size:22px;line-height:1.2}.draconia-log-text{font-size:12px;line-height:1.4}.draconia-log-date{display:block;margin-top:3px;font-size:10px;color:#c4b5fd;opacity:.82}.draconia-log-empty{margin:4px 0;font-size:12px;opacity:.72;text-align:center;padding:12px}`;document.head.appendChild(s)}
function container(){
 let c=document.getElementById("draconia-adventure-log");if(c)return c;
 const profile=document.getElementById("profile-page");if(!profile)return null;
 c=document.createElement("section");c.id="draconia-adventure-log";c.className="draconia-log";
 const target=profile.querySelector(".level-card");if(target)target.insertAdjacentElement("afterend",c);else profile.appendChild(c);return c;
}
function render(){styles();const c=container();if(!c)return;const items=load();c.innerHTML=`<div class="draconia-log-head"><h3>📜 Journal d'aventure</h3><button class="draconia-log-clear" type="button">Effacer</button></div><div class="draconia-log-list">${items.length?items.map(x=>`<div class="draconia-log-item"><div class="draconia-log-icon">${x.icon||"📜"}</div><div class="draconia-log-text">${escapeHtml(x.text)}<span class="draconia-log-date">${escapeHtml(x.date||"")}</span></div></div>`).join(""):`<p class="draconia-log-empty">Tes prochaines aventures apparaîtront ici. 🐉</p>`}</div>`;c.querySelector(".draconia-log-clear").onclick=()=>{if(confirm("Effacer le journal d'aventure ?")){save([]);render()}}}
function escapeHtml(v){return String(v).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[ch]))}
window.draconiaAdventureLog=add;window.renderAdventureLog=render;
function hook(name,make){let tries=0;const t=setInterval(()=>{tries++;const fn=window[name];if(typeof fn==="function"&&!fn.__adventureLog){const wrapped=make(fn);wrapped.__adventureLog=true;window[name]=wrapped;clearInterval(t)}else if(tries>40)clearInterval(t)},250)}
hook("discoverDragon",old=>function(d,...args){const before=typeof ownedDragons!=="undefined"&&d?ownedDragons.some(x=>(x.id||x.dragonId)===d.id):false;const r=old.call(this,d,...args);if(d&&!before)add(`${d.name||"Un dragon"} a rejoint ton refuge !`,`🐉`,"dragon");return r});
hook("addPlayerXP",old=>function(amount,...args){const before=typeof player!=="undefined"?Number(player.level)||1:null;const r=old.call(this,amount,...args);const after=typeof player!=="undefined"?Number(player.level)||1:null;if(before!==null&&after>before)add(`Tu passes au niveau ${after} !`,`⭐`,"level");return r});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",render,{once:true});else render();
})();