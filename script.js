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

document.addEventListener('DOMContentLoaded', (event) => {
    // Set up the MutationObserver to observe changes to the data-bs-theme attribute on the <html> element
    const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-bs-theme') {
            window.dispatchEvent(new Event('theme-changed'));
        }
    }});
        
        // Start observing the <html> element
    observer.observe(document.documentElement, { attributes: true });
        
        // Example button to toggle theme
    document.querySelector('#toggle-theme-btn').addEventListener('click', toggleTheme);
});

function toggleTheme() {
    const htmlElement = document.documentElement;
    const currentTheme = htmlElement.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlElement.setAttribute('data-bs-theme', newTheme);
}

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

        this.updateTheme();
        window.addEventListener('theme-changed', this.updateTheme.bind(this));
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

        this.shadowRoot.innerHTML = `
            <style>
                @import url('/libraries/bootstrap-5.3.3-dist/css/bootstrap.min.css');
                @import url('/libraries/bootstrap-icons-1.11.3/font/bootstrap-icons.min.css');

                .expanding-tree {
                    padding: 10px;

                    details.expanding-tree-node {

                        details.expanding-tree-node::before {
                            content: '';
                            position: absolute;
                            top: 5px;
                            left: 10px;
                            bottom: 0;
                            width: 2px;
                            border-left: 2px dashed #ccc;
                        }

                        details.expanding-tree-node {
                            position: relative;
                            padding-left: 20px;
                            margin-top: 10px;
                        }

                        summary {
                            padding: 5px;
                            border-radius: 5px;
                            width: 100%;
                            list-style: none;
                            border: 1px solid #ccc;
                            list-style: none;
                        }
                        
                        summary:hover {
                            cursor: pointer;
                            background-color: #f0f0f0;
                        }

                        div.expanding-tree-node-items {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;

                            div.expanding-tree-item-buttons {
                                margin: 3px;

                                button {
                                    background: none;
                                    border: none;
                                    color: #00000085;
                                    border-radius: 5px;
                                    transition: transform 0.1s ease-in-out;
                                }

                                button:hover {
                                    cursor: pointer;
                                    color: black;
                                    transform: scale(1.2);
                                }

                                button:active {
                                    transform: scale(1.0);
                                }
                            }
                        }
                    }
                }

                .expanding-tree[data-bs-theme="dark"] {
                    details.expanding-tree-node {
                        summary:hover {
                            background-color: #333;
                        }

                        div.expanding-tree-node-items {
                            div.expanding-tree-item-buttons {
                                button {
                                    color: #959595;
                                }

                                button:hover {
                                    color: white;
                                }
                            }
                        }
                    }
                }


            </style>

            <div class="expanding-tree" data-bs-theme="light"></div>
        `;

        const container = this.shadowRoot.querySelector('.expanding-tree');
        
        treeData.forEach(node => {
            container.appendChild(this.createTreeElement(node));
        });
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
                            <button type="button"><i class="bi bi-plus-square"></i></button>
                            <button type="button"><i class="bi bi-pencil-square"></i></button>
                            <button type="button"><i class="bi bi-trash"></i></button>  
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

    updateTheme() {
        const isDarkMode = document.documentElement.getAttribute('data-bs-theme') === 'dark';
        const container = this.shadowRoot.querySelector('.expanding-tree');
        container.setAttribute('data-bs-theme', isDarkMode ? 'dark' : 'light');
    }
}

customElements.define('expanding-tree', ExpandingTree);