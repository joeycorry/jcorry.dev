import type { Angle } from '~/common/lib/angle';

const cosineValuesByRadians = new Map<number, number>();

const sineValuesByRadians = new Map<number, number>();

function clampFloat(
    value: number,
    {
        maximum,
        minimum,
    }: {
        maximum?: number;
        minimum?: number;
    } = {},
): number {
    return clampNumber(value, { isInteger: false, maximum, minimum });
}

function clampInteger(
    value: number,
    {
        maximum,
        minimum,
    }: {
        maximum?: number;
        minimum?: number;
    } = {},
): number {
    return clampNumber(value, { isInteger: true, maximum, minimum });
}

function clampNumber(
    value: number,
    {
        isInteger,
        maximum: rawMaximum = Number.POSITIVE_INFINITY,
        minimum: rawMinimum = Number.NEGATIVE_INFINITY,
    }: {
        isInteger: boolean;
        maximum?: number;
        minimum?: number;
    },
): number {
    const [minimum, maximum] =
        rawMinimum <= rawMaximum
            ? [rawMinimum, rawMaximum]
            : [rawMaximum, rawMinimum];

    const floatResult = Math.min(Math.max(value, minimum), maximum);

    return isInteger ? Math.floor(floatResult) : floatResult;
}

function clampPercentage(percentage: number): number {
    return clampFloat(percentage, {
        maximum: 1,
        minimum: 0,
    });
}

function cosine(angle: Angle): number {
    const radians = angle.computeNormalizedRadians();

    if (!cosineValuesByRadians.has(radians)) {
        cosineValuesByRadians.set(radians, Math.cos(radians));
    }

    return cosineValuesByRadians.get(radians)!;
}

function getBoundedRandomFloat(minimum: number, maximum: number): number {
    return getBoundedRandomNumber(minimum, maximum, { isInteger: false });
}

function getBoundedRandomInteger(minimum: number, maximum: number): number {
    return getBoundedRandomNumber(minimum, maximum, { isInteger: true });
}

function getBoundedRandomNumber(
    minimum: number,
    maximum: number,
    {
        isInteger,
    }: {
        isInteger: boolean;
    },
): number {
    const actualMinimum = clampFloat(minimum, {
        maximum: maximum + (isInteger ? 1 : 0),
    });
    const actualMaximum = clampFloat(maximum + (isInteger ? 1 : 0), {
        minimum,
    });
    const floatResult =
        actualMinimum + Math.random() * (actualMaximum - actualMinimum);

    return isInteger ? Math.floor(floatResult) : floatResult;
}

function modulo(first: number, second: number): number {
    return ((first % second) + second) % second;
}

function sine(angle: Angle): number {
    const radians = angle.computeNormalizedRadians();

    if (!sineValuesByRadians.has(radians)) {
        sineValuesByRadians.set(radians, Math.sin(radians));
    }

    return sineValuesByRadians.get(radians)!;
}

export {
    clampFloat,
    clampInteger,
    clampPercentage,
    cosine,
    getBoundedRandomFloat,
    getBoundedRandomInteger,
    modulo,
    sine,
};
