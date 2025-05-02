import Enum from "./enum.js";

const ElementEnum = Object.freeze({
    P: new Enum('P'),
    OL: new Enum('OL'),
    UL: new Enum('UL'),
    LI: new Enum('LI'),
    STRONG: new Enum('STRONG'),
    EM: new Enum('EM'),
    U: new Enum('U'),
    S: new Enum('S'),
    SUP: new Enum('SUP'),
    SUB: new Enum('SUB'),
})

export default ElementEnum