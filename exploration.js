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
let currentEvent=null;
let lastEventTitle="";

function finishTrip(){
    exploring=false;
    renderZones();
}

const weatherMap={sun:"Lumière",water:"Eau",lightning:"Foudre",ice:"Glace",shadow:"Ombre",air:"Air",nature:"Nature"};
const labels={fish:"🐟 poisson",herb:"🌿 herbe",mushroom:"🍄 champignon",meat:"🍖 viande",insect:"🐛 insecte",apple:"🍎 pomme",berry:"🍓 baie",vegetable:"🥕 légume"};

const events={
    "forest": [
        {
            "icon": "🐾",
            "title": "Des traces dans la mousse",
            "text": "Des empreintes fraîches quittent le sentier. Elles mènent vers un fourré de ronces ; quelques baies poussent au bord du chemin.",
            "choices": [
                {
                    "label": "Cueillir les baies accessibles",
                    "result": "Tu remplis une petite poche de baies, puis reprends le sentier.",
                    "reward": {
                        "resource": "berry",
                        "amount": 2
                    }
                },
                {
                    "label": "Suivre les traces à travers les ronces — réussite 60 %",
                    "risk": 0.6,
                    "result": "Les traces mènent à un nid abandonné. Des baies ont poussé à l'abri de ses branches.",
                    "failure": "Les ronces sont trop épaisses. Tu fais demi-tour sans atteindre le nid.",
                    "reward": {
                        "resource": "berry",
                        "amount": 3,
                        "xp": 5
                    }
                }
            ]
        },
        {
            "icon": "🧚",
            "title": "Une créature méfiante",
            "text": "Une petite créature reste immobile près d'un tronc creux. Elle observe ton sac, puis une pomme tombée hors de sa portée.",
            "choices": [
                {
                    "label": "Lui tendre une pomme — coûte 1 pomme",
                    "cost": {
                        "resource": "apple",
                        "amount": 1
                    },
                    "result": "Rassurée, elle récupère la pomme et te montre des champignons cachés sous le tronc.",
                    "reward": {
                        "resource": "mushroom",
                        "amount": 3,
                        "xp": 4
                    }
                },
                {
                    "label": "Garder ses distances et examiner le tronc",
                    "result": "Sans la déranger, tu ramasses quelques plantes au pied du tronc.",
                    "reward": {
                        "resource": "herb",
                        "amount": 1
                    }
                }
            ]
        }
    ],
    "lake": [
        {
            "icon": "✨",
            "title": "Un reflet sous la surface",
            "text": "Entre les roseaux, un objet brille au fond du lac. L'eau est peu profonde près de la rive, mais le courant se renforce plus loin.",
            "choices": [
                {
                    "label": "Pêcher près des roseaux",
                    "result": "Tu laisses le reflet au fond du lac et attrapes deux poissons près de la rive.",
                    "reward": {
                        "resource": "fish",
                        "amount": 2
                    }
                },
                {
                    "label": "Plonger vers le reflet — réussite 60 %",
                    "risk": 0.6,
                    "result": "Tu récupères une bourse coincée sous une pierre et rejoins la rive.",
                    "failure": "Le courant t'empêche d'atteindre le fond. Tu rejoins la rive sans rien récupérer.",
                    "reward": {
                        "coins": 24,
                        "xp": 5
                    }
                }
            ]
        },
        {
            "icon": "🪷",
            "title": "Des pierres dans la brume",
            "text": "Une rangée de pierres permet de rejoindre un îlot couvert de plantes. Certaines disparaissent sous l'eau lorsque le vent se lève.",
            "choices": [
                {
                    "label": "Récolter les plantes de la rive",
                    "result": "Tu trouves des herbes entre les roseaux sans quitter la terre ferme.",
                    "reward": {
                        "resource": "herb",
                        "amount": 2
                    }
                },
                {
                    "label": "Traverser jusqu'à l'îlot — réussite 60 %",
                    "risk": 0.6,
                    "result": "Tu atteins l'îlot et récoltes des plantes que personne n'a encore cueillies.",
                    "failure": "Une pierre glisse sous ton pied. Tu renonces à la traversée et reviens sur la rive.",
                    "reward": {
                        "resource": "herb",
                        "amount": 3,
                        "xp": 5
                    }
                }
            ]
        }
    ],
    "mountain": [
        {
            "icon": "🪨",
            "title": "Une fissure dans la roche",
            "text": "Un éboulement récent a ouvert une cavité. Des pierres continuent de tomber de sa voûte ; des champignons poussent déjà près de l'entrée.",
            "choices": [
                {
                    "label": "Récolter à l'entrée",
                    "result": "Tu ramasses les champignons accessibles sans entrer sous la voûte.",
                    "reward": {
                        "resource": "mushroom",
                        "amount": 2
                    }
                },
                {
                    "label": "Explorer la cavité — réussite 60 %",
                    "risk": 0.6,
                    "result": "Tu trouves des pièces anciennes dans une niche avant de ressortir.",
                    "failure": "Le bruit des pierres s'intensifie. Tu ressors avant d'avoir trouvé quoi que ce soit.",
                    "reward": {
                        "coins": 24,
                        "xp": 6
                    }
                }
            ]
        },
        {
            "icon": "🔥",
            "title": "Le camp des braises",
            "text": "Un campement désert borde le chemin. Son foyer est encore chaud. Un sac repose derrière les braises, tandis que des plantes poussent à l'écart.",
            "choices": [
                {
                    "label": "Ramasser les plantes loin du foyer",
                    "result": "Tu récoltes quelques herbes sans t'approcher des braises.",
                    "reward": {
                        "resource": "herb",
                        "amount": 2
                    }
                },
                {
                    "label": "Atteindre le sac derrière le foyer — réussite 60 %",
                    "risk": 0.6,
                    "result": "Tu contournes les braises et récupères les provisions oubliées dans le sac.",
                    "failure": "Une bourrasque ravive le foyer. Tu t'éloignes et laisses le sac sur place.",
                    "reward": {
                        "resource": "meat",
                        "amount": 2,
                        "xp": 5
                    }
                }
            ]
        }
    ],
    "ruins": [
        {
            "icon": "📜",
            "title": "Le mur aux symboles",
            "text": "Une dalle gravée dépasse d'un mur effondré. Un léger courant d'air sort de sa base : un compartiment se cache peut-être derrière.",
            "choices": [
                {
                    "label": "Étudier les symboles sans déplacer la dalle",
                    "result": "Tu reconnais des marques de passage et notes leur signification.",
                    "reward": {
                        "xp": 7
                    }
                },
                {
                    "label": "Soulever la dalle — réussite 60 %",
                    "risk": 0.6,
                    "result": "La dalle pivote et révèle un petit trésor intact.",
                    "failure": "La dalle reste bloquée. Tu préfères ne pas fragiliser davantage le mur.",
                    "reward": {
                        "coins": 25,
                        "xp": 4
                    }
                }
            ]
        },
        {
            "icon": "🌌",
            "title": "Une arche qui scintille",
            "text": "Une lueur traverse une arche brisée par intermittence. À chaque pulsation, les pierres vibrent et les insectes alentour s'éloignent.",
            "choices": [
                {
                    "label": "Observer les pulsations depuis l'extérieur",
                    "result": "Tu repères un rythme régulier et consignes cette découverte.",
                    "reward": {
                        "xp": 6
                    }
                },
                {
                    "label": "Franchir l'arche entre deux pulsations — réussite 60 %",
                    "risk": 0.6,
                    "result": "Tu passes au bon moment et découvres une offrande ancienne de l'autre côté.",
                    "failure": "La lueur revient avant que tu ne traverses. Tu recules et renonces à l'offrande.",
                    "reward": {
                        "coins": 24,
                        "xp": 6
                    }
                }
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

function displayEvent(event){
    const panel=eventPanel();
    if(!panel){finishTrip();clearEvent();return;}
    panel.innerHTML="";
    const heading=document.createElement("h3");heading.textContent=event.icon+" "+event.title;panel.appendChild(heading);
    const description=document.createElement("p");description.textContent=event.text;panel.appendChild(description);
    const buttons=document.createElement("div");buttons.className="exploration-event-choices";panel.appendChild(buttons);
    event.choices.forEach(choice=>{
        const button=document.createElement("button");button.className="exploration-event-choice";button.textContent=choice.label;
        button.onclick=()=>chooseEvent(event,choice);
        buttons.appendChild(button);
    });
}

function chooseEvent(event,choice){
    if(!activeEvent||eventResolved||event!==currentEvent||!event.choices.includes(choice))return;
    const message=document.getElementById("egg-message");
    if(choice.cost&&!removeEventCost(choice.cost)){
        if(message)message.textContent="Il te manque "+(choice.cost.amount||1)+" "+(labels[choice.cost.resource]||choice.cost.resource)+". Choisis une autre option.";
        return;
    }
    eventResolved=true;
    const success=choice.success!==false&&(!choice.risk||Math.random()<choice.risk);
    if(success&&choice.reward)applyReward(choice.reward);
    const text=(success?"✅ ":"❌ ")+(success?choice.result:(choice.failure||choice.result))+
        (success&&choice.reward?" "+rewardText(choice.reward):"");
    if(message)message.textContent=text;
    const panel=document.getElementById("exploration-event");
    if(panel)panel.querySelectorAll("button").forEach(button=>button.disabled=true);
    if(typeof window.draconiaAdventureLog==="function")window.draconiaAdventureLog(text,event.icon,"exploration");
    finishTrip();
    // Une seule décision : la sortie est terminée, sans étape supplémentaire.
    setTimeout(()=>{currentEvent=null;clearEvent();},1800);
}

function showRandomEvent(){
    const list=events[selectedZone]||events.forest;
    let event;
    if(Math.random()<.25)event=DraconiaExplorationRules.puzzle(selectedZone);
    else {
        const alternatives=list.filter(e=>e.title!==lastEventTitle);
        const pool=alternatives.length?alternatives:list;
        event=pool[Math.floor(Math.random()*pool.length)];
    }
    lastEventTitle=event.title;
    currentEvent=event;activeEvent=true;eventResolved=false;renderZones();
    displayEvent(event);
}

function find(){
    const b=document.getElementById("egg-button"),m=document.getElementById("egg-message");
    if(activeEvent||exploring)return;
    if(typeof window.draconiaHasActiveEgg==="function"&&window.draconiaHasActiveEgg()){
        if(m)m.textContent="🥚 Un œuf est déjà en incubation.";return;
    }
    exploring=true;
    if(b)b.disabled=true;renderZones();
    if(m)m.textContent="🗺️ Exploration de "+zones[selectedZone].name+"…";
    setTimeout(()=>{
        const bonus=Math.min(.1,Math.max(0,Number(perks().explorationBonus)||0));
        const eggChance=.42+bonus,roll=Math.random();
        if(roll<eggChance){
            const d=pickDragon();
            if(d&&typeof window.draconiaReceiveEgg==="function"&&window.draconiaReceiveEgg(d,zones[selectedZone].name)){
                if(m)m.textContent="🥚 Tu as trouvé un œuf "+d.element+" • "+d.rarity+" !";
                finishTrip();clearEvent();return;
            }
        }else if(roll<eggChance+.30){
            showRandomEvent();return;
        }
        if(m)m.textContent="🍃 Tu rentres de "+zones[selectedZone].name+" sans trouvaille cette fois.";
        finishTrip();clearEvent();
    },850);
}

function install(){
    renderZones();
    window.findEgg=find;
    window.renderExplorationZones=renderZones;
}

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install,{once:true});else install();
})();
