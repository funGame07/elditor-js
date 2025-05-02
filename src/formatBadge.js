import Format from "./format.js";


class FormatBadge extends Format{
    /** @type {Range} */
    range

    /** @type {object} */
    badgeData = {
        warning: {
            class: 'warning',
            d: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z'
        },
        danger: {
            class: 'danger',
            d: 'M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5'
        },
        success: {
            class: 'success',
            d: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
        },
        info: {
            class: 'info',
            d: 'm11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z'
        },
    }

    /**
     * @param {NodeListOf<Element>} formatElement 
     * @param {HTMLElement} editorField
     */
    constructor(formatElement, editorField){
        super()
        formatElement.addEventListener('change', ()=>{
            this.setRange()
            if(editorField.contains(this.range.startContainer)){
                if(formatElement.value === 'nothing'){
                    if(this.isNodeTagged('FIGURE', this.range.startContainer)){
                        this.unformatBadgeInitialization()
                    }
                }else{
                    this.formatBadgeInitialization(formatElement.value)
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
     * 
     * @param {string} key 
     */
    formatBadgeInitialization(key){
        const {startContainer, endContainer} = this.range
        this.formatBadgeManager(key, startContainer, endContainer)
    }

    /**
     * 
     * @param {string} key 
     * @param {Node} startContainer 
     * @param {Node} endContainer 
     */
    formatBadgeManager(key, startContainer, endContainer){
        let wholeContainer = this.nodeInside(['P', 'OL', 'UL', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'], startContainer)
        let nextWholeContainer = wholeContainer.nextElementSibling

        if(this.isNodeTagged('FIGURE', wholeContainer)){
            this.formatBadge(key, wholeContainer)
            return
        }

        while(!wholeContainer.contains(endContainer)){
            this.formatBadge(key, wholeContainer)
            wholeContainer = nextWholeContainer
            nextWholeContainer = wholeContainer.nextElementSibling
        }
        this.formatBadge(key, wholeContainer)
    }

    /**
     * 
     * @param {string} key 
     * @param {HTMLElement} container 
     */
    formatBadge(key, container){
        const figure = this.nodeInside(['FIGURE'], container)
        if(figure){
            figure.setAttribute('class', `badge ${this.badgeData[key].class}`)
            figure.querySelector('div').querySelector('svg').querySelector('path').setAttribute('d', this.badgeData[key].d)
            return
        }

        // if prev node has badge
        if(container.previousElementSibling?.getAttribute("class")?.includes('badge')){
            const badgeType = container.previousElementSibling?.getAttribute("class").split(' ')[1]

            if(badgeType === this.badgeData[key].class){
                const nextNode = container.nextSibling
                const textDiv = container.previousElementSibling.getElementsByClassName('badgeTextSection')[0]
                const br = document.createElement('br')
                textDiv.appendChild(br)
                textDiv.appendChild(container)

                const p = document.createElement('p')
                const br2 = document.createElement('br')
                p.appendChild(br2)
                nextNode.parentNode.insertBefore(p, nextNode)
                return
            }
        }
        //

        const outerFigure = document.createElement('figure')
        outerFigure.setAttribute('class', `badge ${this.badgeData[key].class}`)
        outerFigure.setAttribute('contenteditable', 'false')
        outerFigure.contentEditable = 'false'

        const logoDiv = document.createElement('div')
        logoDiv.setAttribute('class', 'badgeLogo')
        logoDiv.setAttribute('contenteditable', 'false')
        logoDiv.contentEditable = 'false'

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        svg.setAttribute('width', 24)
        svg.setAttribute('height', 24)
        svg.setAttribute('fill', 'none')
        svg.setAttribute('viewBox', '0 0 24 24')
        svg.setAttribute('stroke-width', '1.5')
        svg.setAttribute('stroke', 'currentColor')
        svg.setAttribute('class', 'size-6')

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('stroke-linecap', 'round')
        path.setAttribute('stroke-linejoin', 'round')
        path.setAttribute('d', this.badgeData[key].d)

        const textDiv = document.createElement('div')
        textDiv.setAttribute('class', 'badgeTextSection')
        textDiv.setAttribute('contenteditable', 'true')
        textDiv.contentEditable = 'true'


        const range = new Range()
        range.selectNode(container)

        outerFigure.appendChild(logoDiv)
        logoDiv.appendChild(svg)
        svg.appendChild(path)
        outerFigure.appendChild(textDiv)
        textDiv.appendChild(range.cloneContents())

        container.replaceWith(outerFigure)

        const p = document.createElement('p')
        const br = document.createElement('br')
        p.appendChild(br)
        outerFigure.parentNode.insertBefore(p, outerFigure.nextSibling)
    }

    /**
     * 
     * <div class="badge warning">
            <div class="badgeLogo">
                <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>                      
            </div>
            <div class="badgeTextSection">
                <p>Lorem, Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aspernatur laudantium voluptate quisquam fuga vero iure, expedita voluptatibus, natus cupiditate repudiandae fugit tempora id culpa iste numquam optio, reprehenderit architecto accusantium voluptatum nulla quas earum! Numquam, quo voluptates! Sed, neque officia! Provident, nulla quibusdam eius inventore cumque tempora sit vitae, veritatis culpa libero vel possimus, eum amet. Voluptate enim tempora a, voluptas possimus eaque reiciendis quibusdam doloribus nam veniam similique deleniti! Architecto odio neque laboriosam veritatis. Quo nemo sequi temporibus totam veritatis quia fugiat assumenda, eaque in veniam sapiente sint. Labore eos officiis, culpa eaque blanditiis omnis tenetur rem neque sed. ipsum dolor sit amet consectetur adipisicing elit. At officia modi aperiam quaerat ab illo a molestiae eaque, eveniet dicta veniam error nesciunt accusantium sint illum reiciendis sunt eos omnis nisi dolor consequatur? Delectus maxime esse, aperiam veniam commodi fugiat placeat, eligendi laudantium culpa maiores cupiditate ratione facilis, nemo repellendus.</p>
            </div>
        </div>
     */


    unformatBadgeInitialization(){
        const {startContainer, endContainer} = this.range
        this.unformatBadgeManager(startContainer, endContainer)
    }

    /**
     * 
     * @param {HTMLElement} startContainer 
     * @param {HTMLElement} endContainer 
     */
    unformatBadgeManager(startContainer, endContainer){
        let wholeContainer = this.nodeInside(['FIGURE'], startContainer)
        let nextWholeContainer = wholeContainer.nextElementSibling

        while(!wholeContainer.contains(endContainer)){
            this.unformatBadge(wholeContainer)
            wholeContainer = nextWholeContainer
            nextWholeContainer = wholeContainer.nextElementSibling
        }
        this.unformatBadge(wholeContainer)
    }

    /**
     * 
     * @param {HTMLElement} container 
     */
    unformatBadge(container){
        const textSection = container.getElementsByClassName('badgeTextSection')[0]
        if(!textSection) return

        const Looplength = textSection.childNodes.length

        for(let i = 0; i < Looplength; i++){
            container.parentNode.insertBefore(textSection.firstChild, container)
        }

        container.remove()
    }
}

export default FormatBadge