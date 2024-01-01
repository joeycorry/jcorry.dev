import { Point } from '~/common/lib/point';
import { Renderer } from '~/common/lib/renderer';
import { Trapezoid } from '~/common/lib/shapes/trapezoid';
import type { FixedArray } from '~/common/utils/array';
import { easeLinear } from '~/common/utils/easing';
import type { LineData } from '~/common/utils/geometry';
import { getSineOfRadians } from '~/common/utils/geometry';
import type { ValueOrMutableRef } from '~/common/utils/react';
import type {
    RendererAnimationMountingDirection,
    RendererAnimationStartingDirection,
} from '~/common/utils/renderer';

function createMovingRibbonRenderer({
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
}: {
    animationDurationScalar: number;
    animationStartingDirection: RendererAnimationMountingDirection;
    canvasContext: CanvasRenderingContext2D;
    directionAngle: number;
    fillStyle: ValueOrMutableRef<string>;
    firstRibbonLineStartingPoint: Point;
    getYLength: (point: Point) => number;
    secondRibbonLineStartingPoint: Point;
    strokeStyle: ValueOrMutableRef<string>;
    xAxisAdjacentAngle: number;
}) {
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
                point: firstRibbonLineStartingPoint,
            },
            {
                length: secondLength,
                point: secondRibbonLineStartingPoint,
            },
        ],
        strokeStyle,
    });
}

function createMovingTrapezoidRenderer({
    angle,
    canvasContext,
    counterClockwise,
    fillStyle,
    lineWidth,
    parallelLineDataPair,
    strokeStyle,
    ...rendererOptions
}: {
    angle: number;
    animationDuration: number;
    animationIterationCount?: number;
    animationStartingDirection?: RendererAnimationStartingDirection;
    canvasContext: CanvasRenderingContext2D;
    counterClockwise?: boolean;
    fillStyle?: ValueOrMutableRef<string>;
    lineWidth?: ValueOrMutableRef<number>;
    parallelLineDataPair: FixedArray<LineData, 2>;
    strokeStyle?: ValueOrMutableRef<string>;
}) {
    const [firstStartingPoint, secondStartingPoint] = parallelLineDataPair.map(
        data => data.point,
    );
    const maxLength = Math.max(
        ...parallelLineDataPair.map(data => data.length),
    );
    const [firstLength, secondLength] = Array(2).fill(maxLength);
    const [firstEndPoint, secondEndPoint] = parallelLineDataPair.map(
        ({ point }) =>
            point.addAngleAndLength({
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
                      point: firstStartingPoint,
                  }
                : distancePercentage > 1
                  ? {
                        length: new Point(
                            firstEndPoint.x -
                                (2 - distancePercentage) * firstXDistance,

                            firstEndPoint.y -
                                (2 - distancePercentage) * firstYDistance,
                        ).calculateDistance(firstEndPoint),
                        point: new Point(
                            firstEndPoint.x -
                                (2 - distancePercentage) * firstXDistance,
                            firstEndPoint.y -
                                (2 - distancePercentage) * firstYDistance,
                        ),
                    }
                  : {
                        length: firstLength,
                        point: firstStartingPoint,
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
                      point: secondStartingPoint,
                  }
                : distancePercentage > 1
                  ? {
                        length: new Point(
                            secondEndPoint.x -
                                (2 - distancePercentage) * secondXDistance,
                            secondEndPoint.y -
                                (2 - distancePercentage) * secondYDistance,
                        ).calculateDistance(secondEndPoint),
                        point: new Point(
                            secondEndPoint.x -
                                (2 - distancePercentage) * secondXDistance,
                            secondEndPoint.y -
                                (2 - distancePercentage) * secondYDistance,
                        ),
                    }
                  : {
                        length: secondLength,
                        point: secondStartingPoint,
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

export { createMovingRibbonRenderer, createMovingTrapezoidRenderer };
