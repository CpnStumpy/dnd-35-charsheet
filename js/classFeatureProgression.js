// Minimum class levels for automatic features. Elective features are omitted.
const CLASS_FEATURE_LEVELS = {
    Barbarian: { 'Weapon and Armor Proficiency': 1, 'Fast Movement': 1, Illiteracy: 1, Rage: 1, 'Uncanny Dodge (Ex)': 2, 'Trap Sense (Ex)': 3, 'Improved Uncanny Dodge (Ex)': 5, 'Damage Reduction (Ex)': 7, 'Greater Rage (Ex)': 11, 'Indomitable Will (Ex)': 14, 'Tireless Rage (Ex)': 17, 'Mighty Rage (Ex)': 20 },
    Bard: { 'Weapon and Armor Proficiency': 1, Spells: 1, 'Bardic Knowledge': 1, 'Countersong (Su)': 1, 'Fascinate (Sp)': 1, 'Inspire Courage (Su)': 1, 'Inspire Competence (Su)': 3, 'Suggestion (Sp)': 6, 'Inspire Greatness (Su)': 9, 'Song of Freedom (Sp)': 12, 'Inspire Heroics (Su)': 15, 'Mass Suggestion (Sp)': 18 },
    Cleric: { 'Weapon and Armor Proficiency': 1, 'Aura (Ex)': 1, Spells: 1, 'Spontaneous Casting': 1, 'Chaotic, Evil, Good, and Lawful Spells': 1, 'Bonus Languages': 1 },
    Druid: { 'Weapon and Armor Proficiency': 1, Spells: 1, 'Spontaneous Casting': 1, 'Chaotic, Evil, Good, and Lawful Spells': 1, 'Bonus Languages': 1, 'Animal Companion (Ex)': 1, 'Nature Sense (Ex)': 1, 'Wild Empathy (Ex)': 1, 'Woodland Stride (Ex)': 2, 'Trackless Step (Ex)': 3, "Resist Nature's Lure (Ex)": 4, 'Wild Shape (Su)': 5, 'Venom Immunity (Ex)': 9, 'A Thousand Faces (Su)': 13, 'Timeless Body (Ex)': 15 },
    Fighter: { 'Weapon and Armor Proficiency': 1 },
    Monk: { 'Weapon and Armor Proficiency': 1, 'AC Bonus (Ex)': 1, 'Unarmed Strike': 1, 'Evasion (Ex)': 2, 'Fast Movement (Ex)': 3, 'Still Mind (Ex)': 3, 'Slow Fall (Ex)': 4, 'Purity of Body (Ex)': 5, 'Wholeness of Body (Su)': 7, 'Improved Evasion (Ex)': 9, 'Diamond Body (Su)': 11, 'Abundant Step (Su)': 12, 'Diamond Soul (Ex)': 13, 'Quivering Palm (Su)': 15, 'Timeless Body (Ex)': 17, 'Tongue of the Sun and Moon (Ex)': 17, 'Empty Body (Su)': 19, 'Perfect Self': 20 },
    Paladin: { 'Weapon and Armor Proficiency': 1, 'Aura of Good': 1, 'Detect Evil': 1, 'Smite Evil': 1, 'Divine Grace': 2, 'Lay on Hands': 2, 'Aura of Courage': 3, 'Divine Health': 3, 'Turn Undead': 4, Spells: 4, 'Special Mount': 5, 'Remove Disease': 6, 'Code of Conduct': 1, Associates: 1 },
    Ranger: { 'Weapon and Armor Proficiency': 1, Track: 1, 'Wild Empathy (Ex)': 1, Endurance: 3, 'Animal Companion (Ex)': 4, Spells: 4, 'Woodland Stride (Ex)': 7, 'Swift Tracker (Ex)': 8, 'Evasion (Ex)': 9, 'Camouflage (Ex)': 13, 'Hide in Plain Sight (Ex)': 17 },
    Rogue: { 'Weapon and Armor Proficiency': 1, 'Sneak Attack': 1, 'Evasion (Ex)': 2, 'Trap Sense (Ex)': 3, 'Uncanny Dodge (Ex)': 4, 'Improved Uncanny Dodge (Ex)': 8 },
    Sorcerer: { 'Weapon and Armor Proficiency': 1, Spells: 1, Familiar: 1 },
    Wizard: { 'Weapon and Armor Proficiency': 1, Spells: 1, 'Bonus Languages': 1, Familiar: 1, 'Scribe Scroll': 1, Spellbooks: 1 }
};

function getClassFeatureLevel(className, featureName) {
    return CLASS_FEATURE_LEVELS[className]?.[featureName.replace(/:$/, '')];
}

window.getClassFeatureLevel = getClassFeatureLevel;
