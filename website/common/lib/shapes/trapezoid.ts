import type { Point } from '~/common/lib/point';
import type { FixedArray } from '~/common/utils/array';
import type { Line } from '~/common/utils/line';
import type { ValueOrSubject } from '~/common/utils/subject';

import { Shape } from './shape';

class Trapezoid extends Shape {
    #boundingPoints: FixedArray<Point, 4>;

    public constructor({
        linePair,
        ...shapeConstructorParameter
    }: {
        canvasContext: CanvasRenderingContext2D;
        fillStyle?: ValueOrSubject<string>;
        linePair: FixedArray<Line, 2>;
        lineWidth?: ValueOrSubject<number>;
        strokeStyle?: ValueOrSubject<string>;
    }) {
        super(shapeConstructorParameter);

        this.#boundingPoints = this.#computeBoundingPoints(linePair);
    }

    protected _computeNextPath(): Path2D {
        const path = new Path2D();
        const [firstBoundingPoint, ...remainingBoundingPoints] =
            this.#boundingPoints;

        path.moveTo(firstBoundingPoint.x, firstBoundingPoint.y);

        for (const point of remainingBoundingPoints) {
            path.lineTo(point.x, point.y);
        }

        return path;
    }

    #computeBoundingPoints(
        linePair: FixedArray<Line, 2>,
    ): FixedArray<Point, 4> {
        const [
            firstStartingPoint,
            firstEndingPoint,
            secondStartingPoint,
            secondEndingPoint,
        ] = linePair.flatMap(line => line);

        return [
            firstStartingPoint,
            firstEndingPoint,
            secondEndingPoint,
            secondStartingPoint,
        ];
    }
}

export { Trapezoid };
