import * as NumberUtils from './number';

export type Position<DimensionType = number> = {
    x: DimensionType;
    y: DimensionType;
};

export function clampPosition(position: Position) {
    return {
        x: NumberUtils.clamp({ minimum: 0, value: position.x }),
        y: NumberUtils.clamp({ minimum: 0, value: position.y }),
    };
}

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
    // Canvas coordinates are flipped along the y-axis compared to the traditional coordinate system.
    const normalizedAngle = NumberUtils.mod(
        (counterClockwise ? -1 : 1) * angle,
        2 * Math.PI
    );

    return {
        x: startingPosition.x + NumberUtils.cos(normalizedAngle) * length,
        y: startingPosition.y + NumberUtils.sin(normalizedAngle) * length,
    };
}
