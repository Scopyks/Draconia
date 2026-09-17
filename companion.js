// DRACONIA - COMPAGNON D'EXPLORATION
(function () {
    const key = DraconiaConfig.storage.explorationCompanion;
    let selected = DraconiaStorage.getItem(key) || "";
    const energyCost = 5;
    const minimumEnergy = 25;
    const bonusResources = {Feu:"mushroom", Eau:"fish", Nature:"herb", Air:"berry", Foudre:"meat", Glace:"fish", Terre:"vegetable", Ombre:"insect", Lumière:"apple", Cosmique:"insect"};
    const resourceNames = {mushroom:"🍄 champignon",fish:"🐟 poisson",herb:"🌿 herbe",berry:"🍓 baie",meat:"🍖 viande",vegetable:"🥕 légume",insect:"🐛 insecte",apple:"🍎 pomme"};
    function affinity(companion, zone) { return !!companion && !!zone?.elements?.includes(companion.element); }
    const abilities = {
        Feu: { label: "Éclairer une cavité", result: "éclaire une cavité et repère une cache", resource: "mushroom" },
        Eau: { label: "Explorer sous l'eau", result: "plonge et rapporte une belle prise", resource: "fish" },
        Nature: { label: "Soigner les plantes", result: "aide les plantes et découvre des herbes", resource: "herb" },
        Air: { label: "Observer depuis le ciel", result: "survole les lieux et repère des baies", resource: "berry" },
        Foudre: { label: "Activer un mécanisme", result: "réveille un ancien mécanisme et ouvre une cache", coins: 22 },
        Glace: { label: "Créer un passage gelé", result: "gèle un passage et atteint une réserve de plantes", resource: "herb" },
        Terre: { label: "Déplacer les rochers", result: "déplace un rocher et révèle une cache", coins: 22 },
        Ombre: { label: "Suivre les ombres", result: "suit les ombres jusqu'à un recoin oublié", resource: "insect" },
        Lumière: { label: "Révéler les symboles", result: "illumine les symboles et révèle un trésor", coins: 22 },
        Cosmique: { label: "Lire les énergies anciennes", result: "déchiffre les énergies anciennes et leurs secrets", xp: 9 }
    };
    const compatible = {
        "Des traces mystérieuses": ["Air", "Terre"],
        "Une petite créature perdue": ["Nature"],
        "Une lueur sous l'eau": ["Eau"],
        "L'île aux herbes": ["Glace", "Air", "Nature"],
        "Un passage instable": ["Feu", "Terre"],
        "Un ancien brasier": ["Foudre", "Feu"],
        "Une inscription ancienne": ["Lumière", "Foudre"],
        "Une faille scintillante": ["Ombre", "Cosmique"]
    };
    function owned(id) { return ownedDragons.find(d => d.id === id); }
    function available(d) {
        return !!d && !(Number(d.restUntil) > Date.now()) && Number(d.energy) >= minimumEnergy;
    }
    function render(container, locked, zone) {
        const label = document.createElement("label");
        label.className = "exploration-current";
        label.style.display = "block";
        label.textContent = "🐉 Compagnon d'exploration ";
        const select = document.createElement("select");
        select.id = "exploration-companion";
        select.setAttribute("aria-label", "Choisir un compagnon d'exploration");
        select.disabled = locked;
        const solo = document.createElement("option");
        solo.value = ""; solo.textContent = "Explorer seul (gratuit)";
        select.appendChild(solo);
        ownedDragons.forEach(d => {
            const dragon = dragons.find(x => x.id === d.id);
            if (!dragon) return;
            const option = document.createElement("option");
            option.value = d.id;
            option.disabled = !available(d);
            option.textContent = dragon.name + " • " + dragon.element +
                (Number(d.restUntil) > Date.now() ? " • en repos" : !available(d) ? " • trop fatigué" : " • énergie " + d.energy);
            select.appendChild(option);
        });
        if (selected && !owned(selected)) selected = "";
        select.value = selected;
        select.onchange = () => { selected = select.value; DraconiaStorage.setItem(key, selected); updateHint(); };
        label.appendChild(select);
        const hint = document.createElement("small");
        hint.style.display = "block";
        function updateHint() {
            const dragon = dragons.find(d => d.id === selected);
            hint.textContent = !dragon ? "Exploration solo gratuite. Choisis un dragon pour profiter de son élément."
                : "−5 énergie (minimum 25 au départ). +2 XP dragon et +2 bonheur au retour. " +
                  (affinity(dragon, zone) ? "Zone adaptée : +1 " + resourceNames[bonusResources[dragon.element]] + " garanti à chaque retour, même avec un œuf. Des aventures de compagnon peuvent apparaître."
                  : "Pas de récolte bonus ici : choisis une zone adaptée à l'élément " + dragon.element + ". Ses choix spéciaux restent possibles dans les événements compatibles.");
        }
        updateHint();
        label.appendChild(hint);
        container.appendChild(label);
    }
    function depart() {
        if (!selected) return { ok: true, companion: null };
        const d = owned(selected), dragon = dragons.find(x => x.id === selected);
        if (!dragon || !available(d)) return { ok: false, message: "Ton compagnon se repose ou est trop fatigué. Choisis un autre dragon ou pars seul." };
        d.energy = Math.max(0, Number(d.energy) - energyCost);
        saveOwnedDragons();
        if (typeof renderOwnedDragons === "function") renderOwnedDragons();
        return { ok: true, companion: { id: dragon.id, name: dragon.name, element: dragon.element } };
    }
    function choice(event, companion) {
        if (!companion || !compatible[event.title]?.includes(companion.element)) return null;
        const skill = abilities[companion.element];
        return {
            label: "🐉 " + companion.name + " : " + skill.label,
            result: companion.name + " " + skill.result + ".",
            reward: skill.resource ? { resource: skill.resource, amount: 3, xp: 4 }
                : skill.coins ? { coins: skill.coins, xp: 4 } : { xp: skill.xp },
            companionAction: true
        };
    }
    function adventure(companion, zone) {
        if (!affinity(companion, zone) || !abilities[companion.element]) return null;
        const skill = abilities[companion.element];
        const resource = bonusResources[companion.element];
        return {
            icon: "🐉", title: "Une découverte de " + companion.name,
            text: "Dans " + zone.name + ", " + companion.name + " reconnaît une énergie " + companion.element + " et t'invite à explorer un passage oublié.",
            choices: [
                { label: "🐉 " + skill.label + " avec " + companion.name, result: companion.name + " " + skill.result + ". Vous découvrez le passage ensemble.",
                  reward: skill.resource ? {resource:skill.resource,amount:3,xp:5} : skill.coins ? {coins:skill.coins,xp:5} : {xp:10}, companionAction:true },
                { label: "🔎 Inspecter prudemment les alentours", result: "Tu suis les indications de " + companion.name + " et ramasses des ressources sans entrer dans le passage.",
                  reward:{resource,amount:2,xp:3}, companionAction:true }
            ]
        };
    }
    function finish(companion, zone) {
        if (!companion || companion.returned) return "";
        companion.returned = true;
        let summary = companion.name + " : +2 XP dragon • +2 bonheur (maximum 100) • −5 énergie au départ.";
        const resource = bonusResources[companion.element];
        if (affinity(companion, zone) && resource && typeof addResource === "function") {
            addResource(resource, 1);
            summary += " Récolte de compagnon : +1 " + resourceNames[resource] + ".";
        }
        const d = owned(companion.id);
        if (d) {
            d.happiness = Math.min(100, (Number(d.happiness) || 0) + 2);
            if (typeof addDragonXP === "function") addDragonXP(d, 2);
            saveOwnedDragons();
            if (typeof renderOwnedDragons === "function") renderOwnedDragons();
        }
        if (typeof window.draconiaAdventureLog === "function") {
            window.draconiaAdventureLog(companion.name + " t'a accompagné dans " + (zone.name || zone) + ". " + summary, "🐉", "exploration");
        }
        return summary;
    }
    window.draconiaCompanion = Object.freeze({ render, depart, choice, finish, affinity, adventure });
})();
