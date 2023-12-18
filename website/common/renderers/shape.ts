import { Point } from '~/common/lib/point';
import { Renderer } from '~/common/lib/renderer';
import type { ShapeConstructorParameter } from '~/common/lib/shapes/shape';
import type { TrapezoidConstructorParameter } from '~/common/lib/shapes/trapezoid';
import { Trapezoid } from '~/common/lib/shapes/trapezoid';
import { easeLinear } from '~/common/utils/easing';
import { getSineOfRadians } from '~/common/utils/geometry';
import type { RendererOptions } from '~/common/utils/renderer';

type CreateMovingTrapezoidRendererParameter = RendererOptions &
    TrapezoidConstructorParameter;

export function createMovingTrapezoidRenderer({
    angle,
    canvasContext,
    counterClockwise,
    fillStyle,
    lineWidth,
    parallelLineDataPair,
    strokeStyle,
    ...rendererOptions
}: CreateMovingTrapezoidRendererParameter) {
    const [firstStartingPoint, secondStartingPoint] = parallelLineDataPair.map(
        data => data.startingPoint,
    );
    const maxLength = Math.max(
        ...parallelLineDataPair.map(data => data.length),
    );
    const [firstLength, secondLength] = Array(2).fill(maxLength);
    const [firstEndPoint, secondEndPoint] = parallelLineDataPair.map(
        ({ startingPoint }) =>
            startingPoint.addAngleAndLength({
                angle,
                counterClockwise,
                length: maxLength,
            }),
    );
    const firstXDistance = firstEndPoint.calculateXDistance(firstStartingPoint);
    const firstYDistance = firstEndPoint.calculateYDistance(firstStartingPoint);
    const secondXDistance =
        secondEndPoint.calculateXDistance(secondStartingPoint);
    const secondYDistance =
        secondEndPoint.calculateYDistance(secondStartingPoint);

    return new Renderer(({ currentAnimationPercentage }) => {
        const distancePercentage = 2 * easeLinear(currentAnimationPercentage);
        const firstLineData =
            distancePercentage < 1
                ? {
                      length: firstStartingPoint.calculateDistance(
                          new Point(
                              firstStartingPoint.x +
                                  distancePercentage * firstXDistance,
                              firstStartingPoint.y +
                                  distancePercentage * firstYDistance,
                          ),
                      ),
                      startingPoint: firstStartingPoint,
                  }
                : distancePercentage > 1
                  ? {
                        length: new Point(
                            firstEndPoint.x -
                                (2 - distancePercentage) * firstXDistance,

                            firstEndPoint.y -
                                (2 - distancePercentage) * firstYDistance,
                        ).calculateDistance(firstEndPoint),
                        startingPoint: new Point(
                            firstEndPoint.x -
                                (2 - distancePercentage) * firstXDistance,
                            firstEndPoint.y -
                                (2 - distancePercentage) * firstYDistance,
                        ),
                    }
                  : {
                        length: firstLength,
                        startingPoint: firstStartingPoint,
                    };
        const secondLineData =
            distancePercentage < 1
                ? {
                      length: secondStartingPoint.calculateDistance(
                          new Point(
                              secondStartingPoint.x +
                                  distancePercentage * secondXDistance,
                              secondStartingPoint.y +
                                  distancePercentage * secondYDistance,
                          ),
                      ),
                      startingPoint: secondStartingPoint,
                  }
                : distancePercentage > 1
                  ? {
                        length: new Point(
                            secondEndPoint.x -
                                (2 - distancePercentage) * secondXDistance,
                            secondEndPoint.y -
                                (2 - distancePercentage) * secondYDistance,
                        ).calculateDistance(secondEndPoint),
                        startingPoint: new Point(
                            secondEndPoint.x -
                                (2 - distancePercentage) * secondXDistance,
                            secondEndPoint.y -
                                (2 - distancePercentage) * secondYDistance,
                        ),
                    }
                  : {
                        length: secondLength,
                        startingPoint: secondStartingPoint,
                    };

        return [
            new Trapezoid({
                angle,
                canvasContext,
                counterClockwise,
                fillStyle,
                lineWidth,
                parallelLineDataPair: [firstLineData, secondLineData],
                strokeStyle,
            }),
        ];
    }, rendererOptions);
}

type CreateMovingRibbonRendererParameter = {
    animationDurationScalar: number;
    animationStartingDirection: 'alternate' | 'alternate-reverse';
    canvasContext: CanvasRenderingContext2D;
    directionAngle: number;
    fillStyle: NonNullable<ShapeConstructorParameter['fillStyle']>;
    firstRibbonLineStartingPoint: Point;
    getYLength: (point: Point) => number;
    secondRibbonLineStartingPoint: Point;
    strokeStyle: NonNullable<ShapeConstructorParameter['strokeStyle']>;
    xAxisAdjacentAngle: number;
};

export function createMovingRibbonRenderer({
    animationDurationScalar,
    animationStartingDirection,
    canvasContext,
    directionAngle,
    fillStyle,
    firstRibbonLineStartingPoint,
    getYLength,
    secondRibbonLineStartingPoint,
    strokeStyle,
    xAxisAdjacentAngle,
}: CreateMovingRibbonRendererParameter) {
    const sineOfXAxisAdjacentAngle = getSineOfRadians(xAxisAdjacentAngle);
    const firstLength =
        getYLength(firstRibbonLineStartingPoint) / sineOfXAxisAdjacentAngle;
    const secondLength =
        getYLength(secondRibbonLineStartingPoint) / sineOfXAxisAdjacentAngle;

    return createMovingTrapezoidRenderer({
        angle: directionAngle,
        animationDuration:
            Math.max(firstLength, secondLength) * animationDurationScalar,
        animationIterationCount: Number.POSITIVE_INFINITY,
        animationStartingDirection,
        canvasContext,
        fillStyle,
        parallelLineDataPair: [
            {
                length: firstLength,
                startingPoint: firstRibbonLineStartingPoint,
            },
            {
                length: secondLength,
                startingPoint: secondRibbonLineStartingPoint,
            },
        ],
        strokeStyle,
    });
}
