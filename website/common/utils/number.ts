export type Bounds = {
    minimum: number;
    maximum: number;
};

type BoundedRandomParameter = Bounds & {
    isInteger: boolean;
};

function boundedRandom({
    maximum,
    minimum,
    isInteger,
}: BoundedRandomParameter) {
    const actualMinimum = clamp({
        maximum: maximum + (isInteger ? 1 : 0),
        value: minimum,
    });
    const actualMaximum = clamp({
        minimum,
        value: maximum + (isInteger ? 1 : 0),
    });
    const floatResult =
        actualMinimum + Math.random() * (actualMaximum - actualMinimum);

    return isInteger ? Math.floor(floatResult) : floatResult;
}

export function boundedRandomFloat(bounds: Bounds) {
    return boundedRandom({ ...bounds, isInteger: false });
}

export function boundedRandomInteger(bounds: Bounds) {
    return boundedRandom({ ...bounds, isInteger: true });
}

type ClampParameter = Partial<Bounds> & {
    value: number;
};

export function clamp(parameter: ClampParameter) {
    const rawMinimum = parameter.minimum ?? Number.NEGATIVE_INFINITY;
    const rawMaximum = parameter.maximum ?? Number.POSITIVE_INFINITY;
    const [minimum, maximum] =
        rawMinimum <= rawMaximum
            ? [rawMinimum, rawMaximum]
            : [rawMaximum, rawMaximum];

    return Math.min(Math.max(parameter.value, minimum), maximum);
}

const cosLookupTable = new Map() as Map<number, number>;

export function cos(angle: number) {
    if (!cosLookupTable.has(angle)) {
        cosLookupTable.set(angle, Math.cos(angle));
    }

    return cosLookupTable.get(angle)!;
}

export function mod(first: number, second: number) {
    return ((first % second) + second) % second;
}

const sinLookupTable = new Map() as Map<number, number>;

export function sin(angle: number) {
    if (!sinLookupTable.has(angle)) {
        sinLookupTable.set(angle, Math.sin(angle));
    }

    return sinLookupTable.get(angle)!;
}
