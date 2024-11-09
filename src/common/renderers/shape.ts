import type { Angle } from '~/common/lib/angle';
import type { Point } from '~/common/lib/point';
import { Renderer } from '~/common/lib/renderer';
import { Trapezoid } from '~/common/lib/shapes/trapezoid';
import { Vector } from '~/common/lib/vector';
import type { FixedArray } from '~/common/utils/array';
import { easeLinear } from '~/common/utils/easing';
import type { Line } from '~/common/utils/line';
import { sine } from '~/common/utils/math';
import type { RendererAnimationStartingDirection } from '~/common/utils/renderer';
import type { ValueOrSubject } from '~/common/utils/subject';

function createMovingRibbonRenderer({
    animationDurationScalar,
    animationStartingDirection,
    canvasContext,
    directionAngle,
    fillStyle,
    getYLength,
    startingPointPair,
    strokeStyle,
    xAxisAdjacentAngle,
}: {
    animationDurationScalar: number;
    animationStartingDirection?: RendererAnimationStartingDirection;
    canvasContext: CanvasRenderingContext2D;
    directionAngle: Angle;
    fillStyle: ValueOrSubject<string>;
    getYLength: (point: Point) => number;
    startingPointPair: FixedArray<Point, 2>;
    strokeStyle: ValueOrSubject<string>;
    xAxisAdjacentAngle: Angle;
}): Renderer {
    const sineOfXAxisAdjacentAngle = sine(xAxisAdjacentAngle);
    const [firstStartingPoint, secondStartingPoint] = startingPointPair;
    const firstLength =
        getYLength(firstStartingPoint) / sineOfXAxisAdjacentAngle;
    const secondLength =
        getYLength(secondStartingPoint) / sineOfXAxisAdjacentAngle;
    const animationDuration =
        Math.max(firstLength, secondLength) * animationDurationScalar;
    const maxLength = Math.max(firstLength, secondLength);
    const firstEndingPoint = firstStartingPoint.toSummed({
        angle: directionAngle,
        length: maxLength,
    });
    const secondEndingPoint = secondStartingPoint.toSummed({
        angle: directionAngle,
        length: maxLength,
    });
    const firstXDistance =
        firstEndingPoint.calculateXDistanceTo(firstStartingPoint);
    const firstYDistance =
        firstEndingPoint.calculateYDistanceTo(firstStartingPoint);
    const secondXDistance =
        secondEndingPoint.calculateXDistanceTo(secondStartingPoint);
    const secondYDistance =
        secondEndingPoint.calculateYDistanceTo(secondStartingPoint);

    return new Renderer({
        animationDuration,
        animationIterationCount: Number.POSITIVE_INFINITY,
        animationStartingDirection,
        computeNextRenderables({ currentAnimationPercentage }) {
            const distancePercentage =
                2 * easeLinear(currentAnimationPercentage);
            const firstLine: Line =
                distancePercentage < 1
                    ? [
                          firstStartingPoint,
                          firstStartingPoint.toSummed(
                              new Vector(
                                  distancePercentage * firstXDistance,
                                  distancePercentage * firstYDistance,
                              ),
                          ),
                      ]
                    : distancePercentage > 1
                      ? [
                            firstEndingPoint.toSubtracted(
                                new Vector(
                                    (2 - distancePercentage) * firstXDistance,
                                    (2 - distancePercentage) * firstYDistance,
                                ),
                            ),
                            firstEndingPoint,
                        ]
                      : [firstStartingPoint, firstEndingPoint];
            const secondLine: Line =
                distancePercentage < 1
                    ? [
                          secondStartingPoint,
                          secondStartingPoint.toSummed(
                              new Vector(
                                  distancePercentage * secondXDistance,
                                  distancePercentage * secondYDistance,
                              ),
                          ),
                      ]
                    : distancePercentage > 1
                      ? [
                            secondEndingPoint.toSubtracted(
                                new Vector(
                                    (2 - distancePercentage) * secondXDistance,
                                    (2 - distancePercentage) * secondYDistance,
                                ),
                            ),
                            secondEndingPoint,
                        ]
                      : [secondStartingPoint, secondEndingPoint];

            return [
                new Trapezoid({
                    canvasContext,
                    fillStyle,
                    linePair: [firstLine, secondLine],
                    strokeStyle,
                }),
            ];
        },
    });
}

export { createMovingRibbonRenderer };
