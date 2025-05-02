import Format from "./format.js"

class FormatList extends Format{
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
                        this.unformatListInitialization(element.getAttribute('data-key'))
                    }else{
                        this.formatListInitialization(element.getAttribute('data-key'))
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

    formatListInitialization(key){
        const {startContainer, endContainer} = this.range
        this.formatListManager(key, startContainer, endContainer)
    }

    /**
     * 
     * @param {string} key 
     * @param {Node} startContainer 
     * @param {Node} endContainer 
     */
    formatListManager(key, startContainer, endContainer){
        const anotherKey = key === 'UL' ? 'OL': 'UL'
        if(this.isNodeTagged(anotherKey, startContainer)){
            this.formatAnotherListManager(key, startContainer, endContainer)
            return
        }

        let wholeContainer = this.nodeInside(['P', 'LI'], startContainer)
        // if(!wholeContainer) return this.insertEmptyList(key)
        let nextWholeContainer = wholeContainer.nextElementSibling
        const XL = document.createElement(key)

        while(!wholeContainer.contains(endContainer)){
            const li = this.formatList(wholeContainer)
            if(wholeContainer.previousElementSibling?.nodeName === key){
                wholeContainer.previousElementSibling.appendChild(li)
                wholeContainer.parentNode.removeChild(wholeContainer)
            }else{
                XL.appendChild(li)
                wholeContainer.replaceWith(XL)
            }
            wholeContainer = nextWholeContainer
            nextWholeContainer = wholeContainer.nextElementSibling
            
        }
        const li = this.formatList(wholeContainer)
        if(wholeContainer.previousElementSibling?.nodeName === key){
            wholeContainer.previousElementSibling.appendChild(li)
            if(wholeContainer.nextElementSibling?.nodeName === key){
                this.moveTo(wholeContainer.previousElementSibling, wholeContainer.nextElementSibling)
                wholeContainer.previousElementSibling.innerHTML += wholeContainer.nextElementSibling.innerHTML
                wholeContainer.parentNode.removeChild(wholeContainer.nextElementSibling)
            }
            wholeContainer.parentNode.removeChild(wholeContainer)
        }else{
            XL.appendChild(li)
            wholeContainer.replaceWith(XL)
            if(XL.nextElementSibling?.nodeName === key){
                XL.innerHTML += XL.nextElementSibling.innerHTML
                XL.parentNode.removeChild(XL.nextElementSibling)
            }
        }
    }

    /**
     * 
     * @param {Node} container 
     * @returns {Node}
     */
    formatList(container){
        if(this.isNodeTagged('LI', container)) return container

        const li = document.createElement('LI')
        li.innerHTML = container.innerHTML
        return li
    }

    insertEmptyList(key){

    }

    /**
     * 
     * @param {string} key 
     * @param {Node} startContainer 
     * @param {Node} endContainer 
     */
    formatAnotherListManager(key, startContainer, endContainer){
        let wholeContainer = this.findNode('LI', startContainer)
        let nextWholeContainer = wholeContainer.nextElementSibling

        while(!wholeContainer.contains(endContainer)){
            this.formatAnotherList(key, wholeContainer)
            wholeContainer = nextWholeContainer
            nextWholeContainer = wholeContainer?.nextElementSibling
        }
        this.formatAnotherList(key, wholeContainer)
    }

    /**
     * 
     * @param {string} key 
     * @param {Node} container 
     * @returns {void}
     */
    formatAnotherList(key, container){
        const XL = document.createElement(container.parentNode.nodeName)

        while(container.nextElementSibling){
            XL.appendChild(container.nextElementSibling)
        }

        if(container.parentNode.nextSibling){
            container.parentNode.parentNode.insertBefore(XL, container.parentNode.nextSibling)
        }else{
            container.parentNode.parentNode.appendChild(XL)
        }
        
        const XL2 = document.createElement(key)
        if(container.parentNode.previousElementSibling?.nodeName === key){
            container.parentNode.previousElementSibling.appendChild(container)
            this.cleanupEmptyNodes(container.parentNode.parentNode.childNodes)
        }else{
            container.parentNode.parentNode.insertBefore(XL2, XL)
            XL2.appendChild(container)
            this.cleanupEmptyNodes(XL2.parentNode.childNodes)
        }  
        
        // this.cleanupEmptyNodes(XL2.parentNode.childNodes)
    }


    /**
     * 
     * @param {string} key 
     */
    unformatListInitialization(key){
        const {startContainer, endContainer} = this.range
        this.unformatListManager(key, startContainer, endContainer)
    }

    /**
     * 
     * @param {string} key 
     * @param {Node} startContainer 
     * @param {Node} endContainer 
     */
    unformatListManager(key, startContainer, endContainer){
        let wholeContainer = this.findNode('LI', startContainer)
        let nextWholeContainer = wholeContainer.nextElementSibling

        while(!wholeContainer.contains(endContainer)){
            this.unformatList(wholeContainer)
            wholeContainer = nextWholeContainer
            nextWholeContainer = wholeContainer.nextElementSibling
        }
        this.unformatList(wholeContainer)
    }

    /**
     * 
     * @param {Node} container 
     * @returns {void}
     */
    unformatList(container){
        const XL = document.createElement(container.parentNode.nodeName)

        while(container.nextElementSibling){
            XL.appendChild(container.nextElementSibling)
        }

        if(container.parentNode.nextSibling){
            container.parentNode.parentNode.insertBefore(XL, container.parentNode.nextSibling)
        }else{
            container.parentNode.parentNode.appendChild(XL)
        }
        
        const p = document.createElement('P')
        p.innerHTML = container.innerHTML
        container.parentNode.parentNode.insertBefore(p, XL)
        container.parentNode.removeChild(container)
        this.cleanupEmptyNodes(XL.parentNode.childNodes)

    }
}

export default FormatList