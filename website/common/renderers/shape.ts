import { Renderer } from '~/common/lib/renderer';
import type { ShapeConstructorParameter } from '~/common/lib/shapes/shape';
import type { TrapezoidConstructorParameter } from '~/common/lib/shapes/trapezoid';
import { Trapezoid } from '~/common/lib/shapes/trapezoid';
import { easeLinear } from '~/common/utils/easing';
import type { Position } from '~/common/utils/geometry';
import {
    getDistance,
    getNewPosition,
    getSineOfRadians,
} from '~/common/utils/geometry';
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
    const [firstStartingPosition, secondStartingPosition] =
        parallelLineDataPair.map(data => data.startingPosition);
    const maxLength = Math.max(
        ...parallelLineDataPair.map(data => data.length)
    );
    const [firstLength, secondLength] = Array(2).fill(maxLength);
    const [firstEndPosition, secondEndPosition] = parallelLineDataPair.map(
        data =>
            getNewPosition({
                angle,
                counterClockwise,
                length: maxLength,
                startingPosition: data.startingPosition,
            })
    );
    const firstXDistance = firstEndPosition.x - firstStartingPosition.x;
    const firstYDistance = firstEndPosition.y - firstStartingPosition.y;
    const secondXDistance = secondEndPosition.x - secondStartingPosition.x;
    const secondYDistance = secondEndPosition.y - secondStartingPosition.y;

    return new Renderer(({ currentAnimationPercentage }) => {
        const distancePercentage = 2 * easeLinear(currentAnimationPercentage);
        const firstLineData =
            distancePercentage < 1
                ? {
                      length: getDistance(firstStartingPosition, {
                          x:
                              firstStartingPosition.x +
                              distancePercentage * firstXDistance,
                          y:
                              firstStartingPosition.y +
                              distancePercentage * firstYDistance,
                      }),
                      startingPosition: firstStartingPosition,
                  }
                : distancePercentage > 1
                ? {
                      length: getDistance(
                          {
                              x:
                                  firstEndPosition.x -
                                  (2 - distancePercentage) * firstXDistance,
                              y:
                                  firstEndPosition.y -
                                  (2 - distancePercentage) * firstYDistance,
                          },
                          firstEndPosition
                      ),
                      startingPosition: {
                          x:
                              firstEndPosition.x -
                              (2 - distancePercentage) * firstXDistance,
                          y:
                              firstEndPosition.y -
                              (2 - distancePercentage) * firstYDistance,
                      },
                  }
                : {
                      length: firstLength,
                      startingPosition: firstStartingPosition,
                  };
        const secondLineData =
            distancePercentage < 1
                ? {
                      length: getDistance(secondStartingPosition, {
                          x:
                              secondStartingPosition.x +
                              distancePercentage * secondXDistance,
                          y:
                              secondStartingPosition.y +
                              distancePercentage * secondYDistance,
                      }),
                      startingPosition: secondStartingPosition,
                  }
                : distancePercentage > 1
                ? {
                      length: getDistance(
                          {
                              x:
                                  secondEndPosition.x -
                                  (2 - distancePercentage) * secondXDistance,
                              y:
                                  secondEndPosition.y -
                                  (2 - distancePercentage) * secondYDistance,
                          },
                          secondEndPosition
                      ),
                      startingPosition: {
                          x:
                              secondEndPosition.x -
                              (2 - distancePercentage) * secondXDistance,
                          y:
                              secondEndPosition.y -
                              (2 - distancePercentage) * secondYDistance,
                      },
                  }
                : {
                      length: secondLength,
                      startingPosition: secondStartingPosition,
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
    firstRibbonLineStartingPosition: Position;
    getYLength: (position: Position) => number;
    secondRibbonLineStartingPosition: Position;
    strokeStyle: NonNullable<ShapeConstructorParameter['strokeStyle']>;
    xAxisAdjacentAngle: number;
};

export function createMovingRibbonRenderer({
    animationDurationScalar,
    animationStartingDirection,
    canvasContext,
    directionAngle,
    fillStyle,
    firstRibbonLineStartingPosition,
    getYLength,
    secondRibbonLineStartingPosition,
    strokeStyle,
    xAxisAdjacentAngle,
}: CreateMovingRibbonRendererParameter) {
    const sineOfXAxisAdjacentAngle = getSineOfRadians(xAxisAdjacentAngle);
    const firstLength =
        getYLength(firstRibbonLineStartingPosition) / sineOfXAxisAdjacentAngle;
    const secondLength =
        getYLength(secondRibbonLineStartingPosition) / sineOfXAxisAdjacentAngle;

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
                startingPosition: firstRibbonLineStartingPosition,
            },
            {
                length: secondLength,
                startingPosition: secondRibbonLineStartingPosition,
            },
        ],
        strokeStyle,
    });
}
