import Format from "./format.js"

class FormatHeading extends Format{
    /** @type {Range} */
    range

    /** @type {Array} */
    headingReplace = ['P', 'LI', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6']

    /** @type {Array} */
    headingTag = [ 'H1', 'H2', 'H3', 'H4', 'H5', 'H6']


    /**
     * @param {HTMLElement} formatElement 
     * @param {HTMLElement} editorField
     */
    constructor(formatElement, editorField, tag = null){
        super()
        if(!formatElement && !editorField && tag){
            this.setRange()
            if(this.isNodeTagged(tag, this.range.startContainer)){
                this.unformatHeadingInitialization(this.range.startContainer)
            }else{
                this.formatHeadingInitialization(tag)
            }
        }
        formatElement.addEventListener('change', ()=>{
            this.setRange()
            if(editorField.contains(this.range.startContainer)){
                if(this.isNodeTagged(formatElement.value, this.range.startContainer)){
                    this.unformatHeadingInitialization(this.range.startContainer)
                }else{
                    this.formatHeadingInitialization(formatElement.value)
                }
            }
        })
    }


    /**
     * Save the selection range as property
     * Only support 1 selection
     * @returns {void}
     */
    setRange(){
        this.range = document.getSelection().getRangeAt(0)
    }

    /**
     * initialize the key and let the rest work as it is
     * @param {string} key 
     * @returns {void}
     */
    formatHeadingInitialization(key){
        const {startContainer} = this.range
        
        this.formatManager(key, startContainer)
    }

    /**
     * Act as a manager to manage the format behavior
     * @param {string} key
     * @param {Node} startContainer 
     * @returns {void}
     */
    formatManager(key, startContainer){
        if(this.isNodeTagged('LI', startContainer)) return;
        
        const parent = this.nodeInside(this.headingReplace, startContainer)
        const el = document.createElement(key)
        el.innerHTML = parent.innerHTML

        if(parent.nodeName === 'LI'){
            const li = document.createElement('LI')
            li.appendChild(el)
            parent.replaceWith(li)
        }else{
            parent.replaceWith(el)
        }
    }

    /**
     * 
     * @param {Node} container 
     */
    unformatHeadingInitialization(container){
        const heading = this.nodeInside(this.headingTag, container)

        if(heading.parentNode.nodeName === 'LI'){
            heading.parentNode.innerHTML = heading.innerHTML
        }else{
            const p = document.createElement('P')
            p.innerHTML = heading.innerHTML
            heading.replaceWith(p)
        }
    }
}

export default FormatHeading