// Resolves class and racial features granted automatically by character choices.

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

    // Features stay derived rather than being written into save data. This lets
    // current and legacy saves gain the latest rules whenever they are loaded.
    getForCharacter(characterData = {}) {
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
            return (classData?.features || []).flatMap(feature => {
                const gainedAt = getClassFeatureLevel(className, feature.name);
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
