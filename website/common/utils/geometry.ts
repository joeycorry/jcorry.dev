import { modulo } from './math';

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

export type Position<DimensionType = number> = {
    x: DimensionType;
    y: DimensionType;
};

export function getDistance(first: Position, second: Position) {
    return ((second.x - first.x) ** 2 + (second.y - first.y) ** 2) ** 0.5;
}

type GetNewPositionParameter = {
    angle: number;
    counterClockwise?: boolean;
    length: number;
    startingPosition: Position;
};

export function getNewPosition({
    angle,
    counterClockwise = false,
    length,
    startingPosition,
}: GetNewPositionParameter) {
    const normalizedAngle = modulo(
        (counterClockwise ? -1 : 1) * angle,
        2 * Math.PI
    );

    return {
        x: startingPosition.x + getCosineOfRadians(normalizedAngle) * length,
        y: startingPosition.y + getSineOfRadians(normalizedAngle) * length,
    };
}
