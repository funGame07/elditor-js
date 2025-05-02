import Format from "./format.js";
import PresedenceEnum from "./enums/presedenceEnum.js";

class FormatText extends Format{
    /** @type {Range} */
    range

    /**
     * @param {NodeListOf<Element>} formatElement 
     * @param {HTMLElement} editorField
     */
    constructor(formatElement, editorField){
        super()
        formatElement.forEach(element =>{
            element.addEventListener('click', () =>{
                this.setRange()
                if(editorField.contains(this.range.startContainer)){
                    if(this.isNodeTagged(element.getAttribute('data-key'), this.range.startContainer)){
                        this.unformatInitialization(element.getAttribute('data-key'), this.range)
                    }else{
                        this.formatInitialization(element.getAttribute('data-key'))
                    }
                }
            })
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
    formatInitialization(key){
        const {startContainer, endContainer, startOffset, endOffset} = this.range
        this.formatManager(key, startContainer, endContainer, startOffset, endOffset)
    }

    /**
     * Act as a manager to manage the format behavior
     * @param {string} key
     * @param {Node} startContainer 
     * @param {Node} endContainer 
     * @param {number} startOffset 
     * @param {number} endOffset 
     * @returns {void}
     */
    formatManager(key, startContainer, endContainer, startOffset, endOffset){
        const a = startOffset === endOffset

        /* format left selected range */
        this.format(key, startContainer, 0, startOffset, false)

        /* format selected range */
        if(startContainer === endContainer){
            if(a){
                if(PresedenceEnum[key].value < PresedenceEnum[startContainer.parentNode.nodeName].value){
                    return this.format(key, startContainer, 0, 0, true, true)
                }else{
                    return this.format(key, startContainer, startOffset, endOffset, true, true)
                }
            }
            if(PresedenceEnum[key].value < PresedenceEnum[startContainer.parentNode.nodeName].value){
                this.format(key, startContainer, 0, endOffset-startOffset, true)
            }else{
                this.format(key, startContainer, startOffset, endOffset, true)
            }
        }else{
            let container = startContainer
            let nextContainer = this.findNextText(container)

            if(PresedenceEnum[key] > PresedenceEnum[container.parentNode.nodeName]){
                this.format(key, container, startOffset, startContainer.length, true)
                container = nextContainer
                nextContainer = this.findNextText(container)
            }

            while(container !== endContainer){
                this.format(key, container, 0, container.length, true)
                container = nextContainer
                nextContainer = this.findNextText(container) // err here
            }
            this.format(key, container, 0, endOffset, true)
        }
    }

    /**
     *  To format 
     * @param {string} key the element tag
     * @param {Node} container the container you want to format
     * @param {number} startOffset starting point
     * @param {number} endOffset ending point
     * @param {boolean} modify do you want to modify?
     * @returns {void}
     */
    format(key, container, startOffset, endOffset, modify, focus = false){
        if(this.isNodeTagged(key, container)) return;

        const formatRange = new Range()
        formatRange.setStart(container, startOffset)
        formatRange.setEnd(container, endOffset)

        while(  
            PresedenceEnum[key].value < PresedenceEnum[container.nodeName].value &&
            PresedenceEnum[key].value < PresedenceEnum[container.parentNode.nodeName].value
        ){
            container = container.parentNode

            const el = document.createElement(container.nodeName)
            // if(container.childNodes.length > 1){
            //     this.moveTo(el, container)
            // }else{
                el.append(formatRange.extractContents())
                container.parentNode.insertBefore(el, container)
            // }

            formatRange.selectNode(el)
        }

        if(modify){
            const el = document.createElement(key)
            formatRange.surroundContents(el)

            /* delete empty nodes */
            this.removeNode(el.nextSibling)
            this.removeNode(el.previousSibling)

            if(focus){
                this.findLastElement(el).innerHTML = '&nbsp;'

                const range = document.createRange()
                range.selectNode(el)

                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range)
            }

            this.merge(el.parentNode)
        }
        
    }

    /**
     * find the text of a node
     * 
     * @param {Node} node 
     * @returns {Node}
     */
    findLastElement(node){
        while(node.firstChild){
            node = node.firstChild
        }
        return node
    }
} 

export default FormatText