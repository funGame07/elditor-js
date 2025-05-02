import Enum from "./enum.js";

const PresedenceEnum = Object.freeze({
    P: new Enum(0),
    OL: new Enum(0),
    UL: new Enum(0),
    LI: new Enum(2),
    H1: new Enum(3),
    H2: new Enum(3),
    H3: new Enum(3),
    H4: new Enum(3),
    H5: new Enum(3),
    H6: new Enum(3),
    A: new Enum(4),
    STRONG: new Enum(5),
    EM: new Enum(6),
    U: new Enum(7),
    S: new Enum(8),
    SUP: new Enum(9),
    SUB: new Enum(10),
    '#text': new Enum(11)
})

export default PresedenceEnum