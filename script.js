class ExpandingTree extends HTMLElement {

    static defaultConfig = {
        data: [],
        modifiable: false,
        childrenKey: 'children',
        labelKey: 'label',
        idKey: 'id',
        classes: {
            container: 'expanding-tree',
            item: 'expanding-tree-item',
            itemLabel: 'expanding-tree-item-label',
            itemChildren: 'expanding-tree-item-children',
            itemChildrenHidden: 'expanding-tree-item-children-hidden'
        }
    }

    constructor(config = {}) {
        super();
        this.attachShadow({ mode: 'open' });
        this.config = { ...ExpandingTree.defaultConfig };
        this.configure(config)
    }

    configure(newConfig) {
        if (typeof newConfig === 'object') {
            this.config = {
                ...this.config,
                ...newConfig,
                classes: {
                    ...this.config.classes,
                    ...newConfig.classes
                }
            };
            this.render();
        }
    }

    render() {
        console.log(this.config);
    }
}

customElements.define('expanding-tree', ExpandingTree);