// Règles testables : la rareté est tirée AVANT les affinités de zone/météo.
(function(global){
    const rates=Object.freeze([
        {rarity:"Commun",weight:600}, {rarity:"Peu commun",weight:270},
        {rarity:"Rare",weight:100}, {rarity:"Épique",weight:27}, {rarity:"Légendaire",weight:3}
    ].map(Object.freeze));
    function pickRarity(random=Math.random){
        let roll=random()*1000;
        for(const entry of rates){roll-=entry.weight;if(roll<0)return entry.rarity;}
        return "Légendaire";
    }
    const riddles={
        forest:[
            {question:"Je grandis sans marcher, bois sans bouche et porte des feuilles. Qui suis-je ?",answers:["Un arbre","Une rivière","Un rocher"],correct:0},
            {question:"Trois branches portent chacune deux nids. Combien de nids y a-t-il ?",answers:["5","6","9"],correct:1}
        ],
        lake:[
            {question:"Plus je sèche, plus je deviens mouillée. Qui suis-je ?",answers:["La brume","Une serviette","La glace"],correct:1},
            {question:"Je reflète les étoiles sans en posséder une seule. Qui suis-je ?",answers:["Le fond rocheux","Une coquille","La surface du lac"],correct:2}
        ],
        mountain:[
            {question:"La pierre porte la suite 2, 4, 8, 16. Quel nombre vient ensuite ?",answers:["18","24","32"],correct:2},
            {question:"Je réponds quand tu cries, sans jamais parler le premier. Qui suis-je ?",answers:["L'écho","Le vent","La neige"],correct:0}
        ],
        ruins:[
            {question:"Une rune vaut 3. Combien valent quatre runes identiques ?",answers:["7","12","9"],correct:1},
            {question:"J'ai des pages, mais je ne suis pas un arbre. Je raconte sans voix. Qui suis-je ?",answers:["Une statue","Une torche","Un livre"],correct:2}
        ]
    };
    function puzzle(zone,random=Math.random){
        const list=riddles[zone]||riddles.forest;
        const r=list[Math.floor(random()*list.length)];
        // Les positions des réponses changent sans déplacer la bonne réponse logique.
        const answers=r.answers.map((text,i)=>({text,correct:i===r.correct}));
        for(let i=answers.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[answers[i],answers[j]]=[answers[j],answers[i]];}
        const settings={forest:["La borne du vieux sentier","Sous le lierre, une borne gravée indique une cache. Trois signes entourent cette inscription : "],lake:["Le coffret de la rive","Un coffret échoué porte trois signes sur son fermoir. Une inscription permet de choisir le bon : "],mountain:["La niche scellée","Dans une niche rocheuse, une petite porte porte trois signes. Au-dessus, une inscription indique lequel presser : "],ruins:["Le sceau oublié","Un coffre est protégé par un sceau à trois signes. Son couvercle porte cette inscription : "]};
        const setting=settings[zone]||settings.forest;
        return {icon:"🧩",title:setting[0],text:setting[1]+r.question,puzzle:true,
            choices:answers.map(a=>({label:a.text,success:a.correct,result:a.correct?"Le signe choisi s'illumine. La cache s'ouvre et tu récupères une poignée de pièces.":"Le signe choisi s'efface et le mécanisme se bloque. La cache reste fermée ; tu reprends ta route sans récompense.",reward:a.correct?{coins:14,xp:5}:null}))};
    }
    global.DraconiaExplorationRules=Object.freeze({rates,pickRarity,puzzle});
})(typeof window!=="undefined"?window:globalThis);
