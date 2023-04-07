import type Color from 'common/lib/color';
import type Renderer from 'common/lib/renderer';
import RendererManager from 'common/lib/rendererManager';

import * as ArrayUtils from './array';
import * as FunctionalUtils from './functional';
import * as NumberUtils from './number';
import * as RendererUtils from './renderer';
import * as ShapeUtils from './shape';

type GetContinuousMovingRibbonAnimationInitiatorParameter = {
    canvasContext: CanvasRenderingContext2D;
    directionAngle: number;
    color: Color;
    firstRibbonLineStartingPosition: ShapeUtils.Position;
    getYLength: (position: ShapeUtils.Position) => number;
    secondRibbonLineStartingPosition: ShapeUtils.Position;
    xAxisAdjacentAngle: number;
};

function getContinuousMovingRibbonAnimationInitiator({
    canvasContext,
    directionAngle,
    color,
    firstRibbonLineStartingPosition,
    getYLength,
    secondRibbonLineStartingPosition,
    xAxisAdjacentAngle,
}: GetContinuousMovingRibbonAnimationInitiatorParameter) {
    const rendererManager = RendererManager.getSharedInstance();
    const sinOfXAxisAdjacentAngle = NumberUtils.sin(xAxisAdjacentAngle);
    let maybeRenderer: Renderer | undefined;
    const initiateContinuousMovingRibbonAnimation = () => {
        const firstLength =
            getYLength(firstRibbonLineStartingPosition) /
            sinOfXAxisAdjacentAngle;
        const secondLength =
            getYLength(secondRibbonLineStartingPosition) /
            sinOfXAxisAdjacentAngle;
        maybeRenderer = RendererUtils.createMovingTrapezoidRenderer({
            angle: directionAngle,
            animation: {
                duration:
                    Math.max(firstLength, secondLength) *
                    NumberUtils.boundedRandomInteger({
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

    return {
        initiateContinuousMovingRibbonAnimation,
        stopRendering: () => {
            if (maybeRenderer !== undefined) {
                rendererManager.removeRenderer(maybeRenderer);
            }
        },
    };
}

type SetupRibbonRenderersParameter = {
    canvasContext: CanvasRenderingContext2D;
    color: Color;
    ribbonWidthBounds: NumberUtils.Bounds;
    viewport: {
        height: number;
        width: number;
    };
};

export function setupRibbonRenderers({
    canvasContext,
    color,
    ribbonWidthBounds,
    viewport,
}: SetupRibbonRenderersParameter) {
    const renderingStoppers = [] as Array<() => void>;
    const gutter = 5;
    const { maximum: maximumRibbonWidth, minimum: minimumRibbonWidth } =
        ribbonWidthBounds;
    const xAxisAdjacentAngle = 0.35 * Math.PI;
    const ribbonsHeight =
        (viewport.width >= 1500 ? 0.8 : viewport.width >= 750 ? 0.6 : 0.4) *
        viewport.height;

    const leftStartingYs = [0];
    const leftYLimit = ribbonsHeight;

    while (gutter + ArrayUtils.at(leftStartingYs, -1)! <= leftYLimit) {
        leftStartingYs.push(
            gutter +
                ArrayUtils.at(leftStartingYs, -1)! +
                NumberUtils.boundedRandomInteger({
                    minimum: minimumRibbonWidth,
                    maximum: maximumRibbonWidth,
                })
        );
    }

    for (const [index, startingY] of [...leftStartingYs.entries()].slice(
        0,
        -1
    )) {
        const { initiateContinuousMovingRibbonAnimation, stopRendering } =
            getContinuousMovingRibbonAnimationInitiator({
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

        initiateContinuousMovingRibbonAnimation();
        renderingStoppers.push(stopRendering);
    }

    const rightStartingYs = [viewport.height - ribbonsHeight];
    const rightYLimit = viewport.height;

    while (gutter + ArrayUtils.at(rightStartingYs, -1)! <= rightYLimit) {
        rightStartingYs.push(
            gutter +
                ArrayUtils.at(rightStartingYs, -1)! +
                NumberUtils.boundedRandomInteger({
                    minimum: minimumRibbonWidth,
                    maximum: maximumRibbonWidth,
                })
        );
    }

    for (const [index, startingY] of [...rightStartingYs.entries()].slice(
        0,
        -1
    )) {
        const { initiateContinuousMovingRibbonAnimation, stopRendering } =
            getContinuousMovingRibbonAnimationInitiator({
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

        initiateContinuousMovingRibbonAnimation();
        renderingStoppers.push(stopRendering);
    }

    return () => renderingStoppers.forEach(FunctionalUtils.evaluate);
}
