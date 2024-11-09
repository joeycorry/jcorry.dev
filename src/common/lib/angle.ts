import { cosine, modulo, sine } from '~/common/utils/math';

import { Vector } from './vector';

class Angle {
    #counterClockwise: boolean;
    #radians: number;

    public constructor({
        counterClockwise = false,
        radians,
    }: {
        counterClockwise?: boolean;
        radians: number;
    }) {
        this.#counterClockwise = counterClockwise;
        this.#radians = radians;
    }

    public computeNormalizedRadians(): number {
        return modulo(
            (this.#counterClockwise ? -1 : 1) * this.#radians,
            2 * Math.PI,
        );
    }

    public toOpposed(): Angle {
        return new Angle({
            counterClockwise: false,
            radians: 2 * Math.PI - this.computeNormalizedRadians(),
        });
    }

    public toSubtracted(angle: Angle): Angle {
        const radians = modulo(
            this.computeNormalizedRadians() - angle.computeNormalizedRadians(),
            2 * Math.PI,
        );

        return new Angle({
            counterClockwise: false,
            radians,
        });
    }

    public toVector(length: number): Vector {
        return new Vector(length * cosine(this), length * sine(this));
    }
}

export { Angle };
