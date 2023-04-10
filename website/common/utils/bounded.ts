export type Bounds = {
    minimum: number;
    maximum: number;
};

type GetClampedNumberParameter = Partial<Bounds> & {
    isInteger: boolean;
    value: number;
};

function getClampedNumber(parameter: GetClampedNumberParameter) {
    const rawMinimum = parameter.minimum ?? Number.NEGATIVE_INFINITY;
    const rawMaximum = parameter.maximum ?? Number.POSITIVE_INFINITY;
    const [minimum, maximum] =
        rawMinimum <= rawMaximum
            ? [rawMinimum, rawMaximum]
            : [rawMaximum, rawMaximum];

    const floatResult = Math.min(Math.max(parameter.value, minimum), maximum);

    return parameter.isInteger ? Math.floor(floatResult) : floatResult;
}

export function getClampedFloat(
    parameter: Omit<GetClampedNumberParameter, 'isInteger'>
) {
    return getClampedNumber({ ...parameter, isInteger: false });
}

export function getClampedInteger(
    parameter: Omit<GetClampedNumberParameter, 'isInteger'>
) {
    return getClampedNumber({ ...parameter, isInteger: true });
}

export function getClampedPercentage(percentage: number) {
    return getClampedFloat({
        minimum: 0,
        maximum: 1,
        value: percentage,
    });
}

type GetBoundedRandomNumberParameter = Bounds & {
    isInteger: boolean;
};

function getBoundedRandomNumber({
    maximum,
    minimum,
    isInteger,
}: GetBoundedRandomNumberParameter) {
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

export function getBoundedRandomFloat(
    parameter: Omit<GetBoundedRandomNumberParameter, 'isInteger'>
) {
    return getBoundedRandomNumber({ ...parameter, isInteger: false });
}

export function getBoundedRandomInteger(
    parameter: Omit<GetBoundedRandomNumberParameter, 'isInteger'>
) {
    return getBoundedRandomNumber({ ...parameter, isInteger: true });
}
