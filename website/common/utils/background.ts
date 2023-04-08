import type { Color } from '~/common/lib/color';
import type { Renderer } from '~/common/lib/renderer';
import { getRendererManager } from '~/common/lib/rendererManager';

import { getArrayElementAtIndex } from './array';
import type { Bounds } from './bounded';
import { getBoundedRandomInteger } from './bounded';
import { evaluateFunction } from './function';
import type { Position } from './geometry';
import { getSineOfRadians } from './geometry';
import { createMovingTrapezoidRenderer } from './renderer';

type GetbackgroundRendererControlsParameter = {
    canvasContext: CanvasRenderingContext2D;
    directionAngle: number;
    color: Color;
    firstRibbonLineStartingPosition: Position;
    getYLength: (position: Position) => number;
    secondRibbonLineStartingPosition: Position;
    xAxisAdjacentAngle: number;
};

function getBackgroundRendererControls({
    canvasContext,
    directionAngle,
    color,
    firstRibbonLineStartingPosition,
    getYLength,
    secondRibbonLineStartingPosition,
    xAxisAdjacentAngle,
}: GetbackgroundRendererControlsParameter) {
    const rendererManager = getRendererManager();
    const sineOfXAxisAdjacentAngle = getSineOfRadians(xAxisAdjacentAngle);
    let maybeRenderer: Renderer | undefined;

    const addToManager = () => {
        const firstLength =
            getYLength(firstRibbonLineStartingPosition) /
            sineOfXAxisAdjacentAngle;
        const secondLength =
            getYLength(secondRibbonLineStartingPosition) /
            sineOfXAxisAdjacentAngle;

        maybeRenderer = createMovingTrapezoidRenderer({
            angle: directionAngle,
            animation: {
                duration:
                    Math.max(firstLength, secondLength) *
                    getBoundedRandomInteger({
                        minimum: 4,
                        maximum: 10,
                    }),
                iterationCount: 'infinite',
                startingDirection:
                    Math.random() < 0.5 ? 'alternate' : 'alternate-reverse',
            },
            canvasContext,
            fillColor: color,
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
            strokeColor: color,
        });

        rendererManager.addRenderer(maybeRenderer);
    };

    const removeFromManager = () => {
        if (maybeRenderer !== undefined) {
            rendererManager.removeRenderer(maybeRenderer);
        }
    };

    return {
        addToManager,
        removeFromManager,
    };
}

type SetupBackgroundRenderersParameter = {
    canvasContext: CanvasRenderingContext2D;
    color: Color;
    ribbonWidthBounds: Bounds;
    viewport: {
        height: number;
        width: number;
    };
};

export function setupBackgroundRenderers({
    canvasContext,
    color,
    ribbonWidthBounds,
    viewport,
}: SetupBackgroundRenderersParameter) {
    const rendererRemovers: Array<() => void> = [];
    const gutter = 5;
    const xAxisAdjacentAngle = 0.35 * Math.PI;
    const ribbonsHeight =
        (viewport.width >= 1500 ? 0.8 : viewport.width >= 750 ? 0.6 : 0.4) *
        viewport.height;

    const leftStartingYs = [0];
    const leftYLimit = ribbonsHeight;

    while (gutter + getArrayElementAtIndex(leftStartingYs, -1)! <= leftYLimit) {
        leftStartingYs.push(
            gutter +
                getArrayElementAtIndex(leftStartingYs, -1)! +
                getBoundedRandomInteger(ribbonWidthBounds)
        );
    }

    for (const [index, startingY] of leftStartingYs.slice(0, -1).entries()) {
        const { addToManager, removeFromManager } =
            getBackgroundRendererControls({
                canvasContext,
                color,
                directionAngle: -xAxisAdjacentAngle,
                firstRibbonLineStartingPosition: {
                    x: 0,
                    y: (index > 0 ? gutter : 0) + startingY,
                },
                getYLength: position => position.y,
                secondRibbonLineStartingPosition: {
                    x: 0,
                    y: leftStartingYs[index + 1] - gutter,
                },
                xAxisAdjacentAngle,
            });

        addToManager();
        rendererRemovers.push(removeFromManager);
    }

    const rightStartingYs = [viewport.height - ribbonsHeight];
    const rightYLimit = viewport.height;

    while (
        gutter + getArrayElementAtIndex(rightStartingYs, -1)! <=
        rightYLimit
    ) {
        rightStartingYs.push(
            gutter +
                getArrayElementAtIndex(rightStartingYs, -1)! +
                getBoundedRandomInteger(ribbonWidthBounds)
        );
    }

    for (const [index, startingY] of rightStartingYs.slice(0, -1).entries()) {
        const { addToManager, removeFromManager } =
            getBackgroundRendererControls({
                canvasContext,
                color,
                directionAngle: Math.PI - xAxisAdjacentAngle,
                firstRibbonLineStartingPosition: {
                    x: viewport.width,
                    y: (index > 0 ? gutter : 0) + startingY,
                },
                getYLength: position => viewport.height - position.y,
                secondRibbonLineStartingPosition: {
                    x: viewport.width,
                    y: rightStartingYs[index + 1] - gutter,
                },
                xAxisAdjacentAngle,
            });

        addToManager();
        rendererRemovers.push(removeFromManager);
    }

    return () => rendererRemovers.forEach(evaluateFunction);
}
