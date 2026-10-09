// Formats saved spell data for the expandable spell-list summary.
class SpellDetails {
    static render(savedSpell, databaseSpell) {
        const spell = databaseSpell || savedSpell;
        const detailRows = [
            ['School', spell.school],
            ['Components', spell.components],
            ['Casting Time', spell.castingTime],
            ['Range', spell.range],
            ['Duration', spell.duration],
            ['Saving Throw', spell.savingThrow],
            ['Spell Resistance', spell.spellResistance]
        ].filter(([, value]) => value);

        const description = this.plainText(spell.description || spell.fullText || savedSpell.notes);
        if (!detailRows.length && !description) return '';

        const rowsMarkup = detailRows.map(([label, value]) => `
            <div class="spell-detail-item">
                <dt>${this.escape(label)}</dt>
                <dd>${this.escape(value)}</dd>
            </div>
        `).join('');

        return `
            <details class="spell-row-details">
                <summary>Details</summary>
                ${rowsMarkup ? `<dl class="spell-detail-grid">${rowsMarkup}</dl>` : ''}
                ${description ? `<p class="spell-detail-description">${this.escape(description)}</p>` : ''}
            </details>
        `;
    }

    static plainText(value) {
        const temporaryElement = document.createElement('div');
        temporaryElement.innerHTML = String(value || '');
        return (temporaryElement.textContent || '').trim();
    }

    static escape(value) {
        const temporaryElement = document.createElement('div');
        temporaryElement.textContent = String(value);
        return temporaryElement.innerHTML;
    }
}

window.SpellDetails = SpellDetails;
