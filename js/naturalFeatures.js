// Resolves class and racial features granted automatically by character choices.

const CLASS_FEATURE_LEVELS = {
    Barbarian: [1, 1, 1, 1, 2, 3, 5, 7, 11, 14, 17, 20],
    Bard: [1, 1, 1, 1, 1, 1, 3, 6, 9, 12, 15, 18],
    Cleric: [1, 1, 1, 1, 1, 1, 1, 1, 1],
    Druid: [1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 4, 5, 9, 13, 15],
    Fighter: [1, 1],
    Monk: [1, 1, 1, 1, 2, 3, 3, 4, 5, 7, 9, 11, 12, 13, 15, 17, 17, 19, 20],
    Paladin: [1, 1, 1, 1, 2, 2, 3, 3, 4, 4, 5, 6, 1, 1],
    Ranger: [1, 1, 1, 2, 3, 4, 4, 6, 7, 8, 9, 11, 13, 17],
    Rogue: [1, 1, 2, 3, 4, 8, 10, 10],
    Sorcerer: [1, 1, 1],
    Wizard: [1, 1, 1, 1, 1, 5, 1]
};

const HUMAN_TRAITS = [
    'Medium: Humans have no special bonuses or penalties due to size.',
    'Human base land speed is 30 feet.',
    'One extra feat at 1st level.',
    'Four extra skill points at 1st level and one extra skill point at each additional level.',
    'Automatic Language: Common. Bonus Languages: Any (other than secret languages).',
    'Favored Class: Any.'
];

class NaturalFeatures {
    constructor(gameData) {
        this.gameData = gameData;
    }

    getForCharacter(characterData) {
        return [
            ...this.getClassFeatures(characterData.classes || []),
            ...this.getRacialFeatures(characterData.race)
        ];
    }

    getClassFeatures(classLevels) {
        const levelsByClass = classLevels.reduce((counts, classLevel) => {
            counts[classLevel.className] = (counts[classLevel.className] || 0) + 1;
            return counts;
        }, {});

        return Object.entries(levelsByClass).flatMap(([className, level]) => {
            const classData = this.gameData.classes.get(className);
            const featureLevels = CLASS_FEATURE_LEVELS[className] || [];
            return (classData?.features || []).flatMap((feature, featureIdx) => {
                const gainedAt = featureLevels[featureIdx];
                if (!gainedAt || gainedAt > level) return [];
                return [{
                    name: feature.name.replace(/:$/, ''),
                    description: feature.description,
                    source: `${className} ${gainedAt}`,
                    kind: 'Class Feature'
                }];
            });
        });
    }

    getRacialFeatures(raceName) {
        const raceData = this.gameData.races.get(raceName);
        let traits = raceData?.racialTraits || [];
        if (raceName === 'Human' && traits.length === 0) traits = HUMAN_TRAITS;

        return traits.map(trait => {
            const separatorIdx = trait.indexOf(':');
            const hasTitle = separatorIdx > 0 && separatorIdx < 80;
            return {
                name: hasTitle ? trait.slice(0, separatorIdx) : 'Racial Trait',
                description: hasTitle ? trait.slice(separatorIdx + 1).trim() : trait,
                source: raceName,
                kind: 'Racial Feature'
            };
        });
    }
}

window.NaturalFeatures = NaturalFeatures;
