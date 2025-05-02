import ElementEnum from "./enums/elementEnum.js";
import formatRules from "./formatRules.js";

class Format{
    /**
     * return the next text node if the current text node is not surrounded with a certain tag
     * @param {string} key 
     * @param {Node} container 
     * @param {Node|null} untilNode
     * @returns {Node} Text Node
     */
    findNextTextAdv(key, container, untilNode){
        container = this.findNextText(container)

        while(!this.isNodeTagged(key, container) && container !== untilNode ){
            container = this.findNextText(container)
        }

        return container
    }

    /**
     * find node on current node scope/parent
     * @param {string} key 
     * @param {Node} node 
     * @returns {Node|null}
     */
    findNodeBefore(key, node){
        while(ElementEnum[node.parentNode.nodeName] !== ElementEnum[key]){
            node = node.parentNode
        }
        return node 
    }

    /**
     * find node on current node scope/parent
     * @param {string} key 
     * @param {Node} node 
     * @returns {HTMLElement|null}
     */
    findNode(key, node){
        // if(!node) return null
        return this.findNodeBefore(key, node).parentNode
    }

    /**
     * 
     * @param {NodeListOf<ChildNode>} nodes 
     */
    cleanupEmptyNodes(nodes){
        for(let i = nodes.length-1; i >= 0; i--){
            if(nodes[i].nodeName === 'P') continue;
            this.removeNode(nodes[i])
        }
    }

    /**
     * will only be removed if the node is empty
     * @param {Node} node the node you want to transfer to
     * @returns {void}
     */
    removeNode(node){
        if(this.isNodeEmpty(node)){
            node.parentNode.removeChild(node)
        }
    }

    /**
     * to find next text
     * @param {Node} node 
     * @returns {Node}
     */
    findNextText(node){
        const checkSibling = node.nextSibling ? true : false
        if(!checkSibling){
            return this.findNextText(node.parentNode)
        }else{
            node = node.nextSibling
        }

        return this.findText(node)
    }

    /**
     * find the text of a node
     * 
     * @param {Node} node 
     * @returns {Node|null} return false id node is null
     */
    findText(node){
        // node type 3 means its a plain text
        while(node.nodeType !== 3){
            node = node.firstChild

            if(!node) return null
        }
        return node
    }

    /**
     * check if the node is empty
     * @param {Node} node 
     * @returns {boolean}
     */
    isNodeEmpty(node){
        if(!node) return false
        if(node.nodeType === 3) return false

        let isEmpty = true

        for(let i = 0; i < node.childNodes.length; i++){
            const textNode = this.findText(node.childNodes[i])
            if(textNode?.length > 0){
                isEmpty = false
                break
            }
        }

        return isEmpty
    }

    /**
     * 
     * @param {Node} node 
     */
    isNodeTagged(key, node){
        while(node.nodeName !== 'BODY'){ //ElementEnum.P.value && node.nodeName !== ElementEnum.OL.value
            node = node.parentNode
            if(!node) return true
            if(node.nodeName === key) return true
        }
        return false
    }

    /**
     * 
     * @param {Node} toNode the node you want to transfer to
     * @param {Node} fromNode the node you want to transfer from
     * @returns {void}
     */
    moveTo(toNode, fromNode){
        if(fromNode.nodeType === 3){
            return fromNode.parentNode.normalize()
        }
        fromNode.childNodes.forEach(child =>{
            // toNode.appendChild(child)
        })
    }

    /**
     * to merge prevsibling and/or nextsibling if the tag name is same.
     * sometimes uninentionally caused by formatting node
     * @param {ParentNode} node 
     * @returns {void}
     */
    merge(node){
        if(!node) return;
        node.normalize()
        
        let prevChild = node.childNodes[node.childNodes.length-1]
        for(let i = node.childNodes.length-2; i >=0; i--){
            if(prevChild.nodeName === node.childNodes[i].nodeName){
                if(!formatRules.NOTTOMERGE.includes(node.childNodes[i].nodeName)){
                  node.childNodes[i].innerHTML += prevChild.innerHTML  
                  prevChild.remove()
                };
            }
            prevChild = node.childNodes[i]
        }
        this.cleanupEmptyNodes(node.childNodes)
        this.cleanupEmptyNodes(node.parentNode.childNodes)

        /* recursive merge */
        this.merge(node.firstChild)
        
    }

    /**
     * 
     * @param {Array} listOfNodeNames 
     * @param {Node} container 
     * @returns {Node|null}
     */
    nodeInside(listOfNodeNames, container){
        while(!listOfNodeNames.includes(container.nodeName)){
            container = container.parentNode
            if(!container) return null
        }
        return container
    }

    /*------------------------------------- unformat section --------------------------------------*/
    unformatInitialization(key, range){
        const {startContainer, endContainer, startOffset, endOffset} = range
        this.unformatManager(key, startContainer, endContainer, startOffset, endOffset)
    }

    unformatManager(key, startContainer, endContainer, startOffset, endOffset){
        /* handle leftside unformat */
        if(startOffset !== endOffset && this.isNodeTagged(key, startContainer)){
            const parent = this.findNode(key, startContainer)
            const leftNode = this.handleLeft(key, startContainer, startOffset)

            parent.parentNode.insertBefore(leftNode, parent)
        }            

        /* handle unformat */
        if(startContainer === endContainer){
            this.unformat(key, startContainer, 0, endOffset-startOffset)
            return
        }
        
        let container = startContainer
        let nextContainer = this.findNextTextAdv(key, container, endContainer)

        while(container !== endContainer){
            this.unformat(key, container, 0, container.length)
            container = nextContainer
            nextContainer = this.findNextTextAdv(key, container, endContainer)
        }
        this.unformat(key, container, 0, endOffset)
    }

    /**
     * 
     * @param {string} key 
     * @param {Node} container 
     * @param {number} endOffset 
     * @returns {Node}
     */
    handleLeft(key, container, endOffset){
        if(!this.isNodeTagged(key, container)) return;

        const range = new Range()
        range.setStart(container, 0)
        range.setEnd(container, endOffset)

        while(ElementEnum[container.nodeName] !== ElementEnum[key]){
            container = container.parentNode

            const el = document.createElement(container.nodeName)
            
            el.appendChild(range.extractContents())
            container.parentNode.insertBefore(el, container)

            range.selectNode(el)
        }

        // const el = document.createElement(key)
        // el.appendChild(range.extractContents())

        return range.extractContents().firstChild
        /* documentfragment's firstchild is node itself */
    }


    /**
     *  To unformat 
     * @param {string} key the element tag
     * @param {Node} container the container you want to format
     * @param {number} startOffset starting point
     * @param {number} endOffset ending point
     * @returns {void}
     */
    unformat(key, container, startOffset, endOffset){
        if(!this.isNodeTagged(key, container)) return

        const newContainer = this.findNodeBefore(key, container)

        const unformatted = this.handleLeft(key, container, endOffset).firstChild

        const parent = this.findNode(key, newContainer)
        parent.parentNode.insertBefore(unformatted, parent)

        this.merge(parent.parentNode)

        this.cleanupEmptyNodes(parent.parentNode.childNodes)
    }
}

export default Format