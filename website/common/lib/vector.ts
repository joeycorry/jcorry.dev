import { getCosineOfRadians, getSineOfRadians } from '~/common/utils/geometry';
import { modulo } from '~/common/utils/math';

export class Vector {
    public constructor(
        public x: number,
        public y: number,
    ) {}

    public static fromAngleAndLength({
        angle,
        counterClockwise = false,
        length,
    }: {
        angle: number;
        counterClockwise?: boolean;
        length: number;
    }) {
        const normalizedAngle = modulo(
            (counterClockwise ? -1 : 1) * angle,
            2 * Math.PI,
        );

        return new Vector(
            getCosineOfRadians(normalizedAngle) * length,
            getSineOfRadians(normalizedAngle) * length,
        );
    }
}
