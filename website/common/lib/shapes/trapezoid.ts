import type { Position } from '~/common/utils/geometry';
import { getNewPosition } from '~/common/utils/geometry';
import type { Tuple } from '~/common/utils/tuple';

import type { ShapeConstructorParameter } from './shape';
import { Shape } from './shape';

type TrapezoidGetPositionsParameter = {
    angle: number;
    counterClockwise?: boolean;
    parallelLineDataPair: Tuple<
        {
            startingPosition: Position;
            length: number;
        },
        2
    >;
};

type TrapezoidConstructorParameter = ShapeConstructorParameter &
    TrapezoidGetPositionsParameter;

export class Trapezoid extends Shape {
    #positions: Tuple<Position, 4>;

    constructor({
        angle,
        canvasContext,
        counterClockwise,
        fillStyle,
        lineWidth,
        parallelLineDataPair,
        strokeStyle,
    }: TrapezoidConstructorParameter) {
        super({ canvasContext, lineWidth, fillStyle, strokeStyle });

        this.#positions = this.#getPositions({
            angle,
            counterClockwise,
            parallelLineDataPair,
        });
    }

    protected _performRender() {
        this._canvasContext.beginPath();
        this._canvasContext.moveTo(this.#positions[0].x, this.#positions[0].y);

        for (const position of this.#positions.slice(1)) {
            this._canvasContext.lineTo(position.x, position.y);
        }

        this._canvasContext.closePath();
        this._canvasContext.stroke();
        this._canvasContext.fill();
    }

    #getPositions({
        angle,
        counterClockwise,
        parallelLineDataPair,
    }: TrapezoidGetPositionsParameter): Tuple<Position, 4> {
        const [
            firstOriginalPosition,
            firstComputedPosition,
            secondOriginalPosition,
            secondComputedPosition,
        ] = parallelLineDataPair.flatMap(data => [
            data.startingPosition,
            getNewPosition({
                angle,
                counterClockwise,
                ...data,
            }),
        ]);

        return [
            firstOriginalPosition,
            firstComputedPosition,
            secondComputedPosition,
            secondOriginalPosition,
        ];
    }
}
