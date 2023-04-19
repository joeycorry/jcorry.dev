import type { Renderer } from '~/common/lib/renderer';
import { getRendererManager } from '~/common/lib/rendererManager';

import { getArrayElementAtIndex } from './array';
import type { Bounds } from './bounded';
import { getBoundedRandomInteger } from './bounded';
import type { ColorVariantCssName } from './color';
import { EasingFunction } from './easing';
import { evaluateFunction } from './function';
import type { Position } from './geometry';
import { getSineOfRadians } from './geometry';
import { createMovingTrapezoidRenderer } from './renderer';

type GetBackgroundRendererControlsParameter = {
    canvasContext: CanvasRenderingContext2D;
    colorVariantCssName: ColorVariantCssName;
    directionAngle: number;
    easingFunction: EasingFunction;
    firstRibbonLineStartingPosition: Position;
    getYLength: (position: Position) => number;
    secondRibbonLineStartingPosition: Position;
    xAxisAdjacentAngle: number;
};

function getBackgroundRendererControls({
    canvasContext,
    colorVariantCssName,
    directionAngle,
    easingFunction,
    firstRibbonLineStartingPosition,
    getYLength,
    secondRibbonLineStartingPosition,
    xAxisAdjacentAngle,
}: GetBackgroundRendererControlsParameter) {
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
                    getBoundedRandomInteger({ minimum: 8, maximum: 12 }),
                iterationCount: Number.POSITIVE_INFINITY,
                startingDirection:
                    Math.random() < 0.5 ? 'alternate' : 'alternate-reverse',
            },
            canvasContext,
            easingFunction,
            colorVariantCssName,
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
    colorVariantCssName: ColorVariantCssName;
    easingFunction: EasingFunction;
    ribbonWidthBounds: Bounds;
    viewport: {
        height: number;
        width: number;
    };
};

export function setupBackgroundRenderers({
    canvasContext,
    colorVariantCssName,
    easingFunction,
    ribbonWidthBounds,
    viewport,
}: SetupBackgroundRenderersParameter) {
    const backgroundRendererRemovers: Array<() => void> = [];
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
                colorVariantCssName,
                directionAngle: -xAxisAdjacentAngle,
                easingFunction,
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
        backgroundRendererRemovers.push(removeFromManager);
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
                colorVariantCssName,
                directionAngle: Math.PI - xAxisAdjacentAngle,
                easingFunction,
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
        backgroundRendererRemovers.push(removeFromManager);
    }

    return () => backgroundRendererRemovers.forEach(evaluateFunction);
}
