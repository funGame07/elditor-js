import Format from "./format.js"

class FormatAlign extends Format{
    /** @type {Range} */
    range

    /**
     * @param {NodeListOf<Element>} formatElement 
     * @param {HTMLElement} editorField
     */
    constructor(formatElement, editorField, position = null){
        super()
        if(!formatElement && !editorField && position){
            this.setRange()
            if(this.isNodeTagged(position, this.range.startContainer)){
                this.unformatListInitialization(position)
            }else{
                this.formatAlignInitialization(position)
            }
        }else{
            formatElement.forEach(element =>{
                element.addEventListener('click', () =>{
                    this.setRange()
                    if(editorField.contains(this.range.startContainer)){
                        if(this.isNodeTagged(element.getAttribute('data-key'), this.range.startContainer)){
                            this.unformatListInitialization(element.getAttribute('data-key'))
                        }else{
                            this.formatAlignInitialization(element.getAttribute('data-key'))
                        }
                    }
                })
            })
        }
        
    }

    /**
     * Save the selection range as property
     * Only support 1 selection
     * @returns {void}
     */
    setRange(){
        this.range = document.getSelection().getRangeAt(0)
    }

    formatAlignInitialization(key){
        const {startContainer, endContainer} = this.range
        this.formatAlignManager(key, startContainer, endContainer)
    }

    /**
     * @param {string} key
     * @param {Node} startContainer 
     * @param {HTMLElement} endContainer 
     */
    formatAlignManager(key, startContainer, endContainer){
        let wholeContainer = this.nodeInside(['P', 'LI', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'], startContainer)
        let nextWholeContainer = wholeContainer.nextElementSibling
        if(!nextWholeContainer && wholeContainer.nodeName === 'LI'){
            nextWholeContainer = wholeContainer.parentNode.nextElementSibling
        }
        if(['OL', 'UL'].includes(nextWholeContainer)){
            nextWholeContainer = nextWholeContainer.firstElementChild
        }

        while(!wholeContainer.contains(endContainer)){
            this.formatAlign(key, wholeContainer)
            wholeContainer = nextWholeContainer
            nextWholeContainer = wholeContainer.nextElementSibling
            if(!nextWholeContainer && wholeContainer.nodeName === 'LI'){
                nextWholeContainer = wholeContainer.parentNode.nextElementSibling
            }
            if(['OL', 'UL'].includes(nextWholeContainer?.nodeName)){
                nextWholeContainer = nextWholeContainer.firstElementChild
            }
        }
        this.formatAlign(key, wholeContainer)
    }

    /**
     * 
     * @param {string} key 
     * @param {Node} container 
     */
    formatAlign(key, container){
        // center, start, end, justify
        container.style.textAlign = key
    }
}

export default FormatAlign