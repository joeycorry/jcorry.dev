import type { Point } from '~/common/lib/point';
import type { Tuple } from '~/common/utils/tuple';

import type { ShapeConstructorParameter } from './shape';
import { Shape } from './shape';

type ParallelLineDataPair = Tuple<
    {
        startingPoint: Point;
        length: number;
    },
    2
>;

export type TrapezoidConstructorParameter = ShapeConstructorParameter & {
    angle: number;
    counterClockwise?: boolean;
    parallelLineDataPair: ParallelLineDataPair;
};

export class Trapezoid extends Shape {
    #angle: number;
    #cachedBoundingPoints?: Tuple<Point, 4>;
    #counterClockwise: boolean;
    #parallelLineDataPair: ParallelLineDataPair;

    public constructor({
        angle,
        counterClockwise,
        parallelLineDataPair,
        ...shapeConstructorParameter
    }: TrapezoidConstructorParameter) {
        super(shapeConstructorParameter);

        this.#angle = angle;
        this.#counterClockwise = counterClockwise ?? false;
        this.#parallelLineDataPair = parallelLineDataPair;
    }

    protected _calculateNextPath() {
        const path = new Path2D();

        path.moveTo(this.#boundingPoints[0].x, this.#boundingPoints[0].y);

        for (const point of this.#boundingPoints.slice(1)) {
            path.lineTo(point.x, point.y);
        }

        return path;
    }

    get #boundingPoints(): Tuple<Point, 4> {
        if (this.#cachedBoundingPoints !== undefined) {
            return this.#cachedBoundingPoints;
        }

        const [
            firstOriginalPoint,
            firstComputedPoint,
            secondOriginalPoint,
            secondComputedPoint,
        ] = this.#parallelLineDataPair.flatMap(({ length, startingPoint }) => [
            startingPoint,
            startingPoint.addAngleAndLength({
                angle: this.#angle,
                counterClockwise: this.#counterClockwise,
                length,
            }),
        ]);

        this.#cachedBoundingPoints = [
            firstOriginalPoint,
            firstComputedPoint,
            secondComputedPoint,
            secondOriginalPoint,
        ];

        return this.#cachedBoundingPoints;
    }
}
