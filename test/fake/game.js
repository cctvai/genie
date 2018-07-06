import * as Sprite from "./sprite.js";

const Stub = {
    load: {
        json: () => {},
    },
    add: {
        sprite: () => {
            return Sprite.Stub();
        },
        group: () => {},
    },
    canvas: {
        setAttribute: () => {},
    },
    stage: {
        backgroundColor: "",
    },
    state: {
        current: {},
    },
    canvas: {
        parentElement: {
            appendChild: () => {},
        },
        setAttribute: () => {},
    },
};

export { Stub };
