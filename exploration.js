// DRACONIA - EXPLORATION ENRICHIE 🗺️🐉
(function(){
const KEY=DraconiaConfig.storage.explorationZone;
const zones={
    forest:{name:"Forêt ancienne",icon:"🌲",description:"Nature, Air et Terre sont plus fréquents.",elements:["Nature","Air","Terre"]},
    lake:{name:"Lac brumeux",icon:"🌊",description:"Eau, Glace et Air sont plus fréquents.",elements:["Eau","Glace","Air"]},
    mountain:{name:"Montagnes ardentes",icon:"⛰️",description:"Feu, Terre et Foudre sont plus fréquents.",elements:["Feu","Terre","Foudre"]},
    ruins:{name:"Ruines célestes",icon:"🏛️",description:"Ombre, Lumière et Cosmique y apparaissent plus souvent.",elements:["Ombre","Lumière","Cosmique"]}
};

let selectedZone=DraconiaStorage.getItem(KEY);
if(!zones[selectedZone])selectedZone="forest";
let activeEvent=false;
let exploring=false;
let eventResolved=false;
let trip=null;
let phase="idle";

function finishTrip(){
    exploring=false;
    renderZones();
}

const weatherMap={sun:"Lumière",water:"Eau",lightning:"Foudre",ice:"Glace",shadow:"Ombre",air:"Air",nature:"Nature"};
const labels={fish:"🐟 poisson",herb:"🌿 herbe",mushroom:"🍄 champignon",meat:"🍖 viande",insect:"🐛 insecte",apple:"🍎 pomme",berry:"🍓 baie",vegetable:"🥕 légume"};

const events={
    forest:[
        {
            icon:"🐾",title:"Des traces mystérieuses",text:"De grandes empreintes disparaissent entre les arbres.",
            choices:[
                {label:"🔍 Suivre les traces",result:"Tu trouves des baies rares près d'un ancien nid.",reward:{resource:"berry",amount:2,xp:3}},
                {label:"🌿 Fouiller les alentours",result:"Sous les feuilles, tu découvres plusieurs plantes utiles.",reward:{resource:"herb",amount:2}}
            ]
        },
        {
            icon:"🧚",title:"Une petite créature perdue",text:"Une créature de la forêt semble chercher son chemin.",
            choices:[
                {label:"💚 L'aider",result:"Elle te mène jusqu'à une cache oubliée.",reward:{coins:16,xp:4}},
                {label:"🍎 Lui donner à manger",result:"Elle te remercie en déposant quelques ressources devant toi.",cost:{resource:"apple",amount:1},reward:{resource:"mushroom",amount:2,xp:5}}
            ]
        }
    ],
    lake:[
        {
            icon:"✨",title:"Une lueur sous l'eau",text:"Quelque chose brille au fond du lac brumeux.",
            choices:[
                {label:"🌊 Plonger",result:"Tu remontes avec du poisson et quelques pièces anciennes.",reward:{resource:"fish",amount:1,coins:10,xp:3}},
                {label:"🎣 Essayer de l'attraper",result:"Ta patience est récompensée par une belle prise.",reward:{resource:"fish",amount:2}}
            ]
        },
        {
            icon:"🪷",title:"L'île aux herbes",text:"Une petite île couverte de plantes apparaît dans la brume.",
            choices:[
                {label:"🌿 Récolter prudemment",result:"Tu récupères des herbes sans déranger la faune.",reward:{resource:"herb",amount:2}},
                {label:"🧭 Explorer l'île",result:"Tu trouves une vieille bourse cachée sous une pierre.",reward:{coins:20,xp:4}}
            ]
        }
    ],
    mountain:[
        {
            icon:"🪨",title:"Un passage instable",text:"Un petit éboulement révèle une cavité dans la montagne.",
            choices:[
                {label:"⛏️ Entrer dans la cavité",result:"À l'intérieur, tu trouves des champignons et quelques pièces.",reward:{resource:"mushroom",amount:2,coins:8,xp:3}},
                {label:"🧗 Continuer vers le sommet",result:"L'effort t'apporte de l'expérience et une ressource inattendue.",reward:{resource:"meat",amount:1,xp:6}}
            ]
        },
        {
            icon:"🔥",title:"Un ancien brasier",text:"Des braises magiques brûlent encore au milieu des rochers.",
            choices:[
                {label:"🔥 Examiner les braises",result:"Tu découvres une petite cache protégée par la chaleur.",reward:{coins:22,xp:3}},
                {label:"🍄 Chercher autour",result:"La chaleur a fait pousser d'étranges champignons.",reward:{resource:"mushroom",amount:2}}
            ]
        }
    ],
    ruins:[
        {
            icon:"📜",title:"Une inscription ancienne",text:"Des symboles lumineux apparaissent sur un mur des ruines.",
            choices:[
                {label:"📖 Les étudier",result:"Tu comprends une partie du message et gagnes de l'expérience.",reward:{xp:8,coins:8}},
                {label:"🔎 Inspecter le mur",result:"Un compartiment secret s'ouvre devant toi.",reward:{coins:25}}
            ]
        },
        {
            icon:"🌌",title:"Une faille scintillante",text:"Une faible énergie cosmique traverse les pierres anciennes.",
            choices:[
                {label:"✨ S'en approcher",result:"L'énergie t'enveloppe quelques secondes et renforce ton expérience.",reward:{xp:10}},
                {label:"🐛 Observer les alentours",result:"Des insectes étranges se cachent près de la faille.",reward:{resource:"insect",amount:2,coins:6}}
            ]
        }
    ]
};

function perks(){return typeof window.draconiaPlayerPerks==="function"?window.draconiaPlayerPerks():{explorationBonus:0,rarityBonus:1}}

function styles(){
    if(document.getElementById("draconia-exploration-styles"))return;
    const s=document.createElement("style");
    s.id="draconia-exploration-styles";
    s.textContent=`
        .exploration-zones{margin:18px 0 16px;text-align:left}
        .exploration-zones-title{margin:0 0 9px;font-size:13px;font-weight:900;opacity:.78}
        .exploration-zone-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
        .exploration-zone{border:1px solid rgba(167,139,250,.25);border-radius:15px;padding:11px;background:linear-gradient(145deg,#241b4f,#162447);color:#f8f7ff;text-align:left;cursor:pointer}
        .exploration-zone.selected{border-color:#a78bfa;box-shadow:0 0 0 2px rgba(124,58,237,.18)}
        .exploration-zone strong,.exploration-zone small{display:block}
        .exploration-zone small{margin-top:3px;font-size:10px;opacity:.72}
        .exploration-zone-icon{font-size:24px;margin-bottom:5px}
        .exploration-current{margin-top:10px;padding:9px 11px;border-radius:12px;background:rgba(124,58,237,.08);font-size:12px}
        .exploration-event{margin:12px 0 4px;padding:14px;border-radius:18px;background:linear-gradient(145deg,#241b4f,#162447);border:1px solid rgba(167,139,250,.32);color:#f8f7ff;text-align:left;box-shadow:0 10px 24px rgba(15,18,45,.2)}
        .exploration-event-icon{font-size:34px;margin-bottom:5px}
        .exploration-event h3{margin:3px 0 6px;font-size:16px}
        .exploration-event p{margin:0 0 12px;font-size:12px;line-height:1.45;color:#dbe4f3}
        .exploration-event-choices{display:grid;gap:8px}
        .exploration-event-choice{border:1px solid rgba(167,139,250,.26);border-radius:13px;padding:11px;background:rgba(124,58,237,.16);color:#fff;font-weight:850;text-align:left;cursor:pointer}
        .exploration-event-choice:active{transform:scale(.985)}
        .exploration-event-result{margin-top:10px;padding:10px;border-radius:12px;background:rgba(34,197,94,.12);color:#dcfce7;font-size:12px;font-weight:800;line-height:1.4}
        @media(max-width:420px){.exploration-zone{padding:9px}.exploration-event{padding:12px}}
    `;
    document.head.appendChild(s);
}

function weatherElement(){return typeof getWeatherBonus==="function"?weatherMap[getWeatherBonus()]||null:null}

function renderZones(){
    styles();
    const card=document.querySelector(".egg-card");
    if(!card)return;
    let c=document.getElementById("exploration-zones");
    if(!c){
        c=document.createElement("div");
        c.id="exploration-zones";
        c.className="exploration-zones";
        const b=document.getElementById("egg-button");
        if(b)b.insertAdjacentElement("beforebegin",c);else card.appendChild(c);
    }
    const w=weatherElement(),z=zones[selectedZone];
    c.innerHTML=`<p class="exploration-zones-title">🗺️ Choisis une zone à explorer</p><div class="exploration-zone-grid">${Object.entries(zones).map(([id,x])=>`<button class="exploration-zone ${id===selectedZone?"selected":""}" data-zone="${id}"><div class="exploration-zone-icon">${x.icon}</div><strong>${x.name}</strong><small>${x.description}</small></button>`).join("")}</div><div class="exploration-current"><strong>${z.icon} ${z.name}</strong><br>${w?`🌦️ Météo favorable aux dragons ${w}.`:"🌦️ La météo peut influencer les rencontres."}</div>`;
    c.querySelectorAll("[data-zone]").forEach(b=>b.onclick=()=>{
        if(activeEvent||exploring)return;
        selectedZone=b.dataset.zone;
        DraconiaStorage.setItem(KEY,selectedZone);
        renderZones();
    });
    c.querySelectorAll("[data-zone]").forEach(b=>b.disabled=activeEvent||exploring);
}

function pickDragon(){
    if(typeof dragons==="undefined"||!dragons.length)return null;
    const rarity=DraconiaExplorationRules.pickRarity();
    const candidates=dragons.filter(d=>d.rarity===rarity);
    if(!candidates.length)return null; // Ne jamais transformer une rareté absente en une autre.
    const z=zones[selectedZone],w=weatherElement();
    const arr=candidates.map(d=>{
        let weight=1;
        if(z.elements.includes(d.element))weight*=3;
        if(w===d.element)weight*=2.2;
        if(typeof isNight==="function"&&isNight()&&d.element==="Ombre")weight*=1.7;
        return {d,weight};
    });
    const total=arr.reduce((a,x)=>a+x.weight,0);
    let r=Math.random()*total;
    for(const x of arr){r-=x.weight;if(r<=0)return x.d}
    return arr[arr.length-1].d;
}

function hasResource(resource,amount){
    return typeof inventory!=="undefined"&&inventory&&(Number(inventory[resource])||0)>=amount;
}

function removeEventCost(cost){
    if(!cost)return true;
    if(cost.resource){
        if(!hasResource(cost.resource,cost.amount||1))return false;
        if(typeof removeResource==="function")return removeResource(cost.resource,cost.amount||1)!==false;
        inventory[cost.resource]-=cost.amount||1;
        if(typeof saveInventory==="function")saveInventory();
        if(typeof updateInventoryDisplay==="function")updateInventoryDisplay();
    }
    return true;
}

function applyReward(reward){
    if(!reward)return;
    if(reward.resource&&typeof addResource==="function")addResource(reward.resource,reward.amount||1);
    if(reward.coins&&typeof player!=="undefined"&&player){
        player.coins=(Number(player.coins)||0)+reward.coins;
        if(typeof savePlayer==="function")savePlayer();
        if(typeof updatePlayerDisplay==="function")updatePlayerDisplay();
    }
    if(reward.xp&&typeof addPlayerXP==="function")addPlayerXP(reward.xp);
}

function rewardText(reward){
    const parts=[];
    if(reward.resource)parts.push(`+${reward.amount||1} ${labels[reward.resource]||reward.resource}`);
    if(reward.coins)parts.push(`+${reward.coins} 💰`);
    if(reward.xp)parts.push(`+${reward.xp} XP`);
    return parts.join(" • ");
}

function eventPanel(){
    const card=document.querySelector(".egg-card");
    if(!card)return null;
    let p=document.getElementById("exploration-event");
    if(!p){
        p=document.createElement("div");
        p.id="exploration-event";
        p.className="exploration-event";
        const message=document.getElementById("egg-message");
        if(message)message.insertAdjacentElement("beforebegin",p);else card.appendChild(p);
    }
    return p;
}

function clearEvent(){
    activeEvent=false;
    const p=document.getElementById("exploration-event");
    if(p)p.remove();
    const b=document.getElementById("egg-button");
    if(b)b.disabled=typeof window.draconiaHasActiveEgg==="function"&&window.draconiaHasActiveEgg();
    renderZones();
}

function adventurePanel(title,text,choices,callback){
    const panel=eventPanel();
    if(!panel){endTrip("L'exploration n'est pas disponible ici.");return;}
    panel.innerHTML="";
    const heading=document.createElement("h3");heading.textContent=title;panel.appendChild(heading);
    const description=document.createElement("p");description.textContent=text;panel.appendChild(description);
    const buttons=document.createElement("div");buttons.className="exploration-event-choices";panel.appendChild(buttons);
    const currentPhase=phase;
    choices.forEach((choice,i)=>{
        const button=document.createElement("button");button.className="exploration-event-choice";button.textContent=choice.label;
        button.onclick=()=>{if(!exploring||phase!==currentPhase)return;callback(choice,i);};
        buttons.appendChild(button);
    });
}

function endTrip(text){
    const gains=trip?.gains?.join(" • ");
    const message=document.getElementById("egg-message");
    if(message)message.textContent=text+(gains?" Récompenses conservées : "+gains:" ");
    if(typeof window.draconiaAdventureLog==="function")window.draconiaAdventureLog(text,"🗺️","exploration");
    trip=null;phase="idle";
    finishTrip();clearEvent();
}

function chooseEvent(event,choice,index){
    if(!activeEvent||eventResolved||phase!=="event")return;
    if(choice.cost&&!removeEventCost(choice.cost)){
        const message=document.getElementById("egg-message");
        if(message)message.textContent="Il te manque "+(choice.cost.amount||1)+" "+(labels[choice.cost.resource]||choice.cost.resource)+". Choisis une autre option.";
        return;
    }
    eventResolved=true;
    const success=choice.success!==false&&(!choice.risk||Math.random()<choice.risk);
    if(success&&choice.reward){applyReward(choice.reward);trip.gains.push(rewardText(choice.reward));}
    trip.eventSuccess=success;
    phase="result";
    const text=success?choice.result:(event.puzzle?choice.result:"Le passage est trop dangereux : cette tentative échoue. Tes gains précédents sont conservés.");
    adventurePanel(success?"✅ Événement réussi":"❌ Événement raté",text,[{label:"Étape 3 : décider de la suite"}],decision);
}

function showRandomEvent(){
    const list=events[selectedZone]||events.forest;
    let event;
    if(Math.random()<.25)event=DraconiaExplorationRules.puzzle(selectedZone);
    else {
        const base=list[Math.floor(Math.random()*list.length)];
        event={...base,choices:[...base.choices,{label:"⚠️ Ouvrir un passage risqué (60 % de réussite)",result:"Tu ouvres le passage et découvres une cache !",risk:.6,reward:{coins:24,xp:6}}]};
    }
    phase="event";activeEvent=true;eventResolved=false;renderZones();
    adventurePanel("Étape 2 — "+event.icon+" "+event.title,event.text,event.choices,(choice,i)=>chooseEvent(event,choice,i));
}

function decision(){
    if(phase!=="result")return;
    phase="decision";
    const bonus=Math.min(.1,Math.max(0,Number(perks().explorationBonus)||0));
    const chance=Math.min(.65,Math.max(.1,(trip.route==="risk"?.48:.32)+(trip.eventSuccess?.08:-.12)+bonus));
    trip.eggChance=chance;
    adventurePanel("Étape 3 — Continuer ou rentrer ?",(trip.eventSuccess?"Le passage t'aide à chercher un nid.":"Le passage n'a pas été ouvert : la recherche sera plus difficile.")+" Chance de trouver un œuf si tu continues : "+Math.round(chance*100)+" %. Rentrer conserve tes gains, sans rechercher d'œuf.",[
        {label:"🏠 Rentrer avec mes trouvailles",home:true},{label:"🥚 Continuer pour chercher un œuf"}
    ],choice=>{
        if(choice.home){endTrip("Tu rentres de "+zones[selectedZone].name+" avec tes trouvailles.");return;}
        phase="search";
        adventurePanel("Recherche du nid…","Tu poursuis le chemin. La recherche peut ne rien donner.",[],()=>{});
        setTimeout(()=>{
            if(phase!=="search"||!trip)return;
            if(Math.random()<trip.eggChance){
                const d=pickDragon();
                if(d&&typeof window.draconiaReceiveEgg==="function"&&window.draconiaReceiveEgg(d,zones[selectedZone].name)){
                    endTrip("🥚 Tu as trouvé un œuf "+d.element+" • "+d.rarity+" !");return;
                }
            }
            endTrip("🍃 Aucun œuf trouvé cette fois. Tu rentres sans perdre tes trouvailles.");
        },850);
    });
}

function find(){
    const b=document.getElementById("egg-button"),m=document.getElementById("egg-message");
    if(activeEvent||exploring)return;
    if(typeof window.draconiaHasActiveEgg==="function"&&window.draconiaHasActiveEgg()){
        if(m)m.textContent="🥚 Un œuf est déjà en incubation.";return;
    }
    exploring=true;activeEvent=true;phase="route";trip={route:null,eventSuccess:false,gains:[]};
    if(b)b.disabled=true;renderZones();
    if(m)m.textContent="🗺️ Une nouvelle exploration commence.";
    adventurePanel("Étape 1 — Choisis ton chemin","Les gains d'événement sont conservés. Le chemin aventureux donne de meilleures chances de trouver un œuf, mais peut t'arrêter avant l'événement. Parmi les œufs obtenus : épique 2,7 %, légendaire 0,3 %.",[
        {label:"🌿 Chemin prudent — accès garanti à l'événement",route:"safe"},
        {label:"⚠️ Chemin aventureux — 20 % de risque de devoir rentrer",route:"risk"},
        {label:"🏠 Annuler la sortie",cancel:true}
    ],choice=>{
        if(choice.cancel){endTrip("Sortie annulée.");return;}
        trip.route=choice.route;
        phase="travel";
        if(choice.route==="risk"&&Math.random()<.2){endTrip("Un éboulement bloque le chemin. Tu rentres sans trouvaille.");return;}
        showRandomEvent();
    });
}

function install(){
    renderZones();
    window.findEgg=find;
    window.renderExplorationZones=renderZones;
}

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install,{once:true});else install();
})();
