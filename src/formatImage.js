import Format from "./format.js"

class FormatImage extends Format{
    /** @type {Range} */
    range

    /**
     * @param {HTMLElement} formatElement 
     * @param {HTMLElement} editorField
     */
    constructor(formatElement, editorField, blob = null, cb){
        super()
        if(!formatElement && !editorField && blob){
            this.setRange()
            this.formatImage(blob, cb)
        }else{
            formatElement.addEventListener('change', (e)=>{
                this.setRange()
                if(editorField.contains(this.range.startContainer)){
                    this.formatImage(e.target.files[0])
                }
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

    async formatImage(blobImg, cb){
        const brBefore = document.createElement("br");
        const img = document.createElement("img");
        img.src = URL.createObjectURL(blobImg);
        img.style.width = "100%";
        const brAfter = document.createElement("br");

        // Insert them into the document
        this.range.insertNode(brAfter);
        this.range.insertNode(img);
        this.range.insertNode(brBefore);

        // Move caret after the inserted image
        this.range.setStartAfter(brAfter);
        this.range.collapse(true);

        if(cb){
            const formData = new FormData()
            formData.append('uploadImage', blobImg, blobImg.name)

            const {imagePath, apiDomain} = await cb(formData)
            img.src = apiDomain + '/' + imagePath
        }
    }
}

export default FormatImage