function getClampedNumber(parameter: {
    isInteger: boolean;
    maximum?: number;
    minimum?: number;
    value: number;
}) {
    const rawMinimum = parameter.minimum ?? Number.NEGATIVE_INFINITY;
    const rawMaximum = parameter.maximum ?? Number.POSITIVE_INFINITY;
    const [minimum, maximum] =
        rawMinimum <= rawMaximum
            ? [rawMinimum, rawMaximum]
            : [rawMaximum, rawMaximum];

    const floatResult = Math.min(Math.max(parameter.value, minimum), maximum);

    return parameter.isInteger ? Math.floor(floatResult) : floatResult;
}

export function getClampedFloat({
    maximum,
    minimum,
    value,
}: {
    maximum?: number;
    minimum?: number;
    value: number;
}) {
    return getClampedNumber({ isInteger: false, maximum, minimum, value });
}

export function getClampedInteger({
    maximum,
    minimum,
    value,
}: {
    maximum?: number;
    minimum?: number;
    value: number;
}) {
    return getClampedNumber({ isInteger: true, maximum, minimum, value });
}

export function getClampedPercentage(percentage: number) {
    return getClampedFloat({
        maximum: 1,
        minimum: 0,
        value: percentage,
    });
}

function getBoundedRandomNumber({
    maximum,
    minimum,
    isInteger,
}: {
    isInteger: boolean;
    maximum: number;
    minimum: number;
}) {
    const actualMinimum = getClampedFloat({
        maximum: maximum + (isInteger ? 1 : 0),
        value: minimum,
    });
    const actualMaximum = getClampedFloat({
        minimum,
        value: maximum + (isInteger ? 1 : 0),
    });
    const floatResult =
        actualMinimum + Math.random() * (actualMaximum - actualMinimum);

    return isInteger ? Math.floor(floatResult) : floatResult;
}

export function getBoundedRandomFloat({
    maximum,
    minimum,
}: {
    maximum: number;
    minimum: number;
}) {
    return getBoundedRandomNumber({ maximum, minimum, isInteger: false });
}

export function getBoundedRandomInteger({
    maximum,
    minimum,
}: {
    maximum: number;
    minimum: number;
}) {
    return getBoundedRandomNumber({ maximum, minimum, isInteger: true });
}
