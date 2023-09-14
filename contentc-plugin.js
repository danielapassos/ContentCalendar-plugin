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
};

var OuterbaseColumnEvent = {
    onEdit: "onEdit",
    onStopEdit: "onStopEdit",
    onCancelEdit: "onCancelEdit",
    updateCell: "updateCell",
}

var OuterbaseTableEvent = {
    updateRow: "updateRow",
    deleteRow: "deleteRow",
    createRow: "createRow",
    getNextPage: "getNextPage",
    getPreviousPage: "getPreviousPage"
};


class OuterbasePluginConfig_$PLUGIN_ID {
    tableValue = undefined
    count = 0
    page = 1
    offset = 50
    theme = "light"

    imageKey = undefined
    optionalImagePrefix = undefined
    titleKey = undefined
    captionKey = undefined
    contentLinkKey = undefined

    deletedRows = []

    constructor(object) {
        this.imageKey = object?.imageKey
        this.optionalImagePrefix = object?.optionalImagePrefix
        this.titleKey = object?.titleKey
        this.captionKey = object?.captionKey
        this.contentLinkKey = object?.contentLinkKey
    }

    toJSON() {
        return {
            "imageKey": this.imageKey,
            "imagePrefix": this.optionalImagePrefix,
            "titleKey": this.titleKey,
            "captionKey": this.captionKey,
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

/**
 * **********
 * Table View
 * **********
 */

var templateTable = document.createElement("template")
templateTable.innerHTML = `
<style>
    #theme-container {
        height: 100%;
    }

    #container {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow-y: scroll;
    }

    .grid-container {
        flex: 1;
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
        padding: 12px;
        color: white;
    }

    .grid-item {
        position: relative;
        display: flex;
        flex-direction: column;
        background-color: transparent;
        border: 1px solid rgb(238, 238, 238);
        border-radius: 4px;
        box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.05);
        overflow: clip;
        color: white;
    }

    .img-wrapper {
        height: 0;
        overflow: hidden;
        padding-top: 100%;
        box-sizing: border-box;
        position: relative;
    }

    img {
        width: 100%;
        vertical-align: top;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        object-fit: cover;
    }

    .contents {
        padding: 12px;
        color: white;
    }

    .title {
        font-weight: bold;
        font-size: 16px;
        line-height: 24px;
        font-family: "Inter", sans-serif;
        line-clamp: 2;
        margin-bottom: 8px;
        color: white;
    }

    .description {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 14px;
        line-height: 20px;
        font-family: "Inter", sans-serif;

        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;  
        overflow: hidden;
        color: white;
    }

    .subtitle {
        font-size: 12px;
        line-height: 16px;
        font-family: "Inter", sans-serif;
        color: gray;
        font-weight: 300;
        margin-top: 8px;
        color: white;
    }

    p {
        margin: 0;
        color: white;
    }

    .dark {
        #container {
            background-color: white;
        }
    }

    @media only screen and (min-width: 768px) {
        .grid-container {
            grid-template-columns: repeat(4, minmax(0, 1fr));
        }
    }

    @media only screen and (min-width: 1200px) {
        .grid-container {
            grid-template-columns: repeat(5, minmax(0, 1fr));
            gap: 20px;
        }
    }

    @media only screen and (min-width: 1400px) {
        .grid-container {
            grid-template-columns: repeat(6, minmax(0, 1fr));
            gap: 32px;
        }
    }
</style>

<div id="theme-container">
    <div id="container">
        
    </div>
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
            <h1>Content Calendar for Devs<br /><br /><br /><br />View All ></h1>
            ${this.config?.tableValue?.length && this.config?.tableValue?.map((row) => `
                <div class="grid-item">
                    <button class="deleteRowButton" style="position: absolute; top: 12px; right: 12px; z-index: 1;">X</button>
                    ${ this.config.imageKey ? `<div class="img-wrapper"><img src="${row[this.config.imageKey]}" width="100" height="100"></div>` : `` }

                    <div class="contents">
                        ${ this.config.titleKey ? `<p class="title">${row[this.config.titleKey]}</p>` : `` }
                        ${ this.config.contentLinkKey ? `<p class="subtitle">${row[this.config.contentLinkKey]}</p>` : `` }
                        ${ this.config.captionKey ? `<p class="description">${row[this.config.captionKey]}</p>` : `` }

                        <button class="markPostedButton" style="margin-top: 12px;">Mark as posted</button>
                    </div>
                </div>
            `).join("")}

            <div style="display: flex; flex-direction: column; gap: 12px;">
                <h1>What Next?</h1>
                <button id="previousPageButton">Previous Page</button>
                <button id="nextPageButton">Next Page</button>
            </div>
        </div>
        `

        const deleteRowButtons = this.shadow.querySelectorAll('.deleteRowButton');
        deleteRowButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                let row = this.config.tableValue[index]
                triggerEvent(this, {
                    action: OuterbaseTableEvent.deleteRow,
                    value: row
                })

                this.config.deletedRows.push(row)
                this.config.tableValue.splice(index, 1)
                this.render()
            });
        });

        const markPostedButtons = this.shadow.querySelectorAll('.markPostedButton');
        markPostedButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                let row = this.config.tableValue[index]

                fetch(
                    "https://adjacent-apricot.cmd.outerbase.io/mark-sold",
                    {
                        method: "POST",
                        headers: {
                            "content-type": "application/json",
                        },
                        body: JSON.stringify({
                            id: row.id,
                        }),
                    }
                );
            });
        });


        var previousPageButton = this.shadow.getElementById("previousPageButton");
        previousPageButton.addEventListener("click", () => {
            triggerEvent(this, {
                action: OuterbaseTableEvent.getPreviousPage,
                value: {}
            })
        });

        var nextPageButton = this.shadow.getElementById("nextPageButton");
        nextPageButton.addEventListener("click", () => {
            triggerEvent(this, {
                action: OuterbaseTableEvent.getNextPage,
                value: {}
            })
        });
    }
}


/**
 * ******************
 * Configuration View
 * ******************
 */
var templateConfiguration = document.createElement("template")
templateConfiguration.innerHTML = `
<style>
    #configuration-container {
        display: flex;
        height: 100%;
        overflow-y: scroll;
        padding: 40px 50px 65px 40px;
    }

    .field-title {
        font: "Inter", sans-serif;
        font-size: 12px;
        line-height: 18px;
        font-weight: 500;
        margin: 0 0 8px 0;
    }

    select {
        width: 320px;
        height: 40px;
        margin-bottom: 16px;
        background: transparent;
        border: 1px solid #343438;
        border-radius: 8px;
        color: black;
        font-size: 14px;
        padding: 0 8px;
        cursor: pointer;
        background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 -960 960 960" width="32"><path fill="black" d="M480-380 276-584l16-16 188 188 188-188 16 16-204 204Z"/></svg>');
        background-position: 100%;
        background-repeat: no-repeat;
        appearance: none;
        -webkit-appearance: none !important;
        -moz-appearance: none !important;
    }

    input {
        width: 320px;
        height: 40px;
        margin-bottom: 16px;
        background: transparent;
        border: 1px solid #343438;
        border-radius: 8px;
        color: black;
        font-size: 14px;
        padding: 0 8px;
    }

    button {
        border: none;
        background-color: #834FF8;
        color: white;
        padding: 6px 18px;
        font: "Inter", sans-serif;
        font-size: 14px;
        line-height: 18px;
        border-radius: 8px;
        cursor: pointer;
    }

    .preview-card {
        margin-left: 80px;
        width: 240px;
        background-color: white;
        border-radius: 16px;
        overflow: hidden;
    }

    .preview-card > img {
        width: 100%;
        height: 165px;
    }

    .preview-card > div {
        padding: 16px;
        display: flex; 
        flex-direction: column;
        color: black;
    }

    .preview-card > div > p {
        margin: 0;
    }

    .dark {
        #configuration-container {
            background-color: black;
            color: white;
        }
    }

    .dark > div > div> input {
        color: white !important;
    }

    .dark > div > div> select {
        color: white !important;
        background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 -960 960 960" width="32"><path fill="white" d="M480-380 276-584l16-16 188 188 188-188 16 16-204 204Z"/></svg>');
    }
</style>

<div id="theme-container">
    <div id="configuration-container">
        
    </div>
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
        this.config.tableValue = decodeAttributeByName(this, "tableValue")
        this.config.theme = decodeAttributeByName(this, "metadata").theme

        var element = this.shadow.getElementById("theme-container");
        element.classList.remove("dark")
        element.classList.add(this.config.theme);

        this.render()
    }

    render() {
        let sample = this.config.tableValue.length ? this.config.tableValue[0] : {}
        let keys = Object.keys(sample)

        if (!keys || keys.length === 0 || !this.shadow.querySelector('#configuration-container')) return

        this.shadow.querySelector('#configuration-container').innerHTML = `
        <div style="flex: 1;">
            <p class="field-title">Content Image</p>
            <select id="imageKeySelect">
                ` + keys.map((key) => `<option value="${key}" ${key === this.config.imageKey ? 'selected' : ''}>${key}</option>`).join("") + `
            </select>

            <p class="field-title">Image URL Prefix (optional)</p>
            <input type="text" value="" />

            <p class="field-title">Content Title</p>
            <select id="titleKeySelect">
                ` + keys.map((key) => `<option value="${key}" ${key === this.config.titleKey ? 'selected' : ''}>${key}</option>`).join("") + `
            </select>

            <p class="field-title">Content Caption</p>
            <select id="captionKeySelect">
                ` + keys.map((key) => `<option value="${key}" ${key === this.config.captionKey ? 'selected' : ''}>${key}</option>`).join("") + `
            </select>

            <p class="field-title">Content Link</p>
            <select id="contentLinkKeySelect">
                ` + keys.map((key) => `<option value="${key}" ${key === this.config.contentLinkKey ? 'selected' : ''}>${key}</option>`).join("") + `
            </select>

            <div style="margin-top: 8px;">
                <button id="saveButton">Save View</button>
            </div>
        </div>

        <div style="position: relative;">
            <div class="preview-card">
                <img src="${sample[this.config.imageKey]}" width="100" height="100">

                <div>
                    <p style="margin-bottom: 8px; font-weight: bold; font-size: 16px; line-height: 24px; font-family: 'Inter', sans-serif;">${sample[this.config.titleKey]}</p>
                    <p style="margin-bottom: 8px; font-size: 14px; line-height: 21px; font-weight: 400; font-family: 'Inter', sans-serif;">${sample[this.config.captionKey]}</p>
                    <p style="margin-top: 12px; font-size: 12px; line-height: 16px; font-family: 'Inter', sans-serif; color: gray; font-weight: 300;">${sample[this.config.contentLinkKey]}</p>
                </div>
            </div>
        </div>
        `

        var saveButton = this.shadow.getElementById("saveButton");
        saveButton.addEventListener("click", () => {
            triggerEvent(this, {
                action: OuterbaseEvent.onSave,
                value: this.config.toJSON()
            })
        });

        var imageKeySelect = this.shadow.getElementById("imageKeySelect");
        imageKeySelect.addEventListener("change", () => {
            this.config.imageKey = imageKeySelect.value
            this.render()
        });

        var titleKeySelect = this.shadow.getElementById("titleKeySelect");
        titleKeySelect.addEventListener("change", () => {
            this.config.titleKey = titleKeySelect.value
            this.render()
        });

        var captionKeySelect = this.shadow.getElementById("captionKeySelect");
        captionKeySelect.addEventListener("change", () => {
            this.config.captionKey = captionKeySelect.value
            this.render()
        });

        var contentLinkKeySelect = this.shadow.getElementById("contentLinkKeySelect");
        contentLinkKeySelect.addEventListener("change", () => {
            this.config.contentLinkKey = contentLinkKeySelect.value
            this.render()
        });
    }
}

window.customElements.define('outerbase-plugin-table-$PLUGIN_ID', OuterbasePluginTable_$PLUGIN_ID)
window.customElements.define('outerbase-plugin-configuration-$PLUGIN_ID', OuterbasePluginConfiguration_$PLUGIN_ID)