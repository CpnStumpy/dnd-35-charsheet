const assert = require('node:assert/strict');

global.window = global;
require('./js/naturalFeatures.js');

const bardFeatures = [
    'Weapon and Armor Proficiency', 'Spells', 'Bardic Knowledge',
    'Countersong (Su)', 'Fascinate (Sp)', 'Inspire Courage (Su)',
    'Inspire Competence (Su)', 'Suggestion (Sp)'
].map(name => ({ name, description: `${name} description` }));
const gameData = {
    classes: new Map([['Bard', { features: bardFeatures }]]),
    races: new Map([
        ['Human', { racialTraits: [] }],
        ['Elf', { racialTraits: ['Keen Senses: Elves receive a bonus to notice things.'] }]
    ])
};
const resolver = new NaturalFeatures(gameData);

const firstLevelBard = resolver.getForCharacter({
    race: 'Human', classes: [{ className: 'Bard' }]
});
assert(firstLevelBard.some(feature => feature.name === 'Inspire Courage (Su)'));
assert(!firstLevelBard.some(feature => feature.name === 'Inspire Competence (Su)'));
assert(firstLevelBard.some(feature => feature.description === 'One extra feat at 1st level.'));

const thirdLevelBard = resolver.getForCharacter({
    race: 'Elf',
    classes: [1, 2, 3].map(() => ({ className: 'Bard' }))
});
assert(thirdLevelBard.some(feature => feature.name === 'Inspire Competence (Su)'));
assert(!thirdLevelBard.some(feature => feature.name === 'Suggestion (Sp)'));
assert(thirdLevelBard.some(feature => feature.name === 'Keen Senses'));

console.log('Natural feature resolver tests passed.');
