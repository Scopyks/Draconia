const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

class Element {
    constructor(tag = 'div') {
        this.tag = tag; this.children = []; this.dataset = {}; this.style = {};
        this.disabled = false; this.textContent = '';
        this.classList = { add() {}, remove() {} };
    }
    set innerHTML(value) {
        this.children = [];
        if (value.includes('<p')) this.appendChild(new Element('p'));
    }
    get firstElementChild() { return this.children[0]; }
    appendChild(child) { this.children.push(child); return child; }
    querySelectorAll(tag) {
        return this.children.flatMap(c => [...(c.tag === tag ? [c] : []), ...c.querySelectorAll(tag)]);
    }
}
let now = 0, id = 0;
const timers = new Map();
const host = new Element();
const message = new Element();
const results = [];
const context = {
    document: { createElement: tag => new Element(tag), getElementById: key => key === 'dragon-mini-game' ? host : message },
    Date: { now: () => now }, Math,
    setTimeout(fn, delay) { const key = ++id; timers.set(key, { fn, at: now + delay }); return key; },
    clearTimeout(key) { timers.delete(key); },
    ownedDragons: [{ id: 'dragon-feu', energy: 100 }]
};
vm.createContext(context);
const source = fs.readFileSync(require('node:path').join(__dirname, '../dragoncare.js'), 'utf8');
vm.runInContext(source.slice(0, source.indexOf('(function initDragonCare()')), context);
vm.runInContext('completeDragonMiniGame = (success, text) => report(success, text); activeCareDragonId = "dragon-feu";',
    Object.assign(context, { report: (success, text) => results.push({ success, text }) }));
function advance(ms) {
    const until = now + ms;
    while (true) {
        const next = [...timers].filter(([,v]) => v.at <= until).sort((a,b) => a[1].at-b[1].at)[0];
        if (!next) break;
        now = next[1].at; timers.delete(next[0]); next[1].fn();
    }
    now = until;
}
function start(type) { results.length = 0; context.startConfiguredMiniGame(type); }
function board() { return host.children.find(c => c.className === 'game-board'); }
function click(b) { if (!b.disabled) b.onclick(); }

for (const type of ['tictactoe','memory','sequence','clouds','reaction','numbers','rps','shadow','light','stars']) {
    start(type);
    assert(host.querySelectorAll('button').length > 0, type);
    vm.runInContext('dragonGameCleanup()', context);
    assert.equal(timers.size, 0, type + ' cleanup');
    advance(60000);
    assert.equal(results.length, 0, type + ' no stale completion');
}
start('reaction'); click(host.querySelectorAll('button')[0]);
assert.equal(results[0].success, false, 'early reaction loses');
start('reaction'); advance(4200);
assert.equal(results[0].success, false, 'late reaction loses');
start('reaction');
for (let round = 0; round < 3; round++) {
    const pad = host.querySelectorAll('button')[0];
    while (pad.textContent !== '⚡') advance(10);
    advance(200); click(pad);
}
assert.equal(results.length, 1); assert.equal(results[0].success, true);
assert.equal(timers.size, 0);
start('numbers');
for (let n=1;n<=9;n++) click(board().children.find(b => b.textContent === '❄️ ' + n));
assert.equal(results[0].success, true);
const oldButton = board().children[0]; oldButton.onclick();
assert.equal(results.length, 1, 'finished game cannot reward twice');
start('numbers');
for (let i=0;i<3;i++) click(board().children.find(b => b.textContent === '❄️ 9'));
assert.equal(results[0].success, false, 'three mistakes lose');
start('numbers'); advance(18000);
assert.equal(results[0].success, false, 'timer ends game');
start('stars');
const orderedStars = [...board().children].sort((a,b) => Number(a.textContent.slice(2))-Number(b.textContent.slice(2)));
assert(board().children.every(b => b.disabled));
advance(4000);
assert(board().children.every(b => b.textContent === '⭐' && !b.disabled));
orderedStars.forEach(click);
assert.equal(results[0].success, true);
start('light');
for (let n=0;n<8;n++) click(board().children.find(b => b.textContent === '☀️'));
assert.equal(results[0].success, true);
assert.equal(timers.size, 0, 'moving targets stop after win');
assert.equal(context.chooseDragonMove(['🐉','🐉','','🔥','','','','','']), 2, 'AI wins');
assert.equal(context.chooseDragonMove(['🔥','🔥','','','','','','','']), 2, 'AI blocks');
console.log('10 jeux initialisés ; nettoyage, délais, erreurs, victoires et IA : OK');
