import {
    Virtualizer,
    elementScroll,
    observeElementOffset,
    observeElementRect
} from 'https://esm.sh/@tanstack/virtual-core@3.13.12';

class VirtualFeatList {
    constructor({ scrollElement, listElement, estimateSize = 72, renderItem }) {
        this.listElement = listElement;
        this.renderItem = renderItem;
        this.items = [];
        this.virtualizer = new Virtualizer({
            count: 0,
            getScrollElement: () => scrollElement,
            estimateSize: () => estimateSize,
            getItemKey: itemIdx => this.items[itemIdx]?.name ?? itemIdx,
            overscan: 6,
            scrollToFn: elementScroll,
            observeElementOffset,
            observeElementRect,
            onChange: () => this.render()
        });
        this.cleanup = this.virtualizer._didMount();
        this.virtualizer._willUpdate();
    }

    setItems(items) {
        this.items = items;
        this.virtualizer.setOptions({
            ...this.virtualizer.options,
            count: items.length
        });
        this.virtualizer.scrollToOffset(0);
        this.virtualizer._willUpdate();
        this.render();
    }

    render() {
        const visibleRows = this.virtualizer.getVirtualItems();
        const fragment = document.createDocumentFragment();

        this.listElement.style.height = `${this.virtualizer.getTotalSize()}px`;
        visibleRows.forEach(virtualRow => {
            const row = this.renderItem(this.items[virtualRow.index]);
            row.dataset.index = virtualRow.index;
            row.style.transform = `translateY(${virtualRow.start}px)`;
            row.style.position = 'absolute';
            row.style.width = '100%';
            row.style.top = '0';
            fragment.appendChild(row);
        });

        this.listElement.replaceChildren(fragment);
        this.listElement.querySelectorAll('[data-index]').forEach(row => {
            this.virtualizer.measureElement(row);
        });
    }

    destroy() {
        this.cleanup();
    }
}

window.VirtualFeatList = VirtualFeatList;
