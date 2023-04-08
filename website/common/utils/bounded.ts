export type Bounds = {
    minimum: number;
    maximum: number;
};

type GetBoundedRandomNumberParameter = Bounds & {
    isInteger: boolean;
};

function getBoundedRandomNumber({
    maximum,
    minimum,
    isInteger,
}: GetBoundedRandomNumberParameter) {
    const actualMinimum = getClampedNumber({
        maximum: maximum + (isInteger ? 1 : 0),
        value: minimum,
    });
    const actualMaximum = getClampedNumber({
        minimum,
        value: maximum + (isInteger ? 1 : 0),
    });
    const floatResult =
        actualMinimum + Math.random() * (actualMaximum - actualMinimum);

    return isInteger ? Math.floor(floatResult) : floatResult;
}

export function getBoundedRandomFloat(bounds: Bounds) {
    return getBoundedRandomNumber({ ...bounds, isInteger: false });
}

export function getBoundedRandomInteger(bounds: Bounds) {
    return getBoundedRandomNumber({ ...bounds, isInteger: true });
}

type GetClampedNumberParameter = Partial<Bounds> & {
    value: number;
};

export function getClampedNumber(parameter: GetClampedNumberParameter) {
    const rawMinimum = parameter.minimum ?? Number.NEGATIVE_INFINITY;
    const rawMaximum = parameter.maximum ?? Number.POSITIVE_INFINITY;
    const [minimum, maximum] =
        rawMinimum <= rawMaximum
            ? [rawMinimum, rawMaximum]
            : [rawMaximum, rawMaximum];

    return Math.min(Math.max(parameter.value, minimum), maximum);
}
