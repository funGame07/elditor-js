import FormatText from "./formatText.js"
import FormatHeading from "./formatHeading.js"
import FormatImage from "./formatImage.js"
import FormatList from "./formatList.js"
import FormatLink from "./formatLink.js"
import FormatAlign from "./formatAlign.js"
import FormatBadge from "./formatBadge.js"

class MyLib{
    /** @type {Range} */
    range

    /** @type {HTMLElement} */
    editorField

    /** @type {Array} */
    headingTag = [ 'H1', 'H2', 'H3', 'H4', 'H5', 'H6']

    /**
     * @param {string} id 
     */
    constructor(id, options){
        this.editorField = document.getElementById(id)

        document.onselectionchange = () => {
            this.setRange()

            if(!this.editorField.contains(this.range.startContainer)){
                document.querySelectorAll(options.button).forEach((button) =>{
                    this.removeButtonUI(button)
                })
            }else{
                if(!this.findRootNodeName(['P', 'LI', ...this.headingTag], this.range.startContainer)){
                    const p = document.createElement('p')
                    const div = this.findRootNode(['DIV'], this.range.startContainer)
                    p.innerHTML = div.innerHTML
                    div.replaceWith(p)
                }
                document.querySelectorAll(options.button).forEach((button) =>{
                    this.setButtonUI(button.getAttribute('data-key') ?? button.value, button, this.range.startContainer)
                })
                if(options.formatHeading){
                    this.setHeadingButtonUI(document.querySelector(options.formatHeading), this.range.startContainer)
                }
                if(options.formatBadge){
                    this.setBadgeButtonUI(document.querySelector(options.formatBadge), this.range.startContainer)
                }
                if(options.formatLink){
                    this.setButtonUI('A', document.querySelector(options.formatLink),this.range.startContainer)
                }
            }
        }
        if(options.formatText) new FormatText(document.querySelectorAll(options.formatText), this.editorField)
        if(options.formatList) new FormatList(document.querySelectorAll(options.formatList), this.editorField)
        if(options.formatAlign) new FormatAlign(document.querySelectorAll(options.formatAlign), this.editorField)
        if(options.formatBadge) new FormatBadge(document.querySelector(options.formatBadge), this.editorField)
        if(options.formatHeading) new FormatHeading(document.querySelector(options.formatHeading), this.editorField)
        if(options.formatLink) new FormatLink(document.querySelector(options.formatLink), this.editorField)
        if(options.formatImage) new FormatImage(document.querySelector(options.formatImage), this.editorField)
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
     * @param {Node} node 
     */
    isNodeTagged(key, node){
        while(node.nodeName !== 'BODY'){
            node = node.parentNode
            if(!node) return true
            if(node.nodeName === key) return true
        }
        return false
    }

    /**
     * 
     * @param {string} key 
     * @param {HTMLElement} buttonElement 
     * @param {Node} container 
     */
    setButtonUI(key, buttonElement, container){
        buttonElement.classList.remove('elditor-active')
        if(this.isNodeTagged(key, container)){
            buttonElement.classList.add('elditor-active')
        }
    }

    /**
     * 
     * @param {HTMLElement} buttonElement 
     * @param {Node} container 
     */
    setHeadingButtonUI(buttonElement, container){
        buttonElement.value = this.findRootNodeName(['P', 'LI', ...this.headingTag], container)
    }

    /**
     * 
     * @param {HTMLElement} buttonElement 
     * @param {Node} container 
     */
    setBadgeButtonUI(buttonElement, container){
        const figureType = this.findRootNode(['FIGURE'], container)?.getAttribute('class')?.split(' ')[1]
        if(figureType){
            buttonElement.value = figureType
        }else{
            buttonElement.value = 'nothing'
        }
        
    }

    /**
     * 
     * @param {HTMLElement} buttonElement 
     */
    removeButtonUI(buttonElement){
        buttonElement.classList.remove('elditor-active')
    }

    /**
     * @param {Array} listOfNodeNames 
     * @param {Node} node 
     * @returns {Node|null}
     */
    findRootNode(listOfNodeNames, node){
        while(!listOfNodeNames.includes(node.nodeName)){
            node = node.parentNode
            if(!node) return null
        }
        return node
    }

    /**
     * @param {Array} listOfNodeNames 
     * @param {Node} node 
     * @returns {string|null}
     */
    findRootNodeName(listOfNodeNames, node){
        const rootNode = this.findRootNode(listOfNodeNames, node)
        if(!rootNode) return null
        return rootNode.nodeName
    }
}

export default MyLib

