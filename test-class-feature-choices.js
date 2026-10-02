const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

global.window = global;
require('./js/classFeatureChoices.js');

const resolver = new ClassFeatureChoices();
const rogueLevels = level => Array.from({ length: level }, () => ({ className: 'Rogue' }));

assert.deepEqual(resolver.getAvailable({ classes: rogueLevels(9) }), []);

const levelTenChoices = resolver.getAvailable({ classes: rogueLevels(10) });
assert.equal(levelTenChoices.length, 1);
assert.equal(levelTenChoices[0].id, 'Rogue:Special Ability:10');
assert(levelTenChoices[0].options.includes('Improved Evasion'));
assert.equal(levelTenChoices[0].selected, '');

const selectedChoices = resolver.getAvailable({
    classes: rogueLevels(13),
    classFeatureChoices: {
        'Rogue:Special Ability:10': 'Skill Mastery',
        'Rogue:Special Ability:13': 'Feat'
    }
});
assert.equal(selectedChoices.length, 2);
assert.equal(selectedChoices[0].selected, 'Skill Mastery');
assert.equal(selectedChoices[1].selected, 'Feat');
assert(selectedChoices[1].options.includes('Skill Mastery'));
assert(selectedChoices[0].options.includes('Feat'));

const rangerChoice = resolver.getAvailable({ classes: [
    { className: 'Ranger' }, { className: 'Ranger' }
] });
assert.deepEqual(rangerChoice[0].options, ['Archery', 'Two-Weapon Combat']);

const calculatorSource = `${fs.readFileSync('./js/calculator.js', 'utf8')}\nthis.TestCalculator = Calculator;`;
const calculatorContext = {};
vm.runInNewContext(calculatorSource, calculatorContext);
const featSlots = new calculatorContext.TestCalculator({}).calculateFeatSlots({
    level: 10,
    race: 'Elf',
    classes: rogueLevels(10),
    feats: [],
    classFeatureChoices: { 'Rogue:Special Ability:10': 'Feat' }
});
assert.equal(featSlots.total, 5);
assert(featSlots.breakdown.some(item => item.source === 'Class Feature Choices'));

console.log('Class feature choice resolver tests passed.');
