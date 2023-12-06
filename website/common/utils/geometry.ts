const cosineValuesByRadians = new Map<number, number>();

export function getCosineOfRadians(radians: number) {
    if (!cosineValuesByRadians.has(radians)) {
        cosineValuesByRadians.set(radians, Math.cos(radians));
    }

    return cosineValuesByRadians.get(radians)!;
}

const sineValuesByRadians = new Map<number, number>();

export function getSineOfRadians(radians: number) {
    if (!sineValuesByRadians.has(radians)) {
        sineValuesByRadians.set(radians, Math.sin(radians));
    }

    return sineValuesByRadians.get(radians)!;
}
