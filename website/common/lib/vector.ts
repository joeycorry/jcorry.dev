import { getCosineOfRadians, getSineOfRadians } from '~/common/utils/geometry';
import { modulo } from '~/common/utils/math';

export type VectorStaticFromAngleAndLengthParameter = {
    angle: number;
    counterClockwise?: boolean;
    length: number;
};

export class Vector {
    constructor(public x: number, public y: number) {}

    public static fromAngleAndLength({
        angle,
        counterClockwise = false,
        length,
    }: VectorStaticFromAngleAndLengthParameter) {
        const normalizedAngle = modulo(
            (counterClockwise ? -1 : 1) * angle,
            2 * Math.PI
        );

        return new Vector(
            getCosineOfRadians(normalizedAngle) * length,
            getSineOfRadians(normalizedAngle) * length
        );
    }
}
