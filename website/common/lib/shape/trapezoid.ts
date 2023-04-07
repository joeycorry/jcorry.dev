import * as MiscellaneousUtils from 'common/utils/miscellaneous';
import * as ShapeUtils from 'common/utils/shape';

import Shape, { ShapeConstructorParameter } from '.';

type TrapezoidGetPositionsParameter = {
    angle: number;
    counterClockwise?: boolean;
    parallelLineDataPair: MiscellaneousUtils.Tuple<
        {
            startingPosition: ShapeUtils.Position;
            length: number;
        },
        2
    >;
};

type TrapezoidConstructorParameter = ShapeConstructorParameter &
    TrapezoidGetPositionsParameter;

export default class Trapezoid extends Shape {
    #positions: MiscellaneousUtils.Tuple<ShapeUtils.Position, 4>;

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
    }: TrapezoidGetPositionsParameter) {
        const [
            firstOriginalPosition,
            firstComputedPosition,
            secondOriginalPosition,
            secondComputedPosition,
        ] = parallelLineDataPair.flatMap(data => [
            data.startingPosition,
            ShapeUtils.getNewPosition({
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
        ] as MiscellaneousUtils.Tuple<ShapeUtils.Position, 4>;
    }
}
