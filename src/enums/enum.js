class Enum{

    /**
     * 
     * @param {String|Number} value 
     */
    constructor(value){
        if(typeof value === 'string'){
            value = value.toUpperCase()
        }
        this.value = value
        Object.freeze(this)
    }
}

Enum.prototype.toString = function(){
    return this.value
}

export default Enum