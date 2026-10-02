// Elective class features are modeled separately from automatic features.
const CLASS_CHOICE_DEFINITIONS = {
    Monk: [
        { name: 'Bonus Feat', levels: [1], options: ['Improved Grapple', 'Stunning Fist'] },
        { name: 'Bonus Feat', levels: [2], options: ['Combat Reflexes', 'Deflect Arrows'] },
        { name: 'Bonus Feat', levels: [6], options: ['Improved Disarm', 'Improved Trip'] }
    ],
    Ranger: [{
        name: 'Combat Style',
        levels: [2],
        options: ['Archery', 'Two-Weapon Combat']
    }],
    Rogue: [{
        name: 'Special Ability',
        levels: [10, 13, 16, 19],
        options: [
            'Crippling Strike', 'Defensive Roll', 'Improved Evasion',
            'Opportunist', 'Skill Mastery', 'Slippery Mind', 'Feat'
        ],
        repeatableOptions: ['Skill Mastery', 'Feat']
    }]
};

class ClassFeatureChoices {
    getAvailable(characterData = {}) {
        const levelsByClass = (characterData.classes || []).reduce((counts, classLevel) => {
            counts[classLevel.className] = (counts[classLevel.className] || 0) + 1;
            return counts;
        }, {});

        return Object.entries(levelsByClass).flatMap(([className, classLevel]) =>
            (CLASS_CHOICE_DEFINITIONS[className] || []).flatMap(definition =>
                definition.levels.filter(level => level <= classLevel).map(level => {
                    const id = `${className}:${definition.name}:${level}`;
                    const selected = characterData.classFeatureChoices?.[id] || '';
                    const choiceGroup = `${className}:${definition.name}:`;
                    const usedOptions = Object.entries(characterData.classFeatureChoices || {})
                        .filter(([choiceId]) => choiceId.startsWith(choiceGroup) && choiceId !== id)
                        .map(([, option]) => option);
                    return {
                        id, className, classLevel: level, name: definition.name, selected,
                        options: definition.options.filter(option =>
                            option === selected || definition.repeatableOptions?.includes(option) || !usedOptions.includes(option)
                        )
                    };
                })
            )
        );
    }
}

window.ClassFeatureChoices = ClassFeatureChoices;
