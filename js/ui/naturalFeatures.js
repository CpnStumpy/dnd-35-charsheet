// Renders the innate traits supplied by the character's selected race.
class NaturalFeatures {
    static render(container, characterData) {
        if (!container) return;

        const raceData = dataLoader.getRace(characterData.race);
        const naturalFeatures = raceData?.racialTraits || characterData.racialAbilities || [];
        container.replaceChildren();

        if (naturalFeatures.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.className = 'info-text';
            emptyMessage.textContent = 'No natural features are listed for this race.';
            container.appendChild(emptyMessage);
            return;
        }

        const featureList = document.createElement('ul');
        featureList.className = 'natural-features-list';
        naturalFeatures.forEach(feature => {
            const featureItem = document.createElement('li');
            featureItem.textContent = feature;
            featureList.appendChild(featureItem);
        });
        container.appendChild(featureList);
    }
}

window.NaturalFeatures = NaturalFeatures;
