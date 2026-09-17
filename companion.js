// DRACONIA - COMPAGNON D'EXPLORATION
(function () {
    const key = DraconiaConfig.storage.explorationCompanion;
    let selected = DraconiaStorage.getItem(key) || "";
    const energyCost = 5;
    const minimumEnergy = 25;
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
    function render(container, locked) {
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
        select.onchange = () => { selected = select.value; DraconiaStorage.setItem(key, selected); };
        label.appendChild(select);
        const hint = document.createElement("small");
        hint.style.display = "block";
        hint.textContent = "Avec un dragon : −5 énergie par départ, minimum 25. Son élément ouvre certains choix spéciaux.";
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
    function finish(companion, zone) {
        if (!companion) return;
        const d = owned(companion.id);
        if (d) {
            d.happiness = Math.min(100, (Number(d.happiness) || 0) + 2);
            if (typeof addDragonXP === "function") addDragonXP(d, 2);
            saveOwnedDragons();
            if (typeof renderOwnedDragons === "function") renderOwnedDragons();
        }
        if (typeof window.draconiaAdventureLog === "function") {
            window.draconiaAdventureLog(companion.name + " t'a accompagné dans " + zone + ".", "🐉", "exploration");
        }
    }
    window.draconiaCompanion = Object.freeze({ render, depart, choice, finish });
})();
