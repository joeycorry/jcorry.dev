import type { Point } from '~/common/lib/point';

type LineData = {
    length: number;
    point: Point;
};

const cosineValuesByRadians = new Map<number, number>();

const sineValuesByRadians = new Map<number, number>();

function getCosineOfRadians(radians: number) {
    if (!cosineValuesByRadians.has(radians)) {
        cosineValuesByRadians.set(radians, Math.cos(radians));
    }

    return cosineValuesByRadians.get(radians)!;
}

function getSineOfRadians(radians: number) {
    if (!sineValuesByRadians.has(radians)) {
        sineValuesByRadians.set(radians, Math.sin(radians));
    }

    return sineValuesByRadians.get(radians)!;
}

export type { LineData };
export { getCosineOfRadians, getSineOfRadians };
