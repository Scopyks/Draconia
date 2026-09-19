const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const c={};c.window=c;vm.createContext(c);vm.runInContext(fs.readFileSync('dragontitles.js','utf8'),c);
const expected={
    'dragon-feu':'Pourfendeur des Flammes','dragon-eau':'Pourfendeur des Marées',
    'dragon-nature':'Dieu des Mille Forêts','dragon-air':'Prince des Quatre Vents',
    'dragon-foudre':'Pourfendeur des Foudres','dragon-glace':'Chasseur des Démons de Glace',
    'dragon-terre':'Démon des Sables','dragon-ombre':'Vengeur des Ombres',
    'dragon-lumiere':'Héritier des Six Voies','dragon-cosmique':'Maître de l’Infini'
};
for(const [id,title] of Object.entries(expected))assert.equal(c.getDragonTitle(id),title);
assert.equal(c.getDragonTitleState({id:'dragon-eau',level:4}).unlocked,false);
assert.equal(c.getDragonTitleState({id:'dragon-eau',level:5}).unlocked,true);
assert.equal(c.getDragonTitleState({id:'dragon-eau',level:5}).title,'Pourfendeur des Marées');
assert.equal(c.getDragonTitleState({id:'dragon-feu',level:10}).unlockLevel,5);
assert.equal(Object.keys(c.draconiaDragonTitles).length,10);
console.log('Titres : dix dragons, Aquaria masculin et déblocage au niveau 5 OK');
