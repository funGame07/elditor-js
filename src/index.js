import './style.css'

import MyLib from './myLib.js'
import FormatText from './formatText.js'
import FormatList from './formatList.js'
import FormatAlign from './formatAlign.js'
import FormatLink from './formatLink.js'
import FormatHeading from './formatHeading.js'
import FormatImage from './formatImage.js'
import FormatBadge from './formatBadge.js'

const template = `
    <div id="elditor">
        <div id="elditor-tools">
            <button id="b" class="elditor-btn elditor-formatText" data-key="STRONG">
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5h4.5a3.5 3.5 0 1 1 0 7H8m0-7v7m0-7H6m2 7h6.5a3.5 3.5 0 1 1 0 7H8m0-7v7m0 0H6"/>
                </svg>                  
            </button>
            <button id="i" class="elditor-btn elditor-formatText" data-key="EM">
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m8.874 19 6.143-14M6 19h6.33m-.66-14H18"/>
                </svg>                  
            </button>
            <button id="i" class="elditor-btn elditor-formatText" data-key="U">
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 19h12M8 5v9a4 4 0 0 0 8 0V5M6 5h4m4 0h4"/>
                </svg>                  
            </button>
            <button id="s" class="elditor-btn elditor-formatText" data-key="S">
                <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 12a8.912 8.912 0 0 1-.318-.079c-1.585-.424-2.904-1.247-3.76-2.236-.873-1.009-1.265-2.19-.968-3.301.59-2.2 3.663-3.29 6.863-2.432A8.186 8.186 0 0 1 16.5 5.21M6.42 17.81c.857.99 2.176 1.812 3.761 2.237 3.2.858 6.274-.23 6.863-2.431.233-.868.044-1.779-.465-2.617M3.75 12h16.5" />
                    </svg>
                    
            </button>

            <button id="sup" class="elditor-btn elditor-formatText" data-key="SUP">
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 10h-4v-.5C17.0989 8.46711 19.75 7 19.75 6V4.99989c0-.55228-.4477-.99989-1-.99989H17c-.5523 0-1 .44772-1 1M4 7.30341l9.1221 11.39319m0-11.39319L4 18.6966"/>
                </svg>                  
            </button>
            <button id="sub" class="elditor-btn elditor-formatText" data-key="SUB">
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 20h-4v-.5c1.0989-1.0329 3.75-2.5 3.75-3.5v-1.0001c0-.5523-.4477-.9999-1-.9999H17c-.5522 0-1 .4477-1 1M4.00004 4l9.12206 11.3932m0-11.3932L4 15.3932"/>
                </svg>                  
            </button>
            
            <button id="ol" class="elditor-btn elditor-formatList" data-key="OL">
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6h8m-8 6h8m-8 6h8M4 16a2 2 0 1 1 3.321 1.5L4 20h5M4 5l2-1v6m-2 0h4"/>
                </svg>                  
            </button>
            <button id="ul" class="elditor-btn elditor-formatList" data-key="UL">
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5"/>
                </svg>                  
            </button>
            
            <button id="elditor-formatLink" class="elditor-btn">
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.213 9.787a3.391 3.391 0 0 0-4.795 0l-3.425 3.426a3.39 3.39 0 0 0 4.795 4.794l.321-.304m-.321-4.49a3.39 3.39 0 0 0 4.795 0l3.424-3.426a3.39 3.39 0 0 0-4.794-4.795l-1.028.961"/>
                </svg>                  
            </button>
            
            <select id="elditor-formatHeading" class="elditor-select">
                <option value="P">P</option>
                <option value="H1">H1</option>
                <option value="H2">H2</option>
                <option value="H3">H3</option>
                <option value="H4">H4</option>
                <option value="H5">H5</option>
                <option value="H6">H6</option>
            </select> 

            <select id="elditor-formatBadge" class="elditor-select">
                <option value="nothing">Nothing</option>
                <option value="warning">Warning</option>
                <option value="success">Success</option>
                <option value="danger">Danger</option>
                <option value="info">Info</option>
            </select> 
            
            <button id="elditor-btn-image">
                <input type="file" accept="image/png, image/webp, image/jpeg, image/jpg" style="display: none;" id="elditor-formatImage">
                <label for="elditor-formatImage" id="elditor-labelImage">
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m3 16 5-7 6 6.5m6.5 2.5L16 13l-4.286 6M14 10h.01M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"/>
                    </svg>                  
                </label>
            </button>
            
            <button class="elditor-btn elditor-formatAlign" data-key="start">
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 6h8m-8 4h12M6 14h8m-8 4h12"/>
                </svg>                  
            </button>
            <button class="elditor-btn elditor-formatAlign" data-key="center">
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 6h8M6 10h12M8 14h8M6 18h12"/>
                </svg>                  
            </button>
            <button class="elditor-btn elditor-formatAlign" data-key="justify">
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6H6m12 4H6m12 4H6m12 4H6"/>
                </svg>                  
            </button>
            <button class="elditor-btn elditor-formatAlign" data-key="end">
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6h-8m8 4H6m12 4h-8m8 4H6"/>
                </svg>                  
            </button>
        </div>
        <div id="elditor-editable" contenteditable="true"><p>Your content goes here</p></div>
    </div>
`

export class ElditorFunc{
    /**
     * tag available: strong, em, u, sub, sup, s
     * will automatically remove style if selection content has same type of style
     */
    formatText(tagName){
        return (new FormatText(null, null, tagName))
    }
    /**
     * type available: ol, ul
     * will automatically remove list if selection content has same type of list
     */
    formatList(type){
        return new FormatList(null, null, type)
    }
    /**
     * position available: justify, center, left, right
     */
    formatAlign(position){
        return new FormatAlign(null, null, position)
    }
    /**
     * types available: danger, warning, success, danger, info
     * to remove badge use 'nothing' as type
     */
    formatBadge(type){
        return new FormatBadge(null, null, type)
    }
    /**
     * tag available: H1, H2, H3, H4, H5, H6
     * will overwrite p, ul, li tag
     */
    formatHeading(tag){
        return new FormatHeading(null, null, tag)
    }
    /**
     * will ask for user input from browser prompt
     * this function is not fully developed yet, still an idea
     */
    formatLink(){
        return new FormatLink()
    }
    /**
     * blob ex: e.target.files[0], etc
     * if you want to save your img automatically to your server provide cb that returns {imagePath, apiDomain}, 
     * the name of image field is "uploadImage" in FormData, here's how you'd like to provide the cb:
     * async function imageCb(formData){
            const response = await axios.post('/upload/image', formData, {
            headers:{
                "Content-Type": "multipart/form-data"
            },
            withCredentials: true,
            })

            const data = response.data
            return {
                imagePath: data.imagePath, // ex: uploads/image.png
                apiDomain: <your domain name> // ex: https://example.com
            }
        }
     */
    formatImage(blob, cb){
        return new FormatImage(null, null, blob, cb)
    }
    
}

export class Elditor{
    /**
     * 
     * @param {HTMLElement} container 
     */
    constructor(container){
        container.innerHTML = template
        new MyLib('elditor-editable', {
            button: '.elditor-btn',
            formatText: '.elditor-formatText',
            formatHeading: '#elditor-formatHeading',
            formatImage: '#elditor-formatImage',
            formatList: '.elditor-formatList',
            formatLink: '#elditor-formatLink',
            formatAlign: '.elditor-formatAlign',
            formatBadge: '#elditor-formatBadge'
        })
    }
}
