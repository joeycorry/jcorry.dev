import { Renderer } from '~/common/lib/renderer';
import { Trapezoid } from '~/common/lib/shape/trapezoid';

import type { ColorVariantCssName } from './color';
import type { EasingFunction } from './easing';
import { getDistance, getNewPosition, Position } from './geometry';
import type { Tuple } from './tuple';

export type RendererAnimationIterationCount = number;

export type RendererStartingAnimationDirection =
    | 'alternate'
    | 'alternate-reverse'
    | 'backward'
    | 'forward';

export type RendererAnimationOptions = {
    duration?: number;
    iterationCount?: RendererAnimationIterationCount;
    startingDirection?: RendererStartingAnimationDirection;
};

export type RendererOptions = {
    animation?: RendererAnimationOptions;
};

type CreateMovingTrapezoidRendererParameter = RendererOptions & {
    angle: number;
    canvasContext: CanvasRenderingContext2D;
    colorVariantCssName: ColorVariantCssName;
    counterClockwise?: boolean;
    easingFunction: EasingFunction;
    lineWidth?: number;
    parallelLineDataPair: Tuple<
        {
            startingPosition: Position;
            length: number;
        },
        2
    >;
};

export function createMovingTrapezoidRenderer({
    angle,
    canvasContext,
    colorVariantCssName,
    counterClockwise,
    easingFunction,
    lineWidth,
    parallelLineDataPair,
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
    const rootElement = window.document.documentElement;

    return new Renderer(elapsedDurationPercentage => {
        const fillStyle =
            rootElement.style.getPropertyValue(colorVariantCssName);
        const strokeStyle =
            rootElement.style.getPropertyValue(colorVariantCssName);
        const distancePercentage =
            2 * easingFunction(elapsedDurationPercentage);
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
