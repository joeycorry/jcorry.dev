import CanvasRenderer from 'common/lib/canvasRenderer';
import Color from 'common/lib/color';
import Trapezoid from 'common/lib/shape/trapezoid';

import type { Tuple } from './miscellaneous';
import * as ShapeUtils from './shape';

export type AnimationDirection = 'backward' | 'forward';

export type AnimationOptions = {
    duration?: number;
    startingDirection?: AnimationDirection;
    startingPercentage?: number;
};

export type RendererOptions = {
    animation?: AnimationOptions;
    onFinish?: () => void;
};

type CreateMovingTrapezoidCanvasRendererParameter = RendererOptions & {
    angle: number;
    counterClockwise?: boolean;
    fillColor: Color;
    lineWidth?: number;
    parallelLineDataPair: Tuple<
        {
            startingPosition: ShapeUtils.Position;
            length: number;
        },
        2
    >;
    strokeColor: Color;
};

export function createMovingTrapezoidCanvasRenderer({
    angle,
    counterClockwise,
    fillColor,
    lineWidth,
    parallelLineDataPair,
    strokeColor,
    ...rendererOptions
}: CreateMovingTrapezoidCanvasRendererParameter) {
    const [firstStartingPosition, secondStartingPosition] =
        parallelLineDataPair.map(data => data.startingPosition);
    const maxLength = Math.max(
        ...parallelLineDataPair.map(data => data.length)
    );
    const [firstLength, secondLength] = Array(2).fill(maxLength);
    const [firstEndPosition, secondEndPosition] = parallelLineDataPair.map(
        data =>
            ShapeUtils.getNewPosition({
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
    const fillStyle = fillColor.toString();
    const strokeStyle = strokeColor.toString();

    return new CanvasRenderer(elapsedDurationPercentage => {
        const distancePercentage = 2 * elapsedDurationPercentage;
        const firstLineData =
            distancePercentage < 1
                ? {
                      length: ShapeUtils.getDistance(firstStartingPosition, {
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
                      length: ShapeUtils.getDistance(
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
                      length: ShapeUtils.getDistance(secondStartingPosition, {
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
                      length: ShapeUtils.getDistance(
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
                counterClockwise,
                fillStyle,
                lineWidth,
                parallelLineDataPair: [firstLineData, secondLineData],
                strokeStyle,
            }),
        ];
    }, rendererOptions);
}
