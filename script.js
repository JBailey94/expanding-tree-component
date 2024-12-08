const myData = [
    { "id": "1", "label": "Level0", "parentId": null },
    { "id": "2", "label": "Level1", "parentId": "1" },
    { "id": "3", "label": "Level2", "parentId": "2" },
    { "id": "4", "label": "Level3", "parentId": "3" },
    { "id": "5", "label": "Level3", "parentId": "3" },
    { "id": "6", "label": "Level2", "parentId": "2" },
    { "id": "7", "label": "Level3", "parentId": "6" },
    { "id": "8", "label": "Level1", "parentId": "1" },
    { "id": "9", "label": "Level2", "parentId": "8" }
];

class ExpandingTree extends HTMLElement {

    static defaultConfig = {
        data: myData,
        modifiable: false,
        childrenKey: 'children',
        labelKey: 'label',
        idKey: 'id',
    }

    constructor(config = {}) {
        super();
        this.attachShadow({ mode: 'open' });
        this.config = { ...ExpandingTree.defaultConfig };
        this.configure(config)
    }

    configure(newConfig) {
        try {          
            if (typeof newConfig !== 'object' || newConfig === null) {
                throw new Error('Configuration must be an object');
            }

            this.config = {
                ...this.config,
                ...newConfig,
            };

            this.render();

        } catch (error) {
            console.error(error);
        }
    }

    render() {
        const treeData = this.buildTree(this.config.data);
        const container = document.createElement('div');
        const style = this.createStyle();
        container.className = 'expanding-tree';

        treeData.forEach(node => {
            container.appendChild(this.createTreeElement(node));
        });

        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(container);
    }

    buildTree(data) {
        let tree = [];
        let lookup = {};

        this.config.data.forEach(item => {
            lookup[item.id] = { ...item, children: [] };
        });

        this.config.data.forEach(item => {
            if (item.parentId === null) {
                tree.push(lookup[item.id]);
            } else {
                lookup[item.parentId].children.push(lookup[item.id]);
            }
        });

        return tree;
    }

    createTreeElement(node) {
        const template = document.createElement('template');
        template.innerHTML = `
            <details class="expanding-tree-node">
                <summary>
                    <div class="expanding-tree-node-items">
                        <span class="expanding-tree-item-label">${node[this.config.labelKey]}</span>
                        <div class="expanding-tree-item-buttons">
                            <button type="button" class="btn btn-primary"><i class="bi bi-plus-square"></i></button>
                            <button type="button" class="btn btn-primary"><i class="bi bi-pencil-square"></i></button>
                            <button type="button" class="btn btn-primary"><i class="bi bi-trash"></i></button>  
                        </div>
                    </div>
                </summary>
            </details>
        `

        const details = template.content.firstElementChild


        if (node[this.config.childrenKey] && node[this.config.childrenKey].length > 0) {
            node[this.config.childrenKey].forEach(child => {
                details.appendChild(this.createTreeElement(child));
            });
        }

        return details;
    }

    createStyle() {
        const style = document.createElement('style');

        style.textContent = `
            .expanding-tree {
                padding: 10px;

                details.expanding-tree-node {
                    details.expanding-tree-node {
                        padding-left: 10px;
                    }

                    summary {
                        width: 100%;
                        list-style: none;
                        border: 1px solid #ccc;
                        list-style: none;
                    }
                    
                    summary:hover {
                        cursor: pointer;
                    }

                    div.expanding-tree-node-items {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;

                        div.expanding-tree-item-buttons {
                            margin: 5px;

                            i {
                                display: inline-block;
                                width: 16px;
                                height: 16px;
                            }
                        
                        }
                    }
                }
            }
        `;

        return style;
    }
}

customElements.define('expanding-tree', ExpandingTree);