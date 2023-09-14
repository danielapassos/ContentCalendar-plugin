var observableAttributes = [
    "cellvalue",
    "rowvalue",
    "tablevalue",
    "tableschemavalue",
    "databaseschemavalue",
    "configuration",
    "metadata"
]

var OuterbaseEvent = {
    onSave: "onSave",
}

var OuterbaseTableEvent = {
    updateRow: "updateRow",
    deleteRow: "deleteRow",
    createRow: "createRow",
    getNextPage: "getNextPage",
    getPreviousPage: "getPreviousPage"
}

class OuterbasePluginConfig_$PLUGIN_ID {
    tableValue = undefined
    theme = "light"
    imageKey = "image"
    titleKey = "content_title"
    descriptionKey = "content_caption"
    isPostedKey = "is_posted"
    contentLinkKey = "content_link"

    constructor(object) {
        this.imageKey = object?.imageKey || this.imageKey
        this.titleKey = object?.titleKey || this.titleKey
        this.descriptionKey = object?.descriptionKey || this.descriptionKey
        this.isPostedKey = object?.isPostedKey || this.isPostedKey
        this.contentLinkKey = object?.contentLinkKey || this.contentLinkKey
    }

    toJSON() {
        return {
            "imageKey": this.imageKey,
            "titleKey": this.titleKey,
            "descriptionKey": this.descriptionKey,
            "isPostedKey": this.isPostedKey,
            "contentLinkKey": this.contentLinkKey
        }
    }
}

var triggerEvent = (fromClass, data) => {
    const event = new CustomEvent("custom-change", {
        detail: data,
        bubbles: true,
        composed: true
    });
    fromClass.dispatchEvent(event);
}

var decodeAttributeByName = (fromClass, name) => {
    const encodedJSON = fromClass.getAttribute(name);
    const decodedJSON = encodedJSON
        ?.replace(/&quot;/g, '"')
        ?.replace(/&#39;/g, "'");
    return decodedJSON ? JSON.parse(decodedJSON) : {};
}

var templateTable = document.createElement("template")
templateTable.innerHTML = `
<style>
    #container {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
    }

    /* Custom styles for the content box */
    .content-box {
        width: 1080px;
        height: 1350px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        margin: 4px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .content-title {
        font-weight: bold;
        margin-top: 20px;
    }

    .content-image {
        width: 1080px;
        height: 1080px;
        object-fit: cover;
        margin-top: 10px;
    }

    .content-caption {
        margin-top: 20px;
        text-align: center;
        max-width: 1000px;
    }

    .status-pill {
        margin-top: 20px;
        padding: 5px 15px;
        border-radius: 15px;
        background-color: green;
        color: white;
        cursor: pointer;
    }

    .status-pill.not-posted {
        background-color: red;
    }
</style>
<div id="theme-container">
    <div id="container"></div>
</div>
`

class OuterbasePluginTable_$PLUGIN_ID extends HTMLElement {
    static get observedAttributes() {
        return observableAttributes
    }

    config = new OuterbasePluginConfig_$PLUGIN_ID({})

    constructor() {
        super()
        this.shadow = this.attachShadow({ mode: "open" })
        this.shadow.appendChild(templateTable.content.cloneNode(true))
    }

    connectedCallback() {
        this.render()
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.config = new OuterbasePluginConfig_$PLUGIN_ID(decodeAttributeByName(this, "configuration"))
        this.config.tableValue = decodeAttributeByName(this, "tableValue")
        this.config.theme = decodeAttributeByName(this, "metadata").theme

        var element = this.shadow.getElementById("theme-container");
        element.classList.remove("dark")
        element.classList.add(this.config.theme);
        this.render()
    }

    render() {
        this.shadow.querySelector("#container").innerHTML = `
        <div class="grid-container">
            ${this.config?.tableValue?.length && this.config?.tableValue?.map((row) => `
                <div class="content-box">
                    <p class="content-title">${row[this.config.titleKey]}</p>
                    <img class="content-image" src="${row[this.config.imageKey]}" alt="${row[this.config.titleKey]}">
                    <p class="content-caption">${row[this.config.descriptionKey]}</p>
                    <div class="status-pill ${row[this.config.isPostedKey] ? 'posted' : 'not-posted'}" onclick="updatePostStatus(${row['id']})">${row[this.config.isPostedKey] ? 'Posted' : 'Not Posted'}</div>
                </div>
            `).join("")}
        </div>
        `

        this.shadow.querySelectorAll('.status-pill').forEach((pill, index) => {
            pill.addEventListener('click', () => {
                let row = this.config.tableValue[index];
                row[this.config.isPostedKey] = !row[this.config.isPostedKey];
                triggerEvent(this, {
                    action: OuterbaseTableEvent.updateRow,
                    value: row
                });
                this.render();
            });
        });
    }
}

var templateConfiguration = document.createElement("template")
templateConfiguration.innerHTML = `
<style>
    #config-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }
</style>
<div id="config-container">
    <label>
        Image Key:
        <input type="text" id="imageKey">
    </label>
    <label>
        Title Key:
        <input type="text" id="titleKey">
    </label>
    <label>
        Description Key:
        <input type="text" id="descriptionKey">
    </label>
    <label>
        Is Posted Key:
        <input type="text" id="isPostedKey">
    </label>
    <label>
        Content Link Key:
        <input type="text" id="contentLinkKey">
    </label>
</div>
`

class OuterbasePluginConfiguration_$PLUGIN_ID extends HTMLElement {
    static get observedAttributes() {
        return observableAttributes
    }

    config = new OuterbasePluginConfig_$PLUGIN_ID({})

    constructor() {
        super()
        this.shadow = this.attachShadow({ mode: "open" })
        this.shadow.appendChild(templateConfiguration.content.cloneNode(true))
    }

    connectedCallback() {
        this.render()
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.config = new OuterbasePluginConfig_$PLUGIN_ID(decodeAttributeByName(this, "configuration"))
        this.render()
    }

    render() {
        const imageKeyInput = this.shadow.querySelector("#imageKey");
        const titleKeyInput = this.shadow.querySelector("#titleKey");
        const descriptionKeyInput = this.shadow.querySelector("#descriptionKey");
        const isPostedKeyInput = this.shadow.querySelector("#isPostedKey");
        const contentLinkKeyInput = this.shadow.querySelector("#contentLinkKey");

        imageKeyInput.value = this.config.imageKey;
        titleKeyInput.value = this.config.titleKey;
        descriptionKeyInput.value = this.config.descriptionKey;
        isPostedKeyInput.value = this.config.isPostedKey;
        contentLinkKeyInput.value = this.config.contentLinkKey;
    }
}

window.customElements.define('outerbase-plugin-table-$PLUGIN_ID', OuterbasePluginTable_$PLUGIN_ID)
window.customElements.define('outerbase-plugin-configuration-$PLUGIN_ID', OuterbasePluginConfiguration_$PLUGIN_ID)
