const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const context = vm.createContext({ console });
vm.runInContext(fs.readFileSync('js/character.js', 'utf8') + '\n' +
    fs.readFileSync('js/calculator.js', 'utf8') + '\nthis.Character = Character; this.Calculator = Calculator;', context);
const classes = JSON.parse(fs.readFileSync('data/json/classes.json', 'utf8')).data;
const loader = {
    getClass: name => classes.find(cls => cls.name === name),
    isClassSkill: name => name === 'Perform'
};
const calculator = new context.Calculator(loader);
const character = new context.Character();
const data = character.getData();
data.abilities.base.int = 12;
data.level = 5;
data.classes = Array.from({ length: 5 }, (_, i) => ({ level: i + 1, className: 'Bard', skillPoints: 5 }));
data.skills = { Perform: { ranks: [4, 1] }, Spot: { ranks: [0.5, 1] } };
const points = level => calculator.calculateAvailableSkillPoints(character.getData(), level);
assert.equal(points(1).total, 32);
assert.equal(points(1).spent, 5);
assert.equal(points(1).remaining, 27);
assert.equal(points(2).total, 8);
assert.equal(points(2).spent, 3);
const exported = character.exportToJSON();
assert(character.importFromJSON(exported));
assert.equal(points(1).remaining, 27, 'imports recalculate rather than trust stale skillPoints');
assert.equal(character.getData().skills.Perform.ranks[0], 4);
const imported = character.getData();
imported.abilities.base.int = 13;
imported.abilities.levelUps = { 4: 'int' };
assert.equal(points(1).total, 32, 'INT increases are not retroactive');
assert.equal(points(3).total, 8);
assert.equal(points(4).total, 9);
imported.abilities.magic.int = 6;
imported.abilities.temp.int = 8;
assert.equal(points(4).total, 9, 'magical and temporary INT do not grant points');
imported.classes[4].className = 'Wizard';
assert.equal(points(5).total, 5, 'multiclassing uses the new class without quadrupling again');
imported.race = 'Elf';
assert.equal(points(1).total, 28);
assert.equal(points(2).total, 7);
imported.abilities.base.int = 1;
assert.equal(points(1).total, 4, 'minimum one point applies before quadrupling');
imported.race = 'Human';
assert.equal(points(1).total, 8);
assert.equal(points(5).total, 2, 'human bonus applies after the minimum');
imported.feats = [{ name: 'Open Minded', level: 1 }, { name: 'Open Minded', level: 3 }];
assert.equal(points(1).total, 13, 'feat bonus is not quadrupled');
assert.equal(points(2).total, 2);
assert.equal(points(3).total, 7);
assert.equal(points(0).total, 0);
assert.equal(points(6).total, 0);
console.log('Skill point calculation and import tests passed.');

// Caps apply to cumulative purchased ranks, with half ranks retained.
const ranked = new context.Character();
const rankData = ranked.getData();
rankData.level = 2;
rankData.classes = [{ className: 'Bard' }, { className: 'Wizard' }];
const rankCalculator = new context.Calculator({
    getClass: loader.getClass,
    isClassSkill: (skill, cls) => skill === 'Perform' && cls === 'Bard'
});
assert.equal(rankCalculator.calculateMaxSkillRanks(rankData, 'Spot', 2), 2.5);
assert.equal(rankCalculator.validateSkillRanks(rankData, 'Spot', [2, 0.5]), null);
assert(rankCalculator.validateSkillRanks(rankData, 'Spot', [2, 1]));
assert.equal(rankCalculator.validateSkillRanks(rankData, 'Perform', [4, 1]), null);
assert(rankCalculator.validateSkillRanks(rankData, 'Perform', [4, 2]));
assert(rankCalculator.validateSkillRanks(rankData, 'Perform', [0.5, 0]));
assert(rankCalculator.validateSkillRanks(rankData, 'Spot', [-1, 0]));
assert(rankCalculator.validateSkillRanks(rankData, 'Spot', [NaN, 0]));
assert.equal(rankCalculator.calculateSkillRankCost(rankData, 'Perform', 2), 2);
assert.equal(rankCalculator.calculateMaxSkillRanks(rankData, 'Perform', 2), 5);
rankData.classes.reverse();
assert.equal(rankCalculator.calculateMaxSkillRanks(rankData, 'Perform', 1), 2,
    'a class taken later cannot increase historical caps');
rankData.skills = { Spot: { ranks: [0, 0], totalRanks: 0, ability: 'wis' } };
ranked.updateSkillRanks('Spot', 1, 0.5);
assert.equal(rankData.skills.Spot.totalRanks, 0.5);
assert.equal(rankCalculator.calculateSkillModifier(rankData, 'Spot', {wis: {modifier: 1}}), 1,
    'half ranks do not add half a point to checks');
rankData.characterClassSkills = ['Spot'];
assert.equal(rankCalculator.calculateSkillRankCost(rankData, 'Spot', 1), 1);
assert.equal(rankCalculator.calculateMaxSkillRanks(rankData, 'Spot', 1), 4);
console.log('Skill rank cap, cost, and half-rank tests passed.');
// Save validates cumulative caps even if input-change validation was bypassed.
const validationElement = { classList: { remove() {} } };
const modalInputs = [{ value: '4' }, { value: '2' }];
context.window = context;
context.rankData = rankData;
context.rankCalculator = rankCalculator;
vm.runInContext('character.setData(rankData); calculator = rankCalculator;', context);
context.document = { getElementById: id => id === 'modalRanksGrid'
    ? { querySelectorAll: () => modalInputs } : validationElement };
vm.runInContext(fs.readFileSync('js/ui/skillsTab.js', 'utf8'), context);
const tab = Object.create(context.SkillsTab.prototype);
tab.currentSkill = 'Perform';
tab.saveSkillRanks();
assert.match(validationElement.textContent, /exceed the maximum/);
console.log('Skill editor save validation test passed.');
