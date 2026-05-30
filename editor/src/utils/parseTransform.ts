const TRANSFORM_SPLITTER = new RegExp(/\s*(.+?)\((.*?)\)/g);

const TRANSFORMATIONS = [
    "rotate",
    "rotateX",
    "rotateY",
    "rotate3d",
    "translate",
    "translate3d",
    "translateX",
    "translateY",
    "scale",
    "scale3d",
    "scaleX",
    "scaleY",
];

const Default = {
    translate: { x: 0, y: 0 },
    rotate: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1 },
};

const TRANSFORMATION_MAP = {
    scale: (v) => ({ scale: v }),
    scale3d: ({ x, y, z }) => ({ scale: { x, y, z } }),
    scaleX: (x) => ({ scale: { x, y: Default.scale.y } }),
    scaleY: (y) => ({ scale: { y, x: Default.scale.x } }),

    translate: ({ x, y }) => ({ translate: { x, y } }),
    translate3d: ({ x, y, z }) => ({ translate: { x, y, z } }),
    translateX: (x) => ({ translate: { x, y: Default.translate.y } }),
    translateY: (y) => ({ translate: { y, x: Default.translate.x } }),

    rotate: (z) => ({ rotate: { ...Default.rotate, z } }),
    rotate3d: ({ x, y, z }) => ({ rotate: { x, y, z } }),
    rotateX: (x) => ({ rotate: { ...Default.rotate, x } }),
    rotateY: (y) => ({ rotate: { ...Default.rotate, y } }),
};

function convertTransformValue(property, stringValue) {
    const [x, y, z] = stringValue.split(",").map(parseFloat);

    if (
        property === "rotate" ||
        property === "rotateX" ||
        property === "rotateY"
    ) {
        // single parameter
        return stringValue.slice(-3) === "rad" ? x * (180 / Math.PI) : x;
    }

    if (
        property === "scale3d" ||
        property === "translate3d" ||
        property === "rotate3d"
    ) {
        return { x, y, z };
    }

    if (property === "translate") {
        return { x, y: y ?? Default.translate.y };
    }

    // translateX, translateY, scale, scaleX, scaleY,
    // single parameter
    return x;
}

export function parseTransformString(text) {
    let match;
    let result = JSON.parse(JSON.stringify(Default));

    while ((match = TRANSFORM_SPLITTER.exec(text)) !== null) {
        const property = match[1];
        const value = convertTransformValue(property, match[2]);

        if (TRANSFORMATIONS.includes(property)) {
            const data = TRANSFORMATION_MAP[property](value);
            result = { ...result, ...data };
        }
    }

    return result;
} 