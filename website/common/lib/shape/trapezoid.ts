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
    private positions: MiscellaneousUtils.Tuple<ShapeUtils.Position, 4>;

    constructor({
        angle,
        counterClockwise,
        fillStyle,
        lineWidth,
        parallelLineDataPair,
        strokeStyle,
    }: TrapezoidConstructorParameter) {
        super({ lineWidth, fillStyle, strokeStyle });

        this.positions = Trapezoid._getPositions({
            angle,
            counterClockwise,
            parallelLineDataPair,
        });
    }

    protected _performRender(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.moveTo(this.positions[0].x, this.positions[0].y);

        for (const position of this.positions.slice(1)) {
            context.lineTo(position.x, position.y);
        }

        context.closePath();
        context.stroke();
        context.fill();
    }

    private static _getPositions({
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
