import Format from "./format.js"

class FormatLink extends Format{
    /** @type {Range} */
    range

    /**
     * @param {HTMLElement} formatElement 
     * @param {HTMLElement} editorField
     */
    constructor(formatElement, editorField){
        super()
        formatElement.addEventListener('click', (e)=>{
            this.setRange()
            if(editorField.contains(this.range.startContainer)){
                if(this.isNodeTagged('A', this.range.startContainer)){
                    this.unformatLinkInitialization()
                }else{
                    const link = prompt('Link to: (ex: https://google.com)')
                    const newURL = this.validateURL(link.trim())
                    if(newURL){
                        this.formatLinkInitialization(link)
                    }else{
                        alert(link + ' is not valid. maybe there is a typo or in the wrong format')
                    }
                }
            }
        })
    }

    /**
     * 
     * @param {string} url 
     * @returns {string|null}
     */
    validateURL(url){
        try{
            const urlObj = new URL(url)
            return urlObj.origin
        }catch(err){
            return null
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

    /**
     * 
     * @param {string} link 
     */
    formatLinkInitialization(link){
        const {startContainer, endContainer, startOffset, endOffset} = this.range
        this.formatLinkManager(link, startContainer, endContainer, startOffset, endOffset)
    }

    /**
     * @param {string} link 
     * @param {Node} startContainer 
     * @param {Node} endContainer 
     * @param {number} startOffset 
     * @param {number} endOffset 
     */
    formatLinkManager(link, startContainer, endContainer, startOffset, endOffset){
        let wholeContainer = this.nodeInside(['LI', 'P'], startContainer)
        let nextWholeContainer = wholeContainer.nextElementSibling

        if(wholeContainer.contains(endContainer)){
            this.formatLink(link, startContainer, endContainer, startOffset, endOffset)
            return
        }
        
        this.formatLink(link, startContainer, this.findText(wholeContainer.lastChild), startOffset, wholeContainer.lastChild.textContent.length)
        wholeContainer = nextWholeContainer
        nextWholeContainer = wholeContainer.nextElementSibling
        while(!wholeContainer.contains(endContainer)){
            this.formatLink(link, wholeContainer, wholeContainer, 0, wholeContainer.textContent.length)
            wholeContainer = nextWholeContainer
            nextWholeContainer = wholeContainer.nextElementSibling
        }
        this.formatLink(link, wholeContainer, endContainer, 0, endOffset)

    }

    /**
     * 
     * @param {string} link 
     * @param {Node} startContainer 
     * @param {Node} endContainer 
     * @param {number} startOffset 
     * @param {number} endOffset 
     */
    formatLink(link, startContainer, endContainer, startOffset, endOffset){
        const range = new Range()
        range.setStart(startContainer, startOffset)
        range.setEnd(endContainer, endOffset)

        const a = document.createElement('A')
        a.href = link
        a.style.color = 'blue'
        a.style.cursor = 'pointer'
        a.appendChild(range.extractContents())
        range.insertNode(a)

        this.cleanupEmptyNodes(a.parentNode.childNodes)
    }


    /**
     * 
     * @param {string} link 
     */
    unformatLinkInitialization(){
        const {startContainer} = this.range
        this.unformatLinkManager(startContainer)
    }

    /**
     * @param {string} link 
     * @param {Node} startContainer 
     * @param {Node} endContainer 
     */
    unformatLinkManager(startContainer){
        const a = this.findNode('A', startContainer)
        this.unformatLink(a)
    }

    /**
     * 
     * @param {Node} container 
     */
    unformatLink(container){
        const containerParent = container.parentNode
        const Looplength = container.childNodes.length

        for(let i = 0; i < Looplength; i++){
            container.parentNode.insertBefore(container.firstChild, container)
        }
        container.remove()
        this.merge(containerParent)
    }
}

export default FormatLink