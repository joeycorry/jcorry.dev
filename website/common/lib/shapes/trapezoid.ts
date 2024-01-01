import type { Point } from '~/common/lib/point';
import type { FixedArray } from '~/common/utils/array';
import type { LineData } from '~/common/utils/geometry';
import type { ValueOrMutableRef } from '~/common/utils/react';

import { Shape } from './shape';

export class Trapezoid extends Shape {
    #angle: number;
    #cachedBoundingPoints?: FixedArray<Point, 4>;
    #counterClockwise: boolean;
    #parallelLineDataPair: FixedArray<LineData, 2>;

    public constructor({
        angle,
        counterClockwise,
        parallelLineDataPair,
        ...shapeConstructorParameter
    }: {
        angle: number;
        canvasContext: CanvasRenderingContext2D;
        counterClockwise?: boolean;
        fillStyle?: ValueOrMutableRef<string>;
        lineWidth?: ValueOrMutableRef<number>;
        parallelLineDataPair: FixedArray<LineData, 2>;
        strokeStyle?: ValueOrMutableRef<string>;
    }) {
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

    get #boundingPoints(): FixedArray<Point, 4> {
        if (this.#cachedBoundingPoints !== undefined) {
            return this.#cachedBoundingPoints;
        }

        const [
            firstOriginalPoint,
            firstComputedPoint,
            secondOriginalPoint,
            secondComputedPoint,
        ] = this.#parallelLineDataPair.flatMap(({ length, point }) => [
            point,
            point.addAngleAndLength({
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
