// Mobile-only navigation behavior. Layout remains CSS-driven.
class MobileNavigation {
    constructor() {
        this.actionsToggle = document.getElementById('mobileActionsToggle');
        this.characterActions = document.getElementById('characterActions');
        this.mobileBreakpoint = window.matchMedia('(max-width: 768px)');
    }

    initialize() {
        if (!this.actionsToggle || !this.characterActions) return;

        this.actionsToggle.addEventListener('click', () => this.toggleActions());
        this.characterActions.addEventListener('click', (event) => {
            if (event.target.closest('button')) this.closeActions();
        });

        document.querySelectorAll('.tab-btn').forEach(tabButton => {
            tabButton.addEventListener('click', () => {
                if (!this.mobileBreakpoint.matches) return;
                tabButton.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            });
        });

        this.mobileBreakpoint.addEventListener('change', event => {
            if (!event.matches) this.closeActions();
        });
    }

    toggleActions() {
        const isOpen = this.characterActions.classList.toggle('mobile-actions-open');
        this.actionsToggle.setAttribute('aria-expanded', String(isOpen));
    }

    closeActions() {
        this.characterActions.classList.remove('mobile-actions-open');
        this.actionsToggle.setAttribute('aria-expanded', 'false');
    }
}

document.addEventListener('DOMContentLoaded', () => new MobileNavigation().initialize());
